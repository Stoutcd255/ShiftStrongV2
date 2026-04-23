const BODYWEIGHT_KEY = 'shiftstrong_bodyweight'

function getAllBodyweightEntries() {
  const raw = localStorage.getItem(BODYWEIGHT_KEY)
  return raw ? JSON.parse(raw) : []
}

function saveAllBodyweightEntries(entries) {
  localStorage.setItem(BODYWEIGHT_KEY, JSON.stringify(entries))
}

export function getUserBodyweightEntries(userId) {
  return getAllBodyweightEntries()
    .filter((entry) => entry.userId === userId)
    .sort((a, b) => new Date(b.loggedAt) - new Date(a.loggedAt))
}

export function addBodyweightEntry({ userId, weight, notes }) {
  const entries = getAllBodyweightEntries()

  const newEntry = {
    id: crypto.randomUUID(),
    userId,
    weight: Number(weight),
    notes: (notes || '').trim(),
    loggedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  }

  entries.push(newEntry)
  saveAllBodyweightEntries(entries)

  return newEntry
}

export function updateBodyweightEntry(entryId, updates) {
  const entries = getAllBodyweightEntries()

  const updated = entries.map((entry) => {
    if (entry.id !== entryId) return entry

    return {
      ...entry,
      weight: Number(updates.weight),
      notes: (updates.notes || '').trim(),
      updatedAt: new Date().toISOString(),
    }
  })

  saveAllBodyweightEntries(updated)
}

export function deleteBodyweightEntry(entryId) {
  const entries = getAllBodyweightEntries()
  const updated = entries.filter((entry) => entry.id !== entryId)
  saveAllBodyweightEntries(updated)
}

export function getLatestBodyweight(userId) {
  const entries = getUserBodyweightEntries(userId)
  return entries.length ? entries[0] : null
}

export function getWeeklyBodyweightChange(userId) {
  const entries = getUserBodyweightEntries(userId)
  if (entries.length < 2) return 0

  const latest = Number(entries[0].weight)
  const oldest = Number(entries[Math.min(entries.length - 1, 6)].weight)

  return Number((latest - oldest).toFixed(1))
}