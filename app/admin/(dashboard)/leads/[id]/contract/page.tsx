import Link from "next/link";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { estimateItems, estimates, leads, projects } from "@/db/schema";
import { updateContractTerms } from "../actions";
import { PrintButton } from "./print-button";

export const dynamic = "force-dynamic";

const COMPANY_NAME = "Rumphworks";

const inputClass =
  "w-full border border-divider rounded-lg px-3 py-2 text-sm text-navy bg-white focus:outline-none focus:ring-2 focus:ring-blue-accent focus:ring-offset-2 transition";

const labelClass = "block text-sm font-medium text-navy mb-1";

export default async function ContractPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const leadId = Number(id);

  const [lead] = await db.select().from(leads).where(eq(leads.id, leadId));
  const [project] = await db.select().from(projects).where(eq(projects.leadId, leadId));
  const [estimate] = await db.select().from(estimates).where(eq(estimates.leadId, leadId));
  const items = estimate
    ? await db.select().from(estimateItems).where(eq(estimateItems.estimateId, estimate.id))
    : [];

  if (!lead || !project || !estimate || items.length === 0) {
    return (
      <div className="max-w-2xl">
        <Link href={`/admin/leads/${leadId}`} className="text-sm text-blue-accent hover:underline">
          ← Back to lead
        </Link>
        <div className="mt-6 rounded-lg border border-divider bg-white p-6">
          <p className="text-sm text-navy">
            A contract can be generated once this lead has a project started and an estimate with at least one
            line item.
          </p>
        </div>
      </div>
    );
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const depositAmount = Math.round((total * project.depositPercent) / 100);
  const balanceAmount = total - depositAmount;
  const clientName = lead.businessName ? `${lead.businessName} (${lead.name})` : lead.name;
  const today = new Date().toLocaleDateString();

  return (
    <div className="max-w-3xl">
      <div className="print:hidden mb-6 flex items-center justify-between">
        <Link href={`/admin/leads/${leadId}`} className="text-sm text-blue-accent hover:underline">
          ← Back to lead
        </Link>
        <PrintButton />
      </div>

      <div className="print:hidden mb-6 rounded-lg border border-divider bg-white p-6">
        <h2 className="text-lg font-semibold text-navy mb-1">Contract terms</h2>
        <p className="text-sm text-neutral-mid mb-4">
          These are saved on the project and used to fill in the agreement below. This is a starting template, not
          legal advice - have it reviewed before sending to a client.
        </p>
        <form action={updateContractTerms.bind(null, project.id, leadId)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={labelClass}>Agreed timeline</label>
            <input
              name="timeline"
              type="text"
              defaultValue={project.timeline ?? ""}
              placeholder="e.g. 6 weeks from signed contract and deposit"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Revision rounds included</label>
            <input name="revisionRounds" type="number" min="0" step="1" defaultValue={project.revisionRounds} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Rework rate ($/hour)</label>
            <input name="reworkRate" type="number" min="0" step="1" defaultValue={project.reworkRate} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Deposit (%)</label>
            <input name="depositPercent" type="number" min="0" max="100" step="1" defaultValue={project.depositPercent} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy/90"
            >
              Save terms
            </button>
          </div>
        </form>
      </div>

      {/* Printable contract */}
      <div className="rounded-lg border border-divider bg-white p-8 text-sm text-navy space-y-6 print:border-none print:p-0">
        <div className="text-center">
          <h1 className="text-xl font-bold">Web Design Services Agreement</h1>
          <p className="mt-1 text-neutral-mid">Dated {today}</p>
        </div>

        <p>
          This Agreement is made between <strong>{COMPANY_NAME}</strong> (&ldquo;Developer&rdquo;) and{" "}
          <strong>{clientName}</strong> (&ldquo;Client&rdquo;).
        </p>

        <section>
          <h2 className="font-semibold mb-2">1. Project</h2>
          <p>
            Developer agrees to design and develop a website for Client, referred to in this Agreement as the{" "}
            &ldquo;{lead.businessName || lead.name} website&rdquo;.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">2. Deliverables</h2>
          <p className="mb-2">The following deliverables are included in this engagement:</p>
          <ul className="list-disc pl-6 space-y-1">
            {items.map((item) => (
              <li key={item.id}>
                {item.label}
                {item.quantity > 1 ? ` (x${item.quantity})` : ""}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-semibold mb-2">3. Timeline</h2>
          <p>{project.timeline || "To be determined and confirmed in writing by both parties."}</p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">4. Payment Terms</h2>
          <p>Total project fee: ${total.toLocaleString()}</p>
          <p>
            A deposit of {project.depositPercent}% (${depositAmount.toLocaleString()}) is due before work begins.
          </p>
          <p>
            The remaining balance of ${balanceAmount.toLocaleString()} is due upon completion, prior to delivery of
            final files or launch.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">5. Revisions and Additional Work</h2>
          <p>
            This Agreement includes {project.revisionRounds} round{project.revisionRounds === 1 ? "" : "s"} of
            revisions for each deliverable listed above. Additional revisions, new feature requests, or changes to
            the agreed scope will be billed at ${project.reworkRate}/hour and must be approved by Client before
            work begins.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">6. Ownership and Use</h2>
          <p>
            Upon receipt of full payment, Developer transfers ownership of the final website design and custom
            content created for Client to Client. Developer retains the right to display the completed work in its
            portfolio and marketing materials. Third-party assets (stock photos, fonts, plugins, themes, hosting,
            etc.) remain subject to their own licenses.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">7. Client Responsibilities</h2>
          <p>
            Client agrees to provide content, feedback, and approvals in a timely manner. Delays in providing
            necessary materials may affect the project timeline.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">8. Confidentiality</h2>
          <p>
            Both parties agree to keep confidential any non-public business information shared during this
            engagement.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">9. Warranty and Limitation of Liability</h2>
          <p>
            Developer will perform services in a professional manner consistent with industry standards. Developer
            makes no other warranties, express or implied. Developer&rsquo;s total liability under this Agreement is
            limited to the total fees paid by Client.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">10. Termination</h2>
          <p>
            Either party may terminate this Agreement with written notice. Client will be billed for work completed
            and expenses incurred up to the date of termination; any deposit paid is non-refundable.
          </p>
        </section>

        <section>
          <h2 className="font-semibold mb-2">11. Governing Law</h2>
          <p>This Agreement is governed by the laws of the State of ____________________.</p>
        </section>

        <section className="pt-6">
          <h2 className="font-semibold mb-4">Signatures</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <p className="mb-8">{COMPANY_NAME}</p>
              <p className="border-t border-divider pt-1">Signature</p>
              <p className="mt-6 border-t border-divider pt-1">Date</p>
            </div>
            <div>
              <p className="mb-8">{clientName}</p>
              <p className="border-t border-divider pt-1">Signature</p>
              <p className="mt-6 border-t border-divider pt-1">Date</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
