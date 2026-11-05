import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

import LoginPage from './pages/LoginPage'
import VacancyCreationPage from './pages/VacancyCreationPage'
import CandidateApplicationPage from './pages/CandidateApplicationPage'
import NotFoundPage from './pages/NotFoundPage'
import RegisterPage from './pages/RegisterPage'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardPage from './pages/DashboardPage'
import CandidatesPage from './pages/CandidatesPage'
import InterviewsPage from './pages/InterviewsPage'
import ReportsPage from './pages/ReportsPage'

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

      <Route
        path="/register"
        element={user ? <Navigate to="/" replace /> : <RegisterPage />}
      />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        {/* Dashboard available to all logged in users */}
        <Route path="/" element={<DashboardPage />} />
        
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