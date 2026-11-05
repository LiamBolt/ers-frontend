// multipart: files can't travel as JSON, so the lists are sent as JSON strings
// (the server parses them in application.schema.ts).
export function toFormData(data) {
  const form = new FormData()
  form.append('jobId', data.jobId)
  form.append('fullName', data.fullName)
  form.append('phone', data.phone)
  form.append('address', data.address)
  form.append('qualifications', JSON.stringify(data.qualifications))
  form.append('experience', JSON.stringify(data.experience ?? []))
  form.append('references', JSON.stringify(data.references))
  form.append('cv', data.cv)
  return form
}
