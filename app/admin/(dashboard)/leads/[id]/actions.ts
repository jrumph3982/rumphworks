"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { estimateItems, estimates, leads, projects } from "@/db/schema";
import type { EstimateStatus, EstimateTier, LeadStatus, ProjectStatus } from "@/lib/crm";
import type { IntakeData } from "@/lib/intake";
import { generateEstimateItems } from "@/lib/pricing";

export async function updateLeadStatus(leadId: number, formData: FormData) {
  const status = formData.get("status") as LeadStatus;
  await db.update(leads).set({ status }).where(eq(leads.id, leadId));
  revalidatePath(`/admin/leads/${leadId}`);
  revalidatePath("/admin");
}

export async function createEstimate(leadId: number, formData: FormData) {
  const tier = formData.get("tier") as EstimateTier;
  const [{ id: estimateId }] = await db.insert(estimates).values({ leadId, tier }).$returningId();

  const [lead] = await db.select().from(leads).where(eq(leads.id, leadId));
  const intake: IntakeData | null = lead?.intakeData
    ? typeof lead.intakeData === "string"
      ? JSON.parse(lead.intakeData)
      : (lead.intakeData as IntakeData)
    : null;

  const suggested = generateEstimateItems(intake, tier);
  if (suggested.length > 0) {
    await db.insert(estimateItems).values(suggested.map((item) => ({ estimateId, ...item })));
    await recalcEstimateTotal(estimateId);
  }

  revalidatePath(`/admin/leads/${leadId}`);
}

export async function updateEstimateTier(estimateId: number, leadId: number, formData: FormData) {
  const tier = formData.get("tier") as EstimateTier;
  await db.update(estimates).set({ tier }).where(eq(estimates.id, estimateId));
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function updateEstimateStatus(estimateId: number, leadId: number, formData: FormData) {
  const status = formData.get("status") as EstimateStatus;
  await db.update(estimates).set({ status }).where(eq(estimates.id, estimateId));
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
  await db.insert(projects).values({ leadId });
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function updateProjectStatus(projectId: number, leadId: number, formData: FormData) {
  const status = formData.get("status") as ProjectStatus;
  await db.update(projects).set({ status }).where(eq(projects.id, projectId));
  revalidatePath(`/admin/leads/${leadId}`);
}
