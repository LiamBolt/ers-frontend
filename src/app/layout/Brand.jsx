import Logo from '@/shared/brand/Logo'

export default function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <Logo variant="mark" tone="light" className="h-8" />
      <span className="text-lg font-semibold text-ers-sidebar-fg">ERS</span>
    </div>
  )
}
