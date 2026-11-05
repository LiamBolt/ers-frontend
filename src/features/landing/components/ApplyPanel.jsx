import { Link } from 'react-router-dom'
import { buttonClass } from '@/shared/ui/Button'
import { useAuth } from '@/features/auth/AuthContext'

// The call to action beside a posting. Visitors register first; signed-in
// candidates go straight to the application; staff cannot apply.
export default function ApplyPanel({ job }) {
  const { user } = useAuth()
  const staff = user && user.role !== 'CANDIDATE'

  return (
    <aside className="h-fit rounded-xl border border-ers-line bg-ers-surface p-5 shadow-card lg:sticky lg:top-24" aria-label="Apply for this role">
      <h2 className="text-h3 text-ers-ink">Apply for this role</h2>
      {staff ? (
        <p className="mt-2 text-sm text-ers-ink-soft">You are signed in as staff. Candidates apply from this page.</p>
      ) : (
        <>
          <p className="mt-2 text-sm text-ers-ink-soft">
            {user ? 'Your details are ready. Continue to the application form.' : 'Create a free account first, then complete your application.'}
          </p>
          <Link
            to={user ? `/candidate?job=${job.id}` : `/register?job=${job.id}`}
            className={buttonClass('primary', 'md', 'mt-4 w-full')}
          >
            {user ? 'Continue to application' : 'Create account to apply'}
          </Link>
          {!user && (
            <p className="mt-3 text-center text-sm text-ers-ink-soft">
              Already registered?{' '}
              <Link to={`/login?job=${job.id}`} className="font-semibold text-ers-primary hover:underline">Sign in</Link>
            </p>
          )}
        </>
      )}
    </aside>
  )
}
