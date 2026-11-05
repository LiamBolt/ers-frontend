import { CalendarClock, ClipboardCheck } from 'lucide-react'
import { fmtDate, fmtDateTime } from '@/shared/lib/format'
import { useAuth } from '@/features/auth/AuthContext'
import { toRows } from '../lib/rows'
import StatCard from './StatCard'
import ActionList from './ActionList'

export default function PanelDashboard({ applications, onOpen }) {
  const { user } = useAuth()
  const mine = applications.filter((a) => a.interview?.panel.some((p) => p.id === user.id))
  const pending = mine.filter((a) => a.state === 'UNDER_EVALUATION' && !a.evaluations.some((e) => e.panelistId === user.id))
  const upcoming = mine.filter((a) => a.state === 'INTERVIEW_SCHEDULED')

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={CalendarClock} label="Upcoming interviews" value={upcoming.length} to="/interviews" />
        <StatCard icon={ClipboardCheck} label="Evaluations to submit" value={pending.length} to="/interviews" />
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <ActionList title="Pending evaluations" items={toRows(pending, (a) => `interviewed ${fmtDate(a.interview.date)}`)} empty="You’re all caught up." onOpen={onOpen} to="/interviews" toLabel="All interviews" />
        <ActionList title="Upcoming interviews" items={toRows(upcoming, (a) => fmtDateTime(a.interview.date))} empty="No interviews assigned." onOpen={onOpen} />
      </div>
    </div>
  )
}
