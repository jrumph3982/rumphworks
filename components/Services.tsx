import Image from "next/image";
import Link from "next/link";

const services = [
  {
    title: "Website Development",
    href: "/services/website-development",
    description:
      "Marketing sites, business sites, and landing pages built to look great on every device and turn visitors into customers.",
    icon: "website",
  },
  {
    title: "Web Application Development",
    href: "/services/web-applications",
    description:
      "Custom tools, portals, and interactive systems built when a simple website isn't enough. Made for how your business actually works.",
    icon: "web-app",
  },
  {
    title: "Hosting & Maintenance",
    href: "/services/hosting-maintenance",
    description:
      "From launch day to long-term. I handle updates, performance, and reliability so you never have to think about the technical side.",
    icon: "hosting",
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
            <Link
              key={service.title}
              href={service.href}
              className="group bg-slate-bg border border-divider p-8 rounded-2xl hover:-translate-y-1 transition-transform duration-200 shadow-[0px_10px_15px_-3px_rgba(15,23,42,0.05)] flex flex-col"
            >
              <div className="relative w-full aspect-[320/234] mb-5 rounded-xl overflow-hidden bg-white">
                <Image
                  src={`/services/${service.icon}.png`}
                  alt=""
                  fill
                  className="object-contain"
                  sizes="(min-width: 768px) 33vw, 90vw"
                />
              </div>
              <h3 className="text-xl font-bold text-navy mb-3">{service.title}</h3>
              <p className="text-neutral-mid leading-relaxed mb-6 flex-1">
                {service.description}
              </p>
              <span className="text-sm font-semibold text-blue-accent group-hover:text-blue-600 transition-colors">
                Learn more →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
