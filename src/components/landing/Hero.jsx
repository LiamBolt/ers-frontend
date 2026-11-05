import { Link } from 'react-router-dom'
import { buttonClass } from '../ui/Button'
import LandingHeader from './LandingHeader'

// Full-bleed photo with a solid dark scrim for legibility. The header is part of
// it, so the top of the page is one continuous image.
export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-ers-sidebar">
      <picture>
        <source
          type="image/webp"
          srcSet="/images/landing-hero-800.webp 800w, /images/landing-hero-1600.webp 1600w, /images/landing-hero-2400.webp 2400w"
          sizes="100vw"
        />
        <img
          src="/images/landing-hero-1600.jpg"
          width="1600"
          height="1068"
          alt="Five candidates seated in a waiting area, reading documents on clipboards before their interviews"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[center_75%]"
        />
      </picture>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ers-sidebar/70" />

      <LandingHeader />

      <div className="mx-auto flex min-h-[560px] max-w-6xl flex-col justify-start px-4 pb-24 pt-36 sm:px-6 md:min-h-[640px] md:pt-44 lg:px-8">
        <h1 className="max-w-2xl text-4xl font-bold leading-tight text-ers-sidebar-fg sm:text-5xl">
          Your next role starts here
        </h1>
        <p className="mt-5 max-w-xl text-lg text-ers-sidebar-fg/85">
          Browse current vacancies, create an account, and follow your application from submission to offer.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#positions" className={buttonClass('primary')}>View open positions</a>
          <Link to="/login" className={buttonClass('inverse')}>Sign in</Link>
        </div>
      </div>
    </section>
  )
}
