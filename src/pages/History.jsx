import { useMemo } from 'react'
import { getUserMacros } from '../utils/macros'
import { getUserWorkouts } from '../utils/workouts'

function formatDateLabel(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function buildMonthCalendar(items) {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const firstWeekday = firstDay.getDay()
  const totalDays = lastDay.getDate()

  const activityMap = {}

  items.forEach((item) => {
    const date = new Date(item.createdAt)
    if (date.getFullYear() === year && date.getMonth() === month) {
      const day = date.getDate()
      if (!activityMap[day]) {
        activityMap[day] = { workouts: 0, macros: 0 }
      }

      if (item.type === 'workout') activityMap[day].workouts += 1
      if (item.type === 'macro') activityMap[day].macros += 1
    }
  })

  const cells = []

  for (let i = 0; i < firstWeekday; i++) cells.push(null)

  for (let day = 1; day <= totalDays; day++) {
    cells.push({
      day,
      activity: activityMap[day] || { workouts: 0, macros: 0 },
    })
  }

  return {
    monthTitle: now.toLocaleDateString(undefined, {
      month: 'long',
      year: 'numeric',
    }),
    cells,
  }
}

export default function History({ currentUser, dataRefreshKey }) {
  const { groupedEntries, calendar, totals } = useMemo(() => {
    const workouts = getUserWorkouts(currentUser.userId).map((item) => ({
      ...item,
      type: 'workout',
    }))

    const macros = getUserMacros(currentUser.userId).map((item) => ({
      ...item,
      type: 'macro',
    }))

    const combined = [...workouts, ...macros].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )

    const groups = {}

    combined.forEach((item) => {
      const label = formatDateLabel(item.createdAt)
      if (!groups[label]) groups[label] = []
      groups[label].push(item)
    })

    return {
      groupedEntries: Object.entries(groups),
      calendar: buildMonthCalendar(combined),
      totals: {
        workouts: workouts.length,
        macros: macros.length,
        all: combined.length,
      },
    }
  }, [currentUser.userId, dataRefreshKey])

  return (
    <div className="ss-page ss-module-page">
      <section className="ss-module-hero-card ss-card">
        <div className="ss-module-hero-copy">
          <div className="ss-hero-eyebrow">ACTIVITY MODULE</div>
          <h1 className="ss-page-title">HISTORY</h1>
          <p className="ss-page-sub">
            Review your logged workouts and meals across the month and by exact date.
          </p>
        </div>

        <div className="ss-module-hero-stats">
          <ModuleStatCard label="TOTAL ENTRIES" value={totals.all} sub="All activity" />
          <ModuleStatCard label="WORKOUTS" value={totals.workouts} sub="Logged sessions" />
          <ModuleStatCard label="MACROS" value={totals.macros} sub="Logged meals" />
        </div>
      </section>

      <section className="ss-history-layout">
        <div className="ss-card ss-page-card">
          <div className="ss-section-title">{calendar.monthTitle.toUpperCase()}</div>

          <div className="ss-calendar-weekdays">
            <span>S</span>
            <span>M</span>
            <span>T</span>
            <span>W</span>
            <span>T</span>
            <span>F</span>
            <span>S</span>
          </div>

          <div className="ss-calendar-grid">
            {calendar.cells.map((cell, index) =>
              cell ? (
                <div className="ss-calendar-cell" key={index}>
                  <div className="ss-calendar-day">{cell.day}</div>

                  <div className="ss-calendar-markers">
                    {cell.activity.workouts > 0 ? (
                      <div className="ss-calendar-pill workout">
                        W {cell.activity.workouts}
                      </div>
                    ) : null}

                    {cell.activity.macros > 0 ? (
                      <div className="ss-calendar-pill macro">
                        M {cell.activity.macros}
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : (
                <div className="ss-calendar-cell empty" key={index} />
              )
            )}
          </div>
        </div>

        <div className="ss-card ss-page-card">
          <div className="ss-section-title">LOG HISTORY</div>

          {groupedEntries.length === 0 ? (
            <p className="ss-muted-note">No history yet.</p>
          ) : (
            <div className="ss-history-groups">
              {groupedEntries.map(([dateLabel, items]) => (
                <div className="ss-history-group" key={dateLabel}>
                  <div className="ss-history-date">{dateLabel}</div>

                  <div className="ss-history-list">
                    {items.map((item) => (
                      <div className="ss-history-row" key={item.id}>
                        <div className="ss-history-type">
                          {item.type === 'workout' ? 'WORKOUT' : 'MACRO'}
                        </div>

                        <div className="ss-history-content">
                          {item.type === 'workout' ? (
                            <>
                              <div className="ss-history-title">{item.workoutName}</div>
                              <div className="ss-history-sub">
                                {item.exercise} • {item.sets}x{item.reps} • {item.weight} lb
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="ss-history-title">{item.mealName}</div>
                              <div className="ss-history-sub">
                                {item.calories} cal • {item.protein}p • {item.carbs}c • {item.fats}f
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
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