import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import { createJob } from '../../api/jobs'
import { keys } from '../../hooks/queries'
import { useAuth } from '../../context/AuthContext'
import Input from '../ui/Input'
import Select from '../ui/Select'
import TextArea from '../ui/TextArea'
import Button from '../ui/Button'
import Badge from '../ui/Badge'

const today = new Date()
today.setHours(0, 0, 0, 0)

const schema = z.object({
  jobTitle: z.string().min(3, 'Job title must be at least 3 characters').max(100, 'Job title cannot exceed 100 characters'),
  department: z.enum([
    'Engineering', 'Product', 'Design', 'Sales', 'Marketing', 'Finance',
    'Human Resources', 'Operations', 'Customer Support', 'IT/Administration'
  ], { required_error: 'Please select a department' }),
  numberOfPositions: z.number().int('Must be a whole number').min(1, 'At least 1 position').max(50, 'Maximum 50 positions'),
  requiredSkills: z.string().min(10, 'Please describe required skills (min 10 characters)'),
  description: z.string().max(5000, 'Keep the description under 5000 characters').optional(),
  closingDate: z.string().refine((dateStr) => {
    const date = new Date(dateStr)
    return date > today
  }, 'Closing date must be after today'),
})

export default function VacancyForm({ onSuccess }) {
  const [submitted, setSubmitted] = useState(false)
  const [submittedData, setSubmittedData] = useState(null)
  const [serverError, setServerError] = useState(null)
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: createJob,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.jobs }),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      jobTitle: '',
      department: '',
      numberOfPositions: 1,
      requiredSkills: '',
      description: '',
      closingDate: '',
    },
  })

  const onSubmit = async (data) => {
    setServerError(null)
    try {
      await mutation.mutateAsync({
        title: data.jobTitle,
        department: data.department,
        numPositions: data.numberOfPositions,
        requiredSkills: data.requiredSkills,
        description: data.description?.trim() || undefined,
        closingDate: data.closingDate,
      })
    } catch (err) {
      setServerError(err.message)
      return
    }
    setSubmittedData(data)
    setSubmitted(true)
    onSuccess && onSuccess(data)
  }

  if (submitted && submittedData) {
    return (
      <div className="text-center py-8">
        <CheckCircle2 size={48} className="mx-auto text-ers-accent mb-4" />
        <h2 className="text-xl font-bold text-ers-ink mb-2">Vacancy published</h2>
        <div className="space-y-2 text-left max-w-sm mx-auto">
          <p className="text-sm"><span className="font-semibold">Title:</span> {submittedData.jobTitle}</p>
          <p className="text-sm"><span className="font-semibold">Department:</span> {submittedData.department}</p>
          <p className="text-sm"><span className="font-semibold">Positions:</span> {submittedData.numberOfPositions}</p>
          <p className="text-sm"><span className="font-semibold">Closing Date:</span> {submittedData.closingDate}</p>
        </div>
        <Button onClick={() => setSubmitted(false)} className="mt-6">
          Create another vacancy
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid items-start gap-x-8 gap-y-6 lg:grid-cols-2" noValidate>
      <div className="flex items-center gap-2 lg:col-span-2">
        <Badge variant="default">ID: Auto-generated</Badge>
        <Badge variant="default">Created by: {user?.name}</Badge>
      </div>

      <Input
        label="Job Title"
        placeholder="e.g. Senior Frontend Developer"
        required
        error={errors.jobTitle?.message}
        {...register('jobTitle')}
      />

      <Select
        label="Department"
        required
        error={errors.department?.message}
        {...register('department')}
      >
        <option value="" disabled>Select department</option>
        <option value="Engineering">Engineering</option>
        <option value="Product">Product</option>
        <option value="Design">Design</option>
        <option value="Sales">Sales</option>
        <option value="Marketing">Marketing</option>
        <option value="Finance">Finance</option>
        <option value="Human Resources">Human Resources</option>
        <option value="Operations">Operations</option>
        <option value="Customer Support">Customer Support</option>
        <option value="IT/Administration">IT/Administration</option>
      </Select>

      <Input
          label="Number of Positions"
          type="number"
          min="1"
          max="50"
          required
          error={errors.numberOfPositions?.message}
          {...register('numberOfPositions', { valueAsNumber: true })}
        />
      <Input
          label="Closing Date"
          type="date"
          required
          error={errors.closingDate?.message}
          {...register('closingDate')}
        />

      <TextArea
        label="Required Skills"
        rows={4}
        placeholder="List the essential skills, separated by commas"
        required
        hint="Separate skills with commas"
        error={errors.requiredSkills?.message}
        {...register('requiredSkills')}
      />

      <TextArea
        label="Description"
        rows={4}
        placeholder="What the role involves, shown to candidates on the careers page"
        hint="Optional"
        error={errors.description?.message}
        {...register('description')}
      />

      {serverError && (
        <div className="flex items-center gap-2 bg-ers-danger/10 text-ers-danger text-sm px-4 py-3 rounded-lg lg:col-span-2" role="alert">
          <AlertCircle size={16} />
          <span>{serverError}</span>
        </div>
      )}

      <div className="lg:col-span-2">
        <Button type="submit" isLoading={mutation.isPending} className="w-full sm:w-auto">
          Publish vacancy
        </Button>
      </div>
    </form>
  )
}