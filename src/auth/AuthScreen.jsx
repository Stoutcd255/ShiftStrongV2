import { useState } from 'react'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'
import logo from '../assets/logo.png'

export default function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState('login')
  const [fadeOut, setFadeOut] = useState(false)

  function handleSuccess(user) {
    setFadeOut(true)

    setTimeout(() => {
      onAuthenticated(user)
    }, 420)
  }

  return (
    <div className={`ss-auth-overlay ${fadeOut ? 'is-exiting' : ''}`}>
      <div className="ss-auth-backdrop" />

      <div className="ss-auth-frame">
        {/* LEFT SIDE */}
        <div className="ss-auth-side">
          <div className="ss-auth-logo-wrap">
            <img src={logo} className="ss-auth-logo" />
          </div>

          <div className="ss-auth-kicker">TACTICAL PERFORMANCE SYSTEM</div>

          <div className="ss-auth-title">SHIFTSTRONG</div>

          <div className="ss-auth-copy">
            Built for officers and serious lifters who demand precision tracking for training and nutrition.
          </div>

          <div className="ss-auth-feature-list">
            <div>• Local secure accounts</div>
            <div>• Tactical workout logging</div>
            <div>• Precision macro tracking</div>
            <div>• Mission-ready dashboard</div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="ss-auth-panel">
          {mode === 'signup' ? (
            <SignupForm
              onSignupSuccess={handleSuccess}
              onSwitchToLogin={() => setMode('login')}
            />
          ) : (
            <LoginForm
              onLoginSuccess={handleSuccess}
              onSwitchToSignup={() => setMode('signup')}
            />
          )}
        </div>
      </div>
    </div>
  )
}