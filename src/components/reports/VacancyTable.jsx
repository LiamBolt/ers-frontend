import { Table, Th, tbodyClass } from '../ui/Table'

export default function VacancyTable({ rows }) {
  return (
    <section>
      <h2 className="text-h3 text-ers-ink mb-3">By vacancy</h2>
      <Table>
          <thead>
            <tr>
              <Th>Vacancy</Th>
              <Th>Department</Th>
              <Th align="right">Applications</Th>
              <Th align="right">In progress</Th>
              <Th align="right">Hired</Th>
              <Th align="right">Rejected</Th>
            </tr>
          </thead>
          <tbody className={tbodyClass}>
            {rows.map((v) => (
              <tr key={v.job.id}>
                <td className="px-4 py-3 font-semibold text-ers-ink">{v.job.title}</td>
                <td className="px-4 py-3 text-ers-ink-soft">{v.job.department}</td>
                <td className="px-4 py-3 text-right tabular-nums">{v.total}</td>
                <td className="px-4 py-3 text-right tabular-nums">{v.active}</td>
                <td className="px-4 py-3 text-right tabular-nums">{v.hired}</td>
                <td className="px-4 py-3 text-right tabular-nums">{v.rejected}</td>
              </tr>
            ))}
          </tbody>
        </Table>
    </section>
  )
}
