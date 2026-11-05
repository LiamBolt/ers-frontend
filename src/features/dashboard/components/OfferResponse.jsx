import { useState } from 'react'
import Button from '@/shared/ui/Button'
import { fmtDate, fmtMoney } from '@/shared/lib/format'
import { useApplicationActions } from '@/features/applications/useApplicationActions'

// Accept / decline buttons for one offer. Its own component so the mutation hook is per application.
export default function OfferResponse({ app }) {
  const actions = useApplicationActions(app.id)
  const [error, setError] = useState('')

  const respond = async (response) => {
    try {
      await actions.respondToOffer(response)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="space-y-3 rounded-lg border border-ers-primary/30 bg-ers-primary/5 p-4">
      <p className="font-semibold text-ers-ink">You have a job offer</p>
      <p className="text-sm text-ers-ink-soft">
        {fmtMoney(app.offer.salary)} / month · {app.offer.contract} · starting {fmtDate(app.offer.startDate)}
      </p>
      <div className="flex gap-2">
        <Button isLoading={actions.isPending} onClick={() => respond('ACCEPTED')}>Accept offer</Button>
        <Button variant="danger" disabled={actions.isPending} onClick={() => respond('DECLINED')}>Decline</Button>
      </div>
      {error && <p role="alert" className="text-sm text-ers-danger">{error}</p>}
    </div>
  )
}
