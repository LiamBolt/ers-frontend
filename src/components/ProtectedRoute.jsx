import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ allowedRoles }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ers-bg flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-ers-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Role not authorized, go to dashboard base path or show 404
    // We'll just go back to the root of their access
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
