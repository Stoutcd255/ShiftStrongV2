import { useEffect, useMemo, useState } from 'react'
import {
  addMacroEntry,
  deleteMacroEntry,
  getTodayMacroTotals,
  getUserMacros,
  updateMacroEntry,
} from '../utils/macros'
import { getUserGoals } from '../utils/goals'

export default function Macros({ currentUser, onDataChanged }) {
  const [mealName, setMealName] = useState('')
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [carbs, setCarbs] = useState('')
  const [fats, setFats] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [savedEntries, setSavedEntries] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [goals, setGoals] = useState({
    calories: 3000,
    protein: 220,
    carbs: 300,
    fats: 80,
  })

  useEffect(() => {
    if (currentUser?.userId) {
      loadEntries()
      setGoals(getUserGoals(currentUser.userId))
    }
  }, [currentUser])

  function loadEntries() {
    const entries = getUserMacros(currentUser.userId)
    setSavedEntries(entries)
  }

  function resetForm() {
    setMealName('')
    setCalories('')
    setProtein('')
    setCarbs('')
    setFats('')
    setNotes('')
    setEditingId(null)
    setError('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!mealName.trim()) {
      setError('Meal name is required.')
      return
    }

    if (!calories || !protein || !carbs || !fats) {
      setError('Calories, protein, carbs, and fats are required.')
      return
    }

    if (
      Number(calories) < 0 ||
      Number(protein) < 0 ||
      Number(carbs) < 0 ||
      Number(fats) < 0
    ) {
      setError('Enter valid macro values.')
      return
    }

    const payload = {
      mealName,
      calories,
      protein,
      carbs,
      fats,
      notes,
    }

    if (editingId) {
      updateMacroEntry(editingId, payload)
    } else {
      addMacroEntry({
        userId: currentUser.userId,
        ...payload,
      })
    }

    resetForm()
    loadEntries()
    onDataChanged()
  }

  function handleDelete(entryId) {
    deleteMacroEntry(entryId)
    loadEntries()
    onDataChanged()
  }

  function handleEdit(entry) {
    setEditingId(entry.id)
    setMealName(entry.mealName)
    setCalories(String(entry.calories))
    setProtein(String(entry.protein))
    setCarbs(String(entry.carbs))
    setFats(String(entry.fats))
    setNotes(entry.notes || '')
  }

  const todaysTotals = useMemo(() => {
    return getTodayMacroTotals(currentUser.userId)
  }, [savedEntries, currentUser.userId])

  const latestEntry = useMemo(() => {
    return savedEntries.length > 0 ? savedEntries[0] : null
  }, [savedEntries])

  return (
    <div className="ss-page ss-module-page">
      <section className="ss-module-hero-card ss-card">
        <div className="ss-module-hero-copy">
          <div className="ss-hero-eyebrow">NUTRITION MODULE</div>
          <h1 className="ss-page-title">MACROS</h1>
          <p className="ss-page-sub">
            Track meals, calories, protein, carbs, and fats with precision.
          </p>

          <div className="ss-module-hero-actions">
            <button className="ss-primary-button" onClick={() => document.getElementById('ss-macro-form')?.scrollIntoView({ behavior: 'smooth' })}>
              {editingId ? 'CONTINUE EDITING' : 'LOG MEAL'}
            </button>

            {editingId ? (
              <button className="ss-secondary-button" onClick={resetForm}>
                CANCEL EDIT
              </button>
            ) : null}
          </div>
        </div>

        <div className="ss-module-hero-stats">
          <ModuleStatCard label="TODAY CAL" value={todaysTotals.calories} sub={`Goal ${goals.calories}`} />
          <ModuleStatCard label="PROTEIN" value={`${todaysTotals.protein}g`} sub={`Goal ${goals.protein}g`} />
          <ModuleStatCard label="ENTRIES" value={savedEntries.length} sub="Total logged" />
        </div>
      </section>

      <section className="ss-module-grid">
        <div className="ss-card ss-page-card ss-form-command-card" id="ss-macro-form">
          <div className="ss-section-title">
            {editingId ? 'EDIT MACRO ENTRY' : 'MACRO LOGGER'}
          </div>

          <form className="ss-form" onSubmit={handleSubmit}>
            <div className="ss-form-grid one">
              <div className="ss-field">
                <label className="ss-label">Meal Name</label>
                <input
                  className="ss-input"
                  type="text"
                  placeholder="Chicken and rice"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                />
              </div>
            </div>

            <div className="ss-form-grid four">
              <div className="ss-field">
                <label className="ss-label">Calories</label>
                <input
                  className="ss-input"
                  type="number"
                  placeholder="550"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                />
              </div>

              <div className="ss-field">
                <label className="ss-label">Protein</label>
                <input
                  className="ss-input"
                  type="number"
                  placeholder="45"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                />
              </div>

              <div className="ss-field">
                <label className="ss-label">Carbs</label>
                <input
                  className="ss-input"
                  type="number"
                  placeholder="52"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                />
              </div>

              <div className="ss-field">
                <label className="ss-label">Fats</label>
                <input
                  className="ss-input"
                  type="number"
                  placeholder="14"
                  value={fats}
                  onChange={(e) => setFats(e.target.value)}
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
                {editingId ? 'UPDATE MACROS' : 'SAVE MACROS'}
              </button>

              {editingId ? (
                <button className="ss-secondary-button" type="button" onClick={resetForm}>
                  CANCEL
                </button>
              ) : null}
            </div>
          </form>
        </div>

        <div className="ss-module-side-column">
          <div className="ss-card ss-page-card ss-side-panel-card">
            <div className="ss-section-title">TODAY</div>

            <div className="ss-summary-block">
              <MacroGoalRow label="Calories" current={todaysTotals.calories} goal={goals.calories} />
              <MacroGoalRow label="Protein" current={todaysTotals.protein} goal={goals.protein} suffix="g" />
              <MacroGoalRow label="Carbs" current={todaysTotals.carbs} goal={goals.carbs} suffix="g" />
              <MacroGoalRow label="Fats" current={todaysTotals.fats} goal={goals.fats} suffix="g" />
            </div>
          </div>

          <div className="ss-card ss-page-card ss-side-panel-card">
            <div className="ss-section-title">LATEST ENTRY</div>

            {latestEntry ? (
              <div className="ss-summary-block">
                <div className="ss-summary-title">{latestEntry.mealName}</div>
                <div className="ss-summary-row">
                  <span>Calories</span>
                  <strong>{latestEntry.calories}</strong>
                </div>
                <div className="ss-summary-row">
                  <span>Protein</span>
                  <strong>{latestEntry.protein}g</strong>
                </div>
                <div className="ss-summary-row">
                  <span>Carbs</span>
                  <strong>{latestEntry.carbs}g</strong>
                </div>
                <div className="ss-summary-row">
                  <span>Fats</span>
                  <strong>{latestEntry.fats}g</strong>
                </div>
                <div className="ss-summary-note">
                  {latestEntry.notes || 'No notes added.'}
                </div>
              </div>
            ) : (
              <p className="ss-muted-note">No macro entries logged yet.</p>
            )}
          </div>
        </div>
      </section>

      <section className="ss-card ss-page-card">
        <div className="ss-section-title">RECENT ENTRIES</div>

        {savedEntries.length === 0 ? (
          <p className="ss-muted-note">No macro history yet.</p>
        ) : (
          <div className="ss-workout-list">
            {savedEntries.map((entry) => (
              <div className="ss-workout-row" key={entry.id}>
                <div className="ss-workout-row-left">
                  <div className="ss-recent-icon">⌂</div>

                  <div className="ss-workout-meta">
                    <div className="ss-workout-title">{entry.mealName}</div>
                    <div className="ss-workout-sub">
                      {entry.calories} cal • {entry.protein}p • {entry.carbs}c • {entry.fats}f
                    </div>
                    {entry.notes ? (
                      <div className="ss-workout-note">{entry.notes}</div>
                    ) : null}
                  </div>
                </div>

                <div className="ss-row-actions">
                  <button className="ss-small-button" onClick={() => handleEdit(entry)}>
                    Edit
                  </button>

                  <button className="ss-danger-button" onClick={() => handleDelete(entry.id)}>
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

function ModuleStatCard({ label, value, sub }) {
  return (
    <div className="ss-module-stat-card">
      <div className="ss-module-stat-label">{label}</div>
      <div className="ss-module-stat-value">{value}</div>
      <div className="ss-module-stat-sub">{sub}</div>
    </div>
  )
}

function MacroGoalRow({ label, current, goal, suffix = '' }) {
  const fill = Math.min((current / Math.max(goal, 1)) * 100, 100)

  return (
    <div className="ss-progress-row">
      <div className="ss-progress-row-top">
        <span className="ss-progress-row-label">{label}</span>

        <div className="ss-progress-row-values">
          <strong>
            {current}
            {suffix}
          </strong>
          <span>
            / {goal}
            {suffix}
          </span>
        </div>
      </div>

      <div className="ss-progress-track">
        <div className="ss-progress-fill" style={{ width: `${fill}%` }} />
      </div>
    </div>
  )
}