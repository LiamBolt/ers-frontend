export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-ers-ink/10 text-ers-ink',
    primary: 'bg-ers-primary/10 text-ers-primary',
    success: 'bg-ers-accent/10 text-ers-accent',
    danger: 'bg-ers-danger/10 text-ers-danger',
    warning: 'bg-ers-warning/10 text-ers-warning',
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}