import { z } from "zod";

// Moves that need no extra data. Everything else has its own endpoint
// (interview, evaluation, approval, offer, onboarding).
export const transitionSchema = z.object({
  to: z.enum(["UNDER_SCREENING", "SHORTLISTED", "REJECTED", "SELECTED"]),
  note: z.string().trim().max(1000).default(""),
});
export type TransitionInput = z.infer<typeof transitionSchema>;
