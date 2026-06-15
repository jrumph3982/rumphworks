"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Work", href: "/#work" },
    { label: "Services", href: "/#services" },
    { label: "Process", href: "/#process" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : ""
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between h-28">
        <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center">
          <img src="/logo.png" alt="Rumphworks" className="h-[130px] w-auto drop-shadow-lg" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-semibold tracking-widest uppercase text-neutral-mid hover:text-navy transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/start-a-project"
            className="text-xs font-semibold tracking-widest uppercase text-neutral-mid hover:text-navy transition-colors"
          >
            Start a Project
          </Link>
          <Link
            href="/#contact"
            className="bg-blue-accent text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-blue-600 transition-colors"
          >
            Let&apos;s Talk
          </Link>
        </div>

        <button
          className="md:hidden text-navy p-1"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-divider px-6 py-6 flex flex-col gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold tracking-widest uppercase text-neutral-mid hover:text-navy transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/start-a-project"
            className="text-sm font-semibold tracking-widest uppercase text-neutral-mid hover:text-navy transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            Start a Project
          </Link>
          <Link
            href="/#contact"
            className="bg-blue-accent text-white text-sm font-semibold px-6 py-3 rounded-full text-center hover:bg-blue-600 transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            Let&apos;s Talk
          </Link>
        </div>
      )}
    </header>
  );
}
