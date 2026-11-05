import { Check } from 'lucide-react'

// One selectable theme. The preview carries its own data-theme so it shows that
// theme's real tokens even while the other theme is active.
export default function ThemeOption({ value, label, description, icon: Icon, selected, onSelect, onKeyDown }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      tabIndex={selected ? 0 : -1}
      onClick={() => onSelect(value)}
      onKeyDown={onKeyDown}
      className={`
        group w-full rounded-xl border p-3 text-left transition-colors duration-150
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ers-primary focus-visible:ring-offset-2 focus-visible:ring-offset-ers-surface
        ${selected ? 'border-ers-primary bg-ers-primary/5' : 'border-ers-muted/50 hover:border-ers-muted'}
      `}
    >
      <div data-theme={value} aria-hidden="true" className="overflow-hidden rounded-lg border border-ers-line bg-ers-surface">
        <div className="flex h-24">
          <div className="w-1/4 bg-ers-sidebar p-2">
            <div className="mb-1.5 h-1.5 w-3/4 rounded-full bg-ers-sidebar-fg/60" />
            <div className="mb-1.5 h-1.5 w-1/2 rounded-full bg-ers-sidebar-fg/30" />
            <div className="h-1.5 w-2/3 rounded-full bg-ers-sidebar-fg/30" />
          </div>
          <div className="flex-1 space-y-2 p-3">
            <div className="h-2 w-1/3 rounded-full bg-ers-ink" />
            <div className="h-1.5 w-2/3 rounded-full bg-ers-muted/60" />
            <div className="flex gap-1.5 pt-1">
              <div className="h-5 w-12 rounded bg-ers-primary" />
              <div className="h-5 w-8 rounded border border-ers-muted/60" />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Icon size={18} aria-hidden="true" className="text-ers-ink-soft" />
          <div>
            <p className="text-sm font-semibold text-ers-ink">{label}</p>
            <p className="text-caption text-ers-ink-soft">{description}</p>
          </div>
        </div>
        {selected && (
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ers-primary text-ers-primary-ink">
            <Check size={14} aria-hidden="true" />
          </span>
        )}
      </div>
    </button>
  )
}
