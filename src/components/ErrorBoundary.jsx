import { Component } from 'react'
import { AlertTriangle } from 'lucide-react'
import StatusPage from './layout/StatusPage'
import { buttonClass } from './ui/Button'

// Catches rendering crashes anywhere below it so users see a clear page instead of
// a blank screen. Network/API failures are handled where the data loads (ErrorState).
export default class ErrorBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error, info) {
    console.error('Unhandled UI error', error, info?.componentStack)
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <StatusPage
        icon={AlertTriangle}
        title="Something went wrong"
        actions={
          <>
            <button type="button" onClick={() => window.location.reload()} className={buttonClass('primary')}>Reload page</button>
            <a href="/" className={buttonClass('secondary')}>Go to home</a>
          </>
        }
      >
        An unexpected error occurred. Reloading the page usually fixes it. If it keeps happening, please contact your administrator.
      </StatusPage>
    )
  }
}
