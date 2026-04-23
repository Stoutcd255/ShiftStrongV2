import { useState } from 'react'
import { loginUser } from '../utils/auth'

export default function LoginForm({ onLoginSuccess, onSwitchToSignup }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password.trim()) {
      setError('Enter your username and password.')
      return
    }

    const result = loginUser({ username, password })

    if (!result.success) {
      setError(result.message)
      return
    }

    onLoginSuccess(result.user)
  }

  return (
    <div className="ss-auth-form-wrap">
      <div className="ss-auth-form-title">WELCOME BACK</div>
      <div className="ss-auth-form-sub">Log in to continue.</div>

      <form className="ss-auth-form" onSubmit={handleSubmit}>
        <div className="ss-field">
          <label className="ss-label">Username</label>
          <input
            className="ss-input"
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="ss-field">
          <label className="ss-label">Password</label>
          <input
            className="ss-input"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error ? <div className="ss-form-error">{error}</div> : null}

        <button className="ss-primary-button" type="submit">
          LOG IN
        </button>
      </form>

      <button className="ss-auth-switch" onClick={onSwitchToSignup}>
        Need an account? Sign up
      </button>
    </div>
  )
}