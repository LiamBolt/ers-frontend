import Badge from '@/shared/ui/Badge'
import { SCORE_FIELDS, averageScore } from '@/shared/constants/evaluation'
import { fmtDate, fmtDateTime, fmtMoney } from '@/shared/lib/format'
import { Section, Card, Row } from './PanelPrimitives'

export function InterviewDetails({ interview }) {
  return (
    <Section title="Interview">
      <Card className="space-y-1">
        <Row label="When">{fmtDateTime(interview.date)}</Row>
        <Row label="Where">{interview.location}</Row>
        <Row label="Panel">{interview.panel.map((p) => p.name).join(', ')}</Row>
        <Row label="Status">{interview.status === 'COMPLETED' ? 'Completed' : 'Scheduled'}</Row>
      </Card>
    </Section>
  )
}

export function EvaluationDetails({ evaluations }) {
  return (
    <Section title="Evaluations">
      <div className="space-y-3">
        {evaluations.map((e) => (
          <Card key={e.panelistId}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-ers-ink">{e.panelistName}</p>
              <Badge variant="primary">Average {averageScore(e)}</Badge>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
              {SCORE_FIELDS.map((f) => (
                <div key={f.key}>
                  <p className="text-caption text-ers-ink-soft">{f.label}</p>
                  <p className="font-semibold text-ers-ink">{e[f.key]}</p>
                </div>
              ))}
            </div>
            {e.comments && <p className="text-sm text-ers-ink-soft mt-2">“{e.comments}”</p>}
          </Card>
        ))}
      </div>
    </Section>
  )
}

export function ApprovalDetails({ approval }) {
  return (
    <Section title="Manager decision">
      <Card className="space-y-1">
        <div className="flex items-center gap-2">
          <Badge variant={approval.decision === 'APPROVED' ? 'success' : 'danger'}>
            {approval.decision === 'APPROVED' ? 'Approved' : 'Rejected'}
          </Badge>
          <span className="text-caption text-ers-ink-soft">{approval.by} · {fmtDateTime(approval.at)}</span>
        </div>
        {approval.note && <p className="text-sm text-ers-ink-soft">{approval.note}</p>}
      </Card>
    </Section>
  )
}

export function OfferDetails({ offer }) {
  const status =
    offer.status === 'OFFER_SENT'
      ? 'Awaiting candidate response'
      : `${offer.status === 'ACCEPTED' ? 'Accepted' : 'Declined'} on ${fmtDate(offer.responseDate)}`
  return (
    <Section title="Offer">
      <Card className="space-y-1">
        <Row label="Salary">{fmtMoney(offer.salary)} / month</Row>
        <Row label="Start date">{fmtDate(offer.startDate)}</Row>
        <Row label="Contract">{offer.contract}</Row>
        <Row label="Sent">{fmtDate(offer.sentAt)}</Row>
        <Row label="Status">{status}</Row>
      </Card>
    </Section>
  )
}

export function CandidateDetails({ app }) {
  return (
    <Section title="Candidate">
      <Card className="space-y-1">
        <Row label="Phone">{app.candidate.phone}</Row>
        <Row label="Address">{app.candidate.address}</Row>
        <Row label="Qualifications">{app.qualifications.map((q) => `${q.qualification}, ${q.institution} (${q.yearCompleted})`).join(' · ')}</Row>
        {app.experience.length > 0 && (
          <Row label="Experience">{app.experience.map((x) => `${x.positionHeld} at ${x.previousEmployer} (${x.yearsOfExperience}y)`).join(' · ')}</Row>
        )}
        <Row label="References">{app.references.map((r) => `${r.refereeName}, ${r.organisation}`).join(' · ')}</Row>
        <p className="text-sm">
          <a href={app.cvUrl} target="_blank" rel="noreferrer" className="font-semibold text-ers-primary hover:underline">Open CV</a>
        </p>
      </Card>
    </Section>
  )
}
