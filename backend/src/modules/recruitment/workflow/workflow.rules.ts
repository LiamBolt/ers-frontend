import { ApplicationState, UserRole } from "@prisma/client";

type Actor = UserRole | "SYSTEM";

const HR: Actor[] = ["HR_OFFICER"];
// Administrators can drive the pipeline up to the manager hand-off (they may act for HR).
const HR_OR_ADMIN: Actor[] = ["HR_OFFICER", "ADMIN"];
const STAFF_OR_PANEL: Actor[] = ["HR_OFFICER", "ADMIN", "INTERVIEWER"];

// SRS 3.3 state model + BR-03: "FROM>TO" -> roles allowed to make that move.
// This table is the single source of truth for legal transitions. Adding a new
// stage or changing who may act means editing only this file (NFR-08).
const RULES: Record<string, Actor[]> = {
  "SUBMITTED>UNDER_SCREENING": HR_OR_ADMIN,
  "SUBMITTED>SHORTLISTED": HR_OR_ADMIN,
  "SUBMITTED>REJECTED": HR_OR_ADMIN,
  "UNDER_SCREENING>SHORTLISTED": HR_OR_ADMIN,
  "UNDER_SCREENING>REJECTED": HR_OR_ADMIN,
  "SHORTLISTED>INTERVIEW_SCHEDULED": HR_OR_ADMIN,
  "SHORTLISTED>REJECTED": HR_OR_ADMIN,
  "INTERVIEW_SCHEDULED>UNDER_EVALUATION": HR_OR_ADMIN,
  "UNDER_EVALUATION>SELECTED": STAFF_OR_PANEL,
  "UNDER_EVALUATION>REJECTED": STAFF_OR_PANEL,
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
