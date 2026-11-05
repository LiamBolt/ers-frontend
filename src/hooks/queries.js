import { useQuery } from '@tanstack/react-query'
import * as applicationsApi from '../api/applications'
import * as jobsApi from '../api/jobs'
import * as notificationsApi from '../api/notifications'

export const keys = {
  applications: ['applications'],
  application: (id) => ['applications', id],
  jobs: ['jobs'],
  panelists: ['panelists'],
  report: (filters) => ['report', filters],
  notifications: ['notifications'],
}

// The server already scopes each list to what the signed-in role may see.
export const useApplications = () =>
  useQuery({ queryKey: keys.applications, queryFn: applicationsApi.listApplications })

export const useApplication = (id) =>
  useQuery({ queryKey: keys.application(id), queryFn: () => applicationsApi.getApplication(id), enabled: !!id })

export const useJobs = () => useQuery({ queryKey: keys.jobs, queryFn: jobsApi.listJobs })

export const usePanelists = (enabled = true) =>
  useQuery({ queryKey: keys.panelists, queryFn: applicationsApi.listPanelists, enabled })

export const useReport = (filters) =>
  useQuery({ queryKey: keys.report(filters), queryFn: () => applicationsApi.getReport(filters), placeholderData: (prev) => prev })

export const useNotificationCount = () =>
  useQuery({ queryKey: [...keys.notifications, 'count'], queryFn: notificationsApi.countNotifications, refetchInterval: 60_000 })
