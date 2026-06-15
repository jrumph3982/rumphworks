import { labelFor, PAGE_OPTIONS, type IntakeData } from "./intake";
import type { ProjectStatus } from "./crm";

export type WorkflowTask = {
  label: string;
  stage: ProjectStatus;
};

const FEATURE_TASKS: Partial<Record<string, string>> = {
  ecommerce: "Set up online store (products, checkout, payments)",
  booking: "Set up booking / scheduling system",
  membership: "Set up member login area",
  blog: "Set up blog publishing system",
  newsletter: "Set up newsletter signup integration",
  integrations: "Set up third-party integrations (CRM, email marketing, payments, etc.)",
};

/** Builds a starting project checklist from the lead's questionnaire answers - e.g. skips "register domain" if they already have a website. Intended as an editable starting point, not a fixed plan. */
export function generateProjectTasks(intake: IntakeData | null): WorkflowTask[] {
  const tasks: WorkflowTask[] = [];

  // Discovery
  tasks.push({ label: "Kickoff call to confirm scope and goals", stage: "discovery" });
  if (!intake || intake.design.hasBrand !== "yes") {
    tasks.push({ label: "Collect brand assets (logo, colors, fonts)", stage: "discovery" });
  }
  tasks.push({ label: "Define sitemap and page list", stage: "discovery" });
  if (!intake || intake.content.contentReadiness !== "ready") {
    tasks.push({ label: "Collect page content (copy, images)", stage: "discovery" });
  }

  // Design
  if (!intake || intake.design.hasBrand === "no") {
    tasks.push({ label: "Create brand style guide", stage: "design" });
  }
  tasks.push({ label: "Design homepage mockup", stage: "design" });
  const pages = intake?.content.pagesNeeded?.length ? intake.content.pagesNeeded : ["home"];
  if (pages.some((page) => page !== "home")) {
    tasks.push({ label: "Design additional page templates", stage: "design" });
  }
  tasks.push({ label: "Client review and approval of designs", stage: "design" });

  // Build
  if (!intake || intake.content.hasExistingWebsite !== "yes") {
    tasks.push({ label: "Register domain name", stage: "build" });
  }
  for (const page of pages) {
    tasks.push({ label: `Build ${labelFor(PAGE_OPTIONS, page)} page`, stage: "build" });
  }
  if (pages.includes("contact")) {
    tasks.push({ label: "Set up contact form", stage: "build" });
  }
  for (const feature of intake?.features ?? []) {
    const label = FEATURE_TASKS[feature];
    if (label) tasks.push({ label, stage: "build" });
  }
  if (!intake || intake.content.contentReadiness !== "ready") {
    tasks.push({ label: "Write and finalize page content", stage: "build" });
  }
  tasks.push({ label: "On-page SEO optimization (titles, meta descriptions, alt text)", stage: "build" });

  // Launch
  if (!intake || intake.hosting.interest !== "no") {
    tasks.push({ label: "Set up hosting", stage: "launch" });
  }
  if (!intake || intake.content.hasExistingWebsite !== "yes") {
    tasks.push({ label: "Connect domain to hosting", stage: "launch" });
  }
  tasks.push({ label: "Final QA - cross-browser and mobile testing", stage: "launch" });
  tasks.push({ label: "Set up analytics", stage: "launch" });
  tasks.push({ label: "Go live", stage: "launch" });

  // Support
  tasks.push({ label: "Client training / handoff walkthrough", stage: "support" });
  tasks.push({ label: "30-day post-launch check-in", stage: "support" });

  return tasks;
}
