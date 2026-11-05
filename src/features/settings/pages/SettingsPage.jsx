import AppLayout from '@/app/layout/AppLayout'
import AppearanceSettings from '@/features/settings/components/AppearanceSettings'
import AccountSummary from '@/features/settings/components/AccountSummary'
import { useAuth } from '@/features/auth/AuthContext'

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
