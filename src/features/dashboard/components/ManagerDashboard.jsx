import { ClipboardCheck, Users } from 'lucide-react'
import { CLOSED_STATES } from '@/shared/constants/states'
import { toRows } from '../lib/rows'
import StatCard from './StatCard'
import ActionList from './ActionList'

export default function ManagerDashboard({ applications, onOpen }) {
  const open = applications.filter((a) => !CLOSED_STATES.includes(a.state))
  const awaiting = applications.filter((a) => a.state === 'PENDING_APPROVAL' && !a.approval)
  const onboarding = applications.filter((a) => a.state === 'ONBOARDING' && !a.onboarding?.confirmations.Department)

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={ClipboardCheck} label="Awaiting your approval" value={awaiting.length} to="/candidates" />
        <StatCard icon={Users} label="Open applications" value={open.length} to="/candidates" />
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <ActionList title="Awaiting your decision" items={toRows(awaiting, () => 'review scores and decide')} empty="No candidates waiting on you." onOpen={onOpen} to="/candidates" toLabel="All candidates" />
        <ActionList title="Department confirmation needed" items={toRows(onboarding, () => 'confirm onboarding')} empty="Nothing to confirm." onOpen={onOpen} />
      </div>
    </div>
  )
}
