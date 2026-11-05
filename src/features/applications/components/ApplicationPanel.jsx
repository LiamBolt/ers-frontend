import { useState } from 'react'
import { AlertCircle, Loader2 } from 'lucide-react'
import Modal from '@/shared/ui/Modal'
import Badge from '@/shared/ui/Badge'
import StateBadge from './StateBadge'
import StageProgress from './StageProgress'
import HistoryTimeline from './HistoryTimeline'
import Tabs from '@/shared/ui/Tabs'
import { Section } from '@/features/applications/components/panel/PanelPrimitives'
import ActionCard from '@/features/applications/components/panel/ActionCard'
import OnboardingSection from '@/features/applications/components/panel/OnboardingSection'
import { CandidateDetails, InterviewDetails, EvaluationDetails, ApprovalDetails, OfferDetails } from '@/features/applications/components/panel/DetailSections'
import { useAuth } from '@/features/auth/AuthContext'
import { useApplication } from '@/features/applications/hooks'
import { useApplicationActions } from '@/features/applications/useApplicationActions'
import { fmtDate } from '@/shared/lib/format'
import ErrorState from '@/shared/ui/ErrorState'

// Everything a staff member can see and do on one application. Which sections
// show is driven by the application's state and the signed-in role; the server
// enforces the same rules (BR-03), so this only hides what would be refused.
export default function ApplicationPanel({ appId, onClose }) {
  const { user } = useAuth()
  const { data: app, isLoading, error: loadError, refetch } = useApplication(appId)
  const actions = useApplicationActions(appId)
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [tab, setTab] = useState(null) // null = the tab that matches the stage

  const act = async (fn) => {
    try {
      await fn()
      setError('')
      setNote('')
    } catch (err) {
      setError(err.message)
    }
  }

  if (isLoading || loadError || !app) {
    return (
      <Modal open onClose={onClose} title={loadError ? 'Application unavailable' : 'Loading…'}>
        {loadError ? <ErrorState error={loadError} onRetry={refetch} compact /> : <Loader2 className="animate-spin text-ers-primary" aria-label="Loading" />}
      </Modal>
    )
  }

  if (isLoading || loadError || !app) {
    return (
      <Modal open onClose={onClose} title={loadError ? 'Application unavailable' : 'Loading…'}>
        {loadError ? <ErrorState error={loadError} onRetry={refetch} compact /> : <Loader2 className="animate-spin text-ers-primary" aria-label="Loading" />}
      </Modal>
    )
  }

  const role = user.role
  const shared = { app, act, actions, note, setNote }

  // Only the tabs that have something in them; the one matching the stage opens first.
  const tabs = [
    role !== 'INTERVIEWER' && { value: 'overview', label: 'Candidate' },
    app.interview && { value: 'interview', label: 'Interview' },
    (app.approval || app.offer || app.onboarding) && { value: 'decision', label: 'Approval & offer' },
    { value: 'history', label: 'History' },
  ].filter(Boolean)
  const wanted = ['INTERVIEW_SCHEDULED', 'UNDER_EVALUATION'].includes(app.state) ? 'interview' : app.approval || app.offer || app.onboarding ? 'decision' : 'overview'
  const current = tabs.some((t) => t.value === (tab ?? wanted)) ? tab ?? wanted : tabs[0].value

  return (
    <Modal open onClose={onClose} title={app.candidateName} subtitle={`${app.ref} · ${app.job.title} · ${app.job.department}`}>
      <div className="flex flex-wrap items-center gap-2">
        <StateBadge state={app.state} />
        <Badge>Applied {fmtDate(app.appliedAt)}</Badge>
        <span className="text-sm text-ers-ink-soft">{app.candidateEmail}</span>
        {actions.isPending && <Loader2 size={16} className="animate-spin text-ers-primary" aria-label="Saving" />}
      </div>

      <StageProgress app={app} />

      {error && (
        <div role="alert" className="flex items-start gap-2 rounded-xl bg-ers-danger/10 text-ers-danger text-sm p-3 animate-slide-down">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <ActionCard key={`${app.state}-${!!app.approval}-${app.evaluations.length}`} app={app} user={user} shared={shared} />

      <Tabs options={tabs} value={current} onChange={setTab} ariaLabel="Application details" />

      {current === 'overview' && <CandidateDetails app={app} />}
      {current === 'interview' && (
        <>
          {app.interview && <InterviewDetails interview={app.interview} />}
          {app.evaluations.length > 0 && <EvaluationDetails evaluations={app.evaluations} />}
        </>
      )}
      {current === 'decision' && (
        <>
          {app.approval && <ApprovalDetails approval={app.approval} />}
          {app.offer && <OfferDetails offer={app.offer} />}
          {app.onboarding && <OnboardingSection app={app} role={role} act={act} actions={actions} />}
        </>
      )}
      {current === 'history' && (
        <Section title="History">
          <HistoryTimeline history={app.history} />
        </Section>
      )}
    </Modal>
  )
}
