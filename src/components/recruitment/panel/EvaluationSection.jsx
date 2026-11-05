import EvaluationForm from '../../forms/EvaluationForm'
import { Section, Card } from './PanelPrimitives'

// Panel member: submit your own scored evaluation (FR-07).
export default function EvaluationSection({ act, actions }) {
  return (
    <Section title="Your evaluation">
      <Card>
        <EvaluationForm onSubmit={(scores) => act(() => actions.submitEvaluation(scores))} />
      </Card>
    </Section>
  )
}
