"use client";

import { CheckboxGroup } from "../fields";
import { FEATURE_OPTIONS } from "@/lib/intake";
import type { StepProps } from "../types";

export function StepFeatures({ data, setData }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy mb-2">Special features</h2>
        <p className="text-neutral-mid">Anything beyond a standard informational site?</p>
      </div>

      <CheckboxGroup
        label="Which of these would be useful for your website? (choose all that apply)"
        options={FEATURE_OPTIONS}
        values={data.features}
        onChange={(values) => setData((prev) => ({ ...prev, features: values }))}
      />
    </div>
  );
}
