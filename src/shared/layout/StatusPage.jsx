import Logo from '@/shared/brand/Logo'

// Full-page layout for "not found" and "something broke". Deliberately uses plain
// <a> links (no Router) so it can render from the global error boundary, and it is
// a public page, so it is always light.
export default function StatusPage({ code, icon: Icon, title, children, actions }) {
  return (
    <div className="flex min-h-screen flex-col bg-ers-surface">
      <header>
        <div className="mx-auto flex h-20 max-w-6xl items-center px-4 sm:px-6 lg:px-8">
          <a href="/" className="flex items-center gap-2.5 rounded-lg" aria-label="ERS Recruit home">
            <Logo variant="mark" className="h-9" />
            <span className="text-lg font-semibold text-ers-ink">ERS Recruit</span>
          </a>
        </div>
      </header>

      <main id="main" className="flex flex-1 items-center justify-center px-4 pb-24">
        <div className="max-w-md text-center">
          {code && <p className="text-8xl font-bold leading-none text-ers-primary tabular-nums">{code}</p>}
          {Icon && (
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ers-primary/10 text-ers-primary">
              <Icon size={30} aria-hidden="true" />
            </div>
          )}
          <h1 className="mt-6 text-h2 text-ers-ink">{title}</h1>
          <p className="mt-3 text-ers-ink-soft">{children}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">{actions}</div>
        </div>
      </main>
    </div>
  )
}
