import Badge from '@/shared/ui/Badge'
import { ROLE_LABELS } from '@/shared/constants/roles'

// Read-only for now; roles and access are managed by an administrator.
export default function AccountSummary({ user }) {
  const rows = [
    ['Name', user.name],
    ['Email', user.email],
    ['Role', <Badge key="role" variant="primary">{ROLE_LABELS[user.role]}</Badge>],
  ]
  return (
    <section aria-labelledby="account-heading">
      <h2 id="account-heading" className="text-h3 text-ers-ink">Account</h2>
      <p className="mb-4 mt-1 text-sm text-ers-ink-soft">Your sign-in details. Ask an administrator to change your role.</p>
      <dl className="divide-y divide-ers-line rounded-xl border border-ers-line">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 px-4 py-3">
            <dt className="text-sm text-ers-ink-soft">{label}</dt>
            <dd className="text-sm font-medium text-ers-ink">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
