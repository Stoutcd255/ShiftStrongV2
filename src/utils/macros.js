const MACROS_KEY = 'shiftstrong_macros'

function getAllMacros() {
  const raw = localStorage.getItem(MACROS_KEY)
  return raw ? JSON.parse(raw) : []
}

function saveAllMacros(entries) {
  localStorage.setItem(MACROS_KEY, JSON.stringify(entries))
}

export function getUserMacros(userId) {
  const entries = getAllMacros()

  return entries
    .filter((entry) => entry.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export function addMacroEntry({
  userId,
  mealName,
  calories,
  protein,
  carbs,
  fats,
  notes,
}) {
  const entries = getAllMacros()

  const newEntry = {
    id: crypto.randomUUID(),
    userId,
    mealName: mealName.trim(),
    calories: Number(calories),
    protein: Number(protein),
    carbs: Number(carbs),
    fats: Number(fats),
    notes: notes.trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  entries.push(newEntry)
  saveAllMacros(entries)

  return newEntry
}

export function updateMacroEntry(entryId, updates) {
  const entries = getAllMacros()

  const updated = entries.map((entry) => {
    if (entry.id !== entryId) return entry

    return {
      ...entry,
      mealName: updates.mealName.trim(),
      calories: Number(updates.calories),
      protein: Number(updates.protein),
      carbs: Number(updates.carbs),
      fats: Number(updates.fats),
      notes: updates.notes.trim(),
      updatedAt: new Date().toISOString(),
    }
  })

  saveAllMacros(updated)
}

export function deleteMacroEntry(entryId) {
  const entries = getAllMacros()
  const updated = entries.filter((entry) => entry.id !== entryId)
  saveAllMacros(updated)
}

export function getTodayMacroTotals(userId) {
  const entries = getUserMacros(userId)

  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const day = today.getDate()

  const todaysEntries = entries.filter((entry) => {
    const date = new Date(entry.createdAt)
    return (
      date.getFullYear() === year &&
      date.getMonth() === month &&
      date.getDate() === day
    )
  })

  return todaysEntries.reduce(
    (totals, entry) => {
      totals.calories += entry.calories || 0
      totals.protein += entry.protein || 0
      totals.carbs += entry.carbs || 0
      totals.fats += entry.fats || 0
      return totals
    },
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
    }
  )
}