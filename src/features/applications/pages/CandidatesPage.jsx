import { useState } from 'react'
import { SearchX } from 'lucide-react'
import AppLayout from '@/app/layout/AppLayout'
import Tabs from '@/shared/ui/Tabs'
import Select from '@/shared/ui/Select'
import { LoadingRows } from '@/shared/ui/Skeleton'
import EmptyState from '@/shared/ui/EmptyState'
import SearchInput from '@/shared/ui/SearchInput'
import ErrorState from '@/shared/ui/ErrorState'
import { useAuth } from '@/features/auth/AuthContext'
import { useJobs } from '@/features/vacancies/hooks'
import { useApplications } from '../hooks'
import { STAFF_ROLES } from '../lib/moves'
import BulkBar from '../components/BulkBar'
import { STAGE_GROUPS } from '../lib/stageGroups'
import CandidatesTable from '../components/CandidatesTable'
import ApplicationPanel from '../components/ApplicationPanel'

// Staff view of every application they may see (the server scopes it per role).
export default function CandidatesPage() {
  const { user } = useAuth()
  const { data: applications = [], isLoading, error: loadError, refetch } = useApplications()
  const { data: jobs = [] } = useJobs()
  const [group, setGroup] = useState('ALL')
  const [jobId, setJobId] = useState('')
  const [query, setQuery] = useState('')
  const [openId, setOpenId] = useState(null)
  const [selectedIds, setSelectedIds] = useState(new Set())
  const canMove = STAFF_ROLES.includes(user.role)

  const groupStates = STAGE_GROUPS.find((g) => g.value === group).states
  const q = query.trim().toLowerCase()
  const rows = applications
    .filter((a) => !groupStates || groupStates.includes(a.state))
    .filter((a) => !jobId || a.jobId === jobId)
    .filter((a) => !q || a.candidateName.toLowerCase().includes(q) || a.candidateEmail.toLowerCase().includes(q) || a.ref.toLowerCase().includes(q))
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))

  const toggle = (id) => setSelectedIds((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next })
  const toggleAll = (on) => setSelectedIds(on ? new Set(rows.map((a) => a.id)) : new Set())
  const selected = applications.filter((a) => selectedIds.has(a.id))

  const countFor = (g) => (g.states ? applications.filter((a) => g.states.includes(a.state)).length : applications.length)
  const tabs = STAGE_GROUPS.map((g) => ({ value: g.value, label: `${g.label} (${countFor(g)})` }))

  return (
    <AppLayout
      title="Candidates"
      subtitle={user.role === 'INTERVIEWER' ? 'Candidates on your interview panels' : 'Every application and where it stands right now'}
    >
      <div className="space-y-5">
        <Tabs options={tabs} value={group} onChange={setGroup} ariaLabel="Filter by stage group" />

        <div className="grid items-end gap-3 sm:grid-cols-[1fr_16rem]">
          <SearchInput id="cand-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Name, email or application ID" />
          <Select label="Vacancy" value={jobId} onChange={(e) => setJobId(e.target.value)}>
            <option value="">All vacancies</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>{j.title}</option>
            ))}
          </Select>
        </div>

        {canMove && <BulkBar selected={selected} onClear={() => setSelectedIds(new Set())} />}

        {isLoading ? (
          <LoadingRows />
        ) : loadError ? (
          <ErrorState error={loadError} onRetry={refetch} />
        ) : rows.length === 0 ? (
          <EmptyState icon={SearchX} title="No applications match">Try a different stage, vacancy or search term.</EmptyState>
        ) : (
          <CandidatesTable applications={rows} user={user} onOpen={setOpenId} {...(canMove && { selectedIds, onToggle: toggle, onToggleAll: toggleAll })} />
        )}
      </div>

      {openId && <ApplicationPanel appId={openId} onClose={() => setOpenId(null)} />}
    </AppLayout>
  )
}
