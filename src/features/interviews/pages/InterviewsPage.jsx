import { useState } from 'react'
import { CalendarClock } from 'lucide-react'
import AppLayout from '@/app/layout/AppLayout'
import Tabs from '@/shared/ui/Tabs'
import { LoadingRows } from '@/shared/ui/Skeleton'
import EmptyState from '@/shared/ui/EmptyState'
import { useAuth } from '@/features/auth/AuthContext'
import { useApplications } from '@/features/applications/hooks'
import ApplicationPanel from '@/features/applications/components/ApplicationPanel'
import { groupInterviews } from '../lib/interviewGroups'
import InterviewCard from '../components/InterviewCard'
import ReadyToSchedule from '../components/ReadyToSchedule'

export default function InterviewsPage() {
  const { user } = useAuth()
  const { data: applications = [], isLoading } = useApplications()
  const [tab, setTab] = useState('ACTION')
  const [openId, setOpenId] = useState(null)

  const isPanel = user.role === 'INTERVIEWER'
  const isHR = user.role === 'HR_OFFICER' || user.role === 'ADMIN'

  const interviews = applications
    .filter((a) => a.interview)
    .sort((a, b) => new Date(a.interview.date) - new Date(b.interview.date))
  const groups = groupInterviews(interviews, user)
  const toSchedule = isHR ? applications.filter((a) => a.state === 'SHORTLISTED') : []

  const tabs = [
    { value: 'ACTION', label: `${isPanel ? 'Evaluations due' : 'Needs action'} (${groups.ACTION.length})` },
    { value: 'UPCOMING', label: `Upcoming (${groups.UPCOMING.length})` },
    { value: 'COMPLETED', label: `Completed (${groups.COMPLETED.length})` },
    { value: 'ALL', label: `All (${groups.ALL.length})` },
  ]
  const list = groups[tab]

  return (
    <AppLayout
      title="Interviews"
      subtitle={isPanel ? 'Your assigned interviews and pending evaluations' : 'Scheduled interviews and panel evaluations'}
    >
      <div className="space-y-6">
        {isHR && toSchedule.length > 0 && <ReadyToSchedule applications={toSchedule} onOpen={setOpenId} />}

        <Tabs options={tabs} value={tab} onChange={setTab} ariaLabel="Filter interviews" />

        {isLoading ? (
          <LoadingRows rows={3} rowClassName="h-40" />
        ) : list.length === 0 ? (
          <EmptyState icon={CalendarClock} title={tab === 'ACTION' ? 'Nothing needs your attention' : 'No interviews in this view'}>
            {tab === 'ACTION' ? 'New interviews and evaluations will show up here.' : 'Switch tabs to see other interviews.'}
          </EmptyState>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {list.map((a) => <InterviewCard key={a.id} application={a} user={user} onOpen={setOpenId} />)}
          </ul>
        )}
      </div>

      {openId && <ApplicationPanel appId={openId} onClose={() => setOpenId(null)} />}
    </AppLayout>
  )
}
