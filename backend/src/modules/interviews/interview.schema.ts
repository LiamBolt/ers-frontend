import { z } from "zod";

// FR-06: date, time, location and panel members.
export const scheduleSchema = z.object({
  date: z.coerce.date().refine((d) => d > new Date(), "Pick a time in the future"),
  location: z.string().trim().min(3, "Enter a location or meeting link"),
  panel: z.array(z.string().uuid()).min(1, "Assign at least one panel member"),
});
export type ScheduleInput = z.infer<typeof scheduleSchema>;
