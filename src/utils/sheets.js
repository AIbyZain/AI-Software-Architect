/**
 * Maps every text field the backend actually returns in `architecture`
 * to a drawing-sheet definition used across the sidebar and content view.
 * Do not add fields here that the API (app.py / InputProject state) does not return.
 */
export const SHEETS = [
  { key: 'requirements', code: 'REQ', number: '01', label: 'Requirements', kind: 'doc' },
  { key: 'database', code: 'DB', number: '02', label: 'Database', kind: 'doc' },
  { key: 'backend', code: 'BE', number: '03', label: 'Backend', kind: 'doc' },
  { key: 'frontend', code: 'FE', number: '04', label: 'Frontend', kind: 'doc' },
  { key: 'api', code: 'API', number: '05', label: 'API', kind: 'doc' },
  { key: 'ai_design', code: 'AI', number: '06', label: 'AI Architecture', kind: 'doc' },
  { key: 'deployment', code: 'OPS', number: '07', label: 'DevOps', kind: 'doc' },
  { key: 'timeline', code: 'TL', number: '08', label: 'Timeline', kind: 'doc' },
  { key: 'cost', code: 'CST', number: '09', label: 'Cost', kind: 'doc' },
  { key: 'review_score', code: 'REV', number: '10', label: 'Review', kind: 'score' }
];

export function isSheetEmpty(sheet, architecture) {
  if (!architecture) return true;
  const value = architecture[sheet.key];
  if (sheet.kind === 'score') {
    return value === null || value === undefined || value === '';
  }
  return typeof value !== 'string' || value.trim().length === 0;
}
