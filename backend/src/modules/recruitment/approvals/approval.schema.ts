import { z } from "zod";

export const approvalSchema = z
  .object({ decision: z.enum(["APPROVED", "REJECTED"]), note: z.string().trim().max(1000).default("") })
  .refine((v) => v.decision === "APPROVED" || v.note.length > 0, { message: "Give a reason for rejecting.", path: ["note"] });
export type ApprovalInput = z.infer<typeof approvalSchema>;
