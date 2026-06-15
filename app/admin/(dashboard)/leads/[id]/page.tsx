import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { estimateItems, estimates, leads, projects } from "@/db/schema";
import { formatIntakeSummary, type IntakeData } from "@/lib/intake";
import {
  ESTIMATE_STATUS_OPTIONS,
  ESTIMATE_TIER_OPTIONS,
  LEAD_STATUS_OPTIONS,
  PROJECT_STATUS_OPTIONS,
} from "@/lib/crm";
import { AutoSubmitSelect } from "./auto-submit-select";
import {
  addEstimateItem,
  createEstimate,
  createProject,
  deleteEstimateItem,
  updateEstimateStatus,
  updateEstimateTier,
  updateLeadStatus,
  updateProjectStatus,
} from "./actions";

export const dynamic = "force-dynamic";

const selectClass =
  "border border-divider rounded-lg px-3 py-2 text-sm text-navy bg-white focus:outline-none focus:ring-2 focus:ring-blue-accent focus:ring-offset-2 transition";

const inputClass =
  "w-full border border-divider rounded-lg px-3 py-2 text-sm text-navy bg-white focus:outline-none focus:ring-2 focus:ring-blue-accent focus:ring-offset-2 transition";

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

  const intake: IntakeData | null =
    typeof lead.intakeData === "string" ? JSON.parse(lead.intakeData) : (lead.intakeData as IntakeData | null);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
      <section className="mt-6 rounded-lg border border-divider bg-white p-6">
        <h2 className="text-lg font-semibold text-navy mb-4">Contact</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
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
      </section>

      {/* Questionnaire responses */}
      {intake && (
        <section className="mt-6 rounded-lg border border-divider bg-white p-6">
          <h2 className="text-lg font-semibold text-navy mb-4">Questionnaire responses</h2>
          <pre className="whitespace-pre-wrap font-sans text-sm text-navy">{formatIntakeSummary(intake)}</pre>
        </section>
      )}

      {/* Estimate */}
      <section className="mt-6 rounded-lg border border-divider bg-white p-6">
        <h2 className="text-lg font-semibold text-navy mb-4">Estimate</h2>

        {!estimate ? (
          <form action={createEstimate.bind(null, lead.id)} className="flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-sm font-medium text-navy mb-1">Tier</label>
              <select name="tier" defaultValue={ESTIMATE_TIER_OPTIONS[0].value} className={selectClass}>
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
                    <td className="py-2 text-navy">{item.label}</td>
                    <td className="py-2 text-navy">${item.price.toLocaleString()}</td>
                    <td className="py-2 text-navy">{item.quantity}</td>
                    <td className="py-2 text-navy">${(item.price * item.quantity).toLocaleString()}</td>
                    <td className="py-2 text-right">
                      <form action={deleteEstimateItem.bind(null, item.id, estimate.id, lead.id)}>
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
      </section>

      {/* Project status */}
      <section className="mt-6 rounded-lg border border-divider bg-white p-6">
        <h2 className="text-lg font-semibold text-navy mb-4">Project status</h2>

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
          <form action={updateProjectStatus.bind(null, project.id, lead.id)}>
            <AutoSubmitSelect
              name="status"
              defaultValue={project.status}
              options={PROJECT_STATUS_OPTIONS}
              className={selectClass}
            />
          </form>
        )}
      </section>
    </div>
  );
}
