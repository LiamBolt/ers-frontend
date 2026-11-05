import { z } from 'zod'
import { DEPARTMENTS } from '@/shared/constants/departments'

// Mirrors the server rules in backend/src/modules/jobs/job.schema.ts.
export const vacancySchema = z.object({
  jobTitle: z.string().min(3, 'Job title must be at least 3 characters').max(100, 'Job title cannot exceed 100 characters'),
  department: z.enum(DEPARTMENTS, { required_error: 'Please select a department' }),
  numberOfPositions: z.number().int('Must be a whole number').min(1, 'At least 1 position').max(50, 'Maximum 50 positions'),
  requiredSkills: z.string().min(10, 'Please describe required skills (min 10 characters)'),
  description: z.string().max(5000, 'Keep the description under 5000 characters').optional(),
  closingDate: z.string().refine((dateStr) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return new Date(dateStr) > today
  }, 'Closing date must be after today'),
})
