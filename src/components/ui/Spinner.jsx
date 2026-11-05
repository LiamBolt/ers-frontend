import { Loader2 } from 'lucide-react'

// For short inline waits (a button, a refresh). Use Skeleton for content that is loading.
export default function Spinner({ size = 18, label = 'Loading' }) {
  return <Loader2 size={size} className="animate-spin text-ers-primary" role="status" aria-label={label} />
}
