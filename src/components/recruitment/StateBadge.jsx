import Badge from '../ui/Badge'
import { STATE_LABELS, STATE_VARIANTS } from '../../data/recruitment'

export default function StateBadge({ state, className = '' }) {
  return (
    <Badge variant={STATE_VARIANTS[state] || 'default'} className={className}>
      {STATE_LABELS[state] || state}
    </Badge>
  )
}
