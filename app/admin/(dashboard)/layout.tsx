import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { destroySession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Admin | Rumphworks",
  robots: {
    index: false,
    follow: false,
  },
};

async function logout() {
  "use server";
  await destroySession();
  redirect("/admin/login");
}

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-slate-bg">
      <header className="flex items-center justify-between border-b border-divider bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <span className="text-lg font-semibold text-navy">Rumphworks Admin</span>
          <Link href="/" className="text-sm text-neutral-mid transition-colors hover:text-navy">
            ← Back to site
          </Link>
        </div>
        <form action={logout}>
          <button type="submit" className="text-sm text-neutral-mid transition-colors hover:text-navy">
            Log out
          </button>
        </form>
      </header>
      <main className="px-6 py-8">{children}</main>
    </div>
  );
}
