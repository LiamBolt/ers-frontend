import TextArea from '../../ui/TextArea'

export function Section({ title, children }) {
  return (
    <section>
      <h3 className="text-label text-ers-ink-soft uppercase tracking-wide mb-2">{title}</h3>
      {children}
    </section>
  )
}

export function Card({ children, className = '' }) {
  return <div className={`rounded-xl border border-ers-line bg-ers-surface p-4 ${className}`}>{children}</div>
}

export function Row({ label, children }) {
  return (
    <p className="text-sm text-ers-ink">
      <span className="text-ers-ink-soft">{label}: </span>
      {children}
    </p>
  )
}

// Reason / comment box. Notes are saved permanently in the application history.
export function NoteField({ label = 'Reason / note', required, value, onChange }) {
  return (
    <TextArea
      label={label}
      required={required}
      rows={2}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      hint="Saved permanently in the application history."
    />
  )
}
