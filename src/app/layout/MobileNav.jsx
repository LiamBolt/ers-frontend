import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Brand from './Brand'
import Sidebar from './Sidebar'

// Phone/tablet: a fixed top bar plus a slide-over drawer holding the full sidebar.
export default function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between bg-ers-sidebar px-4 py-3 text-ers-sidebar-fg md:hidden">
        <Brand />
        <button
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-ers-sidebar-fg/10"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          aria-expanded={open}
        >
          {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-30 bg-ers-scrim/50 md:hidden" onClick={() => setOpen(false)}>
          <div className="flex h-full w-64 flex-col bg-ers-sidebar pt-14 shadow-pop" onClick={(e) => e.stopPropagation()}>
            <Sidebar onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}
