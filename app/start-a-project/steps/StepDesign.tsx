"use client";

import { RadioGroup, TextAreaField } from "../fields";
import { BRAND_OPTIONS, STYLE_OPTIONS } from "@/lib/intake";
import type { IntakeData } from "@/lib/intake";
import type { StepProps } from "../types";

export function StepDesign({ data, setData }: StepProps) {
  const update = (field: keyof IntakeData["design"], value: string) =>
    setData((prev) => ({ ...prev, design: { ...prev.design, [field]: value } }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy mb-2">Design preferences</h2>
        <p className="text-neutral-mid">A sense of your style helps me put together design directions you&apos;ll love.</p>
      </div>

      <RadioGroup
        name="hasBrand"
        label="Do you already have a logo and brand colors?"
        options={BRAND_OPTIONS}
        value={data.design.hasBrand}
        onChange={(value) => update("hasBrand", value)}
      />

      <TextAreaField
        label="Are there any websites you like the look of? (optional)"
        value={data.design.styleExamples}
        onChange={(v) => update("styleExamples", v)}
        placeholder="Paste a link or two, or describe what you like about them."
      />

      <RadioGroup
        name="stylePreference"
        label="Which style feels closest to your business?"
        options={STYLE_OPTIONS}
        value={data.design.stylePreference}
        onChange={(value) => update("stylePreference", value)}
      />
    </div>
  );
}
