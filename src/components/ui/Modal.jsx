import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, subtitle, children }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-ers-ink/50 backdrop-blur-sm flex items-start sm:items-center justify-center p-0 sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="bg-ers-bg w-full sm:max-w-3xl max-h-screen sm:max-h-[90vh] overflow-y-auto sm:rounded-2xl shadow-xl animate-slide-down"
      >
        <div className="sticky top-0 z-10 bg-ers-bg/95 backdrop-blur border-b border-ers-line px-5 py-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-h3 text-ers-ink truncate">{title}</h2>
            {subtitle && <p className="text-caption text-ers-ink-soft">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ers-ink-soft hover:bg-ers-ink/5"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-5 space-y-6">{children}</div>
      </div>
    </div>
  )
}
