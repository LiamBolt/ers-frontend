// Onboarding requirements (BR-08, FR-11). The frontend mirrors these names.
export const ONBOARDING_DOCUMENTS = [
  "National ID / passport",
  "Academic certificates",
  "Signed contract",
  "Bank & tax details",
] as const;

export const ONBOARDING_CONFIRMATIONS = ["HR", "IT", "Finance", "Department"] as const;

export const CLOSED_STATES = ["COMPLETED", "REJECTED", "DECLINED"] as const;
