import { useEffect, useMemo, useState } from 'react'
import {
  addBodyweightEntry,
  deleteBodyweightEntry,
  getLatestBodyweight,
  getUserBodyweightEntries,
  getWeeklyBodyweightChange,
  updateBodyweightEntry,
} from '../utils/bodyweight'

export default function Bodyweight({ currentUser, onDataChanged }) {
  const [weight, setWeight] = useState('')
  const [notes, setNotes] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [entries, setEntries] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    loadEntries()
  }, [currentUser])

  function loadEntries() {
    const data = getUserBodyweightEntries(currentUser.userId)
    setEntries(data)
  }

  function resetForm() {
    setWeight('')
    setNotes('')
    setEditingId(null)
    setError('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!weight) {
      setError('Bodyweight is required.')
      return
    }

    if (Number(weight) <= 0) {
      setError('Enter a valid bodyweight.')
      return
    }

    if (editingId) {
      updateBodyweightEntry(editingId, { weight, notes })
    } else {
      addBodyweightEntry({
        userId: currentUser.userId,
        weight,
        notes,
      })
    }

    resetForm()
    loadEntries()
    onDataChanged()
  }

  function handleEdit(entry) {
    setEditingId(entry.id)
    setWeight(String(entry.weight))
    setNotes(entry.notes || '')
  }

  function handleDelete(entryId) {
    deleteBodyweightEntry(entryId)
    loadEntries()
    onDataChanged()
  }

  const latest = useMemo(() => getLatestBodyweight(currentUser.userId), [entries, currentUser.userId])
  const weeklyChange = useMemo(() => getWeeklyBodyweightChange(currentUser.userId), [entries, currentUser.userId])

  const chartData = entries.slice(0, 7).reverse()

  return (
    <div className="ss-page ss-module-page">
      <section className="ss-module-hero-card ss-card">
        <div className="ss-module-hero-copy">
          <div className="ss-hero-eyebrow">BODYWEIGHT MODULE</div>
          <h1 className="ss-page-title">BODYWEIGHT</h1>
          <p className="ss-page-sub">
            Track bodyweight changes over time and keep a clean record of progress.
          </p>

          <div className="ss-module-hero-actions">
            <button
              className="ss-primary-button"
              onClick={() =>
                document.getElementById('ss-bodyweight-form')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              {editingId ? 'CONTINUE EDITING' : 'LOG WEIGHT'}
            </button>

            {editingId ? (
              <button className="ss-secondary-button" onClick={resetForm}>
                CANCEL EDIT
              </button>
            ) : null}
          </div>
        </div>

        <div className="ss-module-hero-stats">
          <ModuleStatCard
            label="LATEST"
            value={latest ? `${latest.weight} lb` : '—'}
            sub="Most recent entry"
          />
          <ModuleStatCard
            label="WEEKLY CHANGE"
            value={`${weeklyChange > 0 ? '+' : ''}${weeklyChange} lb`}
            sub="Last 7 logged entries"
          />
          <ModuleStatCard
            label="ENTRIES"
            value={entries.length}
            sub="Total logged"
          />
        </div>
      </section>

      <section className="ss-module-grid">
        <div className="ss-card ss-page-card ss-form-command-card" id="ss-bodyweight-form">
          <div className="ss-section-title">
            {editingId ? 'EDIT BODYWEIGHT ENTRY' : 'BODYWEIGHT LOGGER'}
          </div>

          <form className="ss-form" onSubmit={handleSubmit}>
            <div className="ss-form-grid two">
              <div className="ss-field">
                <label className="ss-label">Bodyweight</label>
                <input
                  className="ss-input"
                  type="number"
                  placeholder="205"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>

              <div className="ss-field">
                <label className="ss-label">Notes</label>
                <input
                  className="ss-input"
                  type="text"
                  placeholder="Morning weigh-in"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            {error ? <div className="ss-form-error">{error}</div> : null}

            <div className="ss-button-row">
              <button className="ss-primary-button" type="submit">
                {editingId ? 'UPDATE ENTRY' : 'SAVE ENTRY'}
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
            <div className="ss-section-title">LATEST ENTRY</div>

            {latest ? (
              <div className="ss-summary-block">
                <div className="ss-summary-title">{latest.weight} lb</div>
                <div className="ss-summary-note">{latest.notes || 'No notes added.'}</div>
              </div>
            ) : (
              <p className="ss-muted-note">No bodyweight logged yet.</p>
            )}
          </div>

          <div className="ss-card ss-page-card ss-side-panel-card">
            <div className="ss-section-title">TREND</div>

            {chartData.length === 0 ? (
              <p className="ss-muted-note">No chart data yet.</p>
            ) : (
              <div className="ss-mini-chart">
                {chartData.map((entry) => (
                  <div key={entry.id} className="ss-mini-chart-item">
                    <div
                      className="ss-mini-chart-bar"
                      style={{
                        height: `${Math.max(18, Math.min(100, (entry.weight / Math.max(...chartData.map((x) => x.weight), 1)) * 100))}%`,
                      }}
                    />
                    <span className="ss-mini-chart-label">
                      {new Date(entry.loggedAt).getDate()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="ss-card ss-page-card">
        <div className="ss-section-title">WEIGHT HISTORY</div>

        {entries.length === 0 ? (
          <p className="ss-muted-note">No bodyweight history yet.</p>
        ) : (
          <div className="ss-workout-list">
            {entries.map((entry) => (
              <div className="ss-workout-row" key={entry.id}>
                <div className="ss-workout-row-left">
                  <div className="ss-recent-icon">◉</div>

                  <div className="ss-workout-meta">
                    <div className="ss-workout-title">{entry.weight} lb</div>
                    <div className="ss-workout-sub">
                      {new Date(entry.loggedAt).toLocaleDateString()}
                    </div>
                    {entry.notes ? <div className="ss-workout-note">{entry.notes}</div> : null}
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