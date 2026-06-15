"use client";

import { RadioGroup, CheckboxGroup } from "../fields";
import { MOTIVATION_OPTIONS, MAIN_GOAL_OPTIONS } from "@/lib/intake";
import type { StepProps } from "../types";

export function StepGoals({ data, setData }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy mb-2">Your goals</h2>
        <p className="text-neutral-mid">Help me understand what&apos;s driving this project.</p>
      </div>

      <RadioGroup
        name="motivation"
        label="What's prompting you to look into a website right now?"
        options={MOTIVATION_OPTIONS}
        value={data.goals.motivation}
        onChange={(value) => setData((prev) => ({ ...prev, goals: { ...prev.goals, motivation: value } }))}
      />

      <CheckboxGroup
        label="What's the main goal for your new website? (choose all that apply)"
        options={MAIN_GOAL_OPTIONS}
        values={data.goals.mainGoals}
        onChange={(values) => setData((prev) => ({ ...prev, goals: { ...prev.goals, mainGoals: values } }))}
      />
    </div>
  );
}
