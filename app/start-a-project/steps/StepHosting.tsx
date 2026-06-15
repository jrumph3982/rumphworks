"use client";

import { RadioGroup, TextAreaField } from "../fields";
import { HOSTING_INTEREST_OPTIONS } from "@/lib/intake";
import type { IntakeData } from "@/lib/intake";
import type { StepProps } from "../types";

export function StepHosting({ data, setData }: StepProps) {
  const update = (field: keyof IntakeData["hosting"], value: string) =>
    setData((prev) => ({ ...prev, hosting: { ...prev.hosting, [field]: value } }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy mb-2">Hosting & final notes</h2>
        <p className="text-neutral-mid">Last step! Then I&apos;ll take a look and follow up.</p>
      </div>

      <RadioGroup
        name="hostingInterest"
        label="Would you like Rumphworks to handle hosting and ongoing maintenance after launch?"
        options={HOSTING_INTEREST_OPTIONS}
        value={data.hosting.interest}
        onChange={(value) => update("interest", value)}
      />

      <TextAreaField
        label="Anything else you'd like to share? (optional)"
        value={data.hosting.additionalNotes}
        onChange={(v) => update("additionalNotes", v)}
        placeholder="Questions, links, deadlines - anything that'll help."
      />
    </div>
  );
}
