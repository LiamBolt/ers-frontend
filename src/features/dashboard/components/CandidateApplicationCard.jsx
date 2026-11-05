import { CalendarClock } from 'lucide-react'
import { fmtDate, fmtDateTime } from '@/shared/lib/format'
import StateBadge from '@/features/applications/components/StateBadge'
import StageTracker from '@/features/applications/components/StageTracker'
import HistoryTimeline from '@/features/applications/components/HistoryTimeline'
import OfferResponse from './OfferResponse'

// One of the candidate's own applications: where it stands, what to do next, its history.
export default function CandidateApplicationCard({ app }) {
  const { job } = app
  return (
    <article className="space-y-5 rounded-xl border border-ers-line bg-ers-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-h3 text-ers-ink">{job?.title}</h2>
          <p className="text-caption text-ers-ink-soft">{job?.department} · {app.ref} · applied {fmtDate(app.appliedAt)}</p>
        </div>
        <StateBadge state={app.state} />
      </div>

      <StageTracker app={app} />

      {app.interview && app.state === 'INTERVIEW_SCHEDULED' && (
        <div className="flex gap-3 rounded-lg bg-ers-primary/10 p-4 text-sm">
          <CalendarClock className="shrink-0 text-ers-primary" size={20} />
          <div>
            <p className="font-semibold text-ers-ink">Your interview</p>
            <p className="text-ers-ink-soft">{fmtDateTime(app.interview.date)} · {app.interview.location}</p>
          </div>
        </div>
      )}

      {app.state === 'OFFER_SENT' && app.offer && <OfferResponse app={app} />}

      {app.state === 'ONBOARDING' && (
        <p className="rounded-lg bg-ers-accent/10 p-4 text-sm text-ers-ink-soft">
          Congratulations! HR is collecting your onboarding documents. You’ll be marked as completed once everything is confirmed.
        </p>
      )}

      <details>
        <summary className="cursor-pointer text-sm font-semibold text-ers-primary">Stage history</summary>
        <div className="mt-4">
          <HistoryTimeline history={app.history} />
        </div>
      </details>
    </article>
  )
}
