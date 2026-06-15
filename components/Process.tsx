import Image from "next/image";
import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Discovery",
    icon: "discovery",
    description:
      "We talk through what your business needs, who your site or app needs to work for, and what success looks like.",
  },
  {
    number: "02",
    title: "Design",
    icon: "design",
    description:
      "I put together the look and structure for your review, so you see and approve the direction before development starts.",
  },
  {
    number: "03",
    title: "Build",
    icon: "build",
    description:
      "Development happens, with regular check-ins along the way, so you're never wondering what's going on.",
  },
  {
    number: "04",
    title: "Launch",
    icon: "launch",
    description:
      "Your site or app goes live, with domain, hosting, and everything else set up, tested, and working.",
  },
  {
    number: "05",
    title: "Support",
    icon: "support",
    description:
      "I stay on to keep things running, secure, and up to date.",
  },
];

export default function Process() {
  return (
    <section id="process" className="py-24 bg-slate-bg scroll-mt-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 max-w-2xl">
          <span className="text-xs font-semibold tracking-widest uppercase text-blue-accent mb-4 block">
            Process
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-navy tracking-tight mb-4">
            How we&apos;ll get there
          </h2>
          <p className="text-lg text-neutral-mid leading-relaxed">
            Wondering how long this takes, what to expect, or when you&apos;ll see
            something? Here&apos;s the typical flow.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {steps.map((step) => (
            <div key={step.number}>
              <div className="relative w-full aspect-[320/234] mb-6 rounded-xl overflow-hidden bg-white">
                <Image
                  src={`/process/${step.icon}.png`}
                  alt=""
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>
              <div className="text-blue-accent text-sm font-bold tracking-widest mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-bold text-navy mb-3">{step.title}</h3>
              <p className="text-neutral-mid leading-relaxed text-sm">{step.description}</p>
              {step.title === "Support" && (
                <Link
                  href="/services/hosting-maintenance"
                  className="inline-block mt-3 text-sm font-semibold text-blue-accent hover:text-blue-600 transition-colors"
                >
                  Learn more →
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
