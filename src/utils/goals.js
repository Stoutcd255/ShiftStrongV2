const GOALS_KEY = 'shiftstrong_goals'

function getAllGoals() {
  const raw = localStorage.getItem(GOALS_KEY)
  return raw ? JSON.parse(raw) : []
}

function saveAllGoals(goals) {
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals))
}

export function getUserGoals(userId) {
  const allGoals = getAllGoals()
  const found = allGoals.find((goal) => goal.userId === userId)

  if (found) return found

  return {
    userId,
    calories: 3000,
    protein: 220,
    carbs: 300,
    fats: 80,
  }
}

export function saveUserGoals(userId, goals) {
  const allGoals = getAllGoals()
  const existingIndex = allGoals.findIndex((goal) => goal.userId === userId)

  const goalRecord = {
    userId,
    calories: Number(goals.calories),
    protein: Number(goals.protein),
    carbs: Number(goals.carbs),
    fats: Number(goals.fats),
    updatedAt: new Date().toISOString(),
  }

  if (existingIndex >= 0) {
    allGoals[existingIndex] = goalRecord
  } else {
    allGoals.push(goalRecord)
  }

  saveAllGoals(allGoals)
  return goalRecord
}