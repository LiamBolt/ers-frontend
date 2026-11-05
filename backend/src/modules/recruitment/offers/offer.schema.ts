import { z } from "zod";

export const CONTRACT_TYPES = ["Permanent", "Fixed-term", "Probation", "Part-time"] as const;

export const offerSchema = z.object({
  salary: z.number().positive("Must be greater than 0"),
  startDate: z.coerce.date().refine((d) => d > new Date(), "Start date must be in the future"),
  contract: z.enum(CONTRACT_TYPES),
});
export const offerResponseSchema = z.object({ response: z.enum(["ACCEPTED", "DECLINED"]), note: z.string().trim().max(500).default("") });
export type OfferInput = z.infer<typeof offerSchema>;
export type OfferResponseInput = z.infer<typeof offerResponseSchema>;
