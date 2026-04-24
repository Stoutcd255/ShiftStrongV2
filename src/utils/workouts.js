const WORKOUTS_KEY = 'shiftstrong_workouts'

function getAllWorkouts() {
  const raw = localStorage.getItem(WORKOUTS_KEY)
  if (!raw) return []

  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveAllWorkouts(workouts) {
  localStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts))
}

export function getUserWorkouts(userId) {
  const workouts = getAllWorkouts()
  return workouts
    .filter((workout) => workout.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export function addWorkout({
  userId,
  workoutName,
  exercise,
  sets,
  reps,
  weight,
  notes,
}) {
  const workouts = getAllWorkouts()

  const newWorkout = {
    id: crypto.randomUUID(),
    userId,
    workoutName: workoutName.trim(),
    exercise: exercise.trim(),
    sets: Number(sets),
    reps: Number(reps),
    weight: Number(weight),
    notes: notes.trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  workouts.push(newWorkout)
  saveAllWorkouts(workouts)

  return newWorkout
}

export function updateWorkout(workoutId, updates) {
  const workouts = getAllWorkouts()

  const updated = workouts.map((workout) => {
    if (workout.id !== workoutId) return workout

    return {
      ...workout,
      workoutName: updates.workoutName.trim(),
      exercise: updates.exercise.trim(),
      sets: Number(updates.sets),
      reps: Number(updates.reps),
      weight: Number(updates.weight),
      notes: updates.notes.trim(),
      updatedAt: new Date().toISOString(),
    }
  })

  saveAllWorkouts(updated)
}

export function deleteWorkout(workoutId) {
  const workouts = getAllWorkouts()
  const updated = workouts.filter((workout) => workout.id !== workoutId)
  saveAllWorkouts(updated)
}
