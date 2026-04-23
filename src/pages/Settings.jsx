import { useEffect, useRef, useState } from 'react'
import {
  RANK_OPTIONS,
  changeUserPassword,
  updateUserProfile,
} from '../utils/auth'
import { downloadExportFile, importAllShiftStrongData, resetAllShiftStrongData } from '../utils/dataManager'
import { getUserGoals, saveUserGoals } from '../utils/goals'

export default function Settings({ currentUser, onDataChanged, onProfileUpdated }) {
  const [fullName, setFullName] = useState(currentUser.fullName || '')
  const [rank, setRank] = useState(currentUser.rank || 'Officer')

  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [carbs, setCarbs] = useState('')
  const [fats, setFats] = useState('')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')

  const [profileMessage, setProfileMessage] = useState('')
  const [goalMessage, setGoalMessage] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [dataMessage, setDataMessage] = useState('')

  const importRef = useRef(null)

  useEffect(() => {
    setFullName(currentUser.fullName || '')
    setRank(currentUser.rank || 'Officer')

    const goals = getUserGoals(currentUser.userId)
    setCalories(String(goals.calories))
    setProtein(String(goals.protein))
    setCarbs(String(goals.carbs))
    setFats(String(goals.fats))
  }, [currentUser])

  function handleSaveProfile(e) {
    e.preventDefault()

    const result = updateUserProfile(currentUser.userId, {
      fullName,
      rank,
    })

    if (result.success) {
      onProfileUpdated(result.user)
      setProfileMessage('Profile updated.')

      setTimeout(() => setProfileMessage(''), 1800)
    }
  }

  function handleSaveGoals(e) {
    e.preventDefault()

    saveUserGoals(currentUser.userId, {
      calories,
      protein,
      carbs,
      fats,
    })

    setGoalMessage('Goals saved.')
    onDataChanged()

    setTimeout(() => setGoalMessage(''), 1800)
  }

  function handleChangePassword(e) {
    e.preventDefault()
    setPasswordError('')
    setPasswordMessage('')

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordError('Fill out all password fields.')
      return
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.')
      return
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match.')
      return
    }

    const result = changeUserPassword(currentUser.userId, currentPassword, newPassword)

    if (!result.success) {
      setPasswordError(result.message)
      return
    }

    setCurrentPassword('')
    setNewPassword('')
    setConfirmNewPassword('')
    setPasswordMessage('Password updated.')

    setTimeout(() => setPasswordMessage(''), 1800)
  }

  function handleExport() {
    downloadExportFile()
    setDataMessage('Backup exported.')
    setTimeout(() => setDataMessage(''), 1800)
  }

  async function handleImportChange(e) {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      importAllShiftStrongData(text)
      setDataMessage('Backup imported. Restart app session if needed.')
      onDataChanged()
    } catch (err) {
      setDataMessage(err.message || 'Import failed.')
    }

    if (importRef.current) {
      importRef.current.value = ''
    }

    setTimeout(() => setDataMessage(''), 2500)
  }

  function handleResetData() {
    const confirmed = window.confirm(
      'Reset workout, macro, goals, templates, and bodyweight data? This cannot be undone.'
    )

    if (!confirmed) return

    resetAllShiftStrongData()
    onDataChanged()
    setDataMessage('Data reset complete.')
    setTimeout(() => setDataMessage(''), 1800)
  }

  return (
    <div className="ss-page ss-module-page">
      <section className="ss-module-hero-card ss-card">
        <div className="ss-module-hero-copy">
          <div className="ss-hero-eyebrow">CONTROL MODULE</div>
          <h1 className="ss-page-title">SETTINGS</h1>
          <p className="ss-page-sub">
            Manage account details, rank, goals, security, and backups.
          </p>
        </div>

        <div className="ss-module-hero-stats">
          <ModuleStatCard label="NAME" value={fullName || '—'} sub="Current profile" compact />
          <ModuleStatCard label="RANK" value={rank} sub="Active designation" compact />
          <ModuleStatCard label="GOAL CAL" value={calories || '0'} sub="Daily target" />
        </div>
      </section>

      <section className="ss-settings-grid">
        <div className="ss-card ss-page-card">
          <div className="ss-section-title">PROFILE</div>

          <form className="ss-form" onSubmit={handleSaveProfile}>
            <div className="ss-field">
              <label className="ss-label">Full Name</label>
              <input className="ss-input" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>

            <div className="ss-field">
              <label className="ss-label">Rank</label>
              <select className="ss-input" value={rank} onChange={(e) => setRank(e.target.value)}>
                {RANK_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="ss-button-row">
              <button className="ss-primary-button" type="submit">
                SAVE PROFILE
              </button>

              {profileMessage ? <div className="ss-inline-message">{profileMessage}</div> : null}
            </div>
          </form>
        </div>

        <div className="ss-card ss-page-card">
          <div className="ss-section-title">DEFAULT MACRO GOALS</div>

          <form className="ss-form" onSubmit={handleSaveGoals}>
            <div className="ss-form-grid four">
              <div className="ss-field">
                <label className="ss-label">Calories</label>
                <input className="ss-input" type="number" value={calories} onChange={(e) => setCalories(e.target.value)} />
              </div>

              <div className="ss-field">
                <label className="ss-label">Protein</label>
                <input className="ss-input" type="number" value={protein} onChange={(e) => setProtein(e.target.value)} />
              </div>

              <div className="ss-field">
                <label className="ss-label">Carbs</label>
                <input className="ss-input" type="number" value={carbs} onChange={(e) => setCarbs(e.target.value)} />
              </div>

              <div className="ss-field">
                <label className="ss-label">Fats</label>
                <input className="ss-input" type="number" value={fats} onChange={(e) => setFats(e.target.value)} />
              </div>
            </div>

            <div className="ss-button-row">
              <button className="ss-primary-button" type="submit">
                SAVE GOALS
              </button>

              {goalMessage ? <div className="ss-inline-message">{goalMessage}</div> : null}
            </div>
          </form>
        </div>
      </section>

      <section className="ss-card ss-page-card">
        <div className="ss-section-title">CHANGE PASSWORD</div>

        <form className="ss-form" onSubmit={handleChangePassword}>
          <div className="ss-form-grid three">
            <div className="ss-field">
              <label className="ss-label">Current Password</label>
              <input className="ss-input" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            </div>

            <div className="ss-field">
              <label className="ss-label">New Password</label>
              <input className="ss-input" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>

            <div className="ss-field">
              <label className="ss-label">Confirm New Password</label>
              <input className="ss-input" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
            </div>
          </div>

          {passwordError ? <div className="ss-form-error">{passwordError}</div> : null}

          <div className="ss-button-row">
            <button className="ss-primary-button" type="submit">
              UPDATE PASSWORD
            </button>

            {passwordMessage ? <div className="ss-inline-message">{passwordMessage}</div> : null}
          </div>
        </form>
      </section>

      <section className="ss-card ss-page-card">
        <div className="ss-section-title">DATA BACKUP</div>

        <div className="ss-button-row">
          <button className="ss-primary-button" type="button" onClick={handleExport}>
            EXPORT BACKUP
          </button>

          <button className="ss-secondary-button" type="button" onClick={() => importRef.current?.click()}>
            IMPORT BACKUP
          </button>

          <button className="ss-danger-button" type="button" onClick={handleResetData}>
            RESET DATA
          </button>

          <input
            ref={importRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={handleImportChange}
          />

          {dataMessage ? <div className="ss-inline-message">{dataMessage}</div> : null}
        </div>
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