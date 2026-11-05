import { Briefcase, CalendarClock, ClipboardCheck, Users } from 'lucide-react'
import { CLOSED_STATES } from '@/shared/constants/states'
import { fmtDate } from '@/shared/lib/format'
import { toRows } from '../lib/rows'
import StatCard from './StatCard'
import ActionList from './ActionList'

export default function HrDashboard({ applications, onOpen }) {
  const open = applications.filter((a) => !CLOSED_STATES.includes(a.state))
  const toScreen = applications.filter((a) => ['SUBMITTED', 'UNDER_SCREENING'].includes(a.state))
  const toSchedule = applications.filter((a) => ['SHORTLISTED', 'INTERVIEW_SCHEDULED'].includes(a.state))
  const toOffer = applications.filter(
    (a) => (a.state === 'PENDING_APPROVAL' && a.approval?.decision === 'APPROVED') || a.state === 'OFFER_SENT' || a.state === 'ONBOARDING'
  )
  const offerHint = (a) => (a.state === 'OFFER_SENT' ? 'awaiting response' : a.state === 'ONBOARDING' ? 'collect documents' : 'approved: send offer')

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={Users} label="Open applications" value={open.length} to="/candidates" />
        <StatCard icon={ClipboardCheck} label="Awaiting screening" value={toScreen.length} to="/candidates" />
        <StatCard icon={CalendarClock} label="Interviews to run" value={toSchedule.length} to="/interviews" />
        <StatCard icon={Briefcase} label="Offers & onboarding" value={toOffer.length} to="/candidates" />
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <ActionList title="Needs screening" items={toRows(toScreen, (a) => `applied ${fmtDate(a.appliedAt)}`)} empty="Nothing waiting for screening." onOpen={onOpen} to="/candidates" toLabel="All candidates" />
        <ActionList title="Offers & onboarding" items={toRows(toOffer, offerHint)} empty="No offers in progress." onOpen={onOpen} />
      </div>
    </div>
  )
}
