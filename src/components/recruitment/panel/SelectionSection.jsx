import Button from '../../ui/Button'
import { Section, Card, NoteField } from './PanelPrimitives'

// HR / panel: select or reject once evaluations are in (FR-08).
export default function SelectionSection({ app, act, actions, note, setNote }) {
  const total = app.interview?.panel.length ?? 0
  return (
    <Section title="Selection">
      <Card className="space-y-3">
        <p className="text-sm text-ers-ink-soft">
          {app.evaluations.length
            ? `${app.evaluations.length} of ${total} evaluations recorded.`
            : 'No evaluations recorded yet; selection needs at least one.'}{' '}
          A selected candidate is routed to the Department Manager automatically.
        </p>
        <NoteField label="Note (required to reject)" value={note} onChange={setNote} />
        <div className="flex flex-wrap gap-2">
          <Button disabled={!app.evaluations.length} onClick={() => act(() => actions.select(note))}>Select candidate</Button>
          <Button variant="secondary" className="!text-ers-danger" onClick={() => act(() => actions.reject(note))}>Reject</Button>
        </div>
      </Card>
    </Section>
  )
}
