import { LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthContext'
import { ROLE_LABELS } from '@/shared/constants/roles'
import Logo from '@/shared/brand/Logo'
import Brand from './Brand'
import { navItems } from './navigation'

const iconButton =
  'flex items-center justify-center rounded-lg text-ers-sidebar-fg/70 transition-colors hover:bg-ers-sidebar-fg/10 hover:text-ers-sidebar-fg'

// `rail` = icon-only desktop state. The mobile drawer always renders it expanded.
export default function Sidebar({ rail = false, onToggle, onNavigate }) {
  const { user, logout } = useAuth()
  const { pathname } = useLocation()
  const items = navItems.filter((item) => user && item.roles.includes(user.role))

  return (
    <div className="flex h-full flex-col">
      <div className={`flex ${rail ? 'flex-col items-center gap-3 px-2 py-5' : 'items-center justify-between px-5 py-6'}`}>
        {rail ? <Logo variant="icon" tone="light" className="h-9" /> : <Brand />}
        {onToggle && (
          <button
            onClick={onToggle}
            aria-label={rail ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!rail}
            aria-controls="app-sidebar"
            title={rail ? 'Expand sidebar' : undefined}
            className={`${iconButton} ${rail ? 'h-10 w-10' : 'hidden h-9 w-9 md:flex'}`}
          >
            {rail ? <PanelLeftOpen size={18} aria-hidden="true" /> : <PanelLeftClose size={18} aria-hidden="true" />}
          </button>
        )}
      </div>

      <nav aria-label="Main" className={`flex-1 space-y-1 ${rail ? 'px-2' : 'px-3'}`}>
        {items.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link
              key={label}
              to={href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              title={rail ? label : undefined}
              className={`
                flex min-h-10 w-full items-center rounded-lg text-sm font-medium transition-colors duration-150
                ${rail ? 'justify-center' : 'gap-3 px-3'}
                ${active
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
            aria-label="Log out"
            className={`${iconButton} h-10 w-10 shrink-0`}
          >
            <LogOut size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
