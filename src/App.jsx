import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

import LoginPage from './pages/LoginPage'
import VacancyCreationPage from './pages/VacancyCreationPage'
import CandidateApplicationPage from './pages/CandidateApplicationPage'
import NotFoundPage from './pages/NotFoundPage'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './components/layout/AppLayout'
import { HardHat } from 'lucide-react'

function DashboardPlaceholder() {
  const { user } = useAuth()
  return (
    <AppLayout title="Dashboard" subtitle={`Welcome back, ${user?.name || 'User'}`}>
      <div className="glass-panel p-8 text-center text-ers-ink-soft flex flex-col items-center">
        <div className="w-16 h-16 bg-ers-primary/10 text-ers-primary rounded-full flex items-center justify-center mb-4 border border-ers-primary/20">
          <HardHat size={32} />
        </div>
        <p>This is your dashboard. Additional features will be added here in the future.</p>
      </div>
    </AppLayout>
  )
}

function PlaceholderPage({ title }) {
  return (
    <AppLayout title={title} subtitle="Under Construction">
      <div className="glass-panel p-8 text-center text-ers-ink-soft flex flex-col items-center">
        <div className="w-16 h-16 bg-ers-primary/10 text-ers-primary rounded-full flex items-center justify-center mb-4 border border-ers-primary/20">
          <HardHat size={32} />
        </div>
        <p>This page is currently under construction.</p>
      </div>
    </AppLayout>
  )
}

function AppRoutes() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ers-bg flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-ers-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/login" 
        element={user ? <Navigate to="/" replace /> : <LoginPage />} 
      />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        {/* Dashboard available to all logged in users */}
        <Route path="/" element={<DashboardPlaceholder />} />
        
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
          <Route path="/candidates" element={<PlaceholderPage title="Candidates List" />} />
          <Route path="/interviews" element={<PlaceholderPage title="Interviews" />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['MANAGER', 'ADMIN']} />}>
          <Route path="/reports" element={<PlaceholderPage title="Reports" />} />
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