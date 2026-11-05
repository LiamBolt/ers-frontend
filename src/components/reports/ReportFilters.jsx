import Input from '../ui/Input'
import Select from '../ui/Select'
import { DEPARTMENTS } from '../../data/recruitment'

// FR-12: filter by date range, department and vacancy.
export default function ReportFilters({ filters, onChange, jobs }) {
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value })
  return (
    <section aria-label="Filters" className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
      <Input label="Applied from" type="date" value={filters.from} onChange={set('from')} />
      <Input label="Applied to" type="date" value={filters.to} onChange={set('to')} />
      <Select label="Department" value={filters.department} onChange={set('department')}>
        <option value="">All departments</option>
        {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
      </Select>
      <Select label="Vacancy" value={filters.jobId} onChange={set('jobId')}>
        <option value="">All vacancies</option>
        {jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
      </Select>
    </section>
  )
}
