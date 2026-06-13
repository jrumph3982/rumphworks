const services = [
  {
    title: "Website Development",
    description:
      "Marketing sites, business sites, and landing pages built to look great on every device and turn visitors into customers.",
    icon: (
      <svg
        className="w-7 h-7"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    title: "Web Application Development",
    description:
      "Custom tools, portals, and interactive systems built when a simple website isn't enough. Made for how your business actually works.",
    icon: (
      <svg
        className="w-7 h-7"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    title: "Hosting & Maintenance",
    description:
      "From launch day to long-term. I handle updates, performance, and reliability so you never have to think about the technical side.",
    icon: (
      <svg
        className="w-7 h-7"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
      </svg>
    ),
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-white scroll-mt-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-blue-accent mb-4 block">
            Services
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-navy tracking-tight">
            What I Build
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.title}
              className="bg-slate-bg border border-divider p-8 rounded-2xl hover:-translate-y-1 transition-transform duration-200 shadow-[0px_10px_15px_-3px_rgba(15,23,42,0.05)]"
            >
              <div className="text-blue-accent mb-5">{service.icon}</div>
              <h3 className="text-xl font-bold text-navy mb-3">{service.title}</h3>
              <p className="text-neutral-mid leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
