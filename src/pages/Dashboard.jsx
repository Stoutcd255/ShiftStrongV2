import { useEffect, useState } from 'react'
import { getLatestBodyweight, getWeeklyBodyweightChange } from '../utils/bodyweight'
import { getUserGoals } from '../utils/goals'
import { getTodayMacroTotals } from '../utils/macros'
import { getUserWorkouts } from '../utils/workouts'

function formatHeroName(fullName) {
  if (!fullName || typeof fullName !== 'string') return 'OPERATOR'

  const parts = fullName.trim().split(/\s+/).filter(Boolean)

  if (parts.length === 0) return 'OPERATOR'
  if (parts.length === 1) return parts[0].toUpperCase()

  const firstName = parts[0].toUpperCase()
  const lastInitial = parts[parts.length - 1][0].toUpperCase()

  return `${firstName} ${lastInitial}.`
}

function isSameDay(dateA, dateB) {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  )
}

function getStartOfWeek(date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function getWeeklyWorkoutData(workouts) {
  const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const today = new Date()
  const weekStart = getStartOfWeek(today)
  const counts = [0, 0, 0, 0, 0, 0, 0]

  workouts.forEach((workout) => {
    const date = new Date(workout.createdAt)
    const diffMs = date - weekStart
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    if (diffDays >= 0 && diffDays < 7) counts[diffDays] += 1
  })

  const max = Math.max(...counts, 1)

  return {
    labels,
    bars: counts.map((count) => ({
      count,
      height: count === 0 ? 18 : Math.max(24, Math.round((count / max) * 100)),
    })),
  }
}

function getWorkoutStreak(workouts) {
  if (!workouts.length) return 0

  const uniqueDays = [
    ...new Set(
      workouts.map((w) => {
        const date = new Date(w.createdAt)
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
      })
    ),
  ]

  const sortedDates = uniqueDays
    .map((key) => {
      const [year, month, day] = key.split('-').map(Number)
      return new Date(year, month, day)
    })
    .sort((a, b) => b - a)

  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  let compareDate = null

  if (sortedDates.length > 0) {
    if (isSameDay(sortedDates[0], today)) {
      compareDate = today
    } else if (isSameDay(sortedDates[0], yesterday)) {
      compareDate = yesterday
    } else {
      return 0
    }
  }

  for (let i = 0; i < sortedDates.length; i++) {
    const current = sortedDates[i]
    if (isSameDay(current, compareDate)) {
      streak += 1
      compareDate = new Date(compareDate)
      compareDate.setDate(compareDate.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}

function getWeeklyWorkoutCount(workouts) {
  const now = new Date()
  const weekStart = getStartOfWeek(now)

  return workouts.filter((workout) => {
    const date = new Date(workout.createdAt)
    return date >= weekStart
  }).length
}

function getLastWorkout(workouts) {
  return workouts.length ? workouts[0] : null
}

export default function Dashboard({ onNavigate, currentUser, dataRefreshKey }) {
  const [dashboardData, setDashboardData] = useState({
    workouts: [],
    macroTotals: { calories: 0, protein: 0, carbs: 0, fats: 0 },
    goals: { calories: 3000, protein: 220, carbs: 300, fats: 80 },
    latestBodyweight: null,
    bodyweightChange: 0,
  })

  useEffect(() => {
    const workouts = getUserWorkouts(currentUser.userId)
    const macroTotals = getTodayMacroTotals(currentUser.userId)
    const goals = getUserGoals(currentUser.userId)
    const latestBodyweight = getLatestBodyweight(currentUser.userId)
    const bodyweightChange = getWeeklyBodyweightChange(currentUser.userId)

    setDashboardData({
      workouts,
      macroTotals,
      goals,
      latestBodyweight,
      bodyweightChange,
    })
  }, [currentUser.userId, dataRefreshKey])

  const heroName = formatHeroName(currentUser?.fullName)
  const workouts = dashboardData.workouts
  const macroTotals = dashboardData.macroTotals
  const goals = dashboardData.goals

  const workoutCountThisWeek = getWeeklyWorkoutCount(workouts)
  const streak = getWorkoutStreak(workouts)
  const weeklyData = getWeeklyWorkoutData(workouts)
  const recentWorkouts = workouts.slice(0, 4)
  const lastWorkout = getLastWorkout(workouts)

  const caloriePct = Math.min((macroTotals.calories / Math.max(goals.calories, 1)) * 100, 100)
  const proteinPct = Math.min((macroTotals.protein / Math.max(goals.protein, 1)) * 100, 100)
  const carbsPct = Math.min((macroTotals.carbs / Math.max(goals.carbs, 1)) * 100, 100)
  const fatsPct = Math.min((macroTotals.fats / Math.max(goals.fats, 1)) * 100, 100)

  return (
    <div className="ss-dashboard ss-dashboard-v2">
      <section className="ss-dashboard-top">
        <div className="ss-card ss-mission-card">
          <div className="ss-mission-copy">
            <div className="ss-mission-kicker">TODAY&apos;S MISSION</div>
            <h1 className="ss-mission-name">{heroName}</h1>
            <p className="ss-mission-sub">
              {workoutCountThisWeek > 0
                ? 'Stay on target. Keep stacking clean reps and clean meals.'
                : 'Get your first session logged and start building momentum.'}
            </p>

            <div className="ss-mission-meta">
              <div className="ss-mission-meta-item">
                <span className="ss-mission-meta-label">Rank</span>
                <strong>{currentUser.rank || 'Officer'}</strong>
              </div>

              <div className="ss-mission-meta-item">
                <span className="ss-mission-meta-label">Streak</span>
                <strong>{streak} days</strong>
              </div>

              <div className="ss-mission-meta-item">
                <span className="ss-mission-meta-label">Last Workout</span>
                <strong>{lastWorkout ? lastWorkout.workoutName : 'None yet'}</strong>
              </div>
            </div>

            <div className="ss-mission-actions">
              <button className="ss-primary-button" onClick={() => onNavigate('workouts')}>
                START WORKOUT
              </button>

              <button className="ss-secondary-button" onClick={() => onNavigate('macros')}>
                LOG MACROS
              </button>
            </div>
          </div>

          <div className="ss-mission-side">
            <div className="ss-readiness-ring-card">
              <div className="ss-readiness-ring">
                <div className="ss-readiness-inner">
                  <span className="ss-readiness-label">READY</span>
                </div>
              </div>

              <div className="ss-readiness-text">
                <div className="ss-readiness-title">MISSION STATUS</div>
                <div className="ss-readiness-sub">
                  {workoutCountThisWeek > 0 ? 'Active this week' : 'Waiting for first entry'}
                </div>
              </div>
            </div>

            <div className="ss-quick-status-grid">
              <MiniStatusCard label="WORKOUTS" value={workoutCountThisWeek} sub="This week" />
              <MiniStatusCard label="CALORIES" value={macroTotals.calories} sub={`Goal ${goals.calories}`} />
            </div>
          </div>
        </div>
      </section>

      <section className="ss-dashboard-middle">
        <div className="ss-card ss-nutrition-card">
          <div className="ss-section-title">NUTRITION PROGRESS</div>

          <ProgressRow label="Calories" value={`${macroTotals.calories}`} sub={`/ ${goals.calories}`} fill={caloriePct} />
          <ProgressRow label="Protein" value={`${macroTotals.protein}g`} sub={`/ ${goals.protein}g`} fill={proteinPct} />
          <ProgressRow label="Carbs" value={`${macroTotals.carbs}g`} sub={`/ ${goals.carbs}g`} fill={carbsPct} />
          <ProgressRow label="Fats" value={`${macroTotals.fats}g`} sub={`/ ${goals.fats}g`} fill={fatsPct} />
        </div>

        <div className="ss-card ss-weekly-card">
          <div className="ss-section-title">WEEKLY TRAINING</div>

          <div className="ss-chart">
            <div className="ss-chart-bars">
              {weeklyData.bars.map((bar, index) => (
                <div
                  key={index}
                  className={`ss-chart-bar ${bar.count === 0 ? 'ghost' : ''}`}
                  style={{ height: `${bar.height}%` }}
                />
              ))}
            </div>

            <div className="ss-chart-labels">
              {weeklyData.labels.map((label, index) => (
                <span key={index}>{label}</span>
              ))}
            </div>
          </div>

          <p className="ss-muted-note">
            {workoutCountThisWeek > 0
              ? `${workoutCountThisWeek} workout${workoutCountThisWeek === 1 ? '' : 's'} logged this week.`
              : 'No workouts logged this week yet.'}
          </p>
        </div>

        <div className="ss-card ss-consistency-card">
          <div className="ss-section-title">CONSISTENCY</div>

          <div className="ss-consistency-metric">
            <span className="ss-consistency-big">{streak}</span>
            <span className="ss-consistency-unit">DAY STREAK</span>
          </div>

          <div className="ss-consistency-list">
            <div className="ss-summary-row">
              <span>Workouts This Week</span>
              <strong>{workoutCountThisWeek}</strong>
            </div>
            <div className="ss-summary-row">
              <span>Most Recent Session</span>
              <strong>{lastWorkout ? lastWorkout.exercise : '—'}</strong>
            </div>
            <div className="ss-summary-row">
              <span>Bodyweight</span>
              <strong>
                {dashboardData.latestBodyweight ? `${dashboardData.latestBodyweight.weight} lb` : '—'}
              </strong>
            </div>
          </div>
        </div>
      </section>

      <section className="ss-dashboard-bottom">
        <div className="ss-card ss-recent-activity-card">
          <div className="ss-section-title">RECENT ACTIVITY</div>

          {recentWorkouts.length === 0 ? (
            <p className="ss-muted-note">No workout activity yet.</p>
          ) : (
            <div className="ss-activity-list">
              {recentWorkouts.map((workout) => (
                <RecentActivityRow
                  key={workout.id}
                  title={workout.workoutName}
                  subtitle={`${workout.exercise} • ${workout.sets}x${workout.reps} • ${workout.weight} lb`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="ss-card ss-goals-snapshot-card">
          <div className="ss-section-title">GOALS SNAPSHOT</div>

          <GoalMiniCard title="Calories" current={macroTotals.calories} goal={goals.calories} />
          <GoalMiniCard title="Protein" current={macroTotals.protein} goal={goals.protein} suffix="g" />
          <GoalMiniCard title="Carbs" current={macroTotals.carbs} goal={goals.carbs} suffix="g" />
          <GoalMiniCard title="Fats" current={macroTotals.fats} goal={goals.fats} suffix="g" />

          <div className="ss-summary-row">
            <span>Bodyweight Change</span>
            <strong>
              {dashboardData.bodyweightChange > 0 ? '+' : ''}
              {dashboardData.bodyweightChange} lb
            </strong>
          </div>

          <button className="ss-secondary-button ss-goals-button" onClick={() => onNavigate('goals')}>
            EDIT GOALS
          </button>
        </div>
      </section>
    </div>
  )
}

function MiniStatusCard({ label, value, sub }) {
  return (
    <div className="ss-mini-status-card">
      <div className="ss-mini-status-label">{label}</div>
      <div className="ss-mini-status-value">{value}</div>
      <div className="ss-mini-status-sub">{sub}</div>
    </div>
  )
}

function ProgressRow({ label, value, sub, fill }) {
  return (
    <div className="ss-progress-row">
      <div className="ss-progress-row-top">
        <span className="ss-progress-row-label">{label}</span>
        <div className="ss-progress-row-values">
          <strong>{value}</strong>
          <span>{sub}</span>
        </div>
      </div>

      <div className="ss-progress-track">
        <div className="ss-progress-fill" style={{ width: `${Math.max(0, Math.min(fill, 100))}%` }} />
      </div>
    </div>
  )
}

function RecentActivityRow({ title, subtitle }) {
  return (
    <div className="ss-activity-row">
      <div className="ss-recent-icon">⌁</div>
      <div className="ss-activity-meta">
        <div className="ss-activity-title">{title}</div>
        <div className="ss-activity-sub">{subtitle}</div>
      </div>
    </div>
  )
}

function GoalMiniCard({ title, current, goal, suffix = '' }) {
  const pct = Math.min((current / Math.max(goal, 1)) * 100, 100)

  return (
    <div className="ss-goal-mini-card">
      <div className="ss-goal-mini-top">
        <span>{title}</span>
        <strong>
          {current}
          {suffix} / {goal}
          {suffix}
        </strong>
      </div>

      <div className="ss-progress-track">
        <div className="ss-progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}