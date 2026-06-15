import type { Option } from "@/lib/intake";

const inputClass =
  "w-full border border-divider rounded-lg px-4 py-3 text-navy bg-white placeholder:text-neutral-mid/50 focus:outline-none focus:ring-2 focus:ring-blue-accent focus:ring-offset-2 transition";

const optionClass = (active: boolean) =>
  `flex items-start gap-3 border rounded-lg px-4 py-3 cursor-pointer transition ${
    active ? "border-blue-accent bg-blue-accent/5" : "border-divider hover:border-blue-accent/50"
  }`;

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
};

export function TextField({ label, value, onChange, placeholder, type = "text", required }: TextFieldProps) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-navy mb-2">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </label>
  );
}

type TextAreaFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
};

export function TextAreaField({ label, value, onChange, placeholder, rows = 4 }: TextAreaFieldProps) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-navy mb-2">{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${inputClass} resize-none`}
      />
    </label>
  );
}

type RadioGroupProps = {
  name: string;
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
};

export function RadioGroup({ name, label, options, value, onChange }: RadioGroupProps) {
  return (
    <div>
      <span className="block text-sm font-semibold text-navy mb-3">{label}</span>
      <div className="space-y-3">
        {options.map((option) => (
          <label key={option.value} className={optionClass(value === option.value)}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="mt-1 accent-blue-accent"
            />
            <span className="text-navy">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

type CheckboxGroupProps = {
  label: string;
  options: Option[];
  values: string[];
  onChange: (values: string[]) => void;
};

export function CheckboxGroup({ label, options, values, onChange }: CheckboxGroupProps) {
  const toggle = (value: string) => {
    if (values.includes(value)) {
      onChange(values.filter((v) => v !== value));
    } else {
      onChange([...values, value]);
    }
  };

  return (
    <div>
      <span className="block text-sm font-semibold text-navy mb-3">{label}</span>
      <div className="space-y-3">
        {options.map((option) => (
          <label key={option.value} className={optionClass(values.includes(option.value))}>
            <input
              type="checkbox"
              checked={values.includes(option.value)}
              onChange={() => toggle(option.value)}
              className="mt-1 accent-blue-accent"
            />
            <span className="text-navy">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
