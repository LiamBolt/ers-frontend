import { z } from "zod";

// FR-12: reports filter by date range, department and vacancy.
export const reportQuerySchema = z.object({
  from: z.string().date().optional(),
  to: z.string().date().optional(),
  department: z.string().optional(),
  jobId: z.string().uuid().optional(),
});
export type ReportQuery = z.infer<typeof reportQuerySchema>;
