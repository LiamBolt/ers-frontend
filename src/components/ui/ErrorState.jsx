import { AlertTriangle, RefreshCw, ServerCrash, ShieldAlert, WifiOff, Clock, SearchX } from 'lucide-react'
import Button from './Button'

const BY_KIND = {
  network: { icon: WifiOff, title: 'Can’t connect' },
  unavailable: { icon: Clock, title: 'Service is waking up' },
  server: { icon: ServerCrash, title: 'Something went wrong' },
  auth: { icon: ShieldAlert, title: 'Session expired' },
  permission: { icon: ShieldAlert, title: 'Access denied' },
  notfound: { icon: SearchX, title: 'Not found' },
  limit: { icon: Clock, title: 'Too many requests' },
  validation: { icon: AlertTriangle, title: 'We couldn’t complete that' },
  unknown: { icon: AlertTriangle, title: 'Something went wrong' },
}

// A calm, specific message for failed data loads, with a retry when one can help.
// `error` is an ApiError (or any Error); `onRetry` is usually the query's refetch.
export default function ErrorState({ error, onRetry, title, compact = false }) {
  const kind = error?.kind ?? 'unknown'
  const { icon: Icon, title: defaultTitle } = BY_KIND[kind] ?? BY_KIND.unknown
  const retryable = error?.retryable !== false && !!onRetry

  return (
    <div
      role="alert"
      className={`rounded-xl border border-ers-danger/30 bg-ers-danger/5 text-center ${compact ? 'px-4 py-5' : 'px-6 py-10'}`}
    >
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-ers-danger/10 text-ers-danger">
        <Icon size={20} aria-hidden="true" />
      </div>
      <p className="text-h3 text-ers-ink">{title ?? defaultTitle}</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-ers-ink-soft">{error?.message ?? 'Something unexpected happened. Please try again.'}</p>
      {retryable && (
        <div className="mt-4 flex justify-center">
          <Button variant="secondary" size="sm" onClick={onRetry}>
            <RefreshCw size={14} aria-hidden="true" /> Try again
          </Button>
        </div>
      )}
      {kind === 'auth' && (
        <div className="mt-4 flex justify-center">
          <a href="/login" className="text-sm font-semibold text-ers-primary hover:underline">Sign in</a>
        </div>
      )}
    </div>
  )
}
