import type { Metadata } from "next";
import Image from "next/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ServiceHero from "@/components/services/ServiceHero";
import ServiceCTA from "@/components/services/ServiceCTA";

export const metadata: Metadata = {
  title: "Website Development | Rumphworks",
  description:
    "From a simple landing page to a full custom website with e-commerce and integrations. See what's included at every level.",
  alternates: { canonical: "/services/website-development" },
};

const tiers = [
  {
    name: "Landing Page",
    icon: "landing-page",
    timeline: "1-2 weeks",
    bestFor:
      "Best for launching fast, supporting an ad campaign, or getting a real online presence up for the first time.",
    includes: [
      "Custom single-page design matched to your brand",
      "Mobile-friendly and fast-loading",
      "Contact form so leads can reach you",
      "Basic on-page SEO",
    ],
  },
  {
    name: "Business Website",
    icon: "business-website",
    timeline: "2-4 weeks",
    bestFor:
      "Best for businesses ready for a full online presence: explain what you do, build trust, and turn visitors into inquiries.",
    includes: [
      "Everything in Landing Page",
      "Multiple pages: Home, About, Services, Contact, and more",
      "Content structured for search engines",
      "Easy-to-update content areas",
      "Room to grow: blog, gallery, and more as needed",
    ],
  },
  {
    name: "Dynamic / Full Website",
    icon: "dynamic-website",
    timeline: "4-8+ weeks",
    bestFor:
      "Best for businesses that need their site to do something: sell products, take bookings, manage accounts, or connect to other tools.",
    includes: [
      "Everything in Business Website",
      "E-commerce, booking, or membership functionality",
      "Integrations with tools you already use: payments, email marketing, CRM",
      "Custom interactions and animations",
    ],
  },
];

function CheckIcon() {
  return (
    <svg
      className="w-5 h-5 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function WebsiteDevelopmentPage() {
  return (
    <>
      <Nav />
      <main>
        <ServiceHero
          eyebrow="Website Development"
          title="From a simple landing page to a full custom website"
          intro="Every business needs something different from its website. Here's how the options break down, so you know what to expect before we ever talk specifics."
        />

        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {tiers.map((tier) => (
                <div
                  key={tier.name}
                  className="bg-slate-bg border border-divider rounded-2xl p-8 flex flex-col"
                >
                  <div className="relative w-full aspect-[320/234] mb-5 rounded-xl overflow-hidden bg-white">
                    <Image
                      src={`/website-development/${tier.icon}.png`}
                      alt=""
                      fill
                      className="object-contain"
                      sizes="(min-width: 1024px) 33vw, 90vw"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <h2 className="text-2xl font-bold text-navy">{tier.name}</h2>
                    <span className="text-xs font-semibold text-blue-accent bg-blue-accent/10 px-3 py-1 rounded-full whitespace-nowrap">
                      {tier.timeline}
                    </span>
                  </div>
                  <p className="text-neutral-mid leading-relaxed mb-6">{tier.bestFor}</p>
                  <ul className="space-y-3 mt-auto">
                    {tier.includes.map((item) => (
                      <li key={item} className="flex gap-3 text-navy text-sm leading-relaxed">
                        <span className="text-blue-accent mt-0.5">
                          <CheckIcon />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ServiceCTA />
      </main>
      <Footer />
    </>
  );
}
