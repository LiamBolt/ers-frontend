import { Briefcase, CalendarClock, ClipboardCheck, Users } from 'lucide-react'
import { CLOSED_STATES } from '@/shared/constants/states'
import { fmtDate } from '@/shared/lib/format'
import { toRows } from '../lib/rows'
import StatCard from './StatCard'
import ActionList from './ActionList'

export default function AdminDashboard({ applications, onOpen }) {
  const open = applications.filter((a) => !CLOSED_STATES.includes(a.state))
  const count = (...states) => applications.filter((a) => states.includes(a.state)).length
  const awaitingManager = applications.filter((a) => a.state === 'PENDING_APPROVAL' && !a.approval).length
  const recent = [...applications].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5)

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={Users} label="In-progress transactions" value={open.length} to="/candidates" />
        <StatCard icon={CalendarClock} label="Interviews pending" value={count('INTERVIEW_SCHEDULED', 'UNDER_EVALUATION')} to="/interviews" />
        <StatCard icon={ClipboardCheck} label="Awaiting manager" value={awaitingManager} to="/candidates" />
        <StatCard icon={Briefcase} label="Completed hires" value={count('COMPLETED')} to="/reports" />
      </div>
      <ActionList
        title="Recently updated"
        items={toRows(recent, (a) => `updated ${fmtDate(a.updatedAt)}`)}
        empty="No activity yet."
        onOpen={onOpen}
        to="/reports"
        toLabel="Open reports"
      />
    </div>
  )
}
