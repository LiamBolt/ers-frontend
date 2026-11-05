import { ApplicationState, UserRole } from "@prisma/client";

type Actor = UserRole | "SYSTEM";

const HR: Actor[] = ["HR_OFFICER"];
const HR_OR_PANEL: Actor[] = ["HR_OFFICER", "INTERVIEWER"];

// SRS 3.3 state model + BR-03: "FROM>TO" -> roles allowed to make that move.
// This table is the single source of truth for legal transitions. Adding a new
// stage or changing who may act means editing only this file (NFR-08).
const RULES: Record<string, Actor[]> = {
  "SUBMITTED>UNDER_SCREENING": HR,
  "SUBMITTED>SHORTLISTED": HR,
  "SUBMITTED>REJECTED": HR,
  "UNDER_SCREENING>SHORTLISTED": HR,
  "UNDER_SCREENING>REJECTED": HR,
  "SHORTLISTED>INTERVIEW_SCHEDULED": HR,
  "SHORTLISTED>REJECTED": HR,
  "INTERVIEW_SCHEDULED>UNDER_EVALUATION": HR,
  "UNDER_EVALUATION>SELECTED": HR_OR_PANEL,
  "UNDER_EVALUATION>REJECTED": HR_OR_PANEL,
  "SELECTED>PENDING_APPROVAL": ["SYSTEM"],
  "PENDING_APPROVAL>REJECTED": ["MANAGER"],
  "PENDING_APPROVAL>OFFER_SENT": HR,
  "OFFER_SENT>OFFER_ACCEPTED": ["HR_OFFICER", "CANDIDATE"],
  "OFFER_SENT>DECLINED": ["HR_OFFICER", "CANDIDATE"],
  "OFFER_ACCEPTED>ONBOARDING": ["SYSTEM"],
  "ONBOARDING>COMPLETED": ["HR_OFFICER", "ADMIN"],
};

export function isLegalMove(role: Actor, from: ApplicationState, to: ApplicationState): boolean {
  return !!RULES[`${from}>${to}`]?.includes(role);
}

export function moveExists(from: ApplicationState, to: ApplicationState): boolean {
  return `${from}>${to}` in RULES;
}
