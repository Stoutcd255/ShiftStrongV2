import { useEffect, useState } from 'react'
import { getUserGoals, saveUserGoals } from '../utils/goals'

export default function Goals({ currentUser, onDataChanged }) {
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [carbs, setCarbs] = useState('')
  const [fats, setFats] = useState('')
  const [savedMessage, setSavedMessage] = useState('')

  useEffect(() => {
    const goals = getUserGoals(currentUser.userId)
    setCalories(String(goals.calories))
    setProtein(String(goals.protein))
    setCarbs(String(goals.carbs))
    setFats(String(goals.fats))
  }, [currentUser.userId])

  function handleSubmit(e) {
    e.preventDefault()

    saveUserGoals(currentUser.userId, {
      calories,
      protein,
      carbs,
      fats,
    })

    setSavedMessage('Goals saved.')
    onDataChanged()

    setTimeout(() => {
      setSavedMessage('')
    }, 1800)
  }

  return (
    <div className="ss-page ss-module-page">
      <section className="ss-module-hero-card ss-card">
        <div className="ss-module-hero-copy">
          <div className="ss-hero-eyebrow">TARGET MODULE</div>
          <h1 className="ss-page-title">GOALS</h1>
          <p className="ss-page-sub">
            Set the daily targets that drive your nutrition progress and dashboard metrics.
          </p>

          <div className="ss-module-hero-actions">
            <button
              className="ss-primary-button"
              onClick={() =>
                document.getElementById('ss-goals-form')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              EDIT GOALS
            </button>
          </div>
        </div>

        <div className="ss-module-hero-stats">
          <ModuleStatCard label="CALORIES" value={calories || '0'} sub="Daily target" />
          <ModuleStatCard label="PROTEIN" value={`${protein || '0'}g`} sub="Daily target" />
          <ModuleStatCard label="CARBS / FATS" value={`${carbs || '0'} / ${fats || '0'}`} sub="Daily targets" />
        </div>
      </section>

      <section className="ss-module-grid">
        <div className="ss-card ss-page-card ss-form-command-card" id="ss-goals-form">
          <div className="ss-section-title">DAILY MACRO GOALS</div>

          <form className="ss-form" onSubmit={handleSubmit}>
            <div className="ss-form-grid four">
              <div className="ss-field">
                <label className="ss-label">Calories</label>
                <input
                  className="ss-input"
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                />
              </div>

              <div className="ss-field">
                <label className="ss-label">Protein</label>
                <input
                  className="ss-input"
                  type="number"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                />
              </div>

              <div className="ss-field">
                <label className="ss-label">Carbs</label>
                <input
                  className="ss-input"
                  type="number"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                />
              </div>

              <div className="ss-field">
                <label className="ss-label">Fats</label>
                <input
                  className="ss-input"
                  type="number"
                  value={fats}
                  onChange={(e) => setFats(e.target.value)}
                />
              </div>
            </div>

            <div className="ss-button-row">
              <button className="ss-primary-button" type="submit">
                SAVE GOALS
              </button>

              {savedMessage ? <div className="ss-inline-message">{savedMessage}</div> : null}
            </div>
          </form>
        </div>

        <div className="ss-module-side-column">
          <div className="ss-card ss-page-card ss-side-panel-card">
            <div className="ss-section-title">HOW IT WORKS</div>

            <div className="ss-summary-block">
              <div className="ss-summary-note">
                These targets feed your dashboard progress bars and your daily macro totals.
              </div>
              <div className="ss-summary-note">
                Update them anytime as your training phase changes.
              </div>
            </div>
          </div>

          <div className="ss-card ss-page-card ss-side-panel-card">
            <div className="ss-section-title">CURRENT TARGETS</div>

            <div className="ss-summary-block">
              <div className="ss-summary-row">
                <span>Calories</span>
                <strong>{calories || '0'}</strong>
              </div>
              <div className="ss-summary-row">
                <span>Protein</span>
                <strong>{protein || '0'}g</strong>
              </div>
              <div className="ss-summary-row">
                <span>Carbs</span>
                <strong>{carbs || '0'}g</strong>
              </div>
              <div className="ss-summary-row">
                <span>Fats</span>
                <strong>{fats || '0'}g</strong>
              </div>
            </div>
          </div>
        </div>
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