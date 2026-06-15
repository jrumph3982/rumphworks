"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { estimateItems, estimates, leadFieldChanges, leads, projectTasks, projects } from "@/db/schema";
import {
  ESTIMATE_STATUS_OPTIONS,
  ESTIMATE_TIER_OPTIONS,
  LEAD_STATUS_OPTIONS,
  PROJECT_STATUS_OPTIONS,
  type EstimateStatus,
  type EstimateTier,
  type LeadStatus,
  type ProjectStatus,
} from "@/lib/crm";
import {
  diffLeadDetails,
  initialIntakeData,
  labelFor,
  parseIntakeData,
  type ContactFields,
  type IntakeData,
} from "@/lib/intake";
import { generateEstimateItems } from "@/lib/pricing";
import { generateProjectTasks } from "@/lib/workflow";

async function logFieldChange(leadId: number, fieldLabel: string, oldValue: string, newValue: string, note?: string | null) {
  await db.insert(leadFieldChanges).values({ leadId, fieldLabel, oldValue, newValue, note: note || null });
}

export async function updateLeadStatus(leadId: number, formData: FormData) {
  const status = formData.get("status") as LeadStatus;
  const [lead] = await db.select({ status: leads.status }).from(leads).where(eq(leads.id, leadId));

  await db.update(leads).set({ status }).where(eq(leads.id, leadId));

  if (lead && lead.status !== status) {
    await logFieldChange(leadId, "Lead status", labelFor(LEAD_STATUS_OPTIONS, lead.status), labelFor(LEAD_STATUS_OPTIONS, status));
  }

  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/admin");
}

export async function createEstimate(leadId: number, formData: FormData) {
  const tier = formData.get("tier") as EstimateTier;
  const [{ id: estimateId }] = await db.insert(estimates).values({ leadId, tier }).$returningId();

  const [lead] = await db.select().from(leads).where(eq(leads.id, leadId));
  const intake = parseIntakeData(lead?.intakeData);

  const suggested = generateEstimateItems(intake, tier);
  if (suggested.length > 0) {
    await db.insert(estimateItems).values(suggested.map((item) => ({ estimateId, ...item })));
    await recalcEstimateTotal(estimateId);
  }

  revalidatePath(`/admin/leads/${leadId}`);
}

export async function updateEstimateTier(estimateId: number, leadId: number, formData: FormData) {
  const tier = formData.get("tier") as EstimateTier;
  const [estimate] = await db.select({ tier: estimates.tier }).from(estimates).where(eq(estimates.id, estimateId));

  await db.update(estimates).set({ tier }).where(eq(estimates.id, estimateId));

  if (estimate && estimate.tier !== tier) {
    await logFieldChange(leadId, "Estimate tier", labelFor(ESTIMATE_TIER_OPTIONS, estimate.tier), labelFor(ESTIMATE_TIER_OPTIONS, tier));
  }

  revalidatePath(`/admin/leads/${leadId}`);
}

export async function updateEstimateStatus(estimateId: number, leadId: number, formData: FormData) {
  const status = formData.get("status") as EstimateStatus;
  const [estimate] = await db.select({ status: estimates.status }).from(estimates).where(eq(estimates.id, estimateId));

  await db.update(estimates).set({ status }).where(eq(estimates.id, estimateId));

  if (estimate && estimate.status !== status) {
    await logFieldChange(
      leadId,
      "Estimate status",
      labelFor(ESTIMATE_STATUS_OPTIONS, estimate.status),
      labelFor(ESTIMATE_STATUS_OPTIONS, status),
    );
  }

  revalidatePath(`/admin/leads/${leadId}`);
}

