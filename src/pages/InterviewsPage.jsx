import { useState } from 'react'
import { CalendarClock, MapPin, Users } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout'
import Tabs from '../components/ui/Tabs'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import StateBadge from '../components/recruitment/StateBadge'
import ApplicationPanel from '../components/recruitment/ApplicationPanel'
import { useAuth } from '../context/AuthContext'
import { useApplications } from '../hooks/queries'
import { fmtDateTime } from '../utils/format'
import { LoadingRows } from '../components/ui/Skeleton'
import EmptyState from '../components/ui/EmptyState'

export default function InterviewsPage() {
  const { user } = useAuth()
  const { data: applications = [], isLoading } = useApplications()
  const [tab, setTab] = useState('ACTION')
  const [openId, setOpenId] = useState(null)

  const isPanel = user.role === 'INTERVIEWER'
  const isHR = user.role === 'HR_OFFICER'

  const interviews = applications
    .filter((a) => a.interview)
    .sort((a, b) => new Date(a.interview.date) - new Date(b.interview.date))

  const mineDone = (a) => a.evaluations.some((e) => e.panelistId === user.id)

  // "Needs me" differs by role: panel -> evaluation due; HR -> to schedule / mark done.
  const needsAction = (a) =>
    isPanel
      ? a.state === 'UNDER_EVALUATION' && !mineDone(a)
      : isHR
        ? a.state === 'INTERVIEW_SCHEDULED'
        : false
  const toSchedule = isHR ? applications.filter((a) => a.state === 'SHORTLISTED') : []

  const groups = {
    ACTION: interviews.filter(needsAction),
    UPCOMING: interviews.filter((a) => a.interview.status === 'SCHEDULED'),
    COMPLETED: interviews.filter((a) => a.interview.status === 'COMPLETED'),
    ALL: interviews,
  }
  const options = [
    { value: 'ACTION', label: `${isPanel ? 'Evaluations due' : 'Needs action'} (${groups.ACTION.length})` },
    { value: 'UPCOMING', label: `Upcoming (${groups.UPCOMING.length})` },
    { value: 'COMPLETED', label: `Completed (${groups.COMPLETED.length})` },
    { value: 'ALL', label: `All (${groups.ALL.length})` },
  ]
  const list = groups[tab]

  return (
    <AppLayout
      title="Interviews"
      subtitle={isPanel ? 'Your assigned interviews and pending evaluations' : 'Scheduled interviews and panel evaluations'}
    >
      <div className="space-y-6">
        {isHR && toSchedule.length > 0 && (
          <section className="rounded-xl border border-ers-primary/30 bg-ers-primary/5 p-4">
            <h2 className="text-h3 text-ers-ink mb-1">Ready to schedule</h2>
            <p className="text-sm text-ers-ink-soft mb-3">Shortlisted candidates still waiting for an interview slot.</p>
            <ul className="space-y-2">
              {toSchedule.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 rounded-lg bg-ers-surface border border-ers-line p-3">
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-ers-ink truncate">{a.candidateName}</span>
                    <span className="block text-caption text-ers-ink-soft truncate">{a.job.title}</span>
                  </span>
                  <Button size="sm" onClick={() => setOpenId(a.id)}>Schedule</Button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <Tabs options={options} value={tab} onChange={setTab} ariaLabel="Filter interviews" />

        {isLoading ? (
          <LoadingRows rows={3} rowClassName="h-40" />
        ) : list.length === 0 ? (
          <EmptyState icon={CalendarClock} title={tab === 'ACTION' ? 'Nothing needs your attention' : 'No interviews in this view'}>{tab === 'ACTION' ? 'New interviews and evaluations will show up here.' : 'Switch tabs to see other interviews.'}</EmptyState>
        ) : (
          <ul className="grid md:grid-cols-2 gap-4">
            {list.map((a) => {
              const job = a.job
              const due = isPanel && a.state === 'UNDER_EVALUATION' && !mineDone(a)
              return (
                <li key={a.id} className="rounded-xl border border-ers-line bg-ers-surface p-4 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-ers-ink truncate">{a.candidateName}</p>
                      <p className="text-caption text-ers-ink-soft truncate">{job?.title} · {job?.department}</p>
                    </div>
                    <StateBadge state={a.state} />
                  </div>
                  <div className="space-y-1.5 text-sm text-ers-ink-soft">
                    <p className="flex items-center gap-2"><CalendarClock size={15} /> {fmtDateTime(a.interview.date)}</p>
                    <p className="flex items-center gap-2"><MapPin size={15} /> {a.interview.location}</p>
                    <p className="flex items-center gap-2"><Users size={15} /> {a.interview.panel.map((p) => p.name).join(', ')}</p>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mt-auto">
                    <Badge variant={a.interview.status === 'COMPLETED' ? 'success' : 'primary'}>
                      {a.interview.status === 'COMPLETED' ? 'Completed' : 'Scheduled'} · {a.evaluations.length}/{a.interview.panel.length} evaluations
                    </Badge>
                    <Button
                      variant={due || needsAction(a) ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => setOpenId(a.id)}
                    >
                      {due ? 'Evaluate' : isHR && a.state === 'INTERVIEW_SCHEDULED' ? 'Review / complete' : 'View'}
                    </Button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {openId && <ApplicationPanel appId={openId} onClose={() => setOpenId(null)} />}
    </AppLayout>
  )
}
