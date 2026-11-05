// Says what is missing and what to do about it, instead of a bare "nothing here".
export default function EmptyState({ icon: Icon, title, children, action }) {
  return (
    <div className="rounded-xl border border-dashed border-ers-line bg-ers-bg/40 px-6 py-10 text-center">
      {Icon && (
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-ers-primary/10 text-ers-primary">
          <Icon size={20} aria-hidden="true" />
        </div>
      )}
      <p className="text-h3 text-ers-ink">{title}</p>
      {children && <p className="mx-auto mt-1 max-w-md text-sm text-ers-ink-soft">{children}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  )
}
