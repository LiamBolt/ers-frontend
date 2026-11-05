import Select from '@/shared/ui/Select'
import FormSection from '../FormSection'

export default function VacancySection({ register, errors, jobs, jobsLoading }) {
  return (
    <FormSection title="Vacancy">
      <Select label="Vacancy" required error={errors.jobId?.message} disabled={jobsLoading} {...register('jobId')}>
        <option value="" disabled>
          {jobsLoading ? 'Loading vacancies…' : jobs.length ? 'Select a vacancy' : 'No vacancies are open right now'}
        </option>
        {jobs.map((j) => (
          <option key={j.id} value={j.id}>
            {j.title} — {j.department}
          </option>
        ))}
      </Select>
    </FormSection>
  )
}
