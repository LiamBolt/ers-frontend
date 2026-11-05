import { useState } from 'react'
import Button from '@/shared/ui/Button'
import ScheduleInterviewForm from '@/features/interviews/components/ScheduleInterviewForm'
import { STATE_LABELS } from '@/shared/constants/states'
import { Card, NoteField } from './PanelPrimitives'

// Confirms one stage move. Every move takes an optional note that the candidate
// sees in their notification; rejecting requires one. Scheduling collects the
// interview details first. This is also the second step before a rejection.
export default function MoveForm({ move, actions, act, onDone, onCancel }) {
  const [note, setNote] = useState('')
  const reject = move.to === 'REJECTED'
  const run = (fn) => act(async () => { await fn(); onDone() })

  const submit = () => {
    if (reject) return actions.reject(note)
    if (move.to === 'UNDER_SCREENING') return actions.startScreening(note)
    if (move.to === 'SHORTLISTED') return actions.shortlist(note)
    if (move.to === 'UNDER_EVALUATION') return actions.completeInterview(note)
    return actions.select(note)
  }

  return (
    <Card className="space-y-4">
      <p className="text-sm font-semibold text-ers-ink">
        {reject ? 'Reject this application' : `Move to ${STATE_LABELS[move.to]}`}
      </p>

      {move.to === 'INTERVIEW_SCHEDULED' ? (
        <ScheduleInterviewForm withNote onCancel={onCancel} onSubmit={(data) => run(() => actions.scheduleInterview(data))} />
      ) : (
        <>
          <NoteField
            required={reject}
            label={reject ? 'Reason (shown to the candidate)' : 'Note to the candidate (optional)'}
            value={note}
            onChange={setNote}
          />
          <div className="flex flex-wrap gap-2">
            <Button
              variant={reject ? 'danger' : 'primary'}
              disabled={reject && !note.trim()}
              isLoading={actions.isPending}
              onClick={() => run(submit)}
            >
              {reject ? 'Confirm rejection' : `Confirm: ${move.label}`}
            </Button>
            <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          </div>
        </>
      )}
    </Card>
  )
}
