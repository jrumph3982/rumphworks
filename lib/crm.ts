import type { Option } from "./intake";

export type LeadStatus = "new" | "quoted" | "won" | "lost";
export type EstimateTier = "landing_page" | "business_website" | "dynamic_website" | "hourly";
export type EstimateStatus = "draft" | "sent" | "accepted" | "declined" | "expired";
export type ProjectStatus = "discovery" | "design" | "build" | "launch" | "support";

export const LEAD_STATUS_OPTIONS: Option[] = [
  { value: "new", label: "New" },
  { value: "quoted", label: "Quoted" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

export const ESTIMATE_TIER_OPTIONS: Option[] = [
  { value: "landing_page", label: "Landing Page" },
  { value: "business_website", label: "Business Website" },
  { value: "dynamic_website", label: "Dynamic / Full Website" },
  { value: "hourly", label: "Hourly / Modifications" },
];

export const ESTIMATE_STATUS_OPTIONS: Option[] = [
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "accepted", label: "Accepted" },
  { value: "declined", label: "Declined" },
  { value: "expired", label: "Expired" },
];

export const PROJECT_STATUS_OPTIONS: Option[] = [
  { value: "discovery", label: "Discovery" },
  { value: "design", label: "Design" },
  { value: "build", label: "Build" },
  { value: "launch", label: "Launch" },
  { value: "support", label: "Support" },
];
