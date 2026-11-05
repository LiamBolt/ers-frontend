import AppLayout from '@/app/layout/AppLayout'
import ApplicationForm from '@/features/applications/components/application-form/ApplicationForm'

export default function CandidateApplicationPage() {
  return (
    <AppLayout
      title="Job Application"
      subtitle="Complete all sections to submit your application"
    >
      <ApplicationForm />
    </AppLayout>
  )
}