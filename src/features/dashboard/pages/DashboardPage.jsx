import { useState } from 'react'
import AppLayout from '@/app/layout/AppLayout'
import Badge from '@/shared/ui/Badge'
import { ROLE_LABELS } from '@/shared/constants/roles'
import { useAuth } from '@/features/auth/AuthContext'
import ApplicationPanel from '@/features/applications/components/ApplicationPanel'
import CandidateDashboard from '../components/CandidateDashboard'
import StaffDashboard from '../components/StaffDashboard'

// Role-specific home. Candidates see their own applications; staff see what needs them.
export default function DashboardPage() {
  const { user } = useAuth()
  const [openId, setOpenId] = useState(null)

  return (
    <AppLayout title="Dashboard" subtitle={`Welcome back, ${user?.name || 'User'}`}>
      <div className="mb-6">
        <Badge variant="primary">{ROLE_LABELS[user.role]}</Badge>
      </div>
      {user.role === 'CANDIDATE' ? <CandidateDashboard /> : <StaffDashboard role={user.role} onOpen={setOpenId} />}
      {openId && <ApplicationPanel appId={openId} onClose={() => setOpenId(null)} />}
    </AppLayout>
  )
}
