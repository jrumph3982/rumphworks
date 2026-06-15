const points = [
  {
    number: "01",
    title: "You get someone who speaks both languages",
    description:
      "I understand what your business needs AND how to actually build it. No translation required between you and a technical team.",
  },
  {
    number: "02",
    title: "Clear communication, no jargon",
    description:
      "You'll always know what's happening, why it matters, and what it costs. No surprises, no tech-speak.",
  },
  {
    number: "03",
    title: "Built to last, not just to launch",
    description:
      "Your site will be fast, secure, and maintainable, not something you're rebuilding in two years.",
  },
];

export default function WhyMe() {
  return (
    <section className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-blue-accent mb-4 block">
            Why Rumphworks
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-navy tracking-tight">
            The difference is in how I work
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {points.map((point) => (
            <div key={point.number}>
              <div className="text-blue-accent text-sm font-bold tracking-widest mb-4">
                {point.number}
              </div>
              <h3 className="text-xl font-bold text-navy mb-3">{point.title}</h3>
              <p className="text-neutral-mid leading-relaxed">{point.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
