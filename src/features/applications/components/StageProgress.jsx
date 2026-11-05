import { MAIN_PATH, STATE_LABELS } from '@/shared/constants/states'

// The eleven states grouped into five stages, so the whole journey fits on one line.
const GROUPS = [
  { label: 'Review', states: ['SUBMITTED', 'UNDER_SCREENING', 'SHORTLISTED'] },
  { label: 'Interview', states: ['INTERVIEW_SCHEDULED', 'UNDER_EVALUATION'] },
  { label: 'Decision', states: ['SELECTED', 'PENDING_APPROVAL'] },
  { label: 'Offer', states: ['OFFER_SENT', 'OFFER_ACCEPTED'] },
  { label: 'Onboarding', states: ['ONBOARDING', 'COMPLETED'] },
]

export default function StageProgress({ app }) {
  const closed = app.state === 'REJECTED' || app.state === 'DECLINED'
  const completed = app.state === 'COMPLETED'
  // A closed application is shown at the stage where it stopped.
  const last = closed ? [...app.history].reverse().find((h) => MAIN_PATH.includes(h.state) && h.state !== app.state) : null
  const at = closed ? last?.state ?? 'SUBMITTED' : app.state
  const current = Math.max(0, GROUPS.findIndex((g) => g.states.includes(at)))

  return (
    <div aria-label="Progress">
      <ol className="flex gap-1.5">
        {GROUPS.map((g, i) => {
          const done = i < current || completed
          const here = i === current && !completed
          return (
            <li key={g.label} className="flex-1" aria-current={here && !closed ? 'step' : undefined}>
              <div className={`h-1.5 rounded-full ${here && closed ? 'bg-ers-danger' : done || here ? 'bg-ers-primary' : 'bg-ers-ink/10'}`} />
              <span className={`mt-1 block text-caption ${here ? (closed ? 'font-semibold text-ers-danger' : 'font-semibold text-ers-primary') : 'text-ers-ink-soft'}`}>
                {g.label}
              </span>
            </li>
          )
        })}
      </ol>
      <p className="mt-1 text-sm text-ers-ink-soft">
        {closed ? `${STATE_LABELS[app.state]} at the ${GROUPS[current].label.toLowerCase()} stage` : `Step ${current + 1} of ${GROUPS.length} · ${STATE_LABELS[app.state]}`}
      </p>
    </div>
  )
}
