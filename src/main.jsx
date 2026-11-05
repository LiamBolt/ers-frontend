import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from '@/app/App'
import { ThemeProvider } from '@/shared/theme/ThemeContext'
import ErrorBoundary from '@/app/ErrorBoundary'
import '@/styles/index.css'

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 15_000, refetchOnWindowFocus: true, retry: 1 } },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
