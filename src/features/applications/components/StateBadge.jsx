import Badge from '@/shared/ui/Badge'
import { STATE_LABELS, STATE_VARIANTS } from '@/shared/constants/states'

export default function StateBadge({ state, className = '' }) {
  return (
    <Badge variant={STATE_VARIANTS[state] || 'default'} className={className}>
      {STATE_LABELS[state] || state}
    </Badge>
  )
}
