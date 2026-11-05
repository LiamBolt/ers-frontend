// One table vocabulary for every list in the app.
// <Table><thead><tr><Th>..</Th></tr></thead><tbody>...</tbody></Table>
export function Table({ children, className = '' }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-ers-line bg-ers-surface">
      <table className={`w-full text-sm text-left ${className}`}>{children}</table>
    </div>
  )
}

export function Th({ children, className = '', align = 'left' }) {
  return (
    <th
      scope="col"
      className={`whitespace-nowrap bg-ers-bg/60 px-4 py-3 text-label text-ers-ink-soft ${align === 'right' ? 'text-right' : ''} ${className}`}
    >
      {children}
    </th>
  )
}

export function Td({ children, className = '', align = 'left' }) {
  return <td className={`px-4 py-3 align-middle ${align === 'right' ? 'text-right tabular-nums' : ''} ${className}`}>{children}</td>
}

export const tbodyClass = 'divide-y divide-ers-line'
