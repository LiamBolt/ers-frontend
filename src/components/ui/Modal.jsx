import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

// Moves focus into the dialog, traps Tab inside it, restores focus on close,
// closes on Escape or a backdrop click, and locks page scroll while open.
export default function Modal({ open, onClose, title, subtitle, children }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const previous = document.activeElement
    const dialog = dialogRef.current
    dialog?.focus()

    const focusable = () =>
      dialog
        ? [...dialog.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')]
        : []

    const onKey = (e) => {
      if (e.key === 'Escape') return onClose()
      if (e.key !== 'Tab') return
      const items = focusable()
      if (!items.length) return e.preventDefault()
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      previous?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-ers-scrim/50 p-0 sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="max-h-screen w-full overflow-y-auto overscroll-contain bg-ers-surface shadow-pop animate-slide-down focus:outline-none sm:max-h-[90vh] sm:max-w-3xl sm:rounded-2xl"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-ers-line bg-ers-surface/95 px-5 py-4 backdrop-blur-sm">
          <div className="min-w-0">
            <h2 className="truncate text-h3 text-ers-ink">{title}</h2>
            {subtitle && <p className="text-caption text-ers-ink-soft">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-ers-ink-soft transition-colors hover:bg-ers-ink/5 hover:text-ers-ink"
            aria-label="Close"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <div className="space-y-6 p-5">{children}</div>
      </div>
    </div>
  )
}
