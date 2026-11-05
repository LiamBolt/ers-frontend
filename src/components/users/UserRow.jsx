import { useState } from 'react'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { ROLE_LABELS } from '../../data/recruitment'
import { fmtDate } from '../../utils/format'

const ROLES = ['CANDIDATE', 'HR_OFFICER', 'INTERVIEWER', 'MANAGER', 'ADMIN']

// One account. You cannot change your own role or deactivate yourself (the
// server refuses it too). Deactivating needs a second click instead of a dialog.
export default function UserRow({ user, isSelf, busy, onChange }) {
  const [confirming, setConfirming] = useState(false)
  const active = user.status === 'ACTIVE'

  return (
    <tr>
      <td className="px-4 py-3">
        <p className="font-semibold text-ers-ink">{user.name}{isSelf && <span className="text-ers-ink-soft font-normal"> (you)</span>}</p>
        <p className="text-caption text-ers-ink-soft">{user.email}</p>
      </td>
      <td className="px-4 py-3">
        {isSelf ? (
          <Badge variant="primary">{ROLE_LABELS[user.role]}</Badge>
        ) : (
          <select
            aria-label={`Role for ${user.name}`}
            value={user.role}
            disabled={busy}
            onChange={(e) => onChange({ role: e.target.value })}
            className="min-h-9 rounded-lg border border-ers-muted/70 bg-ers-surface px-2 text-sm text-ers-ink transition-colors hover:border-ers-muted focus:border-ers-primary focus:outline-none focus:ring-2 focus:ring-ers-primary/30 disabled:cursor-not-allowed disabled:opacity-60 [@media(pointer:coarse)]:min-h-11"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>{ROLE_LABELS[r]}</option>
            ))}
          </select>
        )}
      </td>
      <td className="px-4 py-3">
        <Badge variant={active ? 'success' : 'danger'}>{active ? 'Active' : 'Deactivated'}</Badge>
      </td>
      <td className="px-4 py-3 hidden md:table-cell text-ers-ink-soft">{fmtDate(user.createdAt)}</td>
      <td className="px-4 py-3 text-right">
        {isSelf ? null : active ? (
          confirming ? (
            <span className="inline-flex gap-2">
              <Button size="sm" isLoading={busy} onClick={() => { onChange({ status: 'DEACTIVATED' }); setConfirming(false) }}>
                Confirm
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>Cancel</Button>
            </span>
          ) : (
            <Button variant="danger" size="sm" onClick={() => setConfirming(true)}>
              Deactivate
            </Button>
          )
        ) : (
          <Button variant="secondary" size="sm" isLoading={busy} onClick={() => onChange({ status: 'ACTIVE' })}>
            Reactivate
          </Button>
        )}
      </td>
    </tr>
  )
}
