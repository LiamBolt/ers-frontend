import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const DUMMY_USERS = {
  'candidate@ers.com': { email: 'candidate@ers.com', role: 'CANDIDATE', name: 'Candidate User' },
  'hr@ers.com': { email: 'hr@ers.com', role: 'HR_OFFICER', name: 'HR Officer' },
  'interviewer@ers.com': { email: 'interviewer@ers.com', role: 'INTERVIEWER', name: 'Interviewer User' },
  'manager@ers.com': { email: 'manager@ers.com', role: 'MANAGER', name: 'Manager User' },
  'admin@ers.com': { email: 'admin@ers.com', role: 'ADMIN', name: 'Admin User' }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is in localStorage
    const storedUser = localStorage.getItem('ers_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = (email) => {
    const foundUser = DUMMY_USERS[email.toLowerCase()]
    if (foundUser) {
      setUser(foundUser)
      localStorage.setItem('ers_user', JSON.stringify(foundUser))
      return { success: true, user: foundUser }
    }
    return { success: false, error: 'User not found. Please use a valid testing email.' }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('ers_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
