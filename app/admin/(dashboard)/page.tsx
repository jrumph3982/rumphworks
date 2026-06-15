import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { LEAD_STATUS_OPTIONS, type LeadStatus } from "@/lib/crm";
import { labelFor } from "@/lib/intake";

export const dynamic = "force-dynamic";

const STATUS_BADGE_CLASSES: Record<string, string> = {
  new: "bg-blue-accent/10 text-blue-accent",
  quoted: "bg-amber-100 text-amber-700",
  won: "bg-green-100 text-green-700",
  lost: "bg-neutral-mid/10 text-neutral-mid",
};

const LEAD_STATUS_VALUES = LEAD_STATUS_OPTIONS.map((option) => option.value);

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeStatus = LEAD_STATUS_VALUES.includes(status ?? "") ? (status as LeadStatus) : undefined;

  const rows = activeStatus
    ? await db.select().from(leads).where(eq(leads.status, activeStatus)).orderBy(desc(leads.createdAt))
    : await db.select().from(leads).orderBy(desc(leads.createdAt));

  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy">Leads</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        <FilterLink label="All" href="/admin" active={!activeStatus} />
        {LEAD_STATUS_OPTIONS.map((option) => (
          <FilterLink
            key={option.value}
            label={option.label}
            href={`/admin?status=${option.value}`}
            active={activeStatus === option.value}
          />
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-divider bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-divider text-left text-neutral-mid">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Business</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Received</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((lead) => (
              <tr key={lead.id} className="border-b border-divider last:border-0 hover:bg-slate-bg">
                <td className="px-4 py-3">
                  <Link href={`/admin/leads/${lead.id}`} className="font-medium text-navy hover:text-blue-accent">
                    {lead.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-neutral-mid">{lead.businessName || "—"}</td>
                <td className="px-4 py-3 text-neutral-mid">{lead.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      STATUS_BADGE_CLASSES[lead.status] || STATUS_BADGE_CLASSES.new
                    }`}
                  >
                    {labelFor(LEAD_STATUS_OPTIONS, lead.status)}
                  </span>
                </td>
                <td className="px-4 py-3 text-neutral-mid">{lead.createdAt.toLocaleDateString()}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-neutral-mid">
                  No leads yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FilterLink({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
        active
          ? "bg-navy text-white"
          : "border border-divider bg-white text-neutral-mid hover:text-navy"
      }`}
    >
      {label}
    </Link>
  );
}
