import { useState } from 'react'
import { SearchX } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout'
import Tabs from '../components/ui/Tabs'
import Select from '../components/ui/Select'
import Badge from '../components/ui/Badge'
import StateBadge from '../components/recruitment/StateBadge'
import ApplicationPanel from '../components/recruitment/ApplicationPanel'
import { useAuth } from '../context/AuthContext'
import { useApplications, useJobs } from '../hooks/queries'
import { fmtDate } from '../utils/format'
import { Table, Th, tbodyClass } from '../components/ui/Table'
import { LoadingRows } from '../components/ui/Skeleton'
import EmptyState from '../components/ui/EmptyState'
import SearchInput from '../components/ui/SearchInput'
import ErrorState from '../components/ui/ErrorState'

const GROUPS = [
  { value: 'ALL', label: 'All', states: null },
  { value: 'SCREENING', label: 'Screening', states: ['SUBMITTED', 'UNDER_SCREENING'] },
  { value: 'INTERVIEW', label: 'Interview', states: ['SHORTLISTED', 'INTERVIEW_SCHEDULED', 'UNDER_EVALUATION'] },
  { value: 'APPROVAL', label: 'Approval', states: ['SELECTED', 'PENDING_APPROVAL'] },
  { value: 'OFFER', label: 'Offer & onboarding', states: ['OFFER_SENT', 'OFFER_ACCEPTED', 'ONBOARDING'] },
  { value: 'CLOSED', label: 'Closed', states: ['COMPLETED', 'REJECTED', 'DECLINED'] },
]

// What the signed-in role needs to do next on an application, for the table.
function nextAction(app, user) {
  const role = user.role
  const waiting = {
    SUBMITTED: ['HR_OFFICER', 'Start screening'],
    UNDER_SCREENING: ['HR_OFFICER', 'Shortlist or reject'],
    SHORTLISTED: ['HR_OFFICER', 'Schedule interview'],
    INTERVIEW_SCHEDULED: ['HR_OFFICER', 'Mark interview completed'],
    SELECTED: ['SYSTEM', ''],
    OFFER_SENT: ['HR_OFFICER', 'Awaiting candidate response'],
    ONBOARDING: ['HR_OFFICER', 'Collect confirmations'],
  }[app.state]

  if (app.state === 'UNDER_EVALUATION') {
    if (role === 'INTERVIEWER')
      return app.interview?.panel.some((p) => p.id === user.id) && !app.evaluations.some((e) => e.panelistId === user.id)
        ? 'Submit your evaluation'
        : ''
    if (role === 'HR_OFFICER') return `${app.evaluations.length}/${app.interview.panel.length} evaluations in`
    return ''
  }
  if (app.state === 'PENDING_APPROVAL') {
    if (!app.approval) return role === 'MANAGER' ? 'Approve or reject' : ''
    return role === 'HR_OFFICER' ? 'Send offer' : ''
  }
  if (app.state === 'ONBOARDING' && role === 'MANAGER') return app.onboarding?.confirmations.Department ? '' : 'Confirm department'
  return waiting && waiting[0] === role ? waiting[1] : ''
}

export default function CandidatesPage() {
  const { user } = useAuth()
  const { data: applications = [], isLoading, error: loadError, refetch } = useApplications()
  const { data: jobs = [] } = useJobs()
  const [group, setGroup] = useState('ALL')
  const [jobId, setJobId] = useState('')
  const [query, setQuery] = useState('')
  const [openId, setOpenId] = useState(null)

  // The server already limits each role to what it may see (panel members: their own panels).
  const visible = applications

  const groupStates = GROUPS.find((g) => g.value === group).states
  const q = query.trim().toLowerCase()
  const rows = visible
    .filter((a) => !groupStates || groupStates.includes(a.state))
    .filter((a) => !jobId || a.jobId === jobId)
    .filter((a) => !q || a.candidateName.toLowerCase().includes(q) || a.candidateEmail.toLowerCase().includes(q) || a.ref.toLowerCase().includes(q))
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))

  const countFor = (g) => (g.states ? visible.filter((a) => g.states.includes(a.state)).length : visible.length)
  const options = GROUPS.map((g) => ({ value: g.value, label: `${g.label} (${countFor(g)})` }))
  const readOnly = user.role === 'ADMIN'

  return (
    <AppLayout
      title="Candidates"
      subtitle={
        user.role === 'INTERVIEWER'
          ? 'Candidates on your interview panels'
          : 'Every application and where it stands right now'
      }
    >
      <div className="space-y-5">
        <Tabs options={options} value={group} onChange={setGroup} ariaLabel="Filter by stage group" />

        <div className="grid sm:grid-cols-[1fr_16rem] gap-3 items-end">
          <SearchInput id="cand-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Name, email or application ID" />
          <Select label="Vacancy" value={jobId} onChange={(e) => setJobId(e.target.value)}>
            <option value="">All vacancies</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>{j.title}</option>
            ))}
          </Select>
        </div>

        {readOnly && <Badge>Read-only monitoring view</Badge>}

        {isLoading ? (
          <LoadingRows />
        ) : loadError ? (
          <ErrorState error={loadError} onRetry={refetch} />
        ) : rows.length === 0 ? (
          <EmptyState icon={SearchX} title="No applications match">Try a different stage, vacancy or search term.</EmptyState>
        ) : (
          <Table>
              <thead>
                <tr>
                  <Th>Candidate</Th>
                  <Th>Vacancy</Th>
                  <Th>Stage</Th>
                  <Th className="hidden md:table-cell">Updated</Th>
                  <Th>Your next step</Th>
                </tr>
              </thead>
              <tbody className={tbodyClass}>
                {rows.map((a) => {
                  const job = a.job
                  const action = nextAction(a, user)
                  return (
                    <tr
                      key={a.id}
                      onClick={() => setOpenId(a.id)}
                      className="cursor-pointer hover:bg-ers-primary/5"
                    >
                      <td className="px-4 py-3">
                        <button
                          className="text-left font-semibold text-ers-ink hover:text-ers-primary"
                          onClick={(e) => { e.stopPropagation(); setOpenId(a.id) }}
                        >
                          {a.candidateName}
                        </button>
                        <div className="text-caption text-ers-ink-soft">{a.ref}</div>
                      </td>
                      <td className="px-4 py-3 text-ers-ink">
                        {job?.title}
                        <div className="text-caption text-ers-ink-soft">{job?.department}</div>
                      </td>
                      <td className="px-4 py-3"><StateBadge state={a.state} /></td>
                      <td className="px-4 py-3 hidden md:table-cell text-ers-ink-soft">{fmtDate(a.updatedAt)}</td>
                      <td className="px-4 py-3">
                        {action ? <Badge variant="primary">{action}</Badge> : <span className="text-ers-ink-soft">—</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
        )}
      </div>

      {openId && <ApplicationPanel appId={openId} onClose={() => setOpenId(null)} />}
    </AppLayout>
  )
}
