import { CheckCircle2, Circle } from 'lucide-react'
import Button from '../../ui/Button'
import { ONBOARDING_CONFIRMATIONS, ONBOARDING_DOCUMENTS } from '../../../data/recruitment'
import { fmtDate } from '../../../utils/format'
import { Section, Card } from './PanelPrimitives'

function ChecklistItem({ label, stamp, canAct, actionLabel, onAct }) {
  return (
    <li className="flex items-center justify-between gap-3 text-sm">
      <span className="flex items-center gap-2 text-ers-ink">
        {stamp ? <CheckCircle2 size={16} className="text-ers-accent" /> : <Circle size={16} className="text-ers-ink-soft/50" />}
        {label}
        {stamp && <span className="text-caption text-ers-ink-soft">{stamp.by} · {fmtDate(stamp.at)}</span>}
      </span>
      {!stamp && canAct && (
        <Button variant="secondary" className="!px-3 !py-1 !text-xs" onClick={onAct}>{actionLabel}</Button>
      )}
    </li>
  )
}

// Documents + department confirmations; completion is gated server-side (FR-11, BR-08).
export default function OnboardingSection({ app, role, act, actions }) {
  const open = app.state === 'ONBOARDING'
  const isStaff = role === 'HR_OFFICER' || role === 'ADMIN'
  const { documents, confirmations } = app.onboarding

  return (
    <Section title="Onboarding (required before completion)">
      <Card className="space-y-4">
        <div>
          <p className="text-label text-ers-ink mb-2">Documents</p>
          <ul className="space-y-1.5">
            {ONBOARDING_DOCUMENTS.map((d) => (
              <ChecklistItem key={d} label={d} stamp={documents[d]} canAct={open && isStaff} actionLabel="Verify" onAct={() => act(() => actions.verifyDocument(d))} />
            ))}
          </ul>
        </div>
        <div>
          <p className="text-label text-ers-ink mb-2">Confirmations</p>
          <ul className="space-y-1.5">
            {ONBOARDING_CONFIRMATIONS.map((c) => (
              <ChecklistItem
                key={c.key}
                label={`${c.label} confirmation`}
                stamp={confirmations[c.key]}
                canAct={open && (isStaff || (role === 'MANAGER' && c.key === 'Department'))}
                actionLabel="Confirm"
                onAct={() => act(() => actions.confirmOnboarding(c.key))}
              />
            ))}
          </ul>
        </div>
        {open && isStaff && <Button onClick={() => act(actions.completeOnboarding)}>Mark recruitment completed</Button>}
      </Card>
    </Section>
  )
}
