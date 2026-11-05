import { z } from "zod";
import { ONBOARDING_CONFIRMATIONS, ONBOARDING_DOCUMENTS } from "../workflow/workflow.constants";

export const documentSchema = z.object({ name: z.enum(ONBOARDING_DOCUMENTS) });
export const confirmationSchema = z.object({ key: z.enum(ONBOARDING_CONFIRMATIONS) });
export type DocumentInput = z.infer<typeof documentSchema>;
export type ConfirmationInput = z.infer<typeof confirmationSchema>;
