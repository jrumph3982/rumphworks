const testimonials = [
  {
    quote:
      "Jamey completely transformed our online presence. The site is fast, beautiful, and we've seen a real uptick in inquiries since launching.",
    name: "Sarah M.",
    company: "Coastal Home Decor",
  },
  {
    quote:
      "Working with Jamey was the best business decision we made last year. He understood exactly what we needed and delivered without any drama.",
    name: "Marcus T.",
    company: "TerraFlow Landscaping",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-navy">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-blue-accent mb-4 block">
            Testimonials
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
            What clients say
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white/5 border border-white/10 rounded-2xl p-8"
            >
              <p className="text-white/80 text-lg leading-relaxed mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <div className="text-white font-semibold">{t.name}</div>
                <div className="text-white/50 text-sm">{t.company}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
