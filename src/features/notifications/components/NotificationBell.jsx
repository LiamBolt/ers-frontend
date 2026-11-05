import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, CheckCheck } from 'lucide-react'
import { fmtDateTime } from '@/shared/lib/format'
import { useMarkAllRead, useMarkRead, useNotificationCount, useNotifications } from '../hooks'

// Bell with an unread count; opens the latest notifications. Used in every dashboard header.
export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()
  const { data: count } = useNotificationCount()
  const { data: items = [], isLoading } = useNotifications(open)
  const markRead = useMarkRead()
  const markAll = useMarkAllRead()
  const unread = count?.unread ?? 0

  useEffect(() => {
    if (!open) return undefined
    const onDown = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const openItem = (n) => {
    if (!n.readAt) markRead.mutate(n.id)
    setOpen(false)
    if (n.link) navigate(n.link)
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'}
        aria-expanded={open}
        className="relative flex size-10 items-center justify-center rounded-lg border border-ers-line text-ers-ink transition-[background-color,transform] duration-150 hover:bg-ers-ink/5 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ers-primary [@media(pointer:coarse)]:size-11"
      >
        <Bell size={18} aria-hidden="true" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-ers-primary px-1 text-center text-[11px] font-semibold leading-5 text-ers-primary-ink tabular-nums">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-2 w-[min(22rem,calc(100vw-2rem))] rounded-xl border border-ers-line bg-ers-surface shadow-pop">
          <div className="flex items-center justify-between border-b border-ers-line px-4 py-3">
            <p className="text-sm font-semibold text-ers-ink">Notifications</p>
            <button
              type="button"
              disabled={!unread}
              onClick={() => markAll.mutate()}
              className="flex items-center gap-1 text-xs font-semibold text-ers-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckCheck size={14} aria-hidden="true" /> Mark all read
            </button>
          </div>
          <ul className="max-h-96 overflow-y-auto">
            {isLoading && <li className="px-4 py-6 text-sm text-ers-ink-soft">Loading…</li>}
            {!isLoading && items.length === 0 && (
              <li className="px-4 py-6 text-sm text-ers-ink-soft">Nothing yet. Updates on your applications will appear here.</li>
            )}
            {items.map((n) => (
              <li key={n.id} className="border-b border-ers-line last:border-0">
                <button
                  type="button"
                  onClick={() => openItem(n)}
                  className="flex w-full gap-3 px-4 py-3 text-left transition-colors duration-150 hover:bg-ers-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ers-primary"
                >
                  <span aria-hidden="true" className={`mt-1.5 size-2 shrink-0 rounded-full ${n.readAt ? 'bg-transparent' : 'bg-ers-primary'}`} />
                  <span className="min-w-0">
                    <span className={`block text-sm ${n.readAt ? 'text-ers-ink-soft' : 'font-semibold text-ers-ink'}`}>{n.message}</span>
                    <span className="block text-caption text-ers-muted">{fmtDateTime(n.sentAt)}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
