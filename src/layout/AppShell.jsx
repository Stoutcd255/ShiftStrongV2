import logo from '../assets/logo.png'
import Dashboard from '../pages/Dashboard'
import Workouts from '../pages/Workouts'
import Macros from '../pages/Macros'
import Goals from '../pages/Goals'
import History from '../pages/History'
import Settings from '../pages/Settings'
import Bodyweight from '../pages/Bodyweight'

export default function AppShell({
  currentUser,
  currentPage,
  displayPage,
  onNavigate,
  onLogout,
  isTransitioning,
  dataRefreshKey,
  onDataChanged,
  onProfileUpdated,
}) {
  const navItems = [
    { key: 'dashboard', label: 'Dashboard', icon: '▦' },
    { key: 'workouts', label: 'Workouts', icon: '⌁' },
    { key: 'macros', label: 'Macros', icon: '⌂' },
    { key: 'bodyweight', label: 'Bodyweight', icon: '◉' },
    { key: 'goals', label: 'Goals', icon: '⌗' },
    { key: 'history', label: 'History', icon: '◫' },
    { key: 'settings', label: 'Settings', icon: '⚙' },
  ]

  function renderPage() {
    if (displayPage === 'workouts') {
      return <Workouts currentUser={currentUser} onDataChanged={onDataChanged} />
    }

    if (displayPage === 'macros') {
      return <Macros currentUser={currentUser} onDataChanged={onDataChanged} />
    }

    if (displayPage === 'goals') {
      return <Goals currentUser={currentUser} onDataChanged={onDataChanged} />
    }

    if (displayPage === 'history') {
      return <History currentUser={currentUser} dataRefreshKey={dataRefreshKey} />
    }

    if (displayPage === 'settings') {
      return (
        <Settings
          currentUser={currentUser}
          onDataChanged={onDataChanged}
          onProfileUpdated={onProfileUpdated}
        />
      )
    }

    if (displayPage === 'bodyweight') {
      return <Bodyweight currentUser={currentUser} onDataChanged={onDataChanged} />
    }

    return (
      <Dashboard
        onNavigate={onNavigate}
        currentUser={currentUser}
        dataRefreshKey={dataRefreshKey}
      />
    )
  }

  return (
    <div className="ss-app">
      <div className="ss-shell">
        <div className="ss-topbar">
          <div className="ss-brand">
            <div className="ss-logo-wrap">
              <img
                src={logo}
                alt="ShiftStrong logo"
                className="ss-logo"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>

            <div className="ss-brand-text">
              <div className="ss-brand-title">SHIFTSTRONG</div>
            </div>
          </div>

          <div className="ss-topbar-right">
            <button className="ss-icon-button" aria-label="Notifications">
              <span className="ss-bell">⌂</span>
            </button>

            <div className="ss-user-block">
              <div className="ss-user-name">{currentUser?.fullName || 'User'}</div>
              <div className="ss-user-role">{currentUser?.rank || 'Officer'}</div>
            </div>

            <div className="ss-user-avatar">
              {currentUser?.fullName?.charAt(0)?.toUpperCase() || 'U'}
            </div>

            <button className="ss-logout-button" onClick={onLogout}>
              Log Out
            </button>
          </div>
        </div>

        <div className="ss-main-layout">
          <aside className="ss-sidebar">
            {navItems.map((item) => (
              <button
                key={item.key}
                className={`ss-nav-item ${currentPage === item.key ? 'active' : ''}`}
                onClick={() => onNavigate(item.key)}
              >
                <span className="ss-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}

            <div className="ss-sidebar-footer">
              <div className="ss-sidebar-badge">STAY READY</div>
              <div className="ss-sidebar-footer-text">
                So you don&apos;t have to get ready.
              </div>
            </div>
          </aside>

          <main className={`ss-content-panel ${isTransitioning ? 'is-transitioning' : ''}`}>
            {renderPage()}
          </main>
        </div>

        <nav className="ss-mobile-nav" aria-label="Mobile navigation">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`ss-mobile-nav-item ${currentPage === item.key ? 'active' : ''}`}
              onClick={() => onNavigate(item.key)}
            >
              <span className="ss-mobile-nav-icon">{item.icon}</span>
              <span className="ss-mobile-nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
