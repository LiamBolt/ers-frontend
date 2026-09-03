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
      className="flex rounded-xl bg-ers-ink/5 p-1 gap-1 overflow-x-auto"
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
            flex-1 whitespace-nowrap px-3 py-2 text-xs font-semibold rounded-lg transition-colors
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ers-primary
            ${value === opt.value ? 'bg-white text-ers-primary shadow-sm' : 'text-ers-ink-soft hover:text-ers-ink'}
          `}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}