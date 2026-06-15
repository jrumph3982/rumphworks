import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { estimateItems, estimates, leadFieldChanges, leads, projectTasks, projects } from "@/db/schema";
import { formatIntakeSummary, initialIntakeData, parseIntakeData } from "@/lib/intake";
import {
  ESTIMATE_STATUS_OPTIONS,
  ESTIMATE_TIER_OPTIONS,
  LEAD_STATUS_OPTIONS,
  PROJECT_STATUS_OPTIONS,
} from "@/lib/crm";
import { suggestTierFromIntake } from "@/lib/pricing";
import { AutoSubmitSelect } from "./auto-submit-select";
import { AutoSubmitCheckbox } from "./auto-submit-checkbox";
import { ConfirmSubmitButton } from "./confirm-submit-button";
import { EditLeadForm } from "./edit-lead-form";
import {
  addEstimateItem,
  addProjectTask,
  createEstimate,
  createProject,
  deleteEstimateItem,
  deleteLead,
  deleteProjectTask,
  toggleProjectTask,
  updateEstimateItem,
  updateEstimateStatus,
  updateEstimateTier,
  updateLeadDetails,
  updateLeadStatus,
  updateProjectStatus,
} from "./actions";

export const dynamic = "force-dynamic";

const selectClass =
  "border border-divider rounded-lg px-3 py-2 text-sm text-navy bg-white focus:outline-none focus:ring-2 focus:ring-blue-accent focus:ring-offset-2 transition";

const inputClass =
  "w-full border border-divider rounded-lg px-3 py-2 text-sm text-navy bg-white focus:outline-none focus:ring-2 focus:ring-blue-accent focus:ring-offset-2 transition";

const tableInputClass =
  "w-full border border-divider rounded px-2 py-1 text-sm text-navy bg-white focus:outline-none focus:ring-2 focus:ring-blue-accent focus:ring-offset-1 transition";

