import Hero from '../components/landing/Hero'
import OpenPositions from '../components/landing/OpenPositions'
import LandingFooter from '../components/landing/LandingFooter'

// Public page. Always light (the theme setting only applies inside dashboards).
export default function LandingPage() {
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
