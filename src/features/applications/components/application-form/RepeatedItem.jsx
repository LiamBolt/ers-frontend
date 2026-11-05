import { Plus, Trash2 } from 'lucide-react'

// The bordered card around one qualification / role / reference, with a remove button.
export function RepeatedItem({ onRemove, removeLabel, children }) {
  return (
    <div className="relative mb-3 rounded-xl border border-ers-line bg-ers-bg/40 p-4">
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute right-2 top-2 rounded-full p-1 text-ers-ink-soft hover:bg-ers-ink/5"
          aria-label={removeLabel}
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  )
}

export function AddItemButton({ onClick, children }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center gap-1 text-sm text-ers-primary hover:underline">
      <Plus size={16} /> {children}
    </button>
  )
}
