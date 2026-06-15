export type Option = { value: string; label: string };

export const MOTIVATION_OPTIONS: Option[] = [
  { value: "no_website", label: "I don't have a website yet" },
  { value: "outdated", label: "My current website is outdated or hard to use" },
  { value: "new_business", label: "I'm starting a new business" },
  { value: "more_leads", label: "I need more leads or sales" },
  { value: "other", label: "Something else" },
];

export const MAIN_GOAL_OPTIONS: Option[] = [
  { value: "leads", label: "Get more leads or inquiries" },
  { value: "sales", label: "Sell products online" },
  { value: "portfolio", label: "Showcase my work or portfolio" },
  { value: "credibility", label: "Build credibility and look more professional" },
  { value: "info", label: "Give customers information and save time answering questions" },
  { value: "bookings", label: "Let customers book appointments online" },
  { value: "other", label: "Something else" },
];

export const SCOPE_OPTIONS: Option[] = [
  { value: "simple", label: "A simple one-page site so people can find me and get in touch" },
  { value: "multi_page", label: "A multi-page website covering my business, services, and more" },
  { value: "advanced", label: "A more advanced site - things like online sales, bookings, or member accounts" },
  { value: "not_sure", label: "Not sure - I'd like help figuring out what's right for me" },
];

export const HAS_WEBSITE_OPTIONS: Option[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

export const PAGE_OPTIONS: Option[] = [
  { value: "home", label: "Home" },
  { value: "about", label: "About" },
  { value: "services", label: "Services" },
  { value: "portfolio", label: "Portfolio / Gallery" },
  { value: "blog", label: "Blog" },
  { value: "pricing", label: "Pricing" },
  { value: "faq", label: "FAQ" },
  { value: "contact", label: "Contact" },
  { value: "other", label: "Something else" },
];

export const CONTENT_READINESS_OPTIONS: Option[] = [
  { value: "ready", label: "Everything's ready to go (text, photos, logo)" },
  { value: "some", label: "I have some of it, but will need help with the rest" },
  { value: "none", label: "I don't have much yet - I'll need help creating it" },
];

export const BRAND_OPTIONS: Option[] = [
  { value: "yes", label: "Yes, I have a logo and brand colors" },
  { value: "some", label: "I have some of it (just a logo, or just colors)" },
  { value: "no", label: "No, I'll need help with this too" },
];

export const STYLE_OPTIONS: Option[] = [
  { value: "minimal", label: "Clean & minimal" },
  { value: "bold", label: "Bold & modern" },
  { value: "corporate", label: "Professional & corporate" },
  { value: "friendly", label: "Warm & friendly" },
  { value: "not_sure", label: "Not sure - open to suggestions" },
];

export const FEATURE_OPTIONS: Option[] = [
  { value: "ecommerce", label: "Online store (sell products)" },
  { value: "booking", label: "Online booking or scheduling" },
  { value: "membership", label: "Member login or private area" },
  { value: "newsletter", label: "Email newsletter signup" },
  { value: "blog", label: "Blog" },
  { value: "integrations", label: "Connect with other tools you use (CRM, email marketing, payments, etc.)" },
  { value: "none", label: "None of these / not sure yet" },
];

export const LAUNCH_TIMELINE_OPTIONS: Option[] = [
  { value: "asap", label: "As soon as possible" },
  { value: "one_two_months", label: "Within 1-2 months" },
  { value: "three_six_months", label: "In the next 3-6 months" },
  { value: "exploring", label: "Just exploring for now" },
];

export const BUDGET_OPTIONS: Option[] = [
  { value: "under_1000", label: "Under $1,000" },
  { value: "1000_3000", label: "$1,000 - $3,000" },
  { value: "3000_7000", label: "$3,000 - $7,000" },
  { value: "7000_plus", label: "$7,000+" },
  { value: "not_sure", label: "Not sure yet" },
];

export const HOSTING_INTEREST_OPTIONS: Option[] = [
  { value: "yes", label: "Yes, I'd like that handled for me" },
  { value: "no", label: "No, I have my own hosting set up" },
  { value: "not_sure", label: "Not sure - tell me more" },
];

export type IntakeData = {
  contact: {
    name: string;
    email: string;
    phone: string;
    businessName: string;
    businessDescription: string;
  };
  goals: {
    motivation: string;
    mainGoals: string[];
  };
  scope: {
    sizeNeeded: string;
  };
  content: {
    hasExistingWebsite: string;
    existingWebsiteUrl: string;
    pagesNeeded: string[];
    contentReadiness: string;
  };
  design: {
    hasBrand: string;
    styleExamples: string;
    stylePreference: string;
  };
  features: string[];
  timeline: {
    launchTimeline: string;
    budgetRange: string;
  };
  hosting: {
    interest: string;
    additionalNotes: string;
  };
};

export const initialIntakeData: IntakeData = {
  contact: { name: "", email: "", phone: "", businessName: "", businessDescription: "" },
  goals: { motivation: "", mainGoals: [] },
  scope: { sizeNeeded: "" },
  content: { hasExistingWebsite: "", existingWebsiteUrl: "", pagesNeeded: [], contentReadiness: "" },
  design: { hasBrand: "", styleExamples: "", stylePreference: "" },
  features: [],
  timeline: { launchTimeline: "", budgetRange: "" },
  hosting: { interest: "", additionalNotes: "" },
};

export function labelFor(options: Option[], value: string): string {
  return options.find((option) => option.value === value)?.label || value;
}

function labelsFor(options: Option[], values: string[]): string {
  if (values.length === 0) return "(none selected)";
  return values.map((value) => labelFor(options, value)).join(", ");
}

/** Same as labelsFor, but always renders in the option list's order regardless of selection order - keeps diffs stable when only the order changes. */
function canonicalLabelsFor(options: Option[], values: string[]): string {
  const selected = options.filter((option) => values.includes(option.value)).map((option) => option.label);
  return selected.length > 0 ? selected.join(", ") : "(none selected)";
}

/** Parses the leads.intake_data column, which mysql2 returns as a JSON string on this MariaDB host rather than a parsed object. */
export function parseIntakeData(raw: unknown): IntakeData | null {
  if (!raw) return null;
  return typeof raw === "string" ? (JSON.parse(raw) as IntakeData) : (raw as IntakeData);
}

export type ContactFields = {
  name: string;
  email: string;
  phone: string;
  businessName: string;
};

export type FieldChange = { label: string; oldValue: string; newValue: string };

/** Diffs the editable lead contact + questionnaire fields, returning one entry per field that actually changed, with human-readable old/new values. */
export function diffLeadDetails(
  oldContact: ContactFields,
  oldIntake: IntakeData,
  newContact: ContactFields,
  newIntake: IntakeData,
): FieldChange[] {
  const changes: FieldChange[] = [];

  const text = (label: string, oldVal: string, newVal: string) => {
    if ((oldVal || "") === (newVal || "")) return;
    changes.push({ label, oldValue: oldVal || "(blank)", newValue: newVal || "(blank)" });
  };
  const select = (label: string, options: Option[], oldVal: string, newVal: string) => {
    if (oldVal === newVal) return;
    changes.push({
      label,
      oldValue: labelFor(options, oldVal) || "(not answered)",
      newValue: labelFor(options, newVal) || "(not answered)",
    });
  };
  const multi = (label: string, options: Option[], oldVal: string[], newVal: string[]) => {
    const oldLabel = canonicalLabelsFor(options, oldVal);
    const newLabel = canonicalLabelsFor(options, newVal);
    if (oldLabel === newLabel) return;
    changes.push({ label, oldValue: oldLabel, newValue: newLabel });
  };

  text("Name", oldContact.name, newContact.name);
  text("Email", oldContact.email, newContact.email);
  text("Phone", oldContact.phone, newContact.phone);
  text("Business name", oldContact.businessName, newContact.businessName);
  text("What they do", oldIntake.contact.businessDescription, newIntake.contact.businessDescription);

  select("Why now", MOTIVATION_OPTIONS, oldIntake.goals.motivation, newIntake.goals.motivation);
  multi("Main goals", MAIN_GOAL_OPTIONS, oldIntake.goals.mainGoals, newIntake.goals.mainGoals);
  select("Site size needed", SCOPE_OPTIONS, oldIntake.scope.sizeNeeded, newIntake.scope.sizeNeeded);
  select("Existing website", HAS_WEBSITE_OPTIONS, oldIntake.content.hasExistingWebsite, newIntake.content.hasExistingWebsite);
  text("Existing website URL", oldIntake.content.existingWebsiteUrl, newIntake.content.existingWebsiteUrl);
  multi("Pages needed", PAGE_OPTIONS, oldIntake.content.pagesNeeded, newIntake.content.pagesNeeded);
  select("Content readiness", CONTENT_READINESS_OPTIONS, oldIntake.content.contentReadiness, newIntake.content.contentReadiness);
  select("Existing brand", BRAND_OPTIONS, oldIntake.design.hasBrand, newIntake.design.hasBrand);
  text("Style examples", oldIntake.design.styleExamples, newIntake.design.styleExamples);
  select("Style preference", STYLE_OPTIONS, oldIntake.design.stylePreference, newIntake.design.stylePreference);
  multi("Special features", FEATURE_OPTIONS, oldIntake.features, newIntake.features);
  select("Launch timeline", LAUNCH_TIMELINE_OPTIONS, oldIntake.timeline.launchTimeline, newIntake.timeline.launchTimeline);
  select("Budget range", BUDGET_OPTIONS, oldIntake.timeline.budgetRange, newIntake.timeline.budgetRange);
  select("Hosting interest", HOSTING_INTEREST_OPTIONS, oldIntake.hosting.interest, newIntake.hosting.interest);
  text("Hosting notes", oldIntake.hosting.additionalNotes, newIntake.hosting.additionalNotes);

  return changes;
}

/** Builds a plain-text summary of the questionnaire responses (goals through hosting), excluding contact info. */
export function formatIntakeSummary(data: IntakeData): string {
  const lines: string[] = [];

  lines.push("Goals");
  lines.push(`  Why now: ${labelFor(MOTIVATION_OPTIONS, data.goals.motivation) || "(not answered)"}`);
  lines.push(`  Main goals: ${labelsFor(MAIN_GOAL_OPTIONS, data.goals.mainGoals)}`);
  lines.push("");

  lines.push("What they think they need");
  lines.push(`  ${labelFor(SCOPE_OPTIONS, data.scope.sizeNeeded) || "(not answered)"}`);
  lines.push("");

  lines.push("Pages & content");
  lines.push(`  Existing website: ${labelFor(HAS_WEBSITE_OPTIONS, data.content.hasExistingWebsite) || "(not answered)"}`);
  if (data.content.existingWebsiteUrl) lines.push(`  URL: ${data.content.existingWebsiteUrl}`);
  lines.push(`  Pages needed: ${labelsFor(PAGE_OPTIONS, data.content.pagesNeeded)}`);
  lines.push(`  Content readiness: ${labelFor(CONTENT_READINESS_OPTIONS, data.content.contentReadiness) || "(not answered)"}`);
  lines.push("");

  lines.push("Design preferences");
  lines.push(`  Existing brand: ${labelFor(BRAND_OPTIONS, data.design.hasBrand) || "(not answered)"}`);
  if (data.design.styleExamples) lines.push(`  Style examples: ${data.design.styleExamples}`);
  lines.push(`  Style preference: ${labelFor(STYLE_OPTIONS, data.design.stylePreference) || "(not answered)"}`);
  lines.push("");

  lines.push("Special features");
  lines.push(`  ${labelsFor(FEATURE_OPTIONS, data.features)}`);
  lines.push("");

  lines.push("Timeline & budget");
  lines.push(`  Launch timeline: ${labelFor(LAUNCH_TIMELINE_OPTIONS, data.timeline.launchTimeline) || "(not answered)"}`);
  lines.push(`  Budget range: ${labelFor(BUDGET_OPTIONS, data.timeline.budgetRange) || "(not answered)"}`);
  lines.push("");

  lines.push("Hosting & final notes");
  lines.push(`  Hosting interest: ${labelFor(HOSTING_INTEREST_OPTIONS, data.hosting.interest) || "(not answered)"}`);
  if (data.hosting.additionalNotes) lines.push(`  Additional notes: ${data.hosting.additionalNotes}`);

  return lines.join("\n");
}

/** Builds a plain-text summary of a questionnaire submission for the new-lead notification email. */
export function formatIntakeEmail(data: IntakeData): string {
  const lines: string[] = [];

  lines.push(`New project inquiry from ${data.contact.name}`);
  if (data.contact.businessName) lines.push(`Business: ${data.contact.businessName}`);
  lines.push("");

  lines.push("Contact");
  lines.push(`  Email: ${data.contact.email}`);
  if (data.contact.phone) lines.push(`  Phone: ${data.contact.phone}`);
  if (data.contact.businessDescription) lines.push(`  What they do: ${data.contact.businessDescription}`);
  lines.push("");

  lines.push(formatIntakeSummary(data));

  return lines.join("\n");
}
