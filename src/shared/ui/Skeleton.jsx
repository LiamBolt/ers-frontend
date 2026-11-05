// Placeholder that holds the shape of content while it loads.
export function Skeleton({ className = '' }) {
  return <div aria-hidden="true" className={`animate-skeleton rounded-lg bg-ers-ink/10 ${className}`} />
}

// A column of rows, announced once to assistive tech.
export function LoadingRows({ rows = 4, rowClassName = 'h-14' }) {
  return (
    <div role="status" aria-live="polite" aria-label="Loading" className="space-y-3">
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} className={rowClassName} />
      ))}
    </div>
  )
}
