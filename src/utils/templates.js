const TEMPLATES_KEY = 'shiftstrong_templates'

function getAllTemplates() {
  const raw = localStorage.getItem(TEMPLATES_KEY)
  return raw ? JSON.parse(raw) : []
}

function saveAllTemplates(templates) {
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates))
}

export function getUserTemplates(userId) {
  return getAllTemplates()
    .filter((template) => template.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export function addWorkoutTemplate({
  userId,
  name,
  exercise,
  sets,
  reps,
  weight,
  notes,
}) {
  const templates = getAllTemplates()

  const newTemplate = {
    id: crypto.randomUUID(),
    userId,
    name: name.trim(),
    exercise: exercise.trim(),
    sets: Number(sets),
    reps: Number(reps),
    weight: Number(weight),
    notes: (notes || '').trim(),
    createdAt: new Date().toISOString(),
  }

  templates.push(newTemplate)
  saveAllTemplates(templates)

  return newTemplate
}

export function deleteWorkoutTemplate(templateId) {
  const templates = getAllTemplates()
  const updated = templates.filter((template) => template.id !== templateId)
  saveAllTemplates(updated)
}