import Button from '@/shared/ui/Button'
import { Section, Card } from './PanelPrimitives'

// HR: closing the interview opens evaluations (FR-07).
export default function InterviewCompleteSection({ act, actions }) {
  return (
    <Section title="After the interview">
      <Card className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ers-ink-soft">Panel evaluations open once the interview is marked completed.</p>
        <Button onClick={() => act(actions.completeInterview)}>Mark interview completed</Button>
      </Card>
    </Section>
  )
}
