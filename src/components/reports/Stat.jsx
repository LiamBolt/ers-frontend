export default function Stat({ label, value, hint }) {
  return (
    <div className="rounded-xl border border-ers-line bg-ers-surface p-4">
      <p className="text-stat tabular-nums text-ers-ink">{value}</p>
      <p className="text-sm font-semibold text-ers-ink">{label}</p>
      {hint && <p className="text-caption text-ers-ink-soft">{hint}</p>}
    </div>
  )
}
