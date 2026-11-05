// Panel evaluation scoring (SRS Appendix A.2): four scores from 0 to 100.
export const SCORE_FIELDS = [
  { key: 'technical', label: 'Technical knowledge' },
  { key: 'communication', label: 'Communication' },
  { key: 'problemSolving', label: 'Problem solving' },
  { key: 'teamwork', label: 'Teamwork' },
]

export const averageScore = (evaluation) =>
  Math.round(SCORE_FIELDS.reduce((sum, f) => sum + evaluation[f.key], 0) / SCORE_FIELDS.length)
