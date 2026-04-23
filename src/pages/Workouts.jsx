import { useEffect, useMemo, useState } from 'react'
import {
  addWorkout,
  deleteWorkout,
  getUserWorkouts,
  updateWorkout,
} from '../utils/workouts'
import {
  addWorkoutTemplate,
  deleteWorkoutTemplate,
  getUserTemplates,
} from '../utils/templates'

export default function Workouts({ currentUser, onDataChanged }) {
  const [workoutName, setWorkoutName] = useState('')
  const [exercise, setExercise] = useState('')
  const [sets, setSets] = useState('')
  const [reps, setReps] = useState('')
  const [weight, setWeight] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [savedWorkouts, setSavedWorkouts] = useState([])
  const [templates, setTemplates] = useState([])
  const [editingId, setEditingId] = useState(null)

  const [templateName, setTemplateName] = useState('')
  const [templateMessage, setTemplateMessage] = useState('')

  useEffect(() => {
    if (currentUser?.userId) {
      loadWorkouts()
      loadTemplates()
    }
  }, [currentUser])

  function loadWorkouts() {
    const workouts = getUserWorkouts(currentUser.userId)
    setSavedWorkouts(workouts)
  }

  function loadTemplates() {
    const data = getUserTemplates(currentUser.userId)
    setTemplates(data)
  }

  function resetForm() {
    setWorkoutName('')
    setExercise('')
    setSets('')
    setReps('')
    setWeight('')
    setNotes('')
    setEditingId(null)
    setError('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!workoutName.trim() || !exercise.trim()) {
      setError('Workout name and exercise are required.')
      return
    }

    if (!sets || !reps || weight === '') {
      setError('Sets, reps, and weight are required.')
      return
    }

    if (Number(sets) <= 0 || Number(reps) <= 0 || Number(weight) < 0) {
      setError('Enter valid numbers for sets, reps, and weight.')
      return
    }

    const payload = {
      workoutName,
      exercise,
      sets,
      reps,
      weight,
      notes,
    }

    if (editingId) {
      updateWorkout(editingId, payload)
    } else {
      addWorkout({
        userId: currentUser.userId,
        ...payload,
      })
    }

    resetForm()
    loadWorkouts()
    onDataChanged()
  }

  function handleDelete(workoutId) {
    deleteWorkout(workoutId)
    loadWorkouts()
    onDataChanged()
  }

  function handleEdit(workout) {
    setEditingId(workout.id)
    setWorkoutName(workout.workoutName)
    setExercise(workout.exercise)
    setSets(String(workout.sets))
    setReps(String(workout.reps))
    setWeight(String(workout.weight))
    setNotes(workout.notes || '')
  }

  function handleSaveTemplate() {
    if (!templateName.trim() || !exercise.trim() || !sets || !reps || weight === '') {
      setTemplateMessage('Fill out the workout form first, then name the template.')
      return
    }

    addWorkoutTemplate({
      userId: currentUser.userId,
      name: templateName,
      exercise,
      sets,
      reps,
      weight,
      notes,
    })

    setTemplateName('')
    setTemplateMessage('Template saved.')
    loadTemplates()

    setTimeout(() => {
      setTemplateMessage('')
    }, 1800)
  }

  function handleApplyTemplate(template) {
    setWorkoutName(template.name)
    setExercise(template.exercise)
    setSets(String(template.sets))
    setReps(String(template.reps))
    setWeight(String(template.weight))
    setNotes(template.notes || '')
    setEditingId(null)
    setError('')
  }

  function handleDeleteTemplate(templateId) {
    deleteWorkoutTemplate(templateId)
    loadTemplates()
  }

  const latestWorkout = useMemo(() => {
    return savedWorkouts.length > 0 ? savedWorkouts[0] : null
  }, [savedWorkouts])

  const workoutCount = savedWorkouts.length

  const totalVolume = savedWorkouts.reduce((sum, workout) => {
    return sum + Number(workout.sets) * Number(workout.reps) * Number(workout.weight)
  }, 0)

  return (
    <div className="ss-page ss-module-page">
      <section className="ss-module-hero-card ss-card">
        <div className="ss-module-hero-copy">
          <div className="ss-hero-eyebrow">TRAINING MODULE</div>
          <h1 className="ss-page-title">WORKOUTS</h1>
          <p className="ss-page-sub">
            Log strength sessions, track volume, and save templates for faster entries.
          </p>

          <div className="ss-module-hero-actions">
            <button className="ss-primary-button" onClick={() => document.getElementById('ss-workout-form')?.scrollIntoView({ behavior: 'smooth' })}>
              {editingId ? 'CONTINUE EDITING' : 'LOG WORKOUT'}
            </button>

            {editingId ? (
              <button className="ss-secondary-button" onClick={resetForm}>
                CANCEL EDIT
              </button>
            ) : null}
          </div>
        </div>

        <div className="ss-module-hero-stats">
          <ModuleStatCard label="SESSIONS" value={workoutCount} sub="Total logged" />
          <ModuleStatCard
            label="LAST SESSION"
            value={latestWorkout ? latestWorkout.exercise : '—'}
            sub={latestWorkout ? latestWorkout.workoutName : 'No entry yet'}
            compact
          />
          <ModuleStatCard
            label="TOTAL VOLUME"
            value={totalVolume > 0 ? totalVolume.toLocaleString() : '0'}
            sub="All logged sessions"
          />
        </div>
      </section>

      <section className="ss-module-grid">
        <div className="ss-card ss-page-card ss-form-command-card" id="ss-workout-form">
          <div className="ss-section-title">
            {editingId ? 'EDIT WORKOUT ENTRY' : 'WORKOUT LOGGER'}
          </div>

          <form className="ss-form" onSubmit={handleSubmit}>
            <div className="ss-form-grid two">
              <div className="ss-field">
                <label className="ss-label">Workout Name</label>
                <input
                  className="ss-input"
                  type="text"
                  placeholder="Upper Body Strength"
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                />
              </div>

              <div className="ss-field">
                <label className="ss-label">Exercise</label>
                <input
                  className="ss-input"
                  type="text"
                  placeholder="Bench Press"
                  value={exercise}
                  onChange={(e) => setExercise(e.target.value)}
                />
              </div>
            </div>

            <div className="ss-form-grid three">
              <div className="ss-field">
                <label className="ss-label">Sets</label>
                <input
                  className="ss-input"
                  type="number"
                  placeholder="4"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                />
              </div>

              <div className="ss-field">
                <label className="ss-label">Reps</label>
                <input
                  className="ss-input"
                  type="number"
                  placeholder="8"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                />
              </div>

              <div className="ss-field">
                <label className="ss-label">Weight</label>
                <input
                  className="ss-input"
                  type="number"
                  placeholder="225"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
            </div>

            <div className="ss-field">
              <label className="ss-label">Notes</label>
              <textarea
                className="ss-textarea"
                placeholder="Optional notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {error ? <div className="ss-form-error">{error}</div> : null}

            <div className="ss-button-row">
              <button className="ss-primary-button" type="submit">
                {editingId ? 'UPDATE WORKOUT' : 'SAVE WORKOUT'}
              </button>

              {editingId ? (
                <button className="ss-secondary-button" type="button" onClick={resetForm}>
                  CANCEL
                </button>
              ) : null}
            </div>
          </form>

          <div className="ss-template-builder">
            <div className="ss-section-title">SAVE AS TEMPLATE</div>

            <div className="ss-button-row">
              <input
                className="ss-input"
                type="text"
                placeholder="Template name"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
              />
              <button className="ss-secondary-button" type="button" onClick={handleSaveTemplate}>
                SAVE TEMPLATE
              </button>
            </div>

            {templateMessage ? <div className="ss-inline-message">{templateMessage}</div> : null}
          </div>
        </div>

        <div className="ss-module-side-column">
          <div className="ss-card ss-page-card ss-side-panel-card">
            <div className="ss-section-title">LATEST ENTRY</div>

            {latestWorkout ? (
              <div className="ss-summary-block">
                <div className="ss-summary-title">{latestWorkout.workoutName}</div>
                <div className="ss-summary-row">
                  <span>Exercise</span>
                  <strong>{latestWorkout.exercise}</strong>
                </div>
                <div className="ss-summary-row">
                  <span>Sets</span>
                  <strong>{latestWorkout.sets}</strong>
                </div>
                <div className="ss-summary-row">
                  <span>Reps</span>
                  <strong>{latestWorkout.reps}</strong>
                </div>
                <div className="ss-summary-row">
                  <span>Weight</span>
                  <strong>{latestWorkout.weight} lb</strong>
                </div>
                <div className="ss-summary-note">
                  {latestWorkout.notes || 'No notes added.'}
                </div>
              </div>
            ) : (
              <p className="ss-muted-note">No workout logged yet.</p>
            )}
          </div>

          <div className="ss-card ss-page-card ss-side-panel-card">
            <div className="ss-section-title">TEMPLATES</div>

            {templates.length === 0 ? (
              <p className="ss-muted-note">No templates saved yet.</p>
            ) : (
              <div className="ss-template-list">
                {templates.map((template) => (
                  <div key={template.id} className="ss-template-row">
                    <div className="ss-template-meta">
                      <div className="ss-workout-title">{template.name}</div>
                      <div className="ss-workout-sub">
                        {template.exercise} • {template.sets}x{template.reps} • {template.weight} lb
                      </div>
                    </div>

                    <div className="ss-row-actions">
                      <button className="ss-small-button" onClick={() => handleApplyTemplate(template)}>
                        Use
                      </button>
                      <button className="ss-danger-button" onClick={() => handleDeleteTemplate(template.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="ss-card ss-page-card">
        <div className="ss-section-title">RECENT SESSIONS</div>

        {savedWorkouts.length === 0 ? (
          <p className="ss-muted-note">No workout history yet.</p>
        ) : (
          <div className="ss-workout-list">
            {savedWorkouts.map((workout) => (
              <div className="ss-workout-row" key={workout.id}>
                <div className="ss-workout-row-left">
                  <div className="ss-recent-icon">⌁</div>

                  <div className="ss-workout-meta">
                    <div className="ss-workout-title">{workout.workoutName}</div>
                    <div className="ss-workout-sub">
                      {workout.exercise} • {workout.sets} sets • {workout.reps} reps • {workout.weight} lb
                    </div>
                    {workout.notes ? (
                      <div className="ss-workout-note">{workout.notes}</div>
                    ) : null}
                  </div>
                </div>

                <div className="ss-row-actions">
                  <button className="ss-small-button" onClick={() => handleEdit(workout)}>
                    Edit
                  </button>

                  <button className="ss-danger-button" onClick={() => handleDelete(workout.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function ModuleStatCard({ label, value, sub, compact = false }) {
  return (
    <div className={`ss-module-stat-card ${compact ? 'compact' : ''}`}>
      <div className="ss-module-stat-label">{label}</div>
      <div className="ss-module-stat-value">{value}</div>
      <div className="ss-module-stat-sub">{sub}</div>
    </div>
  )
}