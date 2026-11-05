import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import AppLayout from '../components/layout/AppLayout'
import Button from '../components/ui/Button'
import Stat from '../components/reports/Stat'
import BarList from '../components/reports/BarList'
import VacancyTable from '../components/reports/VacancyTable'
import ReportFilters from '../components/reports/ReportFilters'
import { useJobs, useReport } from '../hooks/queries'
import { STATE_LABELS } from '../data/recruitment'
import { downloadCsv } from '../utils/csv'

const pct = (n) => (n == null ? '—' : `${n}%`)

export default function ReportsPage() {
  const [filters, setFilters] = useState({ from: '', to: '', department: '', jobId: '' })
  const { data: jobs = [] } = useJobs()
  const { data: report, isLoading, error } = useReport(filters)

  const exportCsv = () =>
    downloadCsv(`ers-recruitment-report-${new Date().toISOString().slice(0, 10)}.csv`, [
      ['Application', 'Candidate', 'Vacancy', 'Department', 'Stage', 'Applied', 'Last updated'],
      ...report.rows.map((a) => [a.ref, a.candidateName, a.job.title, a.job.department, STATE_LABELS[a.state], a.appliedAt.slice(0, 10), a.updatedAt.slice(0, 10)]),
    ])

  const t = report?.totals

  return (
    <AppLayout title="Reports" subtitle="Recruitment performance across the whole lifecycle" wide>
      <div className="space-y-8">
        <ReportFilters filters={filters} onChange={setFilters} jobs={jobs} />

        {isLoading && <Loader2 className="animate-spin text-ers-primary" aria-label="Loading" />}
        {error && <p role="alert" className="text-sm text-ers-danger">{error.message}</p>}

        {report && (
          <>
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-ers-ink-soft">{t.applications} application{t.applications === 1 ? '' : 's'} match</p>
              <Button variant="secondary" onClick={exportCsv} disabled={!t.applications}>
                <Download size={15} /> Export CSV
              </Button>
            </div>

            {t.applications === 0 ? (
              <p className="rounded-xl border border-dashed border-ers-line p-8 text-center text-sm text-ers-ink-soft">
                No applications in this range yet.
              </p>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <Stat label="Applications" value={t.applications} hint={`${t.inProgress} still in progress`} />
                  <Stat label="Hires completed" value={t.hired} hint={t.avgDaysToHire != null ? `avg ${t.avgDaysToHire} days to complete` : 'none completed yet'} />
                  <Stat label="Offer acceptance" value={pct(t.offerAcceptanceRate)} hint={`${t.offersAccepted} accepted · ${t.offersDeclined} declined`} />
                  <Stat label="Rejected" value={t.rejected} hint={`${Math.round((t.rejected / t.applications) * 100)}% of applications`} />
                </div>
                <div className="grid lg:grid-cols-2 gap-8">
                  <BarList title="Pipeline funnel" caption="How many applications ever reached each stage." items={report.funnel} />
                  <BarList title="Where applications are now" caption="Current state of every transaction." items={report.byState} />
                </div>
                <VacancyTable rows={report.byVacancy} />
              </>
            )}
          </>
        )}
      </div>
    </AppLayout>
  )
}
