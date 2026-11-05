import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Briefcase, CalendarClock, ClipboardCheck, Users, Inbox, Loader2 } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import StateBadge from '../components/recruitment/StateBadge'
import StageTracker from '../components/recruitment/StageTracker'
import HistoryTimeline from '../components/recruitment/HistoryTimeline'
import ApplicationPanel from '../components/recruitment/ApplicationPanel'
import { useAuth } from '../context/AuthContext'
import { useApplications } from '../hooks/queries'
import { useApplicationActions } from '../hooks/useApplicationActions'
import { CLOSED_STATES } from '../data/recruitment'
import { fmtDate, fmtDateTime, fmtMoney } from '../utils/format'

function StatCard({ icon: Icon, label, value, to }) {
  const body = (
    <div className="rounded-xl border border-ers-line bg-white/70 p-4 h-full transition-colors hover:border-ers-primary/40">
      <div className="w-9 h-9 rounded-full bg-ers-primary/10 text-ers-primary flex items-center justify-center mb-3">
        <Icon size={18} />
      </div>
      <p className="text-display text-ers-ink !text-3xl">{value}</p>
      <p className="text-sm text-ers-ink-soft">{label}</p>
    </div>
  )
  return to ? <Link to={to}>{body}</Link> : body
}

function ActionList({ title, items, empty, onOpen, to, toLabel }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-h3 text-ers-ink">{title}</h2>
        {to && (
          <Link to={to} className="text-sm font-semibold text-ers-primary inline-flex items-center gap-1 hover:underline">
            {toLabel} <ArrowRight size={14} />
          </Link>
        )}
      </div>
      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-ers-line p-6 text-center text-sm text-ers-ink-soft">{empty}</p>
      ) : (
        <ul className="space-y-2">
          {items.map(({ app, job, hint }) => (
            <li key={app.id}>
              <button
                onClick={() => onOpen(app.id)}
                className="w-full text-left rounded-xl border border-ers-line bg-white/70 p-3 flex items-center justify-between gap-3 hover:border-ers-primary/40 transition-colors"
              >
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-ers-ink truncate">{app.candidateName}</span>
                  <span className="block text-caption text-ers-ink-soft truncate">
                    {job?.title} · {hint}
                  </span>
                </span>
                <StateBadge state={app.state} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

// ------------------------------------------------------------- candidate

// Accept / decline buttons for one offer. Its own component so the mutation hook is per application.
function OfferResponse({ app }) {
  const actions = useApplicationActions(app.id)
  const [error, setError] = useState('')

  const respond = async (response) => {
    try {
      await actions.respondToOffer(response)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="rounded-lg border border-ers-primary/30 bg-ers-primary/5 p-4 space-y-3">
      <p className="font-semibold text-ers-ink">You have a job offer</p>
      <p className="text-sm text-ers-ink-soft">
        {fmtMoney(app.offer.salary)} / month · {app.offer.contract} · starting {fmtDate(app.offer.startDate)}
      </p>
      <div className="flex gap-2">
        <Button isLoading={actions.isPending} onClick={() => respond('ACCEPTED')}>Accept offer</Button>
        <Button variant="secondary" className="!text-ers-danger" disabled={actions.isPending} onClick={() => respond('DECLINED')}>Decline</Button>
      </div>
      {error && <p role="alert" className="text-sm text-ers-danger">{error}</p>}
    </div>
  )
}

function CandidateDashboard() {
  const { data: mine = [], isLoading } = useApplications() // server returns only this candidate's applications

  if (isLoading) return <Loader2 className="animate-spin text-ers-primary" aria-label="Loading" />

  if (!mine.length) {
    return (
      <div className="rounded-xl border border-dashed border-ers-line p-8 text-center">
        <Inbox className="mx-auto text-ers-ink-soft mb-3" size={32} />
        <p className="text-ers-ink font-semibold">You haven’t applied for anything yet</p>
        <p className="text-sm text-ers-ink-soft mb-4">Submit an application and you’ll be able to follow every stage here.</p>
        <Link to="/candidate"><Button>Apply for a vacancy</Button></Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {mine.map((app) => {
        const job = app.job
        return (
          <article key={app.id} className="rounded-xl border border-ers-line bg-white/70 p-5 space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 className="text-h3 text-ers-ink">{job?.title}</h2>
                <p className="text-caption text-ers-ink-soft">{job?.department} · {app.ref} · applied {fmtDate(app.appliedAt)}</p>
              </div>
              <StateBadge state={app.state} />
            </div>

            <StageTracker app={app} />

            {app.interview && app.state === 'INTERVIEW_SCHEDULED' && (
              <div className="rounded-lg bg-ers-primary/10 p-4 flex gap-3 text-sm">
                <CalendarClock className="text-ers-primary shrink-0" size={20} />
                <div>
                  <p className="font-semibold text-ers-ink">Your interview</p>
                  <p className="text-ers-ink-soft">{fmtDateTime(app.interview.date)} · {app.interview.location}</p>
                </div>
              </div>
            )}

            {app.state === 'OFFER_SENT' && app.offer && <OfferResponse app={app} />}

            {app.state === 'ONBOARDING' && (
              <p className="text-sm text-ers-ink-soft rounded-lg bg-ers-accent/10 p-4">
                Congratulations! HR is collecting your onboarding documents. You’ll be marked as completed once everything is confirmed.
              </p>
            )}

            <details className="group">
              <summary className="cursor-pointer text-sm font-semibold text-ers-primary">Stage history</summary>
              <div className="mt-4">
                <HistoryTimeline history={app.history} />
              </div>
            </details>
          </article>
        )
      })}
    </div>
  )
}

// ----------------------------------------------------------------- staff

function StaffDashboard({ role, onOpen }) {
  const { user } = useAuth()
  const { data: applications = [], isLoading } = useApplications()
  const withJob = (list, hint) => list.map((app) => ({ app, job: app.job, hint: hint(app) }))
  const open = applications.filter((a) => !CLOSED_STATES.includes(a.state))
  const count = (...states) => applications.filter((a) => states.includes(a.state)).length

  if (isLoading) return <Loader2 className="animate-spin text-ers-primary" aria-label="Loading" />

  if (role === 'HR_OFFICER') {
    const toScreen = applications.filter((a) => ['SUBMITTED', 'UNDER_SCREENING'].includes(a.state))
    const toSchedule = applications.filter((a) => ['SHORTLISTED', 'INTERVIEW_SCHEDULED'].includes(a.state))
    const toOffer = applications.filter(
      (a) => (a.state === 'PENDING_APPROVAL' && a.approval?.decision === 'APPROVED') || a.state === 'OFFER_SENT' || a.state === 'ONBOARDING'
    )
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard icon={Users} label="Open applications" value={open.length} to="/candidates" />
          <StatCard icon={ClipboardCheck} label="Awaiting screening" value={toScreen.length} to="/candidates" />
          <StatCard icon={CalendarClock} label="Interviews to run" value={toSchedule.length} to="/interviews" />
          <StatCard icon={Briefcase} label="Offers & onboarding" value={toOffer.length} to="/candidates" />
        </div>
        <div className="grid lg:grid-cols-2 gap-8">
          <ActionList title="Needs screening" items={withJob(toScreen, (a) => `applied ${fmtDate(a.appliedAt)}`)} empty="Nothing waiting for screening." onOpen={onOpen} to="/candidates" toLabel="All candidates" />
          <ActionList title="Offers & onboarding" items={withJob(toOffer, (a) => (a.state === 'OFFER_SENT' ? 'awaiting response' : a.state === 'ONBOARDING' ? 'collect documents' : 'approved: send offer'))} empty="No offers in progress." onOpen={onOpen} />
        </div>
      </div>
    )
  }

  if (role === 'INTERVIEWER') {
    const mine = applications.filter((a) => a.interview?.panel.some((p) => p.id === user.id))
    const pending = mine.filter((a) => a.state === 'UNDER_EVALUATION' && !a.evaluations.some((e) => e.panelistId === user.id))
    const upcoming = mine.filter((a) => a.state === 'INTERVIEW_SCHEDULED')
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={CalendarClock} label="Upcoming interviews" value={upcoming.length} to="/interviews" />
          <StatCard icon={ClipboardCheck} label="Evaluations to submit" value={pending.length} to="/interviews" />
        </div>
        <div className="grid lg:grid-cols-2 gap-8">
          <ActionList title="Pending evaluations" items={withJob(pending, (a) => `interviewed ${fmtDate(a.interview.date)}`)} empty="You’re all caught up." onOpen={onOpen} to="/interviews" toLabel="All interviews" />
          <ActionList title="Upcoming interviews" items={withJob(upcoming, (a) => fmtDateTime(a.interview.date))} empty="No interviews assigned." onOpen={onOpen} />
        </div>
      </div>
    )
  }

  if (role === 'MANAGER') {
    const awaiting = applications.filter((a) => a.state === 'PENDING_APPROVAL' && !a.approval)
    const onboarding = applications.filter((a) => a.state === 'ONBOARDING' && !a.onboarding?.confirmations.Department)
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={ClipboardCheck} label="Awaiting your approval" value={awaiting.length} to="/candidates" />
          <StatCard icon={Users} label="Open applications" value={open.length} to="/candidates" />
        </div>
        <div className="grid lg:grid-cols-2 gap-8">
          <ActionList title="Awaiting your decision" items={withJob(awaiting, () => 'review scores and decide')} empty="No candidates waiting on you." onOpen={onOpen} to="/candidates" toLabel="All candidates" />
          <ActionList title="Department confirmation needed" items={withJob(onboarding, () => 'confirm onboarding')} empty="Nothing to confirm." onOpen={onOpen} />
        </div>
      </div>
    )
  }

  // ADMIN
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Users} label="In-progress transactions" value={open.length} to="/candidates" />
        <StatCard icon={CalendarClock} label="Interviews pending" value={count('INTERVIEW_SCHEDULED', 'UNDER_EVALUATION')} to="/interviews" />
        <StatCard icon={ClipboardCheck} label="Awaiting manager" value={applications.filter((a) => a.state === 'PENDING_APPROVAL' && !a.approval).length} to="/candidates" />
        <StatCard icon={Briefcase} label="Completed hires" value={count('COMPLETED')} to="/reports" />
      </div>
      <ActionList
        title="Recently updated"
        items={withJob(
          [...applications].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5),
          (a) => `updated ${fmtDate(a.updatedAt)}`
        )}
        empty="No activity yet."
        onOpen={onOpen}
        to="/reports"
        toLabel="Open reports"
      />
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [openId, setOpenId] = useState(null)
  const subtitle = `Welcome back, ${user?.name || 'User'}`

  return (
    <AppLayout title="Dashboard" subtitle={subtitle} wide>
      <div className="mb-6">
        <Badge variant="primary">{user.role.replace('_', ' ')}</Badge>
      </div>
      {user.role === 'CANDIDATE' ? <CandidateDashboard /> : <StaffDashboard role={user.role} onOpen={setOpenId} />}
      {openId && <ApplicationPanel appId={openId} onClose={() => setOpenId(null)} />}
    </AppLayout>
  )
}
