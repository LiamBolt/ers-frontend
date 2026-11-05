import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Button from '@/shared/ui/Button'
import { nextStep } from '../../lib/nextStep'
import MoveForm from './MoveForm'
import EvaluationSection from './EvaluationSection'
import DecisionSection from './DecisionSection'
import { OfferFormSection } from './OfferSections'
import { ApproveOfferForm, RespondForm, FinishOnboardingForm } from './ActionForms'

// "What to do now": one sentence, one main button, the rest under "More".
// Opening an action shows its form in place of the buttons.
export default function ActionCard({ app, user, shared }) {
  const step = nextStep(app, user)
  const [active, setActive] = useState(null)
  const [more, setMore] = useState(false)
  if (!step) return null

  const { act, actions } = shared
  const close = () => setActive(null)
  const common = { act, actions, onCancel: close }
  const forms = {
    move: () => <MoveForm move={active.move} {...common} onDone={close} />,
    evaluate: () => <EvaluationSection {...shared} />,
    decide: () => <DecisionSection {...shared} />,
    offer: () => <OfferFormSection {...shared} />,
    approveOffer: () => <ApproveOfferForm {...common} />,
    respond: () => <RespondForm response={active.response} {...common} />,
    finish: () => <FinishOnboardingForm app={app} {...common} />,
  }

  return (
    <section aria-label="Next step" className="space-y-3 rounded-xl border border-ers-primary/30 bg-ers-primary/5 p-4">
      <p className="text-sm font-semibold text-ers-ink">{step.text}</p>

      {active ? (
        forms[active.kind]()
      ) : (
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            {step.primary && (
              <Button disabled={step.primary.disabled} onClick={() => setActive(step.primary)}>{step.primary.label}</Button>
            )}
            {step.more.length > 0 && (
              <Button variant="ghost" aria-expanded={more} onClick={() => setMore((m) => !m)}>
                More <ChevronDown size={16} aria-hidden="true" className={more ? 'rotate-180' : ''} />
              </Button>
            )}
          </div>
          {more && (
            <div className="flex flex-wrap gap-2">
              {step.more.map((m) => (
                <Button key={m.label} size="sm" variant={m.danger ? 'danger' : 'secondary'} onClick={() => setActive(m)}>{m.label}</Button>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
