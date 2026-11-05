import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Full name must be at least 2 characters").max(80),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  phone: z.string().trim().min(7).max(20).optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Za-z]/, "Password needs a letter")
    .regex(/\d/, "Password needs a number"),
});
export type RegisterInput = z.infer<typeof registerSchema>;
