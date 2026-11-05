import { useState } from 'react'
import {
  Menu, X, LogOut, LayoutDashboard, FilePlus, Briefcase, Users, CalendarClock, BarChart3, UserCog,
  Settings, PanelLeftClose, PanelLeftOpen,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useDocumentTheme } from '../../context/ThemeContext'
import { ROLE_LABELS } from '../../data/recruitment'
import Logo from '../brand/Logo'

const ALL = ['CANDIDATE', 'HR_OFFICER', 'INTERVIEWER', 'MANAGER', 'ADMIN']
const STAFF = ['HR_OFFICER', 'INTERVIEWER', 'MANAGER', 'ADMIN']

const navItems = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard, roles: ALL },
  { label: 'My Application', href: '/candidate', icon: FilePlus, roles: ['CANDIDATE'] },
  { label: 'Create Vacancy', href: '/vacancy', icon: Briefcase, roles: ['HR_OFFICER', 'ADMIN'] },
  { label: 'Candidates', href: '/candidates', icon: Users, roles: STAFF },
  { label: 'Interviews', href: '/interviews', icon: CalendarClock, roles: STAFF },
  { label: 'Reports', href: '/reports', icon: BarChart3, roles: ['MANAGER', 'ADMIN'] },
  { label: 'Users', href: '/users', icon: UserCog, roles: ['ADMIN'] },
  { label: 'Settings', href: '/settings', icon: Settings, roles: ALL },
]

const COLLAPSE_KEY = 'ers_sidebar'

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <Logo variant="mark" tone="light" className="h-8" />
      <span className="text-lg font-semibold text-ers-sidebar-fg">ERS</span>
    </div>
  )
}

export default function AppLayout({ title, subtitle, children }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(COLLAPSE_KEY) === 'collapsed'
    } catch {
      return false
    }
  })
  const { user, logout } = useAuth()
  const location = useLocation()
  useDocumentTheme() // dark mode exists only inside dashboards

  const allowedNavItems = navItems.filter((item) => user && item.roles.includes(user.role))

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      try {
        localStorage.setItem(COLLAPSE_KEY, c ? 'expanded' : 'collapsed')
      } catch {
        /* the choice just will not persist */
      }
      return !c
    })
  }

  // `rail` = the icon-only desktop state. The mobile drawer is always expanded.
  const renderSidebar = (rail) => (
    <div className="flex h-full flex-col">
      <div className={`flex ${rail ? 'flex-col items-center gap-3 px-2 py-5' : 'items-center justify-between px-5 py-6'}`}>
        {rail ? <Logo variant="icon" tone="light" className="h-9" /> : <Brand />}
        {!rail && (
          <button
            onClick={toggleCollapsed}
            aria-label="Collapse sidebar"
            aria-expanded="true"
            aria-controls="app-sidebar"
            className="hidden h-9 w-9 items-center justify-center rounded-lg text-ers-sidebar-fg/70 transition-colors hover:bg-ers-sidebar-fg/10 hover:text-ers-sidebar-fg md:flex"
          >
            <PanelLeftClose size={18} aria-hidden="true" />
          </button>
        )}
        {rail && (
          <button
            onClick={toggleCollapsed}
            aria-label="Expand sidebar"
            aria-expanded="false"
            aria-controls="app-sidebar"
            title="Expand sidebar"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-ers-sidebar-fg/70 transition-colors hover:bg-ers-sidebar-fg/10 hover:text-ers-sidebar-fg"
          >
            <PanelLeftOpen size={18} aria-hidden="true" />
          </button>
        )}
      </div>

      <nav aria-label="Main" className={`flex-1 space-y-1 ${rail ? 'px-2' : 'px-3'}`}>
        {allowedNavItems.map(({ label, href, icon: Icon }) => {
          const isActive = location.pathname === href || (href !== '/' && location.pathname.startsWith(href))
          return (
            <Link
              key={label}
              to={href}
              onClick={() => setDrawerOpen(false)}
              aria-current={isActive ? 'page' : undefined}
              title={rail ? label : undefined}
              className={`
                flex min-h-10 w-full items-center rounded-lg text-sm font-medium transition-colors duration-150
                ${rail ? 'justify-center' : 'gap-3 px-3'}
                ${isActive
                  ? 'bg-ers-sidebar-fg/10 text-ers-sidebar-fg'
                  : 'text-ers-sidebar-fg/70 hover:bg-ers-sidebar-fg/5 hover:text-ers-sidebar-fg'}
              `}
            >
              <Icon size={18} aria-hidden="true" />
              {rail ? <span className="sr-only">{label}</span> : label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-ers-sidebar-fg/10 p-3">
        <div className={`flex items-center ${rail ? 'justify-center' : 'justify-between gap-2 px-1'}`}>
          {!rail && (
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ers-sidebar-fg">{user?.name || 'User'}</p>
              <p className="truncate text-xs text-ers-sidebar-fg/60">{ROLE_LABELS[user?.role] ?? user?.role}</p>
            </div>
          )}
          <button
            onClick={logout}
            title={rail ? `Log out ${user?.name ?? ''}`.trim() : undefined}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-ers-sidebar-fg/70 transition-colors hover:bg-ers-sidebar-fg/10 hover:text-ers-sidebar-fg"
            aria-label="Log out"
          >
            <LogOut size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-ers-surface">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded-lg focus:bg-ers-surface focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ers-primary focus:shadow-pop"
      >
        Skip to content
      </a>

      {/* Mobile top bar */}
      <div className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between bg-ers-sidebar px-4 py-3 text-ers-sidebar-fg md:hidden">
        <Brand />
        <button
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-ers-sidebar-fg/10"
          aria-label={drawerOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={drawerOpen}
        >
          {drawerOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-30 bg-ers-scrim/50 md:hidden" onClick={() => setDrawerOpen(false)}>
          <div className="flex h-full w-64 flex-col bg-ers-sidebar pt-14 shadow-pop" onClick={(e) => e.stopPropagation()}>
            {renderSidebar(false)}
          </div>
        </div>
      )}

      {/* Desktop sidebar: full width or an icon rail */}
      <aside
        id="app-sidebar"
        className={`fixed left-0 top-0 z-20 hidden h-screen flex-col bg-ers-sidebar transition-[width] duration-200 ease-out md:flex ${collapsed ? 'w-16' : 'w-64'}`}
      >
        {renderSidebar(collapsed)}
      </aside>

      <main
        id="main"
        className={`relative min-h-screen bg-ers-surface pt-16 transition-[padding] duration-200 ease-out md:pt-0 ${collapsed ? 'md:pl-16' : 'md:pl-64'}`}
      >
        {/* Every dashboard page fills the whole content area. Lay wide forms out in
            columns instead of capping the width. */}
        <div className={`w-full px-4 py-8 sm:px-6 md:py-10 lg:px-8 xl:px-10`}>
          {(title || subtitle) && (
            <header className="mb-8">
              {title && <h1 className="text-display text-ers-ink">{title}</h1>}
              {subtitle && <p className="mt-1 text-ers-ink-soft">{subtitle}</p>}
            </header>
          )}
          {children}
        </div>
      </main>
    </div>
  )
}
