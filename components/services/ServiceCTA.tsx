import Link from "next/link";

export default function ServiceCTA() {
  return (
    <section className="py-24 bg-slate-bg">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-navy tracking-tight mb-4">
          Ready to talk about your project?
        </h2>
        <p className="text-lg text-neutral-mid mb-8 max-w-xl mx-auto">
          Tell me what you&apos;re working on and I&apos;ll help you figure out what fits.
        </p>
        <Link
          href="/#contact"
          className="inline-block bg-blue-accent text-white font-semibold px-8 py-4 rounded-lg hover:bg-blue-600 transition-all hover:-translate-y-0.5 shadow-sm"
        >
          Get in Touch
        </Link>
      </div>
    </section>
  );
}
