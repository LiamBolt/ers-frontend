import { z } from "zod";

const year = new Date().getFullYear();
const phone = /^[+]?[\d\s-]{7,15}$/;

const qualification = z.object({
  qualification: z.string().min(1),
  institution: z.string().min(1),
  yearCompleted: z.coerce.number().int().min(1970).max(year),
});
const experience = z.object({
  yearsOfExperience: z.coerce.number().int().min(0),
  previousEmployer: z.string().min(1),
  positionHeld: z.string().min(1),
  description: z.string().max(500).optional(),
});
const reference = z.object({
  refereeName: z.string().min(1),
  organisation: z.string().min(1),
  contact: z.string().min(1),
});

// multipart fields arrive as strings; the three list fields are JSON strings.
const jsonList = <T extends z.ZodTypeAny>(item: T, min: number) =>
  z.preprocess((v) => {
    if (typeof v !== "string") return v;
    try {
      return JSON.parse(v);
    } catch {
      return undefined;
    }
  }, z.array(item).min(min));

// FR-03: personal details, qualifications, experience, references (+ CV file).
export const submitApplicationSchema = z.object({
  jobId: z.string().uuid(),
  fullName: z.string().trim().min(2).max(80),
  phone: z.string().regex(phone, "Enter a valid phone number"),
  address: z.string().trim().min(10, "Address must be at least 10 characters"),
  qualifications: jsonList(qualification, 1),
  experience: jsonList(experience, 0).default([]),
  references: jsonList(reference, 1),
});
export type SubmitApplicationInput = z.infer<typeof submitApplicationSchema>;
