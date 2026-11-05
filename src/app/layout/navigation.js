import {
  LayoutDashboard, FilePlus, Briefcase, Users, CalendarClock, BarChart3, UserCog, Settings,
} from 'lucide-react'

const ALL = ['CANDIDATE', 'HR_OFFICER', 'INTERVIEWER', 'MANAGER', 'ADMIN']
const STAFF = ['HR_OFFICER', 'INTERVIEWER', 'MANAGER', 'ADMIN']

// The sidebar menu. Each entry lists the roles that see it; the server still
// enforces access (see ProtectedRoute and the API role checks).
export const navItems = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard, roles: ALL },
  { label: 'My Application', href: '/candidate', icon: FilePlus, roles: ['CANDIDATE'] },
  { label: 'Create Vacancy', href: '/vacancy', icon: Briefcase, roles: ['HR_OFFICER', 'ADMIN'] },
  { label: 'Candidates', href: '/candidates', icon: Users, roles: STAFF },
  { label: 'Interviews', href: '/interviews', icon: CalendarClock, roles: STAFF },
  { label: 'Reports', href: '/reports', icon: BarChart3, roles: ['MANAGER', 'ADMIN'] },
  { label: 'Users', href: '/users', icon: UserCog, roles: ['ADMIN'] },
  { label: 'Settings', href: '/settings', icon: Settings, roles: ALL },
]