const summaryClass = "text-lg font-semibold text-navy cursor-pointer";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const leadId = Number(id);
  if (!Number.isInteger(leadId)) notFound();

  const [lead] = await db.select().from(leads).where(eq(leads.id, leadId));
  if (!lead) notFound();

  const [estimate] = await db.select().from(estimates).where(eq(estimates.leadId, leadId));
  const items = estimate
    ? await db.select().from(estimateItems).where(eq(estimateItems.estimateId, estimate.id))
    : [];
  const [project] = await db.select().from(projects).where(eq(projects.leadId, leadId));
  const tasks = project
    ? await db.select().from(projectTasks).where(eq(projectTasks.projectId, project.id)).orderBy(asc(projectTasks.sortOrder))
    : [];
  const changes = await db
    .select()
    .from(leadFieldChanges)
    .where(eq(leadFieldChanges.leadId, leadId))
    .orderBy(desc(leadFieldChanges.changedAt));

  const intake = parseIntakeData(lead.intakeData);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const contact = {
    name: lead.name,
    email: lead.email,
    phone: lead.phone ?? "",
    businessName: lead.businessName ?? "",
  };

  return (
    <div className="max-w-4xl">
      <Link href="/admin" className="text-sm text-blue-accent hover:underline">
        ← Back to leads
      </Link>

      <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-navy">{lead.name}</h1>
          {lead.businessName && <p className="text-neutral-mid">{lead.businessName}</p>}
        </div>
        <form action={updateLeadStatus.bind(null, lead.id)}>
          <AutoSubmitSelect
            name="status"
            defaultValue={lead.status}
            options={LEAD_STATUS_OPTIONS}
            className={selectClass}
          />
        </form>
      </div>

      {/* Contact */}
      <details open className="mt-6 rounded-lg border border-divider bg-white p-6">
        <summary className={summaryClass}>Contact</summary>
        <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-neutral-mid">Email</dt>
            <dd>
              <a href={`mailto:${lead.email}`} className="text-navy hover:text-blue-accent">
                {lead.email}
              </a>
            </dd>
          </div>
          {lead.phone && (
            <div>
              <dt className="text-neutral-mid">Phone</dt>
              <dd className="text-navy">{lead.phone}</dd>
            </div>
          )}
          {lead.businessName && (
            <div>
              <dt className="text-neutral-mid">Business</dt>
              <dd className="text-navy">{lead.businessName}</dd>
            </div>
          )}
          <div>
            <dt className="text-neutral-mid">Received</dt>
            <dd className="text-navy">{lead.createdAt.toLocaleString()}</dd>
          </div>
        </dl>
        {intake?.contact.businessDescription && (
          <p className="mt-4 text-sm text-navy">
            <span className="text-neutral-mid">What they do: </span>
            {intake.contact.businessDescription}
          </p>
        )}
      </details>

      {/* Questionnaire responses */}
      {intake && (
        <details className="mt-6 rounded-lg border border-divider bg-white p-6">
          <summary className={summaryClass}>Questionnaire responses</summary>
          <pre className="mt-4 whitespace-pre-wrap font-sans text-sm text-navy">{formatIntakeSummary(intake)}</pre>
        </details>
      )}

      {/* Edit lead details */}
      <details className="mt-6 rounded-lg border border-divider bg-white p-6">
        <summary className={summaryClass}>Edit lead details</summary>
        <div className="mt-4">
          <EditLeadForm action={updateLeadDetails.bind(null, lead.id)} contact={contact} intake={intake ?? initialIntakeData} />
        </div>
      </details>

      {/* Change history */}
      <details className="mt-6 rounded-lg border border-divider bg-white p-6">
        <summary className={summaryClass}>Change history</summary>
        <div className="mt-4">
          {changes.length === 0 ? (
            <p className="text-sm text-neutral-mid">No changes recorded yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-divider text-left text-neutral-mid">
                  <th className="py-2 font-medium">Field</th>
                  <th className="py-2 font-medium">Old value</th>
                  <th className="py-2 font-medium">New value</th>
                  <th className="py-2 font-medium">Note</th>
                  <th className="py-2 font-medium">When</th>
                </tr>
              </thead>
              <tbody>
                {changes.map((change) => (
                  <tr key={change.id} className="border-b border-divider last:border-0 align-top">
                    <td className="py-2 text-navy">{change.fieldLabel}</td>
                    <td className="py-2 text-navy">{change.oldValue}</td>
                    <td className="py-2 text-navy">{change.newValue}</td>
                    <td className="py-2 text-navy">{change.note || "-"}</td>
                    <td className="py-2 text-neutral-mid whitespace-nowrap">{change.changedAt.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </details>

      {/* Estimate */}
      <details open className="mt-6 rounded-lg border border-divider bg-white p-6">
        <summary className={summaryClass}>Estimate</summary>
        <div className="mt-4">
          {!estimate ? (
            <form action={createEstimate.bind(null, lead.id)} className="flex flex-wrap items-end gap-3">
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Tier</label>
                <select name="tier" defaultValue={suggestTierFromIntake(intake)} className={selectClass}>
                  {ESTIMATE_TIER_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="rounded-lg bg-blue-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
              >
                Create estimate
              </button>
              <p className="text-xs text-neutral-mid">
                Starting line items will be generated from their questionnaire answers - edit or remove anything after.
              </p>
            </form>
          ) : (
            <div>
              <div className="flex flex-wrap gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-navy mb-1">Tier</label>
                  <form action={updateEstimateTier.bind(null, estimate.id, lead.id)}>
                    <AutoSubmitSelect
                      name="tier"
                      defaultValue={estimate.tier}
                      options={ESTIMATE_TIER_OPTIONS}
                      className={selectClass}
                    />
                  </form>
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-1">Status</label>
                  <form action={updateEstimateStatus.bind(null, estimate.id, lead.id)}>
                    <AutoSubmitSelect
                      name="status"
                      defaultValue={estimate.status}
                      options={ESTIMATE_STATUS_OPTIONS}
                      className={selectClass}
                    />
                  </form>
                </div>
              </div>

              <table className="w-full text-sm mb-4">
                <thead>
                  <tr className="border-b border-divider text-left text-neutral-mid">
                    <th className="py-2 font-medium">Item</th>
                    <th className="py-2 font-medium">Price</th>
                    <th className="py-2 font-medium">Qty</th>
                    <th className="py-2 font-medium">Total</th>
                    <th className="py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-divider last:border-0">
                      <td className="py-2">
                        <input
                          form={`item-form-${item.id}`}
                          name="label"
                          defaultValue={item.label}
                          className={tableInputClass}
                        />
                      </td>
                      <td className="py-2">
                        <input
                          form={`item-form-${item.id}`}
                          name="price"
                          type="number"
                          min="0"
                          step="1"
                          defaultValue={item.price}
                          className={`${tableInputClass} w-24`}
                        />
                      </td>
                      <td className="py-2">
                        <input
                          form={`item-form-${item.id}`}
                          name="quantity"
                          type="number"
                          min="1"
                          step="1"
                          defaultValue={item.quantity}
                          className={`${tableInputClass} w-16`}
                        />
                      </td>
                      <td className="py-2 text-navy">${(item.price * item.quantity).toLocaleString()}</td>
                      <td className="py-2 text-right whitespace-nowrap">
                        <form id={`item-form-${item.id}`} action={updateEstimateItem.bind(null, item.id, estimate.id, lead.id)} className="inline">
                          <button type="submit" className="text-xs text-blue-accent hover:underline mr-2">
                            Save
                          </button>
                        </form>
                        <form action={deleteEstimateItem.bind(null, item.id, estimate.id, lead.id)} className="inline">
                          <button type="submit" className="text-xs text-neutral-mid hover:text-red-600">
                            Remove
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-neutral-mid">
                        No items yet.
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="py-2 text-right font-semibold text-navy">
                      Total
                    </td>
                    <td className="py-2 font-semibold text-navy">${total.toLocaleString()}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>

              <form
                action={addEstimateItem.bind(null, estimate.id, lead.id)}
                className="flex flex-wrap items-end gap-3"
              >
                <div className="flex-1 min-w-[180px]">
                  <label className="block text-sm font-medium text-navy mb-1">Item</label>
                  <input name="label" type="text" required className={inputClass} />
                </div>
                <div className="w-28">
                  <label className="block text-sm font-medium text-navy mb-1">Price ($)</label>
                  <input name="price" type="number" min="0" step="1" required className={inputClass} />
                </div>
                <div className="w-20">
                  <label className="block text-sm font-medium text-navy mb-1">Qty</label>
                  <input name="quantity" type="number" min="1" step="1" defaultValue={1} className={inputClass} />
                </div>
                <button
                  type="submit"
                  className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy/90"
                >
                  Add item
                </button>
              </form>
            </div>
          )}
        </div>
      </details>

      {/* Project status */}
      <details open className="mt-6 rounded-lg border border-divider bg-white p-6">
        <summary className={summaryClass}>Project status</summary>
        <div className="mt-4">
          {!project ? (
            <form action={createProject.bind(null, lead.id)}>
              <button
                type="submit"
                className="rounded-lg bg-blue-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
              >
                Start project
              </button>
            </form>
          ) : (
            <div>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <form action={updateProjectStatus.bind(null, project.id, lead.id)}>
                  <AutoSubmitSelect
                    name="status"
                    defaultValue={project.status}
                    options={PROJECT_STATUS_OPTIONS}
                    className={selectClass}
                  />
                </form>
                <Link href={`/admin/leads/${lead.id}/contract`} className="text-sm text-blue-accent hover:underline">
                  Generate contract →
                </Link>
              </div>

              {PROJECT_STATUS_OPTIONS.map((stageOption) => {
                const stageTasks = tasks.filter((task) => task.stage === stageOption.value);
                if (stageTasks.length === 0) return null;

                return (
                  <div key={stageOption.value} className="mb-4">
                    <h3 className="text-sm font-semibold text-navy mb-2">{stageOption.label}</h3>
                    <ul className="space-y-1">
                      {stageTasks.map((task) => (
                        <li key={task.id} className="flex items-center gap-2 text-sm">
                          <form
                            action={toggleProjectTask.bind(null, task.id, lead.id)}
                            className="flex flex-1 items-center gap-2"
                          >
                            <AutoSubmitCheckbox name="done" defaultChecked={task.done} />
                            <span className={task.done ? "text-neutral-mid line-through" : "text-navy"}>{task.label}</span>
                          </form>
                          {task.isCustom && (
                            <form action={deleteProjectTask.bind(null, task.id, lead.id)}>
                              <button type="submit" className="text-xs text-neutral-mid hover:text-red-600">
                                Remove
                              </button>
                            </form>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}

              <form action={addProjectTask.bind(null, project.id, lead.id)} className="mt-4 flex flex-wrap items-end gap-3">
                <div className="flex-1 min-w-[180px]">
                  <label className="block text-sm font-medium text-navy mb-1">Task</label>
                  <input name="label" type="text" required className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy mb-1">Stage</label>
                  <select name="stage" defaultValue={project.status} className={selectClass}>
                    {PROJECT_STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy/90"
                >
                  Add task
                </button>
              </form>
            </div>
          )}
        </div>
      </details>

      {/* Danger zone */}
      <section className="mt-6 rounded-lg border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-semibold text-red-700 mb-2">Danger zone</h2>
        <p className="text-sm text-red-700 mb-4">
          Permanently delete this lead, along with its estimate, project, and history. This cannot be undone.
        </p>
        <form action={deleteLead.bind(null, lead.id)}>
          <ConfirmSubmitButton
            confirmMessage="Delete this lead and all related data? This cannot be undone."
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Delete lead
          </ConfirmSubmitButton>
        </form>
      </section>
    </div>
  );
}
