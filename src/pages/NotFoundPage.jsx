import { useNavigate } from 'react-router-dom'
import { HardHat, ArrowLeft } from 'lucide-react'
import Button from '../components/ui/Button'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-ers-bg flex items-center justify-center p-4">
      <div className="bg-blobs" aria-hidden="true" />
      <div className="glass-panel max-w-md w-full p-8 text-center relative z-10 flex flex-col items-center">
        <div className="w-20 h-20 bg-ers-accent/20 text-ers-accent rounded-full flex items-center justify-center mb-6 shadow-lg shadow-ers-accent/10 border border-ers-accent/20">
          <HardHat size={40} />
        </div>
        <h1 className="text-3xl font-bold text-ers-ink mb-2">Page Not Found</h1>
        <p className="text-ers-ink-soft mb-8">
          Looks like you've wandered off the path! Our maintenance team is right at it to build something great here.
        </p>
        <Button onClick={() => navigate(-1)} className="flex items-center gap-2">
          <ArrowLeft size={18} />
          Go Back
        </Button>
      </div>
    </div>
  )
}
