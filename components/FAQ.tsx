"use client";
import { useState } from "react";

const faqs = [
  {
    question: "How much will my website cost?",
    answer:
      "It depends on what your business needs. Most projects fall into one of three tiers: a single Landing Page, a multi-page Business Website, or a full Dynamic Website with e-commerce, booking, or other custom features. After a quick conversation about your goals, I'll put together a clear estimate before any work begins, so there are no surprise costs.",
  },
  {
    question: "How long will my project take?",
    answer:
      "Timelines depend on scope. A Landing Page typically takes 1-2 weeks, a Business Website 2-4 weeks, and a full Dynamic Website with custom features 4-8 weeks or more. You'll get a realistic timeline as part of your estimate, plus regular check-ins along the way.",
  },
  {
    question: "What does the process look like?",
    answer:
      "Every project follows the same five steps: Discovery, Design, Build, Launch, and Support. We start by talking through what your business needs, then I put together designs for your review before any development starts. You'll get regular check-ins throughout the build, and I stay on after launch to keep things running smoothly.",
  },
  {
    question: "Do I need to provide my own content, photos, or branding?",
    answer:
      "Not necessarily. It helps if you have an idea of your branding, any existing photos, and a sense of what you want to say, but it's not required. I can help write copy, source stock photography, and put together a look and feel from scratch if you're starting with a blank slate.",
  },
  {
    question: "How does payment work?",
    answer:
      "Most projects start with a deposit to begin work, with the remaining balance due at launch. For larger projects, I can split payments into milestones tied to project phases, so you're never paying for work that hasn't happened yet.",
  },
  {
    question: "What happens after my site goes live?",
    answer:
      "Launch isn't the finish line. I offer ongoing hosting and maintenance plans to keep your site secure, up to date, and running smoothly, plus I'm available for updates and new features as your business grows.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 bg-slate-bg scroll-mt-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 max-w-2xl">
          <span className="text-xs font-semibold tracking-widest uppercase text-blue-accent mb-4 block">
            FAQ
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-navy tracking-tight mb-4">
            Common questions
          </h2>
          <p className="text-lg text-neutral-mid leading-relaxed">
            Have something else on your mind? Reach out below &mdash; happy to talk
            through specifics.
          </p>
        </div>

        <div className="max-w-3xl divide-y divide-divider border-y border-divider">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={faq.question}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 py-6 text-left"
                >
                  <span className="text-lg font-semibold text-navy">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 text-blue-accent transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <p className="pb-6 pr-10 text-neutral-mid leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
