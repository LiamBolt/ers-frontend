import { Link } from 'react-router-dom'
import { Inbox } from 'lucide-react'
import Button from '@/shared/ui/Button'
import { LoadingRows } from '@/shared/ui/Skeleton'
import { useApplications } from '@/features/applications/hooks'
import CandidateApplicationCard from './CandidateApplicationCard'

export default function CandidateDashboard() {
  const { data: mine = [], isLoading } = useApplications() // the server returns only this candidate's applications

  if (isLoading) return <LoadingRows rows={3} rowClassName="h-24" />

  if (!mine.length) {
    return (
      <div className="rounded-xl border border-dashed border-ers-line p-8 text-center">
        <Inbox className="mx-auto mb-3 text-ers-ink-soft" size={32} />
        <p className="font-semibold text-ers-ink">You haven’t applied for anything yet</p>
        <p className="mb-4 text-sm text-ers-ink-soft">Submit an application and you’ll be able to follow every stage here.</p>
        <Link to="/candidate"><Button>Apply for a vacancy</Button></Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {mine.map((app) => <CandidateApplicationCard key={app.id} app={app} />)}
    </div>
  )
}
