import { z } from 'zod'

export const currentYear = new Date().getFullYear()

const phoneRegex = /^[+]?[\d\s-]{7,15}$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const CV_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]
const CV_MAX_BYTES = 5 * 1024 * 1024

const qualificationSchema = z.object({
  qualification: z.string().min(1, 'Qualification is required'),
  institution: z.string().min(1, 'Institution is required'),
  yearCompleted: z.number().int('Year must be a number').min(1970, 'Year must be 1970 or later').max(currentYear, `Year cannot be after ${currentYear}`),
})

const experienceSchema = z.object({
  yearsOfExperience: z.number().int('Years must be a whole number').min(0, 'Cannot be negative'),
  previousEmployer: z.string().min(1, 'Employer is required'),
  positionHeld: z.string().min(1, 'Position is required'),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
})

const referenceSchema = z.object({
  refereeName: z.string().min(1, 'Referee name is required'),
  organisation: z.string().min(1, 'Organisation is required'),
  contact: z.string().min(1, 'Phone or email is required').refine(
    (val) => phoneRegex.test(val) || emailRegex.test(val),
    'Enter a valid phone number or email'
  ),
})

// Mirrors the server rules in backend/src/modules/recruitment/applications/application.schema.ts.
export const applicationSchema = z.object({
  jobId: z.string().min(1, 'Choose the vacancy you are applying for'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(80, 'Full name cannot exceed 80 characters').regex(/^[a-zA-Z\s-]+$/, 'Only letters, spaces, and hyphens allowed'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  phone: z.string().min(1, 'Phone number is required').regex(phoneRegex, 'Enter a valid phone number'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  qualifications: z.array(qualificationSchema).min(1, 'Add at least one qualification'),
  experience: z.array(experienceSchema).optional(),
  references: z.array(referenceSchema).min(1, 'Add at least one reference'),
  cv: z.instanceof(File)
    .refine((file) => CV_TYPES.includes(file.type), 'Please upload a PDF, DOC, or DOCX file.')
    .refine((file) => file.size <= CV_MAX_BYTES, 'File is too large — maximum size is 5MB.'),
})
