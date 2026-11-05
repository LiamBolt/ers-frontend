import AppLayout from '@/app/layout/AppLayout'
import VacancyForm from '@/features/vacancies/components/vacancy-form/VacancyForm'

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