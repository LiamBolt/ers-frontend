import Badge from '@/shared/ui/Badge'
import { Table, Th, tbodyClass } from '@/shared/ui/Table'
import { fmtDate } from '@/shared/lib/format'
import { nextAction } from '../lib/nextAction'
import StateBadge from './StateBadge'

// One row per application; clicking a row (or the name) opens it.
export default function CandidatesTable({ applications, user, onOpen }) {
  return (
    <Table>
      <thead>
        <tr>
          <Th>Candidate</Th>
          <Th>Vacancy</Th>
          <Th>Stage</Th>
          <Th className="hidden md:table-cell">Updated</Th>
          <Th>Your next step</Th>
        </tr>
      </thead>
      <tbody className={tbodyClass}>
        {applications.map((a) => {
          const action = nextAction(a, user)
          return (
            <tr key={a.id} onClick={() => onOpen(a.id)} className="cursor-pointer hover:bg-ers-primary/5">
              <td className="px-4 py-3">
                <button
                  className="text-left font-semibold text-ers-ink hover:text-ers-primary"
                  onClick={(e) => { e.stopPropagation(); onOpen(a.id) }}
                >
                  {a.candidateName}
                </button>
                <div className="text-caption text-ers-ink-soft">{a.ref}</div>
              </td>
              <td className="px-4 py-3 text-ers-ink">
                {a.job?.title}
                <div className="text-caption text-ers-ink-soft">{a.job?.department}</div>
              </td>
              <td className="px-4 py-3"><StateBadge state={a.state} /></td>
              <td className="hidden px-4 py-3 text-ers-ink-soft md:table-cell">{fmtDate(a.updatedAt)}</td>
              <td className="px-4 py-3">
                {action ? <Badge variant="primary">{action}</Badge> : <span className="text-ers-ink-soft">—</span>}
              </td>
            </tr>
          )
        })}
      </tbody>
    </Table>
  )
}
