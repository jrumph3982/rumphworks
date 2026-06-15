"use client";

import type { Option } from "@/lib/intake";

type AutoSubmitSelectProps = {
  name: string;
  defaultValue: string;
  options: Option[];
  className?: string;
};

export function AutoSubmitSelect({ name, defaultValue, options, className }: AutoSubmitSelectProps) {
  return (
    <select
      name={name}
      defaultValue={defaultValue}
      onChange={(e) => e.currentTarget.form?.requestSubmit()}
      className={className}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
