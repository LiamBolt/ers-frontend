import { Link } from 'react-router-dom'
import { Briefcase } from 'lucide-react'
import { usePublicJobs } from '@/features/vacancies/hooks'
import { Skeleton } from '@/shared/ui/Skeleton'
import EmptyState from '@/shared/ui/EmptyState'
import JobCard from './JobCard'
import ErrorState from '@/shared/ui/ErrorState'

export default function OpenPositions() {
  const { data: jobs = [], isLoading, error, refetch } = usePublicJobs()

  return (
    <section id="positions" aria-labelledby="positions-heading" className="scroll-mt-4 bg-ers-bg/60">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="positions-heading" className="text-h2 text-ers-ink">Open positions</h2>
            {!error && (
              <p className="mt-1 text-ers-ink-soft">
                {isLoading ? 'Loading current vacancies…' : `${jobs.length} ${jobs.length === 1 ? 'vacancy' : 'vacancies'} accepting applications`}
              </p>
            )}
          </div>
          <p className="text-sm text-ers-ink-soft">
            Already registered? <Link to="/login" className="font-semibold text-ers-primary hover:underline">Sign in</Link>
          </p>
        </div>

        {isLoading && (
          <div role="status" aria-label="Loading vacancies" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => <Skeleton key={i} className="h-64" />)}
          </div>
        )}

        {error && <ErrorState error={error} onRetry={refetch} title="We could not load the vacancies" />}

        {!isLoading && !error && jobs.length === 0 && (
          <EmptyState icon={Briefcase} title="No open positions right now">
            New vacancies are published here as soon as they open. Create an account to be ready when they do.
          </EmptyState>
        )}

        {jobs.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => <JobCard key={job.id} job={job} />)}
          </div>
        )}
      </div>
    </section>
  )
}
