import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin Login | Rumphworks",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-bg px-4">
      <div className="w-full max-w-sm rounded-lg border border-divider bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-xl font-semibold text-navy">Admin Login</h1>
        <LoginForm />
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-neutral-mid transition-colors hover:text-navy">
            ← Back to site
          </Link>
        </div>
      </div>
    </main>
  );
}
