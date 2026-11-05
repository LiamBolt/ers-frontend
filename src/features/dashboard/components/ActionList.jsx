import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import EmptyState from '@/shared/ui/EmptyState'
import StateBadge from '@/features/applications/components/StateBadge'

// A titled list of applications that need attention. Clicking a row opens it.
export default function ActionList({ title, items, empty, onOpen, to, toLabel }) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-h3 text-ers-ink">{title}</h2>
        {to && (
          <Link to={to} className="inline-flex items-center gap-1 text-sm font-semibold text-ers-primary hover:underline">
            {toLabel} <ArrowRight size={14} />
          </Link>
        )}
      </div>
      {items.length === 0 ? (
        <EmptyState title={empty} />
      ) : (
        <ul className="space-y-2">
          {items.map(({ app, job, hint }) => (
            <li key={app.id}>
              <button
                onClick={() => onOpen(app.id)}
                className="flex w-full items-center justify-between gap-3 rounded-xl border border-ers-line bg-ers-surface p-3 text-left transition-colors hover:border-ers-primary/40"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-ers-ink">{app.candidateName}</span>
                  <span className="block truncate text-caption text-ers-ink-soft">
                    {job?.title} · {hint}
                  </span>
                </span>
                <StateBadge state={app.state} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
