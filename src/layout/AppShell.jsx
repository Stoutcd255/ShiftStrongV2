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
            <button className={`ss-nav-item ${currentPage === 'dashboard' ? 'active' : ''}`} onClick={() => onNavigate('dashboard')}>
              <span className="ss-nav-icon">▦</span>
              <span>Dashboard</span>
            </button>

            <button className={`ss-nav-item ${currentPage === 'workouts' ? 'active' : ''}`} onClick={() => onNavigate('workouts')}>
              <span className="ss-nav-icon">⌁</span>
              <span>Workouts</span>
            </button>

            <button className={`ss-nav-item ${currentPage === 'macros' ? 'active' : ''}`} onClick={() => onNavigate('macros')}>
              <span className="ss-nav-icon">⌂</span>
              <span>Macros</span>
            </button>

            <button className={`ss-nav-item ${currentPage === 'bodyweight' ? 'active' : ''}`} onClick={() => onNavigate('bodyweight')}>
              <span className="ss-nav-icon">◉</span>
              <span>Bodyweight</span>
            </button>

            <button className={`ss-nav-item ${currentPage === 'goals' ? 'active' : ''}`} onClick={() => onNavigate('goals')}>
              <span className="ss-nav-icon">⌗</span>
              <span>Goals</span>
            </button>

            <button className={`ss-nav-item ${currentPage === 'history' ? 'active' : ''}`} onClick={() => onNavigate('history')}>
              <span className="ss-nav-icon">◫</span>
              <span>History</span>
            </button>

            <button className={`ss-nav-item ${currentPage === 'settings' ? 'active' : ''}`} onClick={() => onNavigate('settings')}>
              <span className="ss-nav-icon">⚙</span>
              <span>Settings</span>
            </button>

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
      </div>
    </div>
  )
}