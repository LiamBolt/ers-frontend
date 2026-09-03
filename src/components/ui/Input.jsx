import { forwardRef } from 'react'
import { AlertCircle } from 'lucide-react'

const Input = forwardRef(function Input(
  { label, error, hint, required, id, className = '', endNode, ...props },
  ref
) {
  const inputId = id || props.name
  const errorId = `${inputId}-error`
  const hintId = `${inputId}-hint`

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="block text-sm font-semibold text-ers-ink">
        {label}
        {required && <span className="text-ers-danger ml-0.5">*</span>}
      </label>
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={`${error ? errorId : ''} ${hint ? hintId : ''}`.trim()}
          className={`
            w-full rounded-lg border px-3 py-2 text-sm text-ers-ink
            bg-white/85
            placeholder:text-ers-ink-soft/50
            focus:outline-none focus:ring-2 focus:ring-ers-primary/30 focus:border-ers-primary
            ${error ? 'border-ers-danger focus:border-ers-danger focus:ring-ers-danger/20' : 'border-ers-line'}
            ${className}
            ${props.endNode ? 'pr-10' : ''}
          `}
          {...props}
        />
        {props.endNode && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {props.endNode}
          </div>
        )}
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

export default Input