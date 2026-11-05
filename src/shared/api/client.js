// Thin fetch wrapper. All server calls go through here (never from components).
// The base is relative (/api) so the session cookie is same-origin: Vite proxies
// it in dev and a Vercel rewrite does in production.
const BASE = import.meta.env.VITE_API_URL ?? '/api'

// Why a request failed, in terms the UI can act on.
//   network      no response at all (offline, API down, proxy cannot connect)
//   unavailable  502/503/504 (service starting up or temporarily down)
//   server       other 5xx (our bug)
//   auth         401 (not signed in / session expired)
//   permission   403
//   notfound     404
//   limit        429
//   validation   400/409/422 (the user can fix it; the server explains how)
export function kindFor(status) {
  if (status === 0) return 'network'
  if ([502, 503, 504].includes(status)) return 'unavailable'
  if (status >= 500) return 'server'
  if (status === 401) return 'auth'
  if (status === 403) return 'permission'
  if (status === 404) return 'notfound'
  if (status === 429) return 'limit'
  if (status >= 400) return 'validation'
  return 'unknown'
}

// Fallback wording per kind. Server-provided messages are kept for 4xx (they are
// written for people), but 5xx bodies are never shown: they are not user-facing.
const FRIENDLY = {
  network: 'We could not reach the server. Check your internet connection and try again.',
  unavailable: 'The service is starting up or temporarily unavailable. Please try again in a few seconds.',
  server: 'Something went wrong on our side. Please try again in a moment.',
  auth: 'Your session has expired. Please sign in again.',
  permission: 'You do not have permission to do that.',
  notfound: 'We could not find what you were looking for.',
  limit: 'Too many requests. Please wait a moment and try again.',
  validation: 'Please check the details you entered and try again.',
  unknown: 'Something unexpected happened. Please try again.',
}

// Only these are worth offering a "Try again" button for.
const RETRYABLE = new Set(['network', 'unavailable', 'server', 'limit', 'unknown'])

export class ApiError extends Error {
  constructor(message, status, fieldErrors, kind = kindFor(status)) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
    this.kind = kind
    this.retryable = RETRYABLE.has(kind)
  }
}

function messageFrom(body, status) {
  const kind = kindFor(status)
  if (kind === 'network' || kind === 'unavailable' || kind === 'server') return FRIENDLY[kind]
  const first = body?.errors && Object.values(body.errors).flat()[0] // first field error for 422
  return first || body?.message || FRIENDLY[kind]
}

export async function request(path, { method = 'GET', json, form, query } = {}) {
  const qs = query
    ? '?' + new URLSearchParams(Object.entries(query).filter(([, v]) => v !== '' && v != null)).toString()
    : ''
  const headers = {}
  let body
  if (json !== undefined) {
    headers['Content-Type'] = 'application/json'
    body = JSON.stringify(json)
  } else if (form) {
    body = form // browser sets the multipart boundary
  }

  let res
  try {
    res = await fetch(`${BASE}${path}${qs}`, { method, headers, body, credentials: 'include' })
  } catch {
    throw new ApiError(FRIENDLY.network, 0)
  }

  const payload = await res.json().catch(() => null)
  if (!res.ok) throw new ApiError(messageFrom(payload, res.status), res.status, payload?.errors)
  return payload?.data
}
