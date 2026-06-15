"use client";

import { RadioGroup } from "../fields";
import { LAUNCH_TIMELINE_OPTIONS, BUDGET_OPTIONS } from "@/lib/intake";
import type { IntakeData } from "@/lib/intake";
import type { StepProps } from "../types";

export function StepTimeline({ data, setData }: StepProps) {
  const update = (field: keyof IntakeData["timeline"], value: string) =>
    setData((prev) => ({ ...prev, timeline: { ...prev.timeline, [field]: value } }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy mb-2">Timeline & budget</h2>
        <p className="text-neutral-mid">Ballpark answers are totally fine - this just helps me plan.</p>
      </div>

      <RadioGroup
        name="launchTimeline"
        label="When would you like your new site to be live?"
        options={LAUNCH_TIMELINE_OPTIONS}
        value={data.timeline.launchTimeline}
        onChange={(value) => update("launchTimeline", value)}
      />

      <RadioGroup
        name="budgetRange"
        label="What budget range are you working with?"
        options={BUDGET_OPTIONS}
        value={data.timeline.budgetRange}
        onChange={(value) => update("budgetRange", value)}
      />
    </div>
  );
}
