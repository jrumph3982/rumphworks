"use client";

import { useState } from "react";
import { initialIntakeData, type IntakeData } from "@/lib/intake";
import { StepAbout } from "./steps/StepAbout";
import { StepGoals } from "./steps/StepGoals";
import { StepScope } from "./steps/StepScope";
import { StepContent } from "./steps/StepContent";
import { StepDesign } from "./steps/StepDesign";
import { StepFeatures } from "./steps/StepFeatures";
import { StepTimeline } from "./steps/StepTimeline";
import { StepHosting } from "./steps/StepHosting";
import type { StepProps } from "./types";

const STEPS: { title: string; Component: (props: StepProps) => React.JSX.Element }[] = [
  { title: "About", Component: StepAbout },
  { title: "Goals", Component: StepGoals },
  { title: "What you need", Component: StepScope },
  { title: "Pages & content", Component: StepContent },
  { title: "Design", Component: StepDesign },
  { title: "Features", Component: StepFeatures },
  { title: "Timeline & budget", Component: StepTimeline },
  { title: "Hosting", Component: StepHosting },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "sending" | "success" | "error";

export default function Wizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<IntakeData>(initialIntakeData);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const hasValidContact = data.contact.name.trim() !== "" && EMAIL_RE.test(data.contact.email);
  const isFirst = step === 0;
  const isLast = step === STEPS.length - 1;
  const Current = STEPS[step].Component;

  const handleNext = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    if (!hasValidContact) return;
    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Something went wrong. Please try again.");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-navy mb-2">
          Thanks, {data.contact.name.split(" ")[0] || "there"}!
        </h2>
        <p className="text-neutral-mid leading-relaxed max-w-md mx-auto">
          I&apos;ve got your project details and will take a look shortly. I&apos;ll follow up at{" "}
          <span className="font-semibold text-navy">{data.contact.email}</span> within 2-3 business days.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold tracking-widest uppercase text-blue-accent">
            Step {step + 1} of {STEPS.length}
          </span>
          <span className="text-xs font-semibold tracking-widest uppercase text-neutral-mid">
            {STEPS[step].title}
          </span>
        </div>
        <div className="h-2 bg-divider rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-accent transition-all"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <Current data={data} setData={setData} />

      {status === "error" && <p className="text-sm text-red-600 mt-6">{error}</p>}

      <div className="flex items-center justify-between mt-10">
        <button
          type="button"
          onClick={handleBack}
          className={`text-sm font-semibold text-neutral-mid hover:text-navy transition-colors ${isFirst ? "invisible" : ""}`}
        >
          ← Back
        </button>

        {isLast ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={status === "sending" || !hasValidContact}
            className="bg-blue-accent text-white font-semibold px-8 py-4 rounded-lg hover:bg-blue-600 transition-all hover:-translate-y-0.5 shadow-sm disabled:opacity-60 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
          >
            {status === "sending" ? "Submitting..." : "Submit"}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            disabled={isFirst && !hasValidContact}
            className="bg-blue-accent text-white font-semibold px-8 py-4 rounded-lg hover:bg-blue-600 transition-all hover:-translate-y-0.5 shadow-sm disabled:opacity-60 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}
