import Button from '../../ui/Button'
import ScheduleInterviewForm from '../../forms/ScheduleInterviewForm'
import { Section, Card, NoteField } from './PanelPrimitives'

// HR: book the interview for a shortlisted candidate (FR-06).
export default function ScheduleSection({ act, actions, note, setNote }) {
  return (
    <Section title="Schedule interview">
      <Card className="space-y-4">
        <ScheduleInterviewForm onSubmit={(data) => act(() => actions.scheduleInterview(data))} />
        <hr className="border-ers-line" />
        <NoteField required label="Reason (required to reject)" value={note} onChange={setNote} />
        <Button variant="secondary" className="!text-ers-danger" onClick={() => act(() => actions.reject(note))}>Reject application</Button>
      </Card>
    </Section>
  )
}
