import { Link } from 'react-router-dom'
import Logo from '../brand/Logo'

// Standard dark footer: brand, a short line, quick links, and a legal bar.
export default function LandingFooter() {
  return (
    <footer className="bg-ers-sidebar text-ers-sidebar-fg">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <Logo variant="mark" tone="light" className="h-9" />
            <span className="text-lg font-semibold">ERS Recruit</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-ers-sidebar-fg/70">
            Connecting candidates with open positions, and following every application from submission to offer.
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="text-label uppercase tracking-wide text-ers-sidebar-fg/60">Explore</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><a href="#positions" className="text-ers-sidebar-fg/85 transition-colors hover:text-ers-sidebar-fg">Open positions</a></li>
            <li><Link to="/register" className="text-ers-sidebar-fg/85 transition-colors hover:text-ers-sidebar-fg">Create account</Link></li>
            <li><Link to="/login" className="text-ers-sidebar-fg/85 transition-colors hover:text-ers-sidebar-fg">Sign in</Link></li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-ers-sidebar-fg/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-center text-caption text-ers-sidebar-fg/60 sm:px-6 lg:px-8">
          &copy; {new Date().getFullYear()} ERS Recruit. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
