import { useState } from 'react'
import { AlertCircle, Loader2 } from 'lucide-react'
import Modal from '../ui/Modal'
import Badge from '../ui/Badge'
import StateBadge from './StateBadge'
import StageTracker from './StageTracker'
import HistoryTimeline from './HistoryTimeline'
import { Section } from './panel/PanelPrimitives'
import ScreeningSection from './panel/ScreeningSection'
import ScheduleSection from './panel/ScheduleSection'
import InterviewCompleteSection from './panel/InterviewCompleteSection'
import EvaluationSection from './panel/EvaluationSection'
import SelectionSection from './panel/SelectionSection'
import DecisionSection from './panel/DecisionSection'
import { OfferFormSection, OfferResponseSection } from './panel/OfferSections'
import OnboardingSection from './panel/OnboardingSection'
import { CandidateDetails, InterviewDetails, EvaluationDetails, ApprovalDetails, OfferDetails } from './panel/DetailSections'
import { useAuth } from '../../context/AuthContext'
import { useApplication } from '../../hooks/queries'
import { useApplicationActions } from '../../hooks/useApplicationActions'
import { fmtDate } from '../../utils/format'
import ErrorState from '../ui/ErrorState'

// Everything a staff member can see and do on one application. Which sections
// show is driven by the application's state and the signed-in role; the server
// enforces the same rules (BR-03), so this only hides what would be refused.
export default function ApplicationPanel({ appId, onClose }) {
  const { user } = useAuth()
  const { data: app, isLoading, error: loadError, refetch } = useApplication(appId)
  const actions = useApplicationActions(appId)
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

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

  const role = user.role
  const isHR = role === 'HR_OFFICER'
  const isPanel = role === 'INTERVIEWER'
  const isManager = role === 'MANAGER'
  const mine = app.interview?.panel.some((p) => p.id === user.id)
  const alreadyEvaluated = app.evaluations.some((e) => e.panelistId === user.id)
  const awaitingDecision = app.state === 'PENDING_APPROVAL' && !app.approval
  const approvedAwaitingOffer = app.state === 'PENDING_APPROVAL' && app.approval?.decision === 'APPROVED'
  const shared = { app, act, actions, note, setNote }

  return (
    <Modal open onClose={onClose} title={app.candidateName} subtitle={`${app.ref} · ${app.job.title} · ${app.job.department}`}>
      <div className="flex flex-wrap items-center gap-2">
        <StateBadge state={app.state} />
        <Badge>Applied {fmtDate(app.appliedAt)}</Badge>
        <span className="text-sm text-ers-ink-soft">{app.candidateEmail}</span>
        {actions.isPending && <Loader2 size={16} className="animate-spin text-ers-primary" aria-label="Saving" />}
      </div>

      <StageTracker app={app} />

      {error && (
        <div role="alert" className="flex items-start gap-2 rounded-xl bg-ers-danger/10 text-ers-danger text-sm p-3 animate-slide-down">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ---- actions for this role at this stage ---- */}
      {isHR && ['SUBMITTED', 'UNDER_SCREENING'].includes(app.state) && <ScreeningSection {...shared} />}
      {isHR && app.state === 'SHORTLISTED' && <ScheduleSection {...shared} />}
      {isHR && app.state === 'INTERVIEW_SCHEDULED' && <InterviewCompleteSection {...shared} />}
      {isPanel && app.state === 'UNDER_EVALUATION' && mine && !alreadyEvaluated && <EvaluationSection {...shared} />}
      {(isHR || (isPanel && mine)) && app.state === 'UNDER_EVALUATION' && <SelectionSection {...shared} />}
      {isManager && awaitingDecision && <DecisionSection {...shared} />}
      {isHR && approvedAwaitingOffer && <OfferFormSection {...shared} />}
      {isHR && app.state === 'OFFER_SENT' && <OfferResponseSection {...shared} />}

      {/* ---- record ---- */}
      {role !== 'INTERVIEWER' && <CandidateDetails app={app} />}
      {app.interview && <InterviewDetails interview={app.interview} />}
      {app.evaluations.length > 0 && <EvaluationDetails evaluations={app.evaluations} />}
      {app.approval && <ApprovalDetails approval={app.approval} />}
      {app.offer && <OfferDetails offer={app.offer} />}
      {app.onboarding && <OnboardingSection app={app} role={role} act={act} actions={actions} />}

      <Section title="History">
        <HistoryTimeline history={app.history} />
      </Section>
    </Modal>
  )
}
