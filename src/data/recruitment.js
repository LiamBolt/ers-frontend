// Recruitment domain constants shared by the UI (labels, colours, state order).
// Source: SRS v1 sections 2.3, 2.7 (business rules) and 3.3 (state model).
// Names must match backend/src/modules/workflow/workflow.constants.ts.
// No records live here: all data comes from the API.

export const STATES = [
  'SUBMITTED',
  'UNDER_SCREENING',
  'SHORTLISTED',
  'INTERVIEW_SCHEDULED',
  'UNDER_EVALUATION',
  'SELECTED',
  'PENDING_APPROVAL',
  'OFFER_SENT',
  'OFFER_ACCEPTED',
  'ONBOARDING',
  'COMPLETED',
  'REJECTED',
  'DECLINED',
]

// The happy path, in order. REJECTED / DECLINED are closed branches (BR-05).
export const MAIN_PATH = [
  'SUBMITTED',
  'UNDER_SCREENING',
  'SHORTLISTED',
  'INTERVIEW_SCHEDULED',
  'UNDER_EVALUATION',
  'SELECTED',
  'PENDING_APPROVAL',
  'OFFER_SENT',
  'OFFER_ACCEPTED',
  'ONBOARDING',
  'COMPLETED',
]

export const CLOSED_STATES = ['COMPLETED', 'REJECTED', 'DECLINED']

export const STATE_LABELS = {
  SUBMITTED: 'Submitted',
  UNDER_SCREENING: 'Under screening',
  SHORTLISTED: 'Shortlisted',
  INTERVIEW_SCHEDULED: 'Interview scheduled',
  UNDER_EVALUATION: 'Under evaluation',
  SELECTED: 'Selected',
  PENDING_APPROVAL: 'Pending approval',
  OFFER_SENT: 'Offer sent',
  OFFER_ACCEPTED: 'Offer accepted',
  ONBOARDING: 'Onboarding',
  COMPLETED: 'Completed',
  REJECTED: 'Rejected',
  DECLINED: 'Declined',
}

// Badge variants from components/ui/Badge.jsx
export const STATE_VARIANTS = {
  SUBMITTED: 'default',
  UNDER_SCREENING: 'default',
  SHORTLISTED: 'primary',
  INTERVIEW_SCHEDULED: 'primary',
  UNDER_EVALUATION: 'warning',
  SELECTED: 'success',
  PENDING_APPROVAL: 'warning',
  OFFER_SENT: 'primary',
  OFFER_ACCEPTED: 'success',
  ONBOARDING: 'success',
  COMPLETED: 'success',
  REJECTED: 'danger',
  DECLINED: 'danger',
}

export const ROLE_LABELS = {
  CANDIDATE: 'Candidate',
  HR_OFFICER: 'HR Officer',
  INTERVIEWER: 'Interview Panel',
  MANAGER: 'Department Manager',
  ADMIN: 'System Administrator',
  SYSTEM: 'System',
}

export const DEPARTMENTS = [
  'Engineering',
  'Product',
  'Design',
  'Sales',
  'Marketing',
  'Finance',
  'Human Resources',
  'Operations',
  'Customer Support',
  'IT/Administration',
]

export const CONTRACT_TYPES = ['Permanent', 'Fixed-term', 'Probation', 'Part-time']

// Onboarding confirmations required before COMPLETED (BR-08, FR-11).
export const ONBOARDING_CONFIRMATIONS = [
  { key: 'HR', label: 'HR' },
  { key: 'IT', label: 'IT' },
  { key: 'Finance', label: 'Finance' },
  { key: 'Department', label: 'Department' },
]

export const ONBOARDING_DOCUMENTS = [
  'National ID / passport',
  'Academic certificates',
  'Signed contract',
  'Bank & tax details',
]

export const SCORE_FIELDS = [
  { key: 'technical', label: 'Technical knowledge' },
  { key: 'communication', label: 'Communication' },
  { key: 'problemSolving', label: 'Problem solving' },
  { key: 'teamwork', label: 'Teamwork' },
]

export const averageScore = (evaluation) =>
  Math.round(
    SCORE_FIELDS.reduce((sum, f) => sum + evaluation[f.key], 0) / SCORE_FIELDS.length
  )
