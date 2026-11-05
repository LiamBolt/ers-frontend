import { useDocumentTheme } from '@/shared/theme/ThemeContext'
import MobileNav from './MobileNav'
import Sidebar from './Sidebar'
import { useSidebarCollapsed } from './useSidebarCollapsed'

// The signed-in shell: sidebar (collapsible on desktop), mobile navigation, and a
// full-width content area with the page title. Every dashboard page uses this.
export default function AppLayout({ title, subtitle, children }) {
  const [collapsed, toggleCollapsed] = useSidebarCollapsed()
  useDocumentTheme() // dark mode exists only inside dashboards

  return (
    <div className="min-h-screen bg-ers-surface">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded-lg focus:bg-ers-surface focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ers-primary focus:shadow-pop"
      >
        Skip to content
      </a>

      <MobileNav />

      <aside
        id="app-sidebar"
        className={`fixed left-0 top-0 z-20 hidden h-screen flex-col bg-ers-sidebar transition-[width] duration-200 ease-out md:flex ${collapsed ? 'w-16' : 'w-64'}`}
      >
        <Sidebar rail={collapsed} onToggle={toggleCollapsed} />
      </aside>

      <main
        id="main"
        className={`relative min-h-screen bg-ers-surface pt-16 transition-[padding] duration-200 ease-out md:pt-0 ${collapsed ? 'md:pl-16' : 'md:pl-64'}`}
      >
        <div className="w-full px-4 py-8 sm:px-6 md:py-10 lg:px-8 xl:px-10">
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
