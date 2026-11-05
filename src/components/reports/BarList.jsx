import { STATE_LABELS } from '../../data/recruitment'

function Bar({ label, value, max, tone }) {
  return (
    <div className="grid grid-cols-[8.5rem_1fr_2rem] items-center gap-3 text-sm">
      <span className="text-ers-ink-soft truncate">{label}</span>
      <div className="h-2.5 rounded-full bg-ers-ink/10 overflow-hidden">
        <div className={`h-full rounded-full ${tone}`} style={{ width: max ? `${(value / max) * 100}%` : 0 }} />
      </div>
      <span className="font-semibold text-ers-ink text-right">{value}</span>
    </div>
  )
}

const toneFor = (state) =>
  state === 'REJECTED' || state === 'DECLINED' ? 'bg-ers-danger' : state === 'COMPLETED' ? 'bg-ers-accent' : 'bg-ers-primary'

// items: [{ state, count }] straight from the report endpoint.
export default function BarList({ title, caption, items }) {
  const max = Math.max(1, ...items.map((i) => i.count))
  return (
    <section>
      <h2 className="text-h3 text-ers-ink mb-1">{title}</h2>
      <p className="text-caption text-ers-ink-soft mb-4">{caption}</p>
      <div className="space-y-2.5">
        {items.map((i) => (
          <Bar key={i.state} label={STATE_LABELS[i.state]} value={i.count} max={max} tone={toneFor(i.state)} />
        ))}
      </div>
    </section>
  )
}
