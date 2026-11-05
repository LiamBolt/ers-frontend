import { STATE_LABELS, ROLE_LABELS } from '../../data/recruitment'
import { fmtDateTime } from '../../utils/format'

// Full, append-only history (BR-04, NFR-06): never edited, newest first.
export default function HistoryTimeline({ history }) {
  const items = [...history].reverse()
  return (
    <ol className="relative border-l border-ers-line ml-2 space-y-4">
      {items.map((h, i) => (
        <li key={`${h.at}-${i}`} className="ml-4">
          <span
            className={`absolute -left-[5px] mt-1.5 w-2.5 h-2.5 rounded-full ${
              i === 0 ? 'bg-ers-primary' : 'bg-ers-line'
            }`}
          />
          <p className="text-sm font-semibold text-ers-ink">{STATE_LABELS[h.state] || h.state}</p>
          {h.note && <p className="text-sm text-ers-ink-soft">{h.note}</p>}
          <p className="text-caption text-ers-muted">
            {fmtDateTime(h.at)} · {h.by} ({ROLE_LABELS[h.role] || h.role})
          </p>
        </li>
      ))}
    </ol>
  )
}
