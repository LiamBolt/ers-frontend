import { AlertCircle } from 'lucide-react'
import Button from '@/shared/ui/Button'
import { useApplicationForm } from './useApplicationForm'
import SubmittedNotice from './SubmittedNotice'
import VacancySection from './sections/VacancySection'
import PersonalSection from './sections/PersonalSection'
import QualificationsSection from './sections/QualificationsSection'
import ExperienceSection from './sections/ExperienceSection'
import ReferencesSection from './sections/ReferencesSection'
import CvSection from './sections/CvSection'

// The candidate's application (FR-03). Two columns on wide screens.
export default function ApplicationForm({ onSuccess }) {
  const { form, jobs, jobsLoading, serverError, submittedData, isSubmitting, submit } = useApplicationForm({ onSuccess })
  const { register, control, clearErrors, formState: { errors } } = form

  if (submittedData) return <SubmittedNotice data={submittedData} />

  return (
    <form onSubmit={submit} className="grid items-start gap-x-12 gap-y-8 lg:grid-cols-2" noValidate>
      <VacancySection register={register} errors={errors} jobs={jobs} jobsLoading={jobsLoading} />
      <PersonalSection register={register} errors={errors} />
      <QualificationsSection control={control} register={register} errors={errors} />
      <ExperienceSection control={control} register={register} errors={errors} />
      <ReferencesSection control={control} register={register} errors={errors} />
      <CvSection control={control} errors={errors} clearErrors={clearErrors} />

      {serverError && (
        <div className="flex items-center gap-2 rounded-lg bg-ers-danger/10 px-4 py-3 text-sm text-ers-danger lg:col-span-2" role="alert">
          <AlertCircle size={16} />
          <span>{serverError}</span>
        </div>
      )}

      <div className="lg:col-span-2">
        <Button type="submit" isLoading={isSubmitting} className="w-full sm:w-auto">
          Submit application
        </Button>
      </div>
    </form>
  )
}
