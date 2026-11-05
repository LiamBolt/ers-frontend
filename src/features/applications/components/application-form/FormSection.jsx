export default function FormSection({ title, children }) {
  return (
    <section>
      <h2 className="mb-4 text-h2 text-ers-ink">{title}</h2>
      {children}
    </section>
  )
}
