import { useState } from 'react'
import { SearchX, UserPlus } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout'
import Tabs from '../components/ui/Tabs'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import CreateUserForm from '../components/forms/CreateUserForm'
import UserRow from '../components/users/UserRow'
import { useAuth } from '../context/AuthContext'
import { useUsers } from '../hooks/queries'
import { useUserMutations } from '../hooks/useUserMutations'
import { ROLE_LABELS } from '../data/recruitment'
import { Table, Th, tbodyClass } from '../components/ui/Table'
import { LoadingRows } from '../components/ui/Skeleton'
import EmptyState from '../components/ui/EmptyState'
import SearchInput from '../components/ui/SearchInput'
import ErrorState from '../components/ui/ErrorState'

const GROUPS = [
  { value: 'ALL', label: 'All' },
  ...['HR_OFFICER', 'INTERVIEWER', 'MANAGER', 'ADMIN', 'CANDIDATE'].map((r) => ({ value: r, label: ROLE_LABELS[r] })),
]

// FR-12: administrators manage accounts and roles.
export default function UsersPage() {
  const { user: me } = useAuth()
  const { data: users = [], isLoading, error: loadError, refetch } = useUsers()
  const { createUser, isCreating, updateUser, isUpdating } = useUserMutations()
  const [group, setGroup] = useState('ALL')
  const [query, setQuery] = useState('')
  const [creating, setCreating] = useState(false)
  const [busyId, setBusyId] = useState(null)
  const [error, setError] = useState('')

  const q = query.trim().toLowerCase()
  const rows = users
    .filter((u) => group === 'ALL' || u.role === group)
    .filter((u) => !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))

  const countFor = (g) => (g.value === 'ALL' ? users.length : users.filter((u) => u.role === g.value).length)
  const options = GROUPS.map((g) => ({ value: g.value, label: `${g.label} (${countFor(g)})` }))

  const change = async (id, data) => {
    setBusyId(id)
    try {
      await updateUser(id, data)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <AppLayout title="Users" subtitle="Create staff accounts, assign roles and deactivate access">
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Tabs options={options} value={group} onChange={setGroup} ariaLabel="Filter by role" />
          <Button onClick={() => setCreating(true)}><UserPlus size={16} /> New staff account</Button>
        </div>

        <SearchInput id="user-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Name or email" />

        {error && <p role="alert" className="text-sm text-ers-danger">{error}</p>}

        {isLoading ? (
          <LoadingRows />
        ) : loadError ? (
          <ErrorState error={loadError} onRetry={refetch} />
        ) : rows.length === 0 ? (
          <EmptyState icon={SearchX} title="No accounts match">Try a different role or search term.</EmptyState>
        ) : (
          <Table>
              <thead>
                <tr>
                  <Th>User</Th>
                  <Th>Role</Th>
                  <Th>Status</Th>
                  <Th className="hidden md:table-cell">Created</Th>
                  <Th><span className="sr-only">Actions</span></Th>
                </tr>
              </thead>
              <tbody className={tbodyClass}>
                {rows.map((u) => (
                  <UserRow
                    key={u.id}
                    user={u}
                    isSelf={u.id === me.id}
                    busy={isUpdating && busyId === u.id}
                    onChange={(data) => change(u.id, data)}
                  />
                ))}
              </tbody>
            </Table>
        )}
      </div>

      <Modal open={creating} onClose={() => setCreating(false)} title="New staff account" subtitle="The user signs in with this email and temporary password">
        <CreateUserForm
          isLoading={isCreating}
          onSubmit={async (data) => {
            await createUser(data)
            setCreating(false)
          }}
        />
      </Modal>
    </AppLayout>
  )
}
