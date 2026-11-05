import { Check, XCircle } from 'lucide-react'
import { MAIN_PATH, STATE_LABELS } from '@/shared/constants/states'

// Shows where an application sits on the main path (FR-04). A closed branch
// (REJECTED / DECLINED) is shown at the stage where it stopped.
export default function StageTracker({ app, moves = [], onSelect }) {
  const closed = app.state === 'REJECTED' || app.state === 'DECLINED'
  let currentIdx = MAIN_PATH.indexOf(app.state)
  if (closed) {
    const last = [...app.history].reverse().find((h) => MAIN_PATH.includes(h.state) && h.state !== app.state)
    currentIdx = last ? MAIN_PATH.indexOf(last.state) : 0
  }

  return (
    <ol className="flex gap-1 overflow-x-auto pb-2" aria-label="Application stages">
      {MAIN_PATH.map((s, i) => {
        const done = i < currentIdx || app.state === 'COMPLETED'
        const current = i === currentIdx && !closed && app.state !== 'COMPLETED'
        const stopped = i === currentIdx && closed
        const move = onSelect && moves.find((m) => m.to === s)
        const Tag = move ? 'button' : 'div'
        return (
          <li
            key={s}
            aria-current={current ? 'step' : undefined}
            className="flex-1 min-w-[4.5rem] text-center"
          >
            <Tag
              {...(move ? { type: 'button', onClick: () => onSelect(move), title: `${move.label}`, 'aria-label': `Move to ${STATE_LABELS[s]}` } : {})}
              className={`block w-full rounded-md ${move ? 'cursor-pointer py-1 transition-colors duration-150 hover:bg-ers-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ers-primary' : ''}`}
            >
            <div
              className={`h-1.5 rounded-full mb-1.5 ${
                stopped ? 'bg-ers-danger' : done || current ? 'bg-ers-primary' : 'bg-ers-ink/10'
              } ${current ? 'ring-2 ring-ers-primary/30' : ''}`}
            />
            <div className="flex items-center justify-center gap-0.5">
              {done && <Check size={10} className="text-ers-accent" />}
              {stopped && <XCircle size={10} className="text-ers-danger" />}
              <span
                className={`text-[10px] leading-tight ${
                  current ? 'text-ers-primary font-semibold' : stopped ? 'text-ers-danger font-semibold' : 'text-ers-ink-soft'
                }`}
              >
                {STATE_LABELS[s]}
              </span>
            </div>
            </Tag>
          </li>
        )
      })}
    </ol>
  )
}
