import { Loader2 } from 'lucide-react'
// import clsx from 'clsx' // optional, or use template literals

export default function Button({
  children,
  variant = 'primary',
  isLoading = false,
  className = '',
  ...props
}) {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:ring-ers-primary disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none'
  const variants = {
    primary: 'bg-ers-primary text-ers-primary-ink hover:-translate-y-0.5 hover:shadow-lg shadow-md',
    secondary:
      'bg-transparent text-ers-ink border border-ers-ink/20 hover:border-ers-ink/40 hover:bg-ers-ink/5',
    ghost: 'bg-transparent text-ers-ink hover:bg-ers-ink/5',
  }

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  )
}