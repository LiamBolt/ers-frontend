import { z } from "zod";
import { registerSchema } from "../accounts/account.schema";

export const createUserSchema = registerSchema.extend({
  role: z.enum(["CANDIDATE", "HR_OFFICER", "INTERVIEWER", "MANAGER", "ADMIN"]),
});
export const updateUserSchema = z
  .object({
    role: z.enum(["CANDIDATE", "HR_OFFICER", "INTERVIEWER", "MANAGER", "ADMIN"]).optional(),
    status: z.enum(["ACTIVE", "DEACTIVATED"]).optional(),
  })
  .refine((v) => v.role || v.status, "Provide a role or status");
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
