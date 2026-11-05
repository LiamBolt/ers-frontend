import { Link } from 'react-router-dom'
import { Clock, Users } from 'lucide-react'
import Badge from '@/shared/ui/Badge'
import { buttonClass } from '@/shared/ui/Button'
import { fmtDate } from '@/shared/lib/format'

const MAX_SKILLS = 4

export default function JobCard({ job }) {
  const skills = job.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean)
  const extra = skills.length - MAX_SKILLS

  return (
    <article className="flex flex-col rounded-xl border border-ers-line bg-ers-surface p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-h3 text-ers-ink">
          <Link to={`/jobs/${job.id}`} className="rounded hover:text-ers-primary hover:underline">{job.title}</Link>
        </h3>
        <Badge variant="primary">{job.department}</Badge>
      </div>

      <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-caption text-ers-ink-soft">
        <span className="inline-flex items-center gap-1.5">
          <Users size={14} aria-hidden="true" />
          {job.numPositions} {job.numPositions === 1 ? 'position' : 'positions'}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock size={14} aria-hidden="true" />
          Closes {fmtDate(job.closingDate)}
        </span>
      </p>

      {job.description && <p className="mt-3 line-clamp-3 text-sm text-ers-ink-soft">{job.description}</p>}

      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Key skills">
        {skills.slice(0, MAX_SKILLS).map((s) => (
          <li key={s} className="rounded-full bg-ers-ink/5 px-2.5 py-0.5 text-xs font-medium text-ers-ink">{s}</li>
        ))}
        {extra > 0 && <li className="rounded-full px-2.5 py-0.5 text-xs font-medium text-ers-muted">+{extra} more</li>}
      </ul>

      <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
        <Link to={`/jobs/${job.id}`} className={buttonClass('secondary')} aria-label={`View details for ${job.title}`}>
          View details
        </Link>
        <Link to={`/register?job=${job.id}`} className={buttonClass('primary')} aria-label={`Apply for ${job.title}`}>
          Apply
        </Link>
      </div>
    </article>
  )
}
