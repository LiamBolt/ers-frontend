import { createContext, useContext, useEffect, useState } from 'react'

const KEY = 'ers_theme'
const ThemeContext = createContext({ theme: 'light', setTheme: () => {} })

// "light" | "dark", stored per device, default "light" for everyone.
// The preference only ever applies inside the signed-in dashboards: AppLayout
// calls useDocumentTheme(), and public pages (landing, sign-in, register) never
// do, so they are always light.
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(KEY) === 'dark' ? 'dark' : 'light'
    } catch {
      return 'light'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(KEY, theme)
    } catch {
      /* private mode: the choice just will not persist */
    }
  }, [theme])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

// Applies the chosen theme to <html> while a dashboard page is mounted and
// restores light when the user leaves for a public page.
// eslint-disable-next-line react-refresh/only-export-components
export function useDocumentTheme() {
  const { theme } = useContext(ThemeContext)
  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#141218' : '#FFFFFF')
    return () => {
      root.dataset.theme = 'light'
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#FFFFFF')
    }
  }, [theme])
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext)
