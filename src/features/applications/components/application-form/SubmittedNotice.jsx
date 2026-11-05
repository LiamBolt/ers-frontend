import { CheckCircle2 } from 'lucide-react'
import Badge from '@/shared/ui/Badge'

export default function SubmittedNotice({ data }) {
  return (
    <div className="py-8 text-center">
      <CheckCircle2 size={48} className="mx-auto mb-4 text-ers-accent" />
      <h2 className="mb-2 text-xl font-bold text-ers-ink">Application submitted</h2>
      <p className="mb-4 text-ers-ink-soft">Your application now has status: <Badge variant="warning">SUBMITTED</Badge></p>
      <div className="mx-auto max-w-md space-y-1 text-left text-sm">
        <p><span className="font-semibold">Name:</span> {data.fullName}</p>
        <p><span className="font-semibold">Email:</span> {data.email}</p>
        <p><span className="font-semibold">Qualifications:</span> {data.qualifications.length}</p>
        <p><span className="font-semibold">References:</span> {data.references.length}</p>
        <p><span className="font-semibold">CV:</span> {data.cv.name}</p>
      </div>
    </div>
  )
}
