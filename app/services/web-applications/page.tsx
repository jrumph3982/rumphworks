import type { Metadata } from "next";
import Image from "next/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ServiceHero from "@/components/services/ServiceHero";
import ServiceCTA from "@/components/services/ServiceCTA";

export const metadata: Metadata = {
  title: "Web Application Development | Rumphworks",
  description:
    "Custom data collection, dashboards, internal tools, and integrations: software that runs part of your business, not just represents it.",
  alternates: { canonical: "/services/web-applications" },
};

const capabilities = [
  {
    title: "Custom Data Collection",
    description:
      "Forms, intake systems, or portals that capture information directly in a structured way, instead of letting it pile up in emails or paper forms.",
    icon: "data-collection",
  },
  {
    title: "Dashboards & Reporting",
    description:
      "Turn raw data into charts and reports so you can see trends and make decisions without digging through spreadsheets.",
    icon: "dashboards",
  },
  {
    title: "Internal Tools",
    description:
      "Purpose-built tools for scheduling, inventory, or client management, for whatever process is currently held together with spreadsheets and sticky notes.",
    icon: "internal-tools",
  },
  {
    title: "Integrations",
    description:
      "Connect the tools you already use so information flows between them automatically, instead of being re-entered by hand.",
    icon: "integrations",
  },
];

export default function WebApplicationsPage() {
  return (
    <>
      <Nav />
      <main>
        <ServiceHero
          eyebrow="Web Application Development"
          title="When a website isn't enough"
          titleClassName="max-w-none lg:whitespace-nowrap"
          intro="Some businesses need more than a site that represents them. They need something that does work for them."
        />

        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {capabilities.map((capability) => (
                <div
                  key={capability.title}
                  className="bg-slate-bg border border-divider p-8 rounded-2xl"
                >
                  <div className="relative w-full aspect-[320/234] mb-5 rounded-xl overflow-hidden bg-white">
                    <Image
                      src={`/web-applications/${capability.icon}.png`}
                      alt=""
                      fill
                      className="object-contain"
                      sizes="(min-width: 768px) 50vw, 90vw"
                    />
                  </div>
                  <h2 className="text-xl font-bold text-navy mb-3">{capability.title}</h2>
                  <p className="text-neutral-mid leading-relaxed">{capability.description}</p>
                </div>
              ))}
            </div>

            <div className="bg-navy rounded-2xl p-8 lg:p-10 max-w-3xl">
              <span className="text-xs font-semibold tracking-widest uppercase text-blue-accent mb-4 block">
                What this looks like in practice
              </span>
              <p className="text-lg text-white/90 leading-relaxed">
                For example: a service business collects appointment requests through a
                custom form on their site. Instead of emails piling up, each request is
                logged automatically and shown on a simple dashboard, so staff can see
                what&apos;s pending, what&apos;s scheduled, and basic trends like busiest
                days, at a glance.
              </p>
            </div>
          </div>
        </section>

        <ServiceCTA />
      </main>
      <Footer />
    </>
  );
}
