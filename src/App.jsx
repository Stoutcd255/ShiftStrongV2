import { useEffect, useState } from 'react'
import AuthScreen from './auth/AuthScreen'
import { getSession, logoutUser } from './utils/auth'
import bgImage from './assets/bg.jpg'
import AppShell from './layout/AppShell'
import './styles/appShell.css'

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [displayPage, setDisplayPage] = useState('dashboard')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [dataRefreshKey, setDataRefreshKey] = useState(0)

  useEffect(() => {
    const session = getSession()
    if (session) {
      setCurrentUser(session)
    }
  }, [])

  function handleLogout() {
    logoutUser()
    setCurrentUser(null)
    setCurrentPage('dashboard')
    setDisplayPage('dashboard')
    setDataRefreshKey(0)
  }

  function handleNavigate(nextPage) {
    if (nextPage === currentPage) return

    setIsTransitioning(true)

    setTimeout(() => {
      setCurrentPage(nextPage)
      setDisplayPage(nextPage)

      requestAnimationFrame(() => {
        setIsTransitioning(false)
      })
    }, 180)
  }

  function handleDataChanged() {
    setDataRefreshKey((prev) => prev + 1)
  }

  function handleProfileUpdated(updatedSession) {
    setCurrentUser(updatedSession)
    setDataRefreshKey((prev) => prev + 1)
  }

  const backgroundStyle = {
    minHeight: '100vh',
    width: '100%',
    backgroundImage: `linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.88) 0%,
      rgba(0, 0, 0, 0.58) 22%,
      rgba(0, 0, 0, 0.40) 48%,
      rgba(0, 0, 0, 0.62) 72%,
      rgba(0, 0, 0, 0.92) 100%
    ), url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    overflow: 'hidden',
  }

  if (!currentUser) {
    return (
      <div style={backgroundStyle}>
        <AuthScreen onAuthenticated={setCurrentUser} />
      </div>
    )
  }

  return (
    <div style={backgroundStyle}>
      <AppShell
        currentUser={currentUser}
        currentPage={currentPage}
        displayPage={displayPage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        isTransitioning={isTransitioning}
        dataRefreshKey={dataRefreshKey}
        onDataChanged={handleDataChanged}
        onProfileUpdated={handleProfileUpdated}
      />
    </div>
  )
}

export default App