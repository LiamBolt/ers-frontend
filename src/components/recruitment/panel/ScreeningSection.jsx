import Button from '../../ui/Button'
import { Section, Card, NoteField } from './PanelPrimitives'

// HR: screen, shortlist or reject a new application (FR-05).
export default function ScreeningSection({ app, act, actions, note, setNote }) {
  return (
    <Section title="Screening">
      <Card className="space-y-3">
        <NoteField required label="Reason (required to reject)" value={note} onChange={setNote} />
        <div className="flex flex-wrap gap-2">
          {app.state === 'SUBMITTED' && (
            <Button variant="secondary" onClick={() => act(actions.startScreening)}>Start screening</Button>
          )}
          <Button onClick={() => act(() => actions.shortlist(note))}>Shortlist</Button>
          <Button variant="secondary" className="!text-ers-danger" onClick={() => act(() => actions.reject(note))}>Reject</Button>
        </div>
      </Card>
    </Section>
  )
}
