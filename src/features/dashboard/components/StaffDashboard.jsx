import { LoadingRows } from '@/shared/ui/Skeleton'
import { useApplications } from '@/features/applications/hooks'
import HrDashboard from './HrDashboard'
import PanelDashboard from './PanelDashboard'
import ManagerDashboard from './ManagerDashboard'
import AdminDashboard from './AdminDashboard'

const BY_ROLE = {
  HR_OFFICER: HrDashboard,
  INTERVIEWER: PanelDashboard,
  MANAGER: ManagerDashboard,
  ADMIN: AdminDashboard,
}

// Loads the applications this role may see and hands them to its dashboard.
export default function StaffDashboard({ role, onOpen }) {
  const { data: applications = [], isLoading } = useApplications()
  if (isLoading) return <LoadingRows rows={3} rowClassName="h-24" />
  const Dashboard = BY_ROLE[role] ?? AdminDashboard
  return <Dashboard applications={applications} onOpen={onOpen} />
}
