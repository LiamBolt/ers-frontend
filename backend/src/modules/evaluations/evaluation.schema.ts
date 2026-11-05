import { z } from "zod";

const score = z.number().int().min(0).max(100); // Appendix A.2: 0-100

export const evaluationSchema = z.object({
  technical: score,
  communication: score,
  problemSolving: score,
  teamwork: score,
  comments: z.string().trim().min(10, "Add a short justification (min 10 characters)"),
});
export type EvaluationInput = z.infer<typeof evaluationSchema>;
