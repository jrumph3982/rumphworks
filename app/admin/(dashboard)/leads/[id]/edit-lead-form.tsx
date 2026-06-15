import {
  BRAND_OPTIONS,
  BUDGET_OPTIONS,
  CONTENT_READINESS_OPTIONS,
  FEATURE_OPTIONS,
  HAS_WEBSITE_OPTIONS,
  HOSTING_INTEREST_OPTIONS,
  LAUNCH_TIMELINE_OPTIONS,
  MAIN_GOAL_OPTIONS,
  MOTIVATION_OPTIONS,
  PAGE_OPTIONS,
  SCOPE_OPTIONS,
  STYLE_OPTIONS,
  type ContactFields,
  type IntakeData,
  type Option,
} from "@/lib/intake";

const inputClass =
  "w-full border border-divider rounded-lg px-3 py-2 text-sm text-navy bg-white focus:outline-none focus:ring-2 focus:ring-blue-accent focus:ring-offset-2 transition";

const labelClass = "block text-sm font-medium text-navy mb-1";

function TextField({
  name,
  label,
  defaultValue,
  type = "text",
}: {
  name: string;
  label: string;
  defaultValue: string;
  type?: string;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input type={type} name={name} defaultValue={defaultValue} className={inputClass} />
    </div>
  );
}

function TextAreaField({ name, label, defaultValue }: { name: string; label: string; defaultValue: string }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <textarea name={name} defaultValue={defaultValue} rows={3} className={inputClass} />
    </div>
  );
}

function SelectField({
  name,
  label,
  options,
  defaultValue,
}: {
  name: string;
  label: string;
  options: Option[];
  defaultValue: string;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <select name={name} defaultValue={defaultValue} className={inputClass}>
        <option value="">(not answered)</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function CheckboxGroupField({
  name,
  label,
  options,
  defaultValues,
}: {
  name: string;
  label: string;
  options: Option[];
  defaultValues: string[];
}) {
  return (
    <div>
      <span className={labelClass}>{label}</span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-2 text-sm text-navy">
            <input
              type="checkbox"
              name={name}
              value={option.value}
              defaultChecked={defaultValues.includes(option.value)}
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  );
}

type EditLeadFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  contact: ContactFields;
  intake: IntakeData;
};

/** Combined edit form for the lead's contact info and questionnaire answers - submitting writes one note + timestamp covering every changed field. */
export function EditLeadForm({ action, contact, intake }: EditLeadFormProps) {
  return (
    <form action={action} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField name="name" label="Name" defaultValue={contact.name} />
        <TextField name="email" label="Email" defaultValue={contact.email} type="email" />
        <TextField name="phone" label="Phone" defaultValue={contact.phone} />
        <TextField name="businessName" label="Business name" defaultValue={contact.businessName} />
      </div>
      <TextAreaField name="businessDescription" label="What they do" defaultValue={intake.contact.businessDescription} />

      <SelectField name="motivation" label="Why now" options={MOTIVATION_OPTIONS} defaultValue={intake.goals.motivation} />
      <CheckboxGroupField name="mainGoals" label="Main goals" options={MAIN_GOAL_OPTIONS} defaultValues={intake.goals.mainGoals} />
      <SelectField name="sizeNeeded" label="Site size needed" options={SCOPE_OPTIONS} defaultValue={intake.scope.sizeNeeded} />
      <SelectField
        name="hasExistingWebsite"
        label="Existing website"
        options={HAS_WEBSITE_OPTIONS}
        defaultValue={intake.content.hasExistingWebsite}
      />
      <TextField name="existingWebsiteUrl" label="Existing website URL" defaultValue={intake.content.existingWebsiteUrl} />
      <CheckboxGroupField name="pagesNeeded" label="Pages needed" options={PAGE_OPTIONS} defaultValues={intake.content.pagesNeeded} />
      <SelectField
        name="contentReadiness"
        label="Content readiness"
        options={CONTENT_READINESS_OPTIONS}
        defaultValue={intake.content.contentReadiness}
      />
      <SelectField name="hasBrand" label="Existing brand" options={BRAND_OPTIONS} defaultValue={intake.design.hasBrand} />
      <TextAreaField name="styleExamples" label="Style examples" defaultValue={intake.design.styleExamples} />
      <SelectField
        name="stylePreference"
        label="Style preference"
        options={STYLE_OPTIONS}
        defaultValue={intake.design.stylePreference}
      />
      <CheckboxGroupField name="features" label="Special features" options={FEATURE_OPTIONS} defaultValues={intake.features} />
      <SelectField
        name="launchTimeline"
        label="Launch timeline"
        options={LAUNCH_TIMELINE_OPTIONS}
        defaultValue={intake.timeline.launchTimeline}
      />
      <SelectField name="budgetRange" label="Budget range" options={BUDGET_OPTIONS} defaultValue={intake.timeline.budgetRange} />
      <SelectField
        name="hostingInterest"
        label="Hosting interest"
        options={HOSTING_INTEREST_OPTIONS}
        defaultValue={intake.hosting.interest}
      />
      <TextAreaField name="hostingNotes" label="Hosting notes" defaultValue={intake.hosting.additionalNotes} />

      <TextAreaField name="note" label="Note (why these changes were made)" defaultValue="" />

      <button
        type="submit"
        className="rounded-lg bg-blue-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
      >
        Save changes
      </button>
    </form>
  );
}
