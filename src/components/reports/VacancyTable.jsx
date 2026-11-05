export default function VacancyTable({ rows }) {
  return (
    <section>
      <h2 className="text-h3 text-ers-ink mb-3">By vacancy</h2>
      <div className="overflow-x-auto rounded-xl border border-ers-line bg-white/70">
        <table className="w-full text-sm text-left">
          <thead className="text-label text-ers-ink-soft bg-ers-ink/5">
            <tr>
              <th scope="col" className="px-4 py-3">Vacancy</th>
              <th scope="col" className="px-4 py-3">Department</th>
              <th scope="col" className="px-4 py-3 text-right">Applications</th>
              <th scope="col" className="px-4 py-3 text-right">In progress</th>
              <th scope="col" className="px-4 py-3 text-right">Hired</th>
              <th scope="col" className="px-4 py-3 text-right">Rejected</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ers-line">
            {rows.map((v) => (
              <tr key={v.job.id}>
                <td className="px-4 py-3 font-semibold text-ers-ink">{v.job.title}</td>
                <td className="px-4 py-3 text-ers-ink-soft">{v.job.department}</td>
                <td className="px-4 py-3 text-right">{v.total}</td>
                <td className="px-4 py-3 text-right">{v.active}</td>
                <td className="px-4 py-3 text-right">{v.hired}</td>
                <td className="px-4 py-3 text-right">{v.rejected}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
