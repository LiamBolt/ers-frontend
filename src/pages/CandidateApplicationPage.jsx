import AppLayout from '../components/layout/AppLayout'
import CandidateApplicationForm from '../components/forms/CandidateApplicationForm'

export default function CandidateApplicationPage() {
  return (
    <AppLayout
      title="Job Application"
      subtitle="Complete all sections to submit your application"
    >
      <CandidateApplicationForm />
    </AppLayout>
  )
}