export const fmtDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—'

export const fmtDateTime = (iso) =>
  iso
    ? new Date(iso).toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—'

export const fmtMoney = (n) => `UGX ${Number(n).toLocaleString('en-US')}`

export const daysBetween = (fromIso, toIso = new Date().toISOString()) =>
  Math.max(0, Math.round((new Date(toIso) - new Date(fromIso)) / 86400000))
