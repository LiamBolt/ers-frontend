// Shapes applications into the rows an ActionList shows: { app, job, hint }.
export const toRows = (applications, hint) =>
  applications.map((app) => ({ app, job: app.job, hint: hint(app) }))
