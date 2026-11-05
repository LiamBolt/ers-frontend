import { Link } from 'react-router-dom'
import { ArrowLeft, Clock, Users } from 'lucide-react'
import Badge from '@/shared/ui/Badge'
import { fmtDate } from '@/shared/lib/format'
import ApplyPanel from './ApplyPanel'

// The full public posting: summary, description, every required skill, and how to apply.
export default function JobDetail({ job }) {
  const skills = job.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean)

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Link to="/#positions" className="inline-flex items-center gap-1.5 text-sm font-medium text-ers-ink-soft hover:text-ers-ink">
        <ArrowLeft size={16} aria-hidden="true" /> All open positions
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_20rem]">
        <article>
          <Badge variant="primary">{job.department}</Badge>
          <h1 className="mt-3 text-display text-ers-ink">{job.title}</h1>

          <p className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ers-ink-soft">
            <span className="inline-flex items-center gap-2">
              <Users size={16} aria-hidden="true" />
              {job.numPositions} {job.numPositions === 1 ? 'position' : 'positions'} available
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock size={16} aria-hidden="true" />
              Applications close {fmtDate(job.closingDate)}
            </span>
          </p>

          {job.description && (
            <section className="mt-8" aria-labelledby="about-heading">
              <h2 id="about-heading" className="text-h3 text-ers-ink">About the role</h2>
              <p className="mt-2 max-w-prose whitespace-pre-line text-ers-ink-soft">{job.description}</p>
            </section>
          )}

          <section className="mt-8" aria-labelledby="skills-heading">
            <h2 id="skills-heading" className="text-h3 text-ers-ink">Skills and requirements</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {skills.map((s) => (
                <li key={s} className="rounded-full bg-ers-ink/5 px-3 py-1 text-sm font-medium text-ers-ink">{s}</li>
              ))}
            </ul>
          </section>
        </article>

        <ApplyPanel job={job} />
      </div>
    </div>
  )
}
