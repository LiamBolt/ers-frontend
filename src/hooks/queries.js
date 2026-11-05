import { useQuery } from '@tanstack/react-query'
import * as applicationsApi from '../api/applications'
import * as jobsApi from '../api/jobs'
import * as notificationsApi from '../api/notifications'
import * as usersApi from '../api/users'

export const keys = {
  applications: ['applications'],
  application: (id) => ['applications', id],
  jobs: ['jobs'],
  publicJobs: ['jobs', 'public'],
  panelists: ['panelists'],
  report: (filters) => ['report', filters],
  notifications: ['notifications'],
  users: ['users'],
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

// Admin only: the server refuses this list for every other role.
export const useUsers = () => useQuery({ queryKey: keys.users, queryFn: usersApi.listUsers })

// Open vacancies for visitors; the server exposes no internal fields here.
export const usePublicJobs = () => useQuery({ queryKey: keys.publicJobs, queryFn: jobsApi.listPublicJobs })
