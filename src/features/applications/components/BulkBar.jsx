import { useState } from 'react'
import Button from '@/shared/ui/Button'
import TextArea from '@/shared/ui/TextArea'
import { STATE_LABELS } from '@/shared/constants/states'
import { findMove } from '../lib/moves'
import { useBulkMove } from '../hooks'

const BULK_MOVES = [
  { to: 'UNDER_SCREENING', label: 'Start screening' },
  { to: 'SHORTLISTED', label: 'Shortlist' },
  { to: 'REJECTED', label: 'Reject', danger: true },
]

// Move several selected applications at once. Only applications that can legally
// make the chosen move are touched; the rest are left as they are and counted.
export default function BulkBar({ selected, onClear }) {
  const bulk = useBulkMove()
  const [pending, setPending] = useState(null)
  const [note, setNote] = useState('')
  const [result, setResult] = useState('')

  const eligible = (to) => selected.filter((a) => findMove(a.state, to))

  const confirm = async () => {
    const ids = eligible(pending.to).map((a) => a.id)
    const { moved, failed } = await bulk.mutateAsync({ ids, to: pending.to, note })
    const skipped = selected.length - ids.length
    setResult(
      `${moved} moved to ${STATE_LABELS[pending.to]}` +
        (skipped ? `, ${skipped} skipped (not at a stage that allows it)` : '') +
        (failed ? `, ${failed} failed` : '') + '.'
    )
    setPending(null)
    setNote('')
    onClear()
  }

  if (!selected.length) return result ? <p role="status" className="text-sm text-ers-ink-soft">{result}</p> : null

  return (
    <div className="space-y-3 rounded-xl border border-ers-line bg-ers-surface p-4 shadow-card">
      <div className="flex flex-wrap items-center gap-2">
        <p className="mr-2 text-sm font-semibold text-ers-ink tabular-nums">{selected.length} selected</p>
        {BULK_MOVES.map((m) => (
          <Button
            key={m.to}
            size="sm"
            variant={m.danger ? 'danger' : 'secondary'}
            disabled={!eligible(m.to).length}
            onClick={() => setPending(m)}
          >
            {m.label} ({eligible(m.to).length})
          </Button>
        ))}
        <Button size="sm" variant="ghost" onClick={onClear}>Clear</Button>
      </div>

      {pending && (
        <div className="space-y-3">
          <TextArea
            id="bulk-note"
            required={pending.to === 'REJECTED'}
            label={pending.to === 'REJECTED' ? 'Reason (shown to every candidate)' : 'Note to the candidates (optional)'}
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={pending.danger ? 'danger' : 'primary'}
              isLoading={bulk.isPending}
              disabled={pending.to === 'REJECTED' && !note.trim()}
              onClick={confirm}
            >
              Confirm: {pending.label} {eligible(pending.to).length}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setPending(null)}>Cancel</Button>
          </div>
        </div>
      )}
    </div>
  )
}
