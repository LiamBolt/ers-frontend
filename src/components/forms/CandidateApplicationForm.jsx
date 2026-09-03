import { useState, useEffect } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Trash2, CheckCircle2 } from 'lucide-react'
import Input from '../ui/Input'
import TextArea from '../ui/TextArea'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import FileUpload from '../ui/FileUpload'

const currentYear = new Date().getFullYear()

// Helper for phone validation
const phoneRegex = /^[+]?[\d\s-]{7,15}$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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

const schema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(80, 'Full name cannot exceed 80 characters').regex(/^[a-zA-Z\s-]+$/, 'Only letters, spaces, and hyphens allowed'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  phone: z.string().min(1, 'Phone number is required').regex(phoneRegex, 'Enter a valid phone number'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  qualifications: z.array(qualificationSchema).min(1, 'Add at least one qualification'),
  experience: z.array(experienceSchema).optional(),
  references: z.array(referenceSchema).min(1, 'Add at least one reference'),
  cv: z.instanceof(File).refine(
    (file) => ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type),
    'Please upload a PDF, DOC, or DOCX file.'
  ).refine(
    (file) => file.size <= 5 * 1024 * 1024,
    'File is too large — maximum size is 5MB.'
  ),
})

export default function CandidateApplicationForm({ onSuccess }) {
  const [submitted, setSubmitted] = useState(false)
  const [submittedData, setSubmittedData] = useState(null)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      qualifications: [{ qualification: '', institution: '', yearCompleted: currentYear }],
      experience: [],
      references: [{ refereeName: '', organisation: '', contact: '' }],
      cv: null,
    },
  })

  const qualificationsArray = useFieldArray({ control, name: 'qualifications' })
  const experienceArray = useFieldArray({ control, name: 'experience' })
  const referencesArray = useFieldArray({ control, name: 'references' })

  // Handle scroll/focus on first error
  const onError = (errors) => {
    const firstErrorKey = Object.keys(errors)[0]
    if (firstErrorKey) {
      const element = document.querySelector(`[name="${firstErrorKey}"]`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        element.focus({ preventScroll: true })
      }
    }
  }

  const onSubmit = (data) => {
    console.log('Application submitted:', data)
    setSubmittedData(data)
    setSubmitted(true)
    onSuccess && onSuccess(data)
  }

  if (submitted && submittedData) {
    return (
      <div className="text-center py-8">
        <CheckCircle2 size={48} className="mx-auto text-ers-accent mb-4" />
        <h2 className="text-xl font-bold text-ers-ink mb-2">Application submitted</h2>
        <p className="text-ers-ink-soft mb-4">Your application now has status: <Badge variant="warning">SUBMITTED</Badge></p>
        <div className="text-sm text-left max-w-md mx-auto space-y-1">
          <p><span className="font-semibold">Name:</span> {submittedData.fullName}</p>
          <p><span className="font-semibold">Email:</span> {submittedData.email}</p>
          <p><span className="font-semibold">Qualifications:</span> {submittedData.qualifications.length}</p>
          <p><span className="font-semibold">References:</span> {submittedData.references.length}</p>
          <p><span className="font-semibold">CV:</span> {submittedData.cv.name}</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-8" noValidate>
      {/* Personal Information */}
      <section>
        <h2 className="text-h2 text-ers-ink mb-4">Personal Information</h2>
        <div className="space-y-4">
          <Input
            label="Full Name"
            placeholder="John Doe"
            required
            error={errors.fullName?.message}
            {...register('fullName')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              required
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Phone Number"
              type="tel"
              placeholder="+256 700 123456"
              required
              error={errors.phone?.message}
              {...register('phone')}
            />
          </div>
          <TextArea
            label="Address"
            rows={3}
            placeholder="Street, City, Postal Code"
            required
            error={errors.address?.message}
            {...register('address')}
          />
        </div>
      </section>

      {/* Qualifications */}
      <section>
        <h2 className="text-h2 text-ers-ink mb-4">Qualifications</h2>
        {qualificationsArray.fields.map((field, index) => (
          <div key={field.id} className="relative p-4 border border-ers-line rounded-xl mb-3 bg-white/50">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Qualification"
                placeholder="e.g. BSc Computer Science"
                required
                error={errors.qualifications?.[index]?.qualification?.message}
                {...register(`qualifications.${index}.qualification`)}
              />
              <Input
                label="Institution"
                placeholder="University name"
                required
                error={errors.qualifications?.[index]?.institution?.message}
                {...register(`qualifications.${index}.institution`)}
              />
              <Input
                label="Year Completed"
                type="number"
                min="1970"
                max={currentYear}
                required
                error={errors.qualifications?.[index]?.yearCompleted?.message}
                {...register(`qualifications.${index}.yearCompleted`, { valueAsNumber: true })}
              />
            </div>
            {index > 0 && (
              <button
                type="button"
                onClick={() => qualificationsArray.remove(index)}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-ers-ink/5 text-ers-ink-soft"
                aria-label="Remove qualification"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => qualificationsArray.append({ qualification: '', institution: '', yearCompleted: currentYear })}
          className="inline-flex items-center gap-1 text-sm text-ers-primary hover:underline"
        >
          <Plus size={16} /> Add another qualification
        </button>
        {errors.qualifications?.root && (
          <p className="text-xs text-ers-danger mt-2">{errors.qualifications.root.message}</p>
        )}
      </section>

      {/* Experience */}
      <section>
        <h2 className="text-h2 text-ers-ink mb-4">Experience</h2>
        {experienceArray.fields.length === 0 && (
          <p className="text-sm text-ers-ink-soft mb-2">No experience added — this is optional</p>
        )}
        {experienceArray.fields.map((field, index) => (
          <div key={field.id} className="relative p-4 border border-ers-line rounded-xl mb-3 bg-white/50">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Years of Experience"
                type="number"
                min="0"
                required
                error={errors.experience?.[index]?.yearsOfExperience?.message}
                {...register(`experience.${index}.yearsOfExperience`, { valueAsNumber: true })}
              />
              <Input
                label="Previous Employer"
                placeholder="Company name"
                required
                error={errors.experience?.[index]?.previousEmployer?.message}
                {...register(`experience.${index}.previousEmployer`)}
              />
              <Input
                label="Position Held"
                placeholder="Job title"
                required
                error={errors.experience?.[index]?.positionHeld?.message}
                {...register(`experience.${index}.positionHeld`)}
              />
            </div>
            <div className="mt-3">
              <TextArea
                label="Description"
                rows={3}
                placeholder="Brief description of responsibilities"
                hint={`${field.description?.length || 0}/500`}
                error={errors.experience?.[index]?.description?.message}
                {...register(`experience.${index}.description`)}
              />
            </div>
            <button
              type="button"
              onClick={() => experienceArray.remove(index)}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-ers-ink/5 text-ers-ink-soft"
              aria-label="Remove experience"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => experienceArray.append({ yearsOfExperience: 0, previousEmployer: '', positionHeld: '', description: '' })}
          className="inline-flex items-center gap-1 text-sm text-ers-primary hover:underline"
        >
          <Plus size={16} /> Add another role
        </button>
      </section>

      {/* References */}
      <section>
        <h2 className="text-h2 text-ers-ink mb-4">References</h2>
        {referencesArray.fields.map((field, index) => (
          <div key={field.id} className="relative p-4 border border-ers-line rounded-xl mb-3 bg-white/50">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Referee Name"
                placeholder="Full name"
                required
                error={errors.references?.[index]?.refereeName?.message}
                {...register(`references.${index}.refereeName`)}
              />
              <Input
                label="Organisation"
                placeholder="Company / Institution"
                required
                error={errors.references?.[index]?.organisation?.message}
                {...register(`references.${index}.organisation`)}
              />
              <Input
                label="Phone or Email"
                placeholder="+256... or email"
                required
                error={errors.references?.[index]?.contact?.message}
                {...register(`references.${index}.contact`)}
              />
            </div>
            {index > 0 && (
              <button
                type="button"
                onClick={() => referencesArray.remove(index)}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-ers-ink/5 text-ers-ink-soft"
                aria-label="Remove reference"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => referencesArray.append({ refereeName: '', organisation: '', contact: '' })}
          className="inline-flex items-center gap-1 text-sm text-ers-primary hover:underline"
        >
          <Plus size={16} /> Add another reference
        </button>
        {errors.references?.root && (
          <p className="text-xs text-ers-danger mt-2">{errors.references.root.message}</p>
        )}
      </section>

      {/* CV Upload */}
      <section>
        <h2 className="text-h2 text-ers-ink mb-4">CV Upload</h2>
        <Controller
          name="cv"
          control={control}
          render={({ field }) => (
            <FileUpload
              label="Curriculum Vitae"
              required
              value={field.value}
              onChange={(file) => {
                field.onChange(file)
                if (file) clearErrors('cv')
              }}
              error={errors.cv?.message}
            />
          )}
        />
      </section>

      <Button type="submit" className="w-full sm:w-auto">
        Submit application
      </Button>
    </form>
  )
}