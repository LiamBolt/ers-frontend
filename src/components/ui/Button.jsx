import { Loader2 } from 'lucide-react'

const base =
  'inline-flex items-center justify-center gap-2 font-semibold rounded-lg select-none ' +
  'transition-[background-color,border-color,color,transform] duration-150 ease-out ' +
  'active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ers-primary focus-visible:ring-offset-2 focus-visible:ring-offset-ers-surface ' +
  'disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100'

const variants = {
  primary: 'bg-ers-primary text-ers-primary-ink shadow-card hover:bg-ers-primary-hover',
  secondary: 'bg-ers-surface text-ers-ink border border-ers-ink/20 hover:border-ers-ink/40 hover:bg-ers-ink/5',
  danger: 'bg-ers-surface text-ers-danger border border-ers-danger/40 hover:bg-ers-danger/10 hover:border-ers-danger',
  ghost: 'bg-transparent text-ers-ink hover:bg-ers-ink/5',
  // For use on dark photo or sidebar backgrounds.
  inverse: 'bg-transparent text-ers-sidebar-fg border border-ers-sidebar-fg/50 hover:bg-ers-sidebar-fg/10 hover:border-ers-sidebar-fg',
}

// 40px on desktop and 44px on touch devices for md; sm is 36px (44px on touch).
const sizes = {
  md: 'min-h-10 px-5 text-sm [@media(pointer:coarse)]:min-h-11',
  sm: 'min-h-9 px-3 text-xs [@media(pointer:coarse)]:min-h-11',
}

// Same look for non-button elements, e.g. <Link className={buttonClass('primary')}>.
export const buttonClass = (variant = 'primary', size = 'md', className = '') =>
  `${base} ${variants[variant]} ${sizes[size]} ${className}`

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={buttonClass(variant, size, className)}
      disabled={isLoading || props.disabled}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
      {children}
    </button>
  )
}
