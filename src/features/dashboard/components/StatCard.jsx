import { Link } from 'react-router-dom'

export default function StatCard({ icon: Icon, label, value, to }) {
  const body = (
    <div className="h-full rounded-xl border border-ers-line bg-ers-surface p-4 transition-colors hover:border-ers-primary/40">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-ers-primary/10 text-ers-primary">
        <Icon size={18} />
      </div>
      <p className="text-stat tabular-nums text-ers-ink">{value}</p>
      <p className="text-sm text-ers-ink-soft">{label}</p>
    </div>
  )
  return to ? <Link to={to}>{body}</Link> : body
}
