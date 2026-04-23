import { getUsers, saveUsers } from './auth'
import { getUserGoals } from './goals'

const WORKOUTS_KEY = 'shiftstrong_workouts'
const MACROS_KEY = 'shiftstrong_macros'
const GOALS_KEY = 'shiftstrong_goals'
const BODYWEIGHT_KEY = 'shiftstrong_bodyweight'
const TEMPLATES_KEY = 'shiftstrong_templates'

function readJson(key, fallback = []) {
  const raw = localStorage.getItem(key)
  return raw ? JSON.parse(raw) : fallback
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function exportAllShiftStrongData() {
  return {
    exportedAt: new Date().toISOString(),
    app: 'ShiftStrong',
    version: 1,
    users: getUsers(),
    workouts: readJson(WORKOUTS_KEY),
    macros: readJson(MACROS_KEY),
    goals: readJson(GOALS_KEY),
    bodyweight: readJson(BODYWEIGHT_KEY),
    templates: readJson(TEMPLATES_KEY),
  }
}

export function downloadExportFile() {
  const data = exportAllShiftStrongData()
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const date = new Date().toISOString().slice(0, 10)

  link.href = url
  link.download = `shiftstrong-backup-${date}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function importAllShiftStrongData(fileText) {
  const parsed = JSON.parse(fileText)

  if (!parsed || parsed.app !== 'ShiftStrong') {
    throw new Error('Invalid ShiftStrong backup file.')
  }

  saveUsers(Array.isArray(parsed.users) ? parsed.users : [])
  writeJson(WORKOUTS_KEY, Array.isArray(parsed.workouts) ? parsed.workouts : [])
  writeJson(MACROS_KEY, Array.isArray(parsed.macros) ? parsed.macros : [])
  writeJson(GOALS_KEY, Array.isArray(parsed.goals) ? parsed.goals : [])
  writeJson(BODYWEIGHT_KEY, Array.isArray(parsed.bodyweight) ? parsed.bodyweight : [])
  writeJson(TEMPLATES_KEY, Array.isArray(parsed.templates) ? parsed.templates : [])
}

export function resetAllShiftStrongData() {
  localStorage.removeItem(WORKOUTS_KEY)
  localStorage.removeItem(MACROS_KEY)
  localStorage.removeItem(GOALS_KEY)
  localStorage.removeItem(BODYWEIGHT_KEY)
  localStorage.removeItem(TEMPLATES_KEY)
}

export function exportSingleUserSummary(userId) {
  const workouts = readJson(WORKOUTS_KEY).filter((x) => x.userId === userId)
  const macros = readJson(MACROS_KEY).filter((x) => x.userId === userId)
  const bodyweight = readJson(BODYWEIGHT_KEY).filter((x) => x.userId === userId)
  const goals = getUserGoals(userId)

  return {
    workouts: workouts.length,
    macros: macros.length,
    bodyweight: bodyweight.length,
    goals,
  }
}