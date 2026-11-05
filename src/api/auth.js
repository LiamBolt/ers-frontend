import { request, ApiError } from './client'

const BASE = import.meta.env.VITE_API_URL ?? '/api'

async function csrfToken() {
  const res = await fetch(`${BASE}/auth/csrf`, { credentials: 'include' })
  return (await res.json()).csrfToken
}

// Auth.js (NextAuth) credentials sign-in. It answers 200 either way; success is
// confirmed by the session cookie, so we check /accounts/me afterwards.
export async function signIn(email, password) {
  const csrf = await csrfToken()
  await fetch(`${BASE}/auth/callback/credentials`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-Auth-Return-Redirect': '1' },
    body: new URLSearchParams({ csrfToken: csrf, email, password }),
  })
  try {
    return await getMe()
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) throw new ApiError('Invalid email or password.', 401)
    throw err
  }
}

export async function signOut() {
  const csrf = await csrfToken()
  await fetch(`${BASE}/auth/signout`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-Auth-Return-Redirect': '1' },
    body: new URLSearchParams({ csrfToken: csrf }),
  })
}

export const getMe = () => request('/accounts/me')
export const register = (data) => request('/accounts/register', { method: 'POST', json: data })
