import { ArrowRight } from 'lucide-react'
import Button from '@/shared/ui/Button'
import Select from '@/shared/ui/Select'
import { Section, Card } from './PanelPrimitives'
import { movesFrom, forwardMove } from '@/features/applications/lib/moves'

// Staff controls for moving an application on: the next step as one button,
// a "Move to…" menu for every legal move, and Reject.
export default function StageMoveBar({ app, onPick }) {
  const moves = movesFrom(app.state)
  const next = forwardMove(app.state)
  const blocked = (m) => m.needs === 'evaluations' && !app.evaluations.length
  if (!moves.length) return null

  return (
    <Section title="Move this application">
      <Card className="flex flex-wrap items-end gap-3">
        {next && (
          <Button disabled={blocked(next)} onClick={() => onPick(next)}>
            {next.label}
            <ArrowRight size={16} aria-hidden="true" />
          </Button>
        )}
        <div className="w-full sm:w-56">
          <Select
            id="move-to"
            label="Move to…"
            value=""
            onChange={(e) => onPick(moves.find((m) => m.to === e.target.value))}
          >
            <option value="" disabled>Choose a stage</option>
            {moves.map((m) => (
              <option key={m.to} value={m.to} disabled={blocked(m)}>{m.label}</option>
            ))}
          </Select>
        </div>
        {moves.some((m) => m.to === 'REJECTED') && (
          <Button variant="danger" onClick={() => onPick(moves.find((m) => m.to === 'REJECTED'))}>Reject</Button>
        )}
        {next && blocked(next) && (
          <p className="w-full text-sm text-ers-ink-soft">Selection needs at least one panel evaluation first.</p>
        )}
      </Card>
    </Section>
  )
}
