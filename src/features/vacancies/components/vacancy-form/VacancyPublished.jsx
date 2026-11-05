import { CheckCircle2 } from 'lucide-react'
import Button from '@/shared/ui/Button'

export default function VacancyPublished({ data, onCreateAnother }) {
  return (
    <div className="py-8 text-center">
      <CheckCircle2 size={48} className="mx-auto mb-4 text-ers-accent" />
      <h2 className="mb-2 text-xl font-bold text-ers-ink">Vacancy published</h2>
      <div className="mx-auto max-w-sm space-y-2 text-left">
        <p className="text-sm"><span className="font-semibold">Title:</span> {data.jobTitle}</p>
        <p className="text-sm"><span className="font-semibold">Department:</span> {data.department}</p>
        <p className="text-sm"><span className="font-semibold">Positions:</span> {data.numberOfPositions}</p>
        <p className="text-sm"><span className="font-semibold">Closing Date:</span> {data.closingDate}</p>
      </div>
      <Button onClick={onCreateAnother} className="mt-6">Create another vacancy</Button>
    </div>
  )
}
