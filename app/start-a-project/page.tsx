import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Wizard from "./wizard";

export const metadata: Metadata = {
  title: "Start a Project | Rumphworks",
  description:
    "Tell me about your business and what you're looking for. It takes about 5 minutes and helps me put together a more accurate estimate before we talk.",
  alternates: { canonical: "/start-a-project" },
};

export default function StartAProjectPage() {
  return (
    <>
      <Nav />
      <main>
        <section className="pt-40 pb-24 bg-surface min-h-screen">
          <div className="max-w-3xl mx-auto px-6">
            <span className="text-xs font-semibold tracking-widest uppercase text-blue-accent mb-4 block">
              Start a Project
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-navy leading-tight tracking-tight mb-4">
              Let&apos;s get to know your project
            </h1>
            <p className="text-lg text-neutral-mid leading-relaxed mb-12 max-w-2xl">
              Answer a few questions about your business and what you&apos;re looking for. It takes about
              5 minutes, and helps me put together a more accurate estimate before we talk.
            </p>

            <div className="bg-white border border-divider rounded-2xl p-8 sm:p-10">
              <Wizard />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
