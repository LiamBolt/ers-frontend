import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Hero from '@/features/landing/components/Hero'
import OpenPositions from '@/features/landing/components/OpenPositions'
import LandingFooter from '@/features/landing/components/LandingFooter'

// Public page. Always light (the theme setting only applies inside dashboards).
export default function LandingPage() {
  // Arriving as /#positions (e.g. from a job page): scroll to the section.
  const { hash } = useLocation()
  useEffect(() => {
    if (hash) document.querySelector(hash)?.scrollIntoView()
  }, [hash])

  return (
    <div className="min-h-screen bg-ers-surface">
      <main>
        <Hero />
        <OpenPositions />
      </main>
      <LandingFooter />
    </div>
  )
}
