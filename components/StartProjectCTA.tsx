import Link from "next/link";

export default function StartProjectCTA() {
  return (
    <section className="py-24 bg-navy">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <span className="text-xs font-semibold tracking-widest uppercase text-blue-accent mb-4 block">
          Get Started
        </span>
        <h2 className="text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
          Ready to start your project?
        </h2>
        <p className="text-lg text-white/70 leading-relaxed mb-10 max-w-2xl mx-auto">
          Answer a few questions about your business and what you need, and
          I&apos;ll put together a custom estimate.
        </p>
        <Link
          href="/start-a-project"
          className="inline-block bg-blue-accent text-white font-semibold px-8 py-4 rounded-lg hover:bg-blue-600 transition-all hover:-translate-y-0.5 shadow-sm"
        >
          Start a Project
        </Link>
      </div>
    </section>
  );
}
