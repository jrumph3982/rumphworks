"use client";

import { RadioGroup } from "../fields";
import { SCOPE_OPTIONS } from "@/lib/intake";
import type { StepProps } from "../types";

export function StepScope({ data, setData }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy mb-2">What you need</h2>
        <p className="text-neutral-mid">No need to know the technical terms - just pick what sounds closest.</p>
      </div>

      <RadioGroup
        name="sizeNeeded"
        label="Which of these sounds closest to what you're picturing?"
        options={SCOPE_OPTIONS}
        value={data.scope.sizeNeeded}
        onChange={(value) => setData((prev) => ({ ...prev, scope: { sizeNeeded: value } }))}
      />
    </div>
  );
}
