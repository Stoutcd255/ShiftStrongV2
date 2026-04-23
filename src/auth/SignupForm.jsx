import { useState } from 'react'
import { signupUser } from '../utils/auth'

export default function SignupForm({ onSignupSuccess, onSwitchToLogin }) {
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!fullName.trim() || !username.trim() || !password.trim()) {
      setError('Fill out all fields.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    const result = signupUser({ fullName, username, password })

    if (!result.success) {
      setError(result.message)
      return
    }

    onSignupSuccess(result.user)
  }

  return (
    <div className="ss-auth-form-wrap">
      <div className="ss-auth-form-title">CREATE ACCOUNT</div>
      <div className="ss-auth-form-sub">Set up a local ShiftStrong profile.</div>

      <form className="ss-auth-form" onSubmit={handleSubmit}>
        <div className="ss-field">
          <label className="ss-label">Full Name</label>
          <input
            className="ss-input"
            type="text"
            placeholder="Enter full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className="ss-field">
          <label className="ss-label">Username</label>
          <input
            className="ss-input"
            type="text"
            placeholder="Choose username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="ss-field">
          <label className="ss-label">Password</label>
          <input
            className="ss-input"
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="ss-field">
          <label className="ss-label">Confirm Password</label>
          <input
            className="ss-input"
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {error ? <div className="ss-form-error">{error}</div> : null}

        <button className="ss-primary-button" type="submit">
          SIGN UP
        </button>
      </form>

      <button className="ss-auth-switch" onClick={onSwitchToLogin}>
        Already have an account? Log in
      </button>
    </div>
  )
}