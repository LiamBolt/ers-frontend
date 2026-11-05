import { useRef } from 'react'

export default function Tabs({ options, value, onChange, ariaLabel }) {
  const tabRefs = useRef([])

  const handleKeyDown = (e, index) => {
    const tabs = tabRefs.current
    let newIndex = index
    if (e.key === 'ArrowRight') {
      newIndex = (index + 1) % options.length
    } else if (e.key === 'ArrowLeft') {
      newIndex = (index - 1 + options.length) % options.length
    } else if (e.key === 'Home') {
      newIndex = 0
    } else if (e.key === 'End') {
      newIndex = options.length - 1
    } else {
      return
    }
    e.preventDefault()
    tabs[newIndex]?.focus()
    onChange(options[newIndex].value)
  }

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="flex gap-1 overflow-x-auto rounded-xl bg-ers-ink/5 p-1"
    >
      {options.map((opt, index) => (
        <button
          key={opt.value}
          ref={(el) => (tabRefs.current[index] = el)}
          role="tab"
          aria-selected={value === opt.value}
          tabIndex={value === opt.value ? 0 : -1}
          onClick={() => onChange(opt.value)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className={`
            min-h-9 flex-1 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition-colors duration-150
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ers-primary
            ${value === opt.value ? 'bg-ers-surface text-ers-primary shadow-card' : 'text-ers-ink-soft hover:bg-ers-surface/60 hover:text-ers-ink'}
          `}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}