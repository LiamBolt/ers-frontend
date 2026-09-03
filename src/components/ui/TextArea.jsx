import { forwardRef } from 'react'
import { AlertCircle } from 'lucide-react'

const TextArea = forwardRef(function TextArea(
  { label, error, hint, required, id, className = '', ...props },
  ref
) {
  const areaId = id || props.name
  const errorId = `${areaId}-error`
  const hintId = `${areaId}-hint`

  return (
    <div className="space-y-1.5">
      <label htmlFor={areaId} className="block text-sm font-semibold text-ers-ink">
        {label}
        {required && <span className="text-ers-danger ml-0.5">*</span>}
      </label>
      <textarea
        ref={ref}
        id={areaId}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={`${error ? errorId : ''} ${hint ? hintId : ''}`.trim()}
        className={`
          w-full rounded-lg border bg-white/85 px-3 py-2 text-sm text-ers-ink
          placeholder:text-ers-ink-soft/50
          focus:outline-none focus:ring-2 focus:ring-ers-primary/30 focus:border-ers-primary
          ${error ? 'border-ers-danger focus:border-ers-danger focus:ring-ers-danger/20' : 'border-ers-line'}
          ${className}
        `}
        {...props}
      />
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

export default TextArea