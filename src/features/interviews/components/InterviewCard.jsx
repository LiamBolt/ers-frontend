import { CalendarClock, MapPin, Users } from 'lucide-react'
import Badge from '@/shared/ui/Badge'
import Button from '@/shared/ui/Button'
import { fmtDateTime } from '@/shared/lib/format'
import StateBadge from '@/features/applications/components/StateBadge'
import { evaluatedBy, needsAction } from '../lib/interviewGroups'

// One scheduled interview, with the action that makes sense for the signed-in role.
export default function InterviewCard({ application: a, user, onOpen }) {
  const evaluationDue = (user.role === 'INTERVIEWER' || a.interview.panel.some((p) => p.id === user.id)) && a.state === 'UNDER_EVALUATION' && !evaluatedBy(a, user.id)
  const completed = a.interview.status === 'COMPLETED'
  const label = evaluationDue ? 'Evaluate' : (user.role === 'HR_OFFICER' || user.role === 'ADMIN') && a.state === 'INTERVIEW_SCHEDULED' ? 'Review / complete' : 'View'

  return (
    <li className="flex flex-col gap-3 rounded-xl border border-ers-line bg-ers-surface p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-semibold text-ers-ink">{a.candidateName}</p>
          <p className="truncate text-caption text-ers-ink-soft">{a.job?.title} · {a.job?.department}</p>
        </div>
        <StateBadge state={a.state} />
      </div>
      <div className="space-y-1.5 text-sm text-ers-ink-soft">
        <p className="flex items-center gap-2"><CalendarClock size={15} /> {fmtDateTime(a.interview.date)}</p>
        <p className="flex items-center gap-2"><MapPin size={15} /> {a.interview.location}</p>
        <p className="flex items-center gap-2"><Users size={15} /> {a.interview.panel.map((p) => p.name).join(', ')}</p>
      </div>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
        <Badge variant={completed ? 'success' : 'primary'}>
          {completed ? 'Completed' : 'Scheduled'} · {a.evaluations.length}/{a.interview.panel.length} evaluations
        </Badge>
        <Button variant={evaluationDue || needsAction(a, user) ? 'primary' : 'secondary'} size="sm" onClick={() => onOpen(a.id)}>
          {label}
        </Button>
      </div>
    </li>
  )
}
