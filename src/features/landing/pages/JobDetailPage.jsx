import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { SearchX } from 'lucide-react'
import { usePublicJob } from '@/features/vacancies/hooks'
import { Skeleton } from '@/shared/ui/Skeleton'
import EmptyState from '@/shared/ui/EmptyState'
import ErrorState from '@/shared/ui/ErrorState'
import { buttonClass } from '@/shared/ui/Button'
import LandingHeader from '../components/LandingHeader'
import LandingFooter from '../components/LandingFooter'
import JobDetail from '../components/JobDetail'

// Public page for one vacancy at /jobs/:id. Always light.
export default function JobDetailPage() {
  const { id } = useParams()
  const { data: job, isLoading, error, refetch } = usePublicJob(id)

  useEffect(() => {
    if (!job) return undefined
    const previous = document.title
    document.title = `${job.title} - ERS Recruit`
    return () => { document.title = previous }
  }, [job])

  let body
  if (isLoading) {
    body = (
      <div role="status" aria-label="Loading vacancy" className="mx-auto max-w-6xl space-y-4 px-4 py-10 sm:px-6 lg:px-8">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="h-64" />
      </div>
    )
  } else if (error?.kind === 'notfound') {
    body = (
      <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
        <EmptyState
          icon={SearchX}
          title="This vacancy is no longer open"
          action={<Link to="/#positions" className={buttonClass('primary')}>View open positions</Link>}
        >
          It may have closed or been removed. Have a look at the vacancies that are open right now.
        </EmptyState>
      </div>
    )
  } else if (error) {
    body = <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6"><ErrorState error={error} onRetry={refetch} /></div>
  } else {
    body = <JobDetail job={job} />
  }

  return (
    <div className="flex min-h-screen flex-col bg-ers-surface">
      <LandingHeader solid />
      <main id="main" className="flex-1">{body}</main>
      <LandingFooter />
    </div>
  )
}
