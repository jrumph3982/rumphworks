"use client";

import { TextField, TextAreaField } from "../fields";
import type { IntakeData } from "@/lib/intake";
import type { StepProps } from "../types";

export function StepAbout({ data, setData }: StepProps) {
  const update = (field: keyof IntakeData["contact"], value: string) =>
    setData((prev) => ({ ...prev, contact: { ...prev.contact, [field]: value } }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy mb-2">About your business</h2>
        <p className="text-neutral-mid">Let&apos;s start with the basics so I know who I&apos;m talking to.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <TextField label="Your name" value={data.contact.name} onChange={(v) => update("name", v)} placeholder="Jane Smith" required />
        <TextField label="Email" type="email" value={data.contact.email} onChange={(v) => update("email", v)} placeholder="jane@example.com" required />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <TextField label="Phone (optional)" type="tel" value={data.contact.phone} onChange={(v) => update("phone", v)} placeholder="(555) 555-5555" />
        <TextField label="Business name (optional)" value={data.contact.businessName} onChange={(v) => update("businessName", v)} placeholder="Acme Co." />
      </div>

      <TextAreaField
        label="What does your business do? (optional)"
        value={data.contact.businessDescription}
        onChange={(v) => update("businessDescription", v)}
        placeholder="A quick description helps me understand your business before we talk."
      />
    </div>
  );
}
