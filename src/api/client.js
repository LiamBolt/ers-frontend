// Thin fetch wrapper. All server calls go through here (never from components).
// The base is relative (/api) so the session cookie is same-origin: Vite proxies
// it in dev and a Vercel rewrite does in production.
const BASE = import.meta.env.VITE_API_URL ?? '/api'

export class ApiError extends Error {
  constructor(message, status, fieldErrors) {
    super(message)
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

// Surfaces the first field error ("Password needs a number") for 422 responses.
function messageFrom(body, status) {
  const first = body?.errors && Object.values(body.errors).flat()[0]
  return first || body?.message || `Request failed (${status})`
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
    throw new ApiError('Cannot reach the server. Check your connection and try again.', 0)
  }

  const payload = await res.json().catch(() => null)
  if (!res.ok) throw new ApiError(messageFrom(payload, res.status), res.status, payload?.errors)
  return payload?.data
}
