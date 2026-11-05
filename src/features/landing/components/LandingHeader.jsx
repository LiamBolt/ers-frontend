import { Link } from 'react-router-dom'
import Logo from '@/shared/brand/Logo'
import { buttonClass } from '@/shared/ui/Button'

// Two looks for the public site header:
//  - overlay (default): transparent, sits on top of the home page hero photo
//  - solid: a normal white bar with a border, for inner pages such as a job page
export default function LandingHeader({ solid = false }) {
  const ink = solid ? 'text-ers-ink' : 'text-ers-sidebar-fg'
  return (
    <header className={solid ? 'sticky top-0 z-30 border-b border-ers-line bg-ers-surface/95 backdrop-blur-sm' : 'absolute inset-x-0 top-0 z-20'}>
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5 rounded-lg" aria-label="ERS Recruit home">
          <Logo variant="mark" tone={solid ? 'dark' : 'light'} className="h-9" />
          <span className={`text-lg font-semibold ${ink}`}>ERS Recruit</span>
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-2 sm:gap-3">
          <Link to="/#positions" className={`hidden rounded-lg px-3 py-2 text-sm font-medium transition-colors sm:block ${solid ? 'text-ers-ink-soft hover:text-ers-ink' : 'text-ers-sidebar-fg/85 hover:text-ers-sidebar-fg'}`}>
            Open positions
          </Link>
          <Link to="/login" className={buttonClass(solid ? 'secondary' : 'inverse', 'sm')}>Sign in</Link>
          <Link to="/register" className={buttonClass('primary', 'sm')}>Create account</Link>
        </nav>
      </div>
    </header>
  )
}
