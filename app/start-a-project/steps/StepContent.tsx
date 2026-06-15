"use client";

import { RadioGroup, CheckboxGroup, TextField } from "../fields";
import { HAS_WEBSITE_OPTIONS, PAGE_OPTIONS, CONTENT_READINESS_OPTIONS } from "@/lib/intake";
import type { StepProps } from "../types";

export function StepContent({ data, setData }: StepProps) {
  const setHasExistingWebsite = (value: string) =>
    setData((prev) => ({ ...prev, content: { ...prev.content, hasExistingWebsite: value } }));

  const setExistingWebsiteUrl = (value: string) =>
    setData((prev) => ({ ...prev, content: { ...prev.content, existingWebsiteUrl: value } }));

  const setPagesNeeded = (values: string[]) =>
    setData((prev) => ({ ...prev, content: { ...prev.content, pagesNeeded: values } }));

  const setContentReadiness = (value: string) =>
    setData((prev) => ({ ...prev, content: { ...prev.content, contentReadiness: value } }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy mb-2">Pages & content</h2>
        <p className="text-neutral-mid">This helps me scope the project and plan what we&apos;ll need to gather.</p>
      </div>

      <RadioGroup
        name="hasExistingWebsite"
        label="Do you already have a website?"
        options={HAS_WEBSITE_OPTIONS}
        value={data.content.hasExistingWebsite}
        onChange={setHasExistingWebsite}
      />

      {data.content.hasExistingWebsite === "yes" && (
        <TextField label="What's the URL?" value={data.content.existingWebsiteUrl} onChange={setExistingWebsiteUrl} placeholder="https://example.com" />
      )}

      <CheckboxGroup
        label="Which pages do you think you'll need? (choose all that apply)"
        options={PAGE_OPTIONS}
        values={data.content.pagesNeeded}
        onChange={setPagesNeeded}
      />

      <RadioGroup
        name="contentReadiness"
        label="How ready is your content (text, photos, logo)?"
        options={CONTENT_READINESS_OPTIONS}
        value={data.content.contentReadiness}
        onChange={setContentReadiness}
      />
    </div>
  );
}
