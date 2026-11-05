import { AlertCircle } from 'lucide-react'
import Input from '@/shared/ui/Input'
import Select from '@/shared/ui/Select'
import TextArea from '@/shared/ui/TextArea'
import Button from '@/shared/ui/Button'
import Badge from '@/shared/ui/Badge'
import { DEPARTMENTS } from '@/shared/constants/departments'
import { useAuth } from '@/features/auth/AuthContext'
import { useVacancyForm } from './useVacancyForm'
import VacancyPublished from './VacancyPublished'

// HR / admin: publish a vacancy (FR-02). It appears on the landing page immediately.
export default function VacancyForm({ onSuccess }) {
  const { user } = useAuth()
  const { form, serverError, submittedData, isSubmitting, submit, startAnother } = useVacancyForm({ onSuccess })
  const { register, formState: { errors } } = form

  if (submittedData) return <VacancyPublished data={submittedData} onCreateAnother={startAnother} />

  return (
    <form onSubmit={submit} className="grid items-start gap-x-8 gap-y-6 lg:grid-cols-2" noValidate>
      <div className="flex items-center gap-2 lg:col-span-2">
        <Badge variant="default">ID: Auto-generated</Badge>
        <Badge variant="default">Created by: {user?.name}</Badge>
      </div>

      <Input label="Job Title" placeholder="e.g. Senior Frontend Developer" required error={errors.jobTitle?.message} {...register('jobTitle')} />

      <Select label="Department" required error={errors.department?.message} {...register('department')}>
        <option value="" disabled>Select department</option>
        {DEPARTMENTS.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
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
      <Input label="Closing Date" type="date" required error={errors.closingDate?.message} {...register('closingDate')} />

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
        <div className="flex items-center gap-2 rounded-lg bg-ers-danger/10 px-4 py-3 text-sm text-ers-danger lg:col-span-2" role="alert">
          <AlertCircle size={16} />
          <span>{serverError}</span>
        </div>
      )}

      <div className="lg:col-span-2">
        <Button type="submit" isLoading={isSubmitting} className="w-full sm:w-auto">Publish vacancy</Button>
      </div>
    </form>
  )
}
