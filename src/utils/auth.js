const USERS_KEY = 'shiftstrong_users'
const SESSION_KEY = 'shiftstrong_session'

export const RANK_OPTIONS = [
  'Officer',
  'Sergeant',
  'Lieutenant',
  'Captain',
  'Chief',
]

export function getUsers() {
  const raw = localStorage.getItem(USERS_KEY)
  return raw ? JSON.parse(raw) : []
}

export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function setSessionFromUser(user) {
  const session = {
    userId: user.id,
    username: user.username,
    fullName: user.fullName,
    rank: user.rank || 'Officer',
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

export function signupUser({ fullName, username, password }) {
  const users = getUsers()

  const existingUser = users.find(
    (user) => user.username.toLowerCase() === username.toLowerCase()
  )

  if (existingUser) {
    return { success: false, message: 'Account already exists.' }
  }

  const newUser = {
    id: crypto.randomUUID(),
    fullName,
    username,
    password,
    rank: 'Officer',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  users.push(newUser)
  saveUsers(users)

  const session = setSessionFromUser(newUser)

  return { success: true, user: session }
}

export function loginUser({ username, password }) {
  const users = getUsers()

  const user = users.find(
    (u) =>
      u.username.toLowerCase() === username.toLowerCase() &&
      u.password === password
  )

  if (!user) {
    return { success: false, message: 'Invalid username or password.' }
  }

  const session = setSessionFromUser(user)

  return { success: true, user: session }
}

export function getSession() {
  const raw = localStorage.getItem(SESSION_KEY)
  return raw ? JSON.parse(raw) : null
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY)
}

export function getUserById(userId) {
  const users = getUsers()
  return users.find((user) => user.id === userId) || null
}

export function updateUserProfile(userId, updates) {
  const users = getUsers()
  let updatedUser = null

  const nextUsers = users.map((user) => {
    if (user.id !== userId) return user

    updatedUser = {
      ...user,
      fullName: updates.fullName?.trim() || user.fullName,
      rank: updates.rank || user.rank || 'Officer',
      updatedAt: new Date().toISOString(),
    }

    return updatedUser
  })

  saveUsers(nextUsers)

  if (!updatedUser) {
    return { success: false, message: 'User not found.' }
  }

  const session = setSessionFromUser(updatedUser)
  return { success: true, user: session }
}

export function changeUserPassword(userId, currentPassword, newPassword) {
  const users = getUsers()
  let found = null

  const nextUsers = users.map((user) => {
    if (user.id !== userId) return user

    if (user.password !== currentPassword) {
      found = 'wrong-password'
      return user
    }

    found = {
      ...user,
      password: newPassword,
      updatedAt: new Date().toISOString(),
    }

    return found
  })

  if (found === 'wrong-password') {
    return { success: false, message: 'Current password is incorrect.' }
  }

  if (!found) {
    return { success: false, message: 'User not found.' }
  }

  saveUsers(nextUsers)
  setSessionFromUser(found)

  return { success: true }
}