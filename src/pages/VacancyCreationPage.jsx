import AppLayout from '../components/layout/AppLayout'
import VacancyForm from '../components/forms/VacancyForm'

export default function VacancyCreationPage() {
  return (
    <AppLayout
      title="Create New Vacancy"
      subtitle="Fill in the details to publish a new job opening"
    >
      <VacancyForm />
    </AppLayout>
  )
}