import Button from '@/shared/ui/Button'

// HR only: shortlisted candidates still waiting for an interview slot.
export default function ReadyToSchedule({ applications, onOpen }) {
  return (
    <section className="rounded-xl border border-ers-primary/30 bg-ers-primary/5 p-4">
      <h2 className="mb-1 text-h3 text-ers-ink">Ready to schedule</h2>
      <p className="mb-3 text-sm text-ers-ink-soft">Shortlisted candidates still waiting for an interview slot.</p>
      <ul className="space-y-2">
        {applications.map((a) => (
          <li key={a.id} className="flex items-center justify-between gap-3 rounded-lg border border-ers-line bg-ers-surface p-3">
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-ers-ink">{a.candidateName}</span>
              <span className="block truncate text-caption text-ers-ink-soft">{a.job.title}</span>
            </span>
            <Button size="sm" onClick={() => onOpen(a.id)}>Schedule</Button>
          </li>
        ))}
      </ul>
    </section>
  )
}
