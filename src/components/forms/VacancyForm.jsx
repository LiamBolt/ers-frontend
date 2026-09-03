import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PlusCircle, CheckCircle2 } from 'lucide-react'
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
  closingDate: z.string().refine((dateStr) => {
    const date = new Date(dateStr)
    return date > today
  }, 'Closing date must be after today'),
})

export default function VacancyForm({ onSuccess }) {
  const [submitted, setSubmitted] = useState(false)
  const [submittedData, setSubmittedData] = useState(null)

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
      closingDate: '',
    },
  })

  const onSubmit = (data) => {
    console.log('Vacancy submitted:', data)
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="flex items-center gap-2 mb-4">
        <Badge variant="default">ID: Auto-generated</Badge>
        <Badge variant="default">Created by: HR Officer</Badge>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
      </div>

      <TextArea
        label="Required Skills"
        rows={4}
        placeholder="List the essential skills, separated by commas"
        required
        hint="Separate skills with commas"
        error={errors.requiredSkills?.message}
        {...register('requiredSkills')}
      />

      <Button type="submit" className="w-full sm:w-auto">
        Publish vacancy
      </Button>
    </form>
  )
}