import { z } from "zod";

export const DEPARTMENTS = [
  "Engineering", "Product", "Design", "Sales", "Marketing", "Finance",
  "Human Resources", "Operations", "Customer Support", "IT/Administration",
] as const;

// FR-02: a vacancy cannot publish without title, department and closing date.
export const createJobSchema = z.object({
  title: z.string().trim().min(3, "Job title must be at least 3 characters").max(100),
  department: z.enum(DEPARTMENTS),
  numPositions: z.number().int().min(1).max(50),
  requiredSkills: z.string().trim().min(10, "Describe the required skills (min 10 characters)"),
  description: z.string().trim().max(5000).optional(),
  closingDate: z.coerce.date().refine((d) => d > new Date(), "Closing date must be in the future"),
});
export const updateJobSchema = z.object({ status: z.enum(["PUBLISHED", "CLOSED"]) });
export type CreateJobInput = z.infer<typeof createJobSchema>;
