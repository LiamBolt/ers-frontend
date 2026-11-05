import { useId, useMemo } from 'react'
import { logoMarkup } from './logoSvg'

// The ERS logo, coloured from the theme tokens.
//   variant "full"  mark + RECRUIT wordmark (auth pages)
//   variant "mark"  mark only (sidebar, small spaces)
//   variant "icon"  chair-in-lens only, near-square (collapsed sidebar)
//   tone    "dark"  for light backgrounds, "light" for the dark sidebar
// Size it with a height class on the component, e.g. <Logo className="h-20" />.
export default function Logo({ variant = 'full', tone = 'dark', className = 'h-20' }) {
  const id = `ers-logo-${useId().replace(/:/g, '')}`
  const markup = useMemo(
    () =>
      logoMarkup({
        wordmark: variant === 'full',
        icon: variant === 'icon',
        orange: 'rgb(var(--ers-primary-rgb))',
        ink: tone === 'light' ? 'rgb(var(--ers-sidebar-fg-rgb))' : 'rgb(var(--ers-ink-rgb))',
        id,
        className: 'h-full w-auto',
      }),
    [variant, tone, id]
  )
  return <span className={`inline-flex ${className}`} dangerouslySetInnerHTML={{ __html: markup }} />
}
