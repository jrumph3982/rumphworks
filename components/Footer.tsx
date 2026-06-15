import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <img src="/logo.png" alt="Rumphworks" className="h-[100px] w-auto brightness-0 invert drop-shadow-lg" />
        <div className="flex flex-col items-center gap-1">
          <p className="text-white/40 text-sm">
            &copy; 2026 Rumphworks. All rights reserved.
          </p>
          <Link href="/admin/login" className="text-white/20 hover:text-white/50 text-xs transition-colors">
            Admin
          </Link>
        </div>
        <a
          href="mailto:Jamey.Rumph@rumphworks.com"
          className="text-white/60 hover:text-white text-sm transition-colors"
        >
          Jamey.Rumph@rumphworks.com
        </a>
      </div>
    </footer>
  );
}
