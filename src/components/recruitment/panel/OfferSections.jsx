import Button from '../../ui/Button'
import OfferForm from '../../forms/OfferForm'
import { Section, Card } from './PanelPrimitives'

// HR: generate the offer for an approved candidate (FR-10).
export function OfferFormSection({ act, actions }) {
  return (
    <Section title="Generate offer">
      <Card>
        <OfferForm onSubmit={(offer) => act(() => actions.sendOffer(offer))} />
      </Card>
    </Section>
  )
}

// HR: record the candidate's answer on their behalf. The offer stays open until then (BR-06).
export function OfferResponseSection({ act, actions }) {
  return (
    <Section title="Candidate response">
      <Card className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ers-ink-soft">
          The offer stays open until a response is recorded. Record the candidate’s answer on their behalf:
        </p>
        <div className="flex gap-2">
          <Button onClick={() => act(() => actions.respondToOffer('ACCEPTED'))}>Accepted</Button>
          <Button variant="danger" onClick={() => act(() => actions.respondToOffer('DECLINED'))}>Declined</Button>
        </div>
      </Card>
    </Section>
  )
}
