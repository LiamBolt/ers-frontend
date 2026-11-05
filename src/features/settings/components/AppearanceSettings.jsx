import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/shared/theme/ThemeContext'
import ThemeOption from './ThemeOption'

const OPTIONS = [
  { value: 'light', label: 'Light', description: 'Bright surfaces, best in daylight', icon: Sun },
  { value: 'dark', label: 'Dark', description: 'Dim surfaces, easier on the eyes at night', icon: Moon },
]

export default function AppearanceSettings() {
  const { theme, setTheme } = useTheme()

  // Radio-group keyboard behaviour: arrows move and select.
  const onKeyDown = (e) => {
    const i = OPTIONS.findIndex((o) => o.value === theme)
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]
    if (!step) return
    e.preventDefault()
    const next = OPTIONS[(i + step + OPTIONS.length) % OPTIONS.length]
    setTheme(next.value)
    e.currentTarget.parentElement.querySelector(`[data-value="${next.value}"]`)?.focus()
  }

  return (
    <section aria-labelledby="appearance-heading">
      <h2 id="appearance-heading" className="text-h3 text-ers-ink">Appearance</h2>
      <p className="mb-4 mt-1 text-sm text-ers-ink-soft">Choose a theme. It is saved on this device.</p>
      <div role="radiogroup" aria-labelledby="appearance-heading" className="grid gap-4 sm:grid-cols-2">
        {OPTIONS.map((o) => (
          <div key={o.value} data-value={o.value}>
            <ThemeOption {...o} selected={theme === o.value} onSelect={setTheme} onKeyDown={onKeyDown} />
          </div>
        ))}
      </div>
    </section>
  )
}
