import AppLayout from '../components/layout/AppLayout'
import AppearanceSettings from '../components/settings/AppearanceSettings'
import AccountSummary from '../components/settings/AccountSummary'
import { useAuth } from '../context/AuthContext'

export default function SettingsPage() {
  const { user } = useAuth()
  return (
    <AppLayout title="Settings" subtitle="Manage how ERS looks and review your account">
      <div className="grid items-start gap-10 lg:grid-cols-2">
        <AppearanceSettings />
        <AccountSummary user={user} />
      </div>
    </AppLayout>
  )
}
