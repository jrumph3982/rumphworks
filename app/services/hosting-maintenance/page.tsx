import type { Metadata } from "next";
import Image from "next/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ServiceHero from "@/components/services/ServiceHero";
import ServiceCTA from "@/components/services/ServiceCTA";

export const metadata: Metadata = {
  title: "Hosting & Maintenance | Rumphworks",
  description:
    "Full-lifecycle hosting, maintenance, and support for websites and custom web applications, with one point of contact from start to finish.",
  alternates: { canonical: "/services/hosting-maintenance" },
};

const coverage = [
  {
    title: "Hosting",
    icon: "hosting",
    items: [
      "Reliable, secure hosting for your website or web application",
      "Domain & DNS management",
      "SSL/security certificates kept current",
    ],
  },
  {
    title: "Maintenance",
    icon: "maintenance",
    items: [
      "Ongoing software and platform updates",
      "Regular backups",
      "Monitoring to catch issues early",
    ],
  },
  {
    title: "Support",
    icon: "support",
    items: [
      "Direct access to me, no tickets, no call center",
      "Small content updates as your business changes",
      "Troubleshooting when something breaks",
      "A starting point for bigger changes when you're ready to grow",
    ],
  },
];

export default function HostingMaintenancePage() {
  return (
    <>
      <Nav />
      <main>
        <ServiceHero
          eyebrow="Hosting & Maintenance"
          title="I take it from here"
          intro="Once your site or application goes live, I stay on as the person who keeps it running, for both websites and the custom applications I build. One point of contact, start to finish, for as long as you need it."
        />

        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {coverage.map((category) => (
                <div
                  key={category.title}
                  className="bg-slate-bg border border-divider p-8 rounded-2xl"
                >
                  <div className="relative w-full aspect-[320/234] mb-5 rounded-xl overflow-hidden bg-white">
                    <Image
                      src={`/hosting-maintenance/${category.icon}.png`}
                      alt=""
                      fill
                      className="object-contain"
                      sizes="(min-width: 768px) 33vw, 90vw"
                    />
                  </div>
                  <h2 className="text-xl font-bold text-navy mb-4">{category.title}</h2>
                  <ul className="space-y-3">
                    {category.items.map((item) => (
                      <li key={item} className="text-neutral-mid leading-relaxed text-sm">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <p className="text-lg text-neutral-mid leading-relaxed max-w-2xl">
              This isn&apos;t a separate add-on you have to think about later. It&apos;s
              part of how every project is built from day one.
            </p>
          </div>
        </section>

        <ServiceCTA />
      </main>
      <Footer />
    </>
  );
}
