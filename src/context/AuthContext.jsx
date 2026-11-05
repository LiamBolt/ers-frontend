import { createContext, useContext, useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import * as authApi from '../api/auth'
import { ApiError } from '../api/client'

const AuthContext = createContext(null)

export const SESSION_KEY = ['session']

// The signed-in user comes from the server session (Auth.js cookie), never from
// localStorage. The role is re-checked server-side on every request.
export function AuthProvider({ children }) {
  const queryClient = useQueryClient()

  const { data: user = null, isLoading } = useQuery({
    queryKey: SESSION_KEY,
    queryFn: async () => {
      try {
        return await authApi.getMe()
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) return null
        throw err
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  })

  const login = useCallback(
    async (email, password) => {
      try {
        const me = await authApi.signIn(email, password)
        queryClient.setQueryData(SESSION_KEY, me)
        return { success: true, user: me }
      } catch (err) {
        return { success: false, error: err.message }
      }
    },
    [queryClient]
  )

  const logout = useCallback(async () => {
    await authApi.signOut().catch(() => undefined)
    queryClient.clear()
    queryClient.setQueryData(SESSION_KEY, null)
  }, [queryClient])

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)
