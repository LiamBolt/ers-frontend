import { forwardRef } from 'react'
import { AlertCircle, ChevronDown } from 'lucide-react'

const Select = forwardRef(function Select(
  { label, error, hint, required, children, id, className = '', ...props },
  ref
) {
  const selectId = id || props.name
  const errorId = `${selectId}-error`
  const hintId = `${selectId}-hint`

  return (
    <div className="space-y-1.5">
      <label htmlFor={selectId} className="block text-sm font-semibold text-ers-ink">
        {label}
        {required && <span className="text-ers-danger ml-0.5">*</span>}
      </label>
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={`${error ? errorId : ''} ${hint ? hintId : ''}`.trim()}
          className={`
            w-full appearance-none rounded-lg border bg-white/85 px-3 py-2 pr-10 text-sm text-ers-ink
            focus:outline-none focus:ring-2 focus:ring-ers-primary/30 focus:border-ers-primary
            ${error ? 'border-ers-danger focus:border-ers-danger focus:ring-ers-danger/20' : 'border-ers-line'}
            ${className}
          `}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          size={18}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ers-ink-soft"
        />
      </div>
      {hint && !error && (
        <p id={hintId} className="text-xs text-ers-ink-soft">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={errorId}
          className="flex items-start gap-1 text-xs text-ers-danger animate-slide-down"
        >
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  )
})

export default Select