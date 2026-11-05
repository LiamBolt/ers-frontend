import { Navigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { homeRoute } from '../lib/homeRoute'

// Wraps /login and /register: once a session exists, send the user to their
// home (keeping a chosen ?job=). This is the single place that redirects after
// sign-in, so it cannot race with the forms.
export default function RedirectIfAuthenticated({ children }) {
  const { user } = useAuth()
  const [params] = useSearchParams()
  if (user) return <Navigate to={homeRoute(user, params.get('job'))} replace />
  return children
}
