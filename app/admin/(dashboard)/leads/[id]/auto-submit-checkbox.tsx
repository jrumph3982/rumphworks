"use client";

type AutoSubmitCheckboxProps = {
  name: string;
  defaultChecked: boolean;
  className?: string;
};

export function AutoSubmitCheckbox({ name, defaultChecked, className }: AutoSubmitCheckboxProps) {
  return (
    <input
      type="checkbox"
      name={name}
      defaultChecked={defaultChecked}
      onChange={(e) => e.currentTarget.form?.requestSubmit()}
      className={className}
    />
  );
}
