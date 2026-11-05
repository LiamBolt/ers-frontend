import { forwardRef } from 'react'
import { Search } from 'lucide-react'

// Same control vocabulary as Input (border contrast, focus ring, states) plus a leading icon.
const SearchInput = forwardRef(function SearchInput({ label = 'Search', id = 'search', className = '', ...props }, ref) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label htmlFor={id} className="block text-sm font-semibold text-ers-ink">{label}</label>
      <div className="relative">
        <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ers-muted" />
        <input
          ref={ref}
          id={id}
          type="search"
          autoComplete="off"
          spellCheck={false}
          className="w-full rounded-lg border border-ers-muted/70 bg-ers-surface py-2 pl-9 pr-3 text-sm text-ers-ink placeholder:text-ers-muted transition-colors duration-150 hover:border-ers-muted focus:border-ers-primary focus:outline-none focus:ring-2 focus:ring-ers-primary/30"
          {...props}
        />
      </div>
    </div>
  )
})

export default SearchInput
