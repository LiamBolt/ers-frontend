import { Link } from 'react-router-dom'
import Logo from '../brand/Logo'
import { buttonClass } from '../ui/Button'

// Sits on top of the hero photo (transparent), so the header and image read as one.
export default function LandingHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5 rounded-lg" aria-label="ERS Recruit home">
          <Logo variant="mark" tone="light" className="h-9" />
          <span className="text-lg font-semibold text-ers-sidebar-fg">ERS Recruit</span>
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-2 sm:gap-3">
          <a href="#positions" className="hidden rounded-lg px-3 py-2 text-sm font-medium text-ers-sidebar-fg/85 transition-colors hover:text-ers-sidebar-fg sm:block">
            Open positions
          </a>
          <Link to="/login" className={buttonClass('inverse', 'sm')}>Sign in</Link>
          <Link to="/register" className={buttonClass('primary', 'sm')}>Create account</Link>
        </nav>
      </div>
    </header>
  )
}
