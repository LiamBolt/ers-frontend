import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/features/auth/AuthContext'

import LoginPage from '@/features/auth/pages/LoginPage'
import VacancyCreationPage from '@/features/vacancies/pages/VacancyCreationPage'
import CandidateApplicationPage from '@/features/applications/pages/CandidateApplicationPage'
import NotFoundPage from './NotFoundPage'
import RegisterPage from '@/features/auth/pages/RegisterPage'
import ProtectedRoute from '@/features/auth/ProtectedRoute'
import DashboardPage from '@/features/dashboard/pages/DashboardPage'
import CandidatesPage from '@/features/applications/pages/CandidatesPage'
import InterviewsPage from '@/features/interviews/pages/InterviewsPage'
import ReportsPage from '@/features/reports/pages/ReportsPage'
import UsersPage from '@/features/users/pages/UsersPage'
import SettingsPage from '@/features/settings/pages/SettingsPage'
import LandingPage from '@/features/landing/pages/LandingPage'
import JobDetailPage from '@/features/landing/pages/JobDetailPage'
import RedirectIfAuthenticated from '@/features/auth/components/RedirectIfAuthenticated'

function AppRoutes() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ers-surface flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-ers-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<RedirectIfAuthenticated><LoginPage /></RedirectIfAuthenticated>} />
      <Route path="/register" element={<RedirectIfAuthenticated><RegisterPage /></RedirectIfAuthenticated>} />

      {/* Visitors see the landing page; signed-in users get their dashboard. */}
      <Route path="/" element={user ? <DashboardPage /> : <LandingPage />} />

      {/* A single vacancy, public so it can be shared and linked to. */}
      <Route path="/jobs/:id" element={<JobDetailPage />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        {/* Dashboard available to all logged in users */}
        <Route path="/settings" element={<SettingsPage />} />
        
        {/* Role-specific protected routes */}
        <Route element={<ProtectedRoute allowedRoles={['HR_OFFICER', 'ADMIN']} />}>
          <Route path="/vacancy" element={<VacancyCreationPage />} />
        </Route>
        
        {/* Candidate only route for application form */}
        <Route element={<ProtectedRoute allowedRoles={['CANDIDATE']} />}>
          <Route path="/candidate" element={<CandidateApplicationPage />} />
        </Route>
        
        {/* Management routes */}
        <Route element={<ProtectedRoute allowedRoles={['HR_OFFICER', 'INTERVIEWER', 'MANAGER', 'ADMIN']} />}>
          <Route path="/candidates" element={<CandidatesPage />} />
          <Route path="/interviews" element={<InterviewsPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/users" element={<UsersPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['MANAGER', 'ADMIN']} />}>
          <Route path="/reports" element={<ReportsPage />} />
        </Route>
      </Route>

      {/* Catch all 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  )
}