export async function addEstimateItem(estimateId: number, leadId: number, formData: FormData) {
  const label = String(formData.get("label") || "").trim();
  const price = Number(formData.get("price"));
  const quantity = Number(formData.get("quantity")) || 1;

  if (!label || !Number.isFinite(price)) return;

  await db.insert(estimateItems).values({ estimateId, label, price, quantity });
  await recalcEstimateTotal(estimateId);
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function updateEstimateItem(itemId: number, estimateId: number, leadId: number, formData: FormData) {
  const label = String(formData.get("label") || "").trim();
  const price = Number(formData.get("price"));
  const quantity = Number(formData.get("quantity")) || 1;

  if (!label || !Number.isFinite(price)) return;

  await db.update(estimateItems).set({ label, price, quantity }).where(eq(estimateItems.id, itemId));
  await recalcEstimateTotal(estimateId);
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function deleteEstimateItem(itemId: number, estimateId: number, leadId: number) {
  await db.delete(estimateItems).where(eq(estimateItems.id, itemId));
  await recalcEstimateTotal(estimateId);
  revalidatePath(`/admin/leads/${leadId}`);
}

async function recalcEstimateTotal(estimateId: number) {
  const items = await db.select().from(estimateItems).where(eq(estimateItems.estimateId, estimateId));
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  await db.update(estimates).set({ totalPrice: total }).where(eq(estimates.id, estimateId));
}

export async function createProject(leadId: number) {
  const [{ id: projectId }] = await db.insert(projects).values({ leadId }).$returningId();

  const [lead] = await db.select({ intakeData: leads.intakeData }).from(leads).where(eq(leads.id, leadId));
  const intake = parseIntakeData(lead?.intakeData);
  const tasks = generateProjectTasks(intake);

  if (tasks.length > 0) {
    await db.insert(projectTasks).values(
      tasks.map((task, index) => ({
        projectId,
        label: task.label,
        stage: task.stage,
        sortOrder: index,
      })),
    );
  }

  revalidatePath(`/admin/leads/${leadId}`);
}

export async function updateProjectStatus(projectId: number, leadId: number, formData: FormData) {
  const status = formData.get("status") as ProjectStatus;
  const [project] = await db.select({ status: projects.status }).from(projects).where(eq(projects.id, projectId));

  await db.update(projects).set({ status }).where(eq(projects.id, projectId));

  if (project && project.status !== status) {
    await logFieldChange(
      leadId,
      "Project status",
      labelFor(PROJECT_STATUS_OPTIONS, project.status),
      labelFor(PROJECT_STATUS_OPTIONS, status),
    );
  }

  revalidatePath(`/admin/leads/${leadId}`);
}

export async function toggleProjectTask(taskId: number, leadId: number, formData: FormData) {
  const done = formData.get("done") === "on";
  await db.update(projectTasks).set({ done }).where(eq(projectTasks.id, taskId));
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function addProjectTask(projectId: number, leadId: number, formData: FormData) {
  const label = String(formData.get("label") || "").trim();
  const stage = formData.get("stage") as ProjectStatus;
  if (!label) return;

  const existing = await db
    .select({ sortOrder: projectTasks.sortOrder })
    .from(projectTasks)
    .where(eq(projectTasks.projectId, projectId));
  const nextSortOrder = existing.reduce((max, task) => Math.max(max, task.sortOrder), -1) + 1;

  await db.insert(projectTasks).values({ projectId, label, stage, sortOrder: nextSortOrder, isCustom: true });
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function deleteProjectTask(taskId: number, leadId: number) {
  await db.delete(projectTasks).where(eq(projectTasks.id, taskId));
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function updateContractTerms(projectId: number, leadId: number, formData: FormData) {
  const timeline = String(formData.get("timeline") || "").trim();
  const revisionRounds = Number(formData.get("revisionRounds"));
  const reworkRate = Number(formData.get("reworkRate"));
  const depositPercent = Number(formData.get("depositPercent"));

  await db
    .update(projects)
    .set({
      timeline: timeline || null,
      revisionRounds: Number.isFinite(revisionRounds) ? revisionRounds : 2,
      reworkRate: Number.isFinite(reworkRate) ? reworkRate : 75,
      depositPercent: Number.isFinite(depositPercent) ? depositPercent : 50,
    })
    .where(eq(projects.id, projectId));

  revalidatePath(`/admin/leads/${leadId}/contract`);
}

export async function updateLeadDetails(leadId: number, formData: FormData) {
  const [lead] = await db.select().from(leads).where(eq(leads.id, leadId));
  if (!lead) return;

  const oldIntake = parseIntakeData(lead.intakeData) ?? initialIntakeData;
  const oldContact: ContactFields = {
    name: lead.name,
    email: lead.email,
    phone: lead.phone ?? "",
    businessName: lead.businessName ?? "",
  };

  const newContact: ContactFields = {
    name: String(formData.get("name") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    businessName: String(formData.get("businessName") || "").trim(),
  };

  const newIntake: IntakeData = {
    ...oldIntake,
    contact: {
      ...oldIntake.contact,
      name: newContact.name,
      email: newContact.email,
      phone: newContact.phone,
      businessName: newContact.businessName,
      businessDescription: String(formData.get("businessDescription") || "").trim(),
    },
    goals: {
      motivation: String(formData.get("motivation") || ""),
      mainGoals: formData.getAll("mainGoals").map(String),
    },
    scope: {
      sizeNeeded: String(formData.get("sizeNeeded") || ""),
    },
    content: {
      hasExistingWebsite: String(formData.get("hasExistingWebsite") || ""),
      existingWebsiteUrl: String(formData.get("existingWebsiteUrl") || "").trim(),
      pagesNeeded: formData.getAll("pagesNeeded").map(String),
      contentReadiness: String(formData.get("contentReadiness") || ""),
    },
    design: {
      hasBrand: String(formData.get("hasBrand") || ""),
      styleExamples: String(formData.get("styleExamples") || "").trim(),
      stylePreference: String(formData.get("stylePreference") || ""),
    },
    features: formData.getAll("features").map(String),
    timeline: {
      launchTimeline: String(formData.get("launchTimeline") || ""),
      budgetRange: String(formData.get("budgetRange") || ""),
    },
    hosting: {
      interest: String(formData.get("hostingInterest") || ""),
      additionalNotes: String(formData.get("hostingNotes") || "").trim(),
    },
  };

  const changes = diffLeadDetails(oldContact, oldIntake, newContact, newIntake);
  if (changes.length === 0) return;

  await db
    .update(leads)
    .set({
      name: newContact.name,
      email: newContact.email,
      phone: newContact.phone || null,
      businessName: newContact.businessName || null,
      intakeData: newIntake,
    })
    .where(eq(leads.id, leadId));

  const note = String(formData.get("note") || "").trim() || null;
  await db.insert(leadFieldChanges).values(
    changes.map((change) => ({
      leadId,
      fieldLabel: change.label,
      oldValue: change.oldValue,
      newValue: change.newValue,
      note,
    })),
  );

  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/admin");
}

export async function deleteLead(leadId: number) {
  await db.delete(leads).where(eq(leads.id, leadId));
  revalidatePath("/admin");
  redirect("/admin");
}
