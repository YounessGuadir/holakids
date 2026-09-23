import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { fetchCurrentUser, loginRequest, registerRequest } from '../api/authApi'

const AuthContext = createContext(null)
const TOKEN_KEY = 'holakids_token'
const USER_KEY = 'holakids_user'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => window.localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(() => {
    try { return JSON.parse(window.localStorage.getItem(USER_KEY)) } catch { return null }
  })
  const [checking, setChecking] = useState(Boolean(token))

  const clearSession = useCallback(() => {
    window.localStorage.removeItem(TOKEN_KEY)
    window.localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const saveSession = useCallback((response) => {
    window.localStorage.setItem(TOKEN_KEY, response.accessToken)
    window.localStorage.setItem(USER_KEY, JSON.stringify(response.user))
    setToken(response.accessToken)
    setUser(response.user)
    return response.user
  }, [])

  useEffect(() => {
    if (!token) { setChecking(false); return }
    fetchCurrentUser()
      .then((currentUser) => {
        window.localStorage.setItem(USER_KEY, JSON.stringify(currentUser))
        setUser(currentUser)
      })
      .catch(clearSession)
      .finally(() => setChecking(false))
  }, [clearSession, token])

  const value = useMemo(() => ({
    token, user, checking,
    authenticated: Boolean(token && user),
    isAdmin: user?.role === 'ADMIN',
    login: async (credentials) => saveSession(await loginRequest(credentials)),
    register: async (payload) => saveSession(await registerRequest(payload)),
    logout: clearSession,
  }), [checking, clearSession, saveSession, token, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth doit être utilisé dans AuthProvider')
  return context
}
