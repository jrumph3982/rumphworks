import type { IntakeData } from "./intake";
import type { EstimateTier } from "./crm";

export type SuggestedItem = {
  label: string;
  price: number;
  quantity: number;
};

const BASE_PACKAGES: Record<EstimateTier, SuggestedItem> = {
  landing_page: { label: "Landing page - base package", price: 1000, quantity: 1 },
  business_website: { label: "Business website - base package (up to 5 pages)", price: 3000, quantity: 1 },
  dynamic_website: { label: "Custom website - starting estimate (needs scoping)", price: 5000, quantity: 1 },
};

/** Pages included in the base package before "extra page" charges kick in. Dynamic sites are scoped individually, so no extra-page charge applies. */
const BASE_PAGE_COUNT: Record<EstimateTier, number | null> = {
  landing_page: 1,
  business_website: 5,
  dynamic_website: null,
};

const EXTRA_PAGE_PRICE = 200;
const CONTENT_HELP_PRICE_PER_PAGE = 150;

const FEATURE_ITEMS: Partial<Record<string, SuggestedItem>> = {
  ecommerce: { label: "E-commerce setup", price: 2500, quantity: 1 },
  booking: { label: "Booking / scheduling integration", price: 1000, quantity: 1 },
  membership: { label: "Member login area", price: 2000, quantity: 1 },
  blog: { label: "Blog setup", price: 400, quantity: 1 },
  newsletter: { label: "Newsletter signup integration", price: 200, quantity: 1 },
  integrations: { label: "Custom tool integration", price: 500, quantity: 1 },
};

/** Suggests a starting tier from the lead's questionnaire answers. Always returns a valid tier so the create-estimate form has a sensible default. */
export function suggestTierFromIntake(intake: IntakeData | null): EstimateTier {
  switch (intake?.scope.sizeNeeded) {
    case "simple":
      return "landing_page";
    case "advanced":
      return "dynamic_website";
    default:
      return "business_website";
  }
}

/** Builds a starting set of line items from the chosen tier and the lead's questionnaire answers. Intended as an editable draft, not a final quote. */
export function generateEstimateItems(intake: IntakeData | null, tier: EstimateTier): SuggestedItem[] {
  const items: SuggestedItem[] = [BASE_PACKAGES[tier]];
  if (!intake) return items;

  const baseCount = BASE_PAGE_COUNT[tier];
  if (baseCount !== null) {
    const extraPages = Math.max(0, intake.content.pagesNeeded.length - baseCount);
    if (extraPages > 0) {
      items.push({ label: "Extra page", price: EXTRA_PAGE_PRICE, quantity: extraPages });
    }
  }

  for (const feature of intake.features) {
    const item = FEATURE_ITEMS[feature];
    if (item) items.push(item);
  }

  if (intake.content.contentReadiness === "some" || intake.content.contentReadiness === "none") {
    const pageCount = intake.content.pagesNeeded.length || baseCount || 1;
    items.push({
      label: "Content / copywriting assistance",
      price: CONTENT_HELP_PRICE_PER_PAGE,
      quantity: pageCount,
    });
  }

  if (intake.design.hasBrand === "some" || intake.design.hasBrand === "no") {
    items.push({ label: "Logo / branding assistance", price: 600, quantity: 1 });
  }

  if (intake.hosting.interest === "yes") {
    items.push({ label: "Hosting setup", price: 200, quantity: 1 });
  }

  return items;
}
