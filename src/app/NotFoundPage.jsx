import { useAuth } from '@/features/auth/AuthContext'
import StatusPage from '@/shared/layout/StatusPage'
import { buttonClass } from '@/shared/ui/Button'

export default function NotFoundPage() {
  const { user } = useAuth()

  return (
    <StatusPage
      code="404"
      title="Page not found"
      actions={
        <>
          <a href="/" className={buttonClass('primary')}>{user ? 'Back to dashboard' : 'Go to home'}</a>
          <button type="button" onClick={() => window.history.back()} className={buttonClass('secondary')}>Go back</button>
        </>
      }
    >
      The page you are looking for does not exist or may have moved. Check the address, or head back and try again.
    </StatusPage>
  )
}
