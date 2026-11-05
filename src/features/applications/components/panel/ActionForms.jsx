import { useState } from 'react'
import Button from '@/shared/ui/Button'
import OfferForm from '@/features/offers/components/OfferForm'
import { ONBOARDING_CONFIRMATIONS, ONBOARDING_DOCUMENTS } from '@/shared/constants/onboarding'
import { Card, NoteField } from './PanelPrimitives'

// Admin shortcut: approve the hire and issue the offer in one step.
export function ApproveOfferForm({ act, actions, onCancel }) {
  return (
    <Card className="space-y-3">
      <p className="text-sm font-semibold text-ers-ink">Approve this hire and send the offer</p>
      <OfferForm onSubmit={(offer) => act(async () => { await actions.decide('APPROVED', ''); await actions.sendOffer(offer) })} />
      <Button variant="ghost" onClick={onCancel}>Cancel</Button>
    </Card>
  )
}

// Records the candidate's answer to the offer on their behalf.
export function RespondForm({ response, act, actions, onCancel }) {
  const [note, setNote] = useState('')
  const accepted = response === 'ACCEPTED'
  return (
    <Card className="space-y-3">
      <p className="text-sm font-semibold text-ers-ink">{accepted ? 'Record: offer accepted' : 'Record: offer declined'}</p>
      <NoteField label="Note (optional)" value={note} onChange={setNote} />
      <div className="flex gap-2">
        <Button variant={accepted ? 'primary' : 'danger'} isLoading={actions.isPending} onClick={() => act(() => actions.respondToOffer(response, note))}>
          Confirm
        </Button>
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </Card>
  )
}

// Marks every outstanding document and confirmation as done, then completes recruitment.
export function FinishOnboardingForm({ app, act, actions, onCancel }) {
  const { documents, confirmations } = app.onboarding
  const docs = ONBOARDING_DOCUMENTS.filter((d) => !documents[d])
  const confs = ONBOARDING_CONFIRMATIONS.filter((c) => !confirmations[c.key])
  const run = async () => {
    for (const d of docs) await actions.verifyDocument(d)
    for (const c of confs) await actions.confirmOnboarding(c.key)
    await actions.completeOnboarding()
  }
  return (
    <Card className="space-y-3">
      <p className="text-sm font-semibold text-ers-ink">Finish onboarding</p>
      <p className="text-sm text-ers-ink-soft">
        {docs.length + confs.length
          ? `This will verify ${docs.length} document${docs.length === 1 ? '' : 's'} and record ${confs.length} confirmation${confs.length === 1 ? '' : 's'} under your name, then mark recruitment completed. Only do this once they are really in hand.`
          : 'Everything is already verified. This marks recruitment completed.'}
      </p>
      <div className="flex gap-2">
        <Button isLoading={actions.isPending} onClick={() => act(run)}>Verify all and complete</Button>
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </Card>
  )
}
