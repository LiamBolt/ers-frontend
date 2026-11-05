export default function Stat({ label, value, hint }) {
  return (
    <div className="rounded-xl border border-ers-line bg-white/70 p-4">
      <p className="text-display text-ers-ink !text-3xl">{value}</p>
      <p className="text-sm font-semibold text-ers-ink">{label}</p>
      {hint && <p className="text-caption text-ers-ink-soft">{hint}</p>}
    </div>
  )
}
