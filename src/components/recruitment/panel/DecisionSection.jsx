import Button from '../../ui/Button'
import { Section, Card, NoteField } from './PanelPrimitives'

// Manager: approve or reject a hire; logged with name and time (FR-09, BR-07).
export default function DecisionSection({ act, actions, note, setNote }) {
  return (
    <Section title="Hiring decision">
      <Card className="space-y-3">
        <p className="text-sm text-ers-ink-soft">
          Review the evaluation scores below. Your decision is logged with your name and the time.
        </p>
        <NoteField label="Comment (required to reject)" value={note} onChange={setNote} />
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => act(() => actions.decide('APPROVED', note))}>Approve hire</Button>
          <Button variant="secondary" className="!text-ers-danger" onClick={() => act(() => actions.decide('REJECTED', note))}>Reject</Button>
        </div>
      </Card>
    </Section>
  )
}
