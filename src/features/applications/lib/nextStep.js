import { movesFrom, STAFF_ROLES } from './moves'

const moveItem = (m) => ({ label: m.label, kind: 'move', move: m, danger: m.to === 'REJECTED' })

// What the signed-in user should do on this application right now: a sentence,
// one primary action and a few secondary ones. `kind` says which form opens.
// The server still enforces every rule; this only picks what to offer.
export function nextStep(app, user) {
  const role = user.role
  const admin = role === 'ADMIN'
  const staff = STAFF_ROLES.includes(role)
  const onPanel = !!app.interview?.panel.some((p) => p.id === user.id)
  const evaluated = app.evaluations.some((e) => e.panelistId === user.id)
  const panelCount = app.interview?.panel.length ?? 0

  // Moves this user may make by hand; a panel member may select or reject after evaluating.
  const canMove = staff || (role === 'INTERVIEWER' && onPanel && app.state === 'UNDER_EVALUATION')
  const moves = canMove ? movesFrom(app.state).map(moveItem) : []
  const forward = moves.find((m) => !m.danger)
  const withoutForward = moves.filter((m) => m !== forward)

  switch (app.state) {
    case 'SUBMITTED':
      return forward && { text: 'New application. Start screening, or shortlist it straight away.', primary: forward, more: withoutForward }
    case 'UNDER_SCREENING':
      return forward && { text: 'Being screened. Shortlist the candidate or reject.', primary: forward, more: withoutForward }
    case 'SHORTLISTED':
      return forward && { text: 'Shortlisted. Next: book the interview.', primary: forward, more: withoutForward }
    case 'INTERVIEW_SCHEDULED':
      return forward && { text: 'Interview booked. Mark it completed once it has taken place.', primary: forward, more: withoutForward }
    case 'UNDER_EVALUATION': {
      const text = `${app.evaluations.length} of ${panelCount} evaluations in.`
      if ((role === 'INTERVIEWER' || admin) && onPanel && !evaluated) {
        return { text: `${text} Yours is outstanding.`, primary: { label: 'Submit your evaluation', kind: 'evaluate' }, more: moves }
      }
      if (!forward) return null
      const blocked = !app.evaluations.length
      return { text: blocked ? `${text} Selection needs at least one.` : text, primary: { ...forward, disabled: blocked }, more: withoutForward }
    }
    case 'PENDING_APPROVAL':
      if (!app.approval) {
        if (admin) {
          return {
            text: 'Awaiting the manager’s approval. As administrator you can approve and send the offer in one step.',
            primary: { label: 'Approve and send offer', kind: 'approveOffer' },
            more: [{ label: 'Approve or reject only', kind: 'decide' }],
          }
        }
        return role === 'MANAGER' ? { text: 'Review the evaluation and decide.', primary: { label: 'Review and decide', kind: 'decide' }, more: [] } : null
      }
      return staff ? { text: 'Approved. Next: send the offer.', primary: { label: 'Send offer', kind: 'offer' }, more: [] } : null
    case 'OFFER_SENT':
      return staff && {
        text: 'Offer sent. Record the candidate’s answer when you have it.',
        primary: { label: 'Candidate accepted', kind: 'respond', response: 'ACCEPTED' },
        more: [{ label: 'Candidate declined', kind: 'respond', response: 'DECLINED', danger: true }],
      }
    case 'ONBOARDING':
      return staff && { text: 'Onboarding. Verify the documents and confirmations, then finish.', primary: { label: 'Verify all and complete', kind: 'finish' }, more: [] }
    default:
      return { text: app.state === 'COMPLETED' ? 'Completed. Nothing more to do.' : 'This application is closed.', primary: null, more: [] }
  }
}
