import { useState } from 'react'
import { Menu, X, User, LogOut } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { label: 'Dashboard', href: '/', icon: null, roles: ['CANDIDATE', 'HR_OFFICER', 'INTERVIEWER', 'MANAGER', 'ADMIN'] },
  { label: 'My Application', href: '/candidate', icon: null, roles: ['CANDIDATE'] },
  { label: 'Create Vacancy', href: '/vacancy', icon: null, roles: ['HR_OFFICER', 'ADMIN'] },
  { label: 'Candidates', href: '/candidates', icon: null, roles: ['HR_OFFICER', 'INTERVIEWER', 'MANAGER', 'ADMIN'] },
  { label: 'Interviews', href: '/interviews', icon: null, roles: ['HR_OFFICER', 'INTERVIEWER', 'MANAGER', 'ADMIN'] },
  { label: 'Reports', href: '/reports', icon: null, roles: ['MANAGER', 'ADMIN'] },
]

export default function AppLayout({ title, subtitle, children }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()

  // Filter items based on user role
  const allowedNavItems = navItems.filter(item => 
    !item.roles || (user && item.roles.includes(user.role))
  )

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="px-5 py-6 flex items-center gap-2">
        <img src="/logo.jpeg" alt="ERS Logo" className="w-8 h-8 rounded-lg object-cover shadow-sm" />
        <span className="text-white font-semibold text-lg">ERS</span>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {allowedNavItems.map((item) => {
          const isActive = location.pathname === item.href || 
                           (item.href !== '/' && location.pathname.startsWith(item.href))
          return (
            <Link
              key={item.label}
              to={item.href}
              onClick={() => setDrawerOpen(false)}
              className={`
                w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium
                transition-colors
                ${isActive
                  ? 'text-ers-primary border-l-2 border-ers-primary bg-ers-primary/10'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'}
              `}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <User size={18} />
            <div className="flex flex-col">
              <span className="font-medium">{user?.name || 'User'}</span>
              <span className="text-xs text-gray-500">{user?.role?.replace('_', ' ')}</span>
            </div>
          </div>
          <button 
            onClick={logout}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
            aria-label="Log out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-ers-bg">
      <div className="bg-blobs" aria-hidden="true" />
      {/* Mobile top bar */}
      <div className="md:hidden bg-ers-ink text-white p-4 flex items-center justify-between fixed top-0 left-0 right-0 z-40">
        <div className="flex items-center gap-2">
          <img src="/logo.jpeg" alt="ERS Logo" className="w-8 h-8 rounded-lg object-cover shadow-sm" />
          <span className="font-semibold">ERS</span>
        </div>
        <button
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="p-1 rounded-lg hover:bg-white/10"
          aria-label="Toggle navigation"
        >
          {drawerOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/40 backdrop-blur-sm" onClick={() => setDrawerOpen(false)}>
          <div
            className="w-64 h-full bg-ers-ink shadow-xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-ers-ink z-20 flex-col">
        {sidebarContent}
      </aside>
      {/* Main content */}
      <main className="md:pl-64 pt-16 md:pt-0 relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10">
          <div className="glass-panel p-6 sm:p-8">
            {title && <h1 className="text-display text-ers-ink mb-1">{title}</h1>}
            {subtitle && <p className="text-ers-ink-soft mb-6">{subtitle}</p>}
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}