import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useLMS } from "@/hooks/use-lms-store"
import { Progress } from "@/components/ui/progress"
import {
  IconFlame,
  IconStar,
  IconSearch,
  IconBook2,
  IconStack2,
  IconCategory,
  IconArrowUpRight,
  IconCircleCheck,
  IconCircle,
} from "@tabler/icons-react"

// Simulated current user (user-1: Arjun Mehta)
const CURRENT_USER_ID = "user-1"

type FilterType = "all" | "course" | "curriculum"

export function UserPortalPage() {
  const navigate = useNavigate()
  const { courses, curricula, users } = useLMS()
  const [filter, setFilter] = useState<FilterType>("all")
  const [search, setSearch] = useState("")

  // Current user
  const currentUser = users.find((u) => u.id === CURRENT_USER_ID)!

  // Build streak data (simulated — last 7 days)
  const streakDays = useMemo(() => {
    const days = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"]
    const completed = [false, false, false, false, false, false, false]
    return days.map((d, i) => ({ day: d, completed: completed[i], isToday: i === 6 }))
  }, [])

  // Compute XP and streak
  const expPoints = useMemo(() => {
    const totalProgress = Object.values(currentUser.courseProgress).reduce((a, b) => a + b, 0)
    return Math.round(totalProgress * 1.5)
  }, [currentUser])

  const currentStreak = 0

  // Enrolled courses with progress
  const enrolledCourses = useMemo(() => {
    return courses
      .filter((c) => currentUser.enrolledCourseIds.includes(c.id))
      .map((c) => ({
        ...c,
        type: "course" as const,
        progress: currentUser.courseProgress[c.id] || 0,
        moduleCount: c.modules.length,
      }))
  }, [courses, currentUser])

  // Enrolled curricula with progress
  const enrolledCurricula = useMemo(() => {
    return curricula
      .filter((c) => currentUser.enrolledCurriculumIds.includes(c.id))
      .map((c) => ({
        ...c,
        type: "curriculum" as const,
        progress: currentUser.curriculumProgress[c.id] || 0,
        courseCount: c.courseIds.length,
      }))
  }, [curricula, currentUser])

  // Filtered items
  const filteredItems = useMemo(() => {
    let items: Array<(typeof enrolledCourses)[0] | (typeof enrolledCurricula)[0]> = []
    if (filter === "all" || filter === "course") items = [...items, ...enrolledCourses]
    if (filter === "all" || filter === "curriculum") items = [...items, ...enrolledCurricula]

    if (search.trim()) {
      const q = search.toLowerCase()
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q),
      )
    }
    return items
  }, [filter, search, enrolledCourses, enrolledCurricula])

  const totalCourses = enrolledCourses.length
  const totalCurricula = enrolledCurricula.length

  return (
    <main className="up-main">
      {/* ─── Stats Row ─── */}
      <section className="up-stats-row">
        {/* Streak Card */}
        <div className="up-card up-streak-card">
          <div className="up-streak-top">
            <div className="up-streak-number-group">
              <span className="up-big-number">{currentStreak}</span>
              <IconFlame size={28} className="up-flame-icon-big" />
            </div>
            <div className="up-streak-label">
              Current
              <br />
              streak
            </div>
          </div>
          <div className="up-streak-days">
            {streakDays.map((d) => (
              <div key={d.day} className="up-day-col">
                <div
                  className={`up-day-circle ${d.completed ? "up-day-completed" : ""} ${d.isToday ? "up-day-today" : ""}`}
                >
                  {d.completed && <IconCircleCheck size={20} />}
                  {!d.completed && <IconCircle size={20} />}
                </div>
                <span className="up-day-label">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* XP Card */}
        <div className="up-card up-xp-card">
          <div className="up-xp-top">
            <div className="up-xp-number-group">
              <span className="up-big-number">{expPoints}</span>
              <IconStar size={28} className="up-star-icon-big" />
            </div>
            <div className="up-xp-label">Exp Score</div>
          </div>
          <div className="up-xp-bottom">
            <div className="up-xp-progress-label">Progress</div>
            <div className="up-xp-progress-items">
              <div className="up-progress-pill">
                <IconBook2 size={16} />
                <span className="up-progress-pill-label">Course</span>
                <span className="up-progress-pill-count">{totalCourses}</span>
              </div>
              <div className="up-progress-pill up-progress-pill-alt">
                <IconStack2 size={16} />
                <span className="up-progress-pill-label">Curricula</span>
                <span className="up-progress-pill-count">{totalCurricula}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Filters ─── */}
      <section className="up-filters-row">
        <div className="up-filter-tabs">
          <button
            className={`up-filter-btn ${filter === "all" ? "up-filter-active" : ""}`}
            onClick={() => setFilter("all")}
            title="All"
          >
            <IconCategory size={20} />
          </button>
          <button
            className={`up-filter-btn ${filter === "course" ? "up-filter-active" : ""}`}
            onClick={() => setFilter("course")}
            title="Courses"
          >
            <IconBook2 size={20} />
          </button>
          <button
            className={`up-filter-btn ${filter === "curriculum" ? "up-filter-active" : ""}`}
            onClick={() => setFilter("curriculum")}
            title="Curricula"
          >
            <IconStack2 size={20} />
          </button>
        </div>
        <div className="up-search-box">
          <input
            type="text"
            placeholder="Search Course"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="up-search-input"
          />
          <IconSearch size={18} className="up-search-icon" />
        </div>
      </section>

      {/* ─── Cards Grid ─── */}
      <section className="up-cards-grid">
        {filteredItems.map((item) => {
          const isCourse = item.type === "course"
          const hasProgress = isCourse && item.progress > 0

          return (
            <div 
              key={item.id} 
              className="up-card up-course-card"
              onClick={() => {
                if (isCourse) {
                  navigate(`/userportal/course/${item.id}`)
                } else {
                  navigate(`/userportal/curriculum/${item.id}`)
                }
              }}
            >
              <div className="up-course-card-header">
                <div
                  className={`up-course-type-badge ${isCourse ? "up-badge-course" : "up-badge-curriculum"}`}
                >
                  {isCourse ? <IconBook2 size={14} /> : <IconStack2 size={14} />}
                  <span>{isCourse ? "Course" : "Curricula"}</span>
                </div>
              </div>
              <h3 className="up-course-title">{item.title}</h3>
              <p className="up-course-desc">{item.description}</p>
              <div className="up-course-card-footer">
                {hasProgress ? (
                  <div className="up-course-progress">
                    <span className="up-progress-text">{item.progress}% Completed</span>
                    <Progress value={item.progress} className="up-progress-bar" />
                  </div>
                ) : (
                  <div className="up-course-meta">
                    {"moduleCount" in item && (
                      <span className="up-meta-text">{item.moduleCount} Modules</span>
                    )}
                    {"courseCount" in item && (
                      <span className="up-meta-text">{item.courseCount} Courses</span>
                    )}
                  </div>
                )}
                <button className="up-card-action" title="Open">
                  <IconArrowUpRight size={18} />
                </button>
              </div>
            </div>
          )
        })}

        {filteredItems.length === 0 && (
          <div className="up-empty-state">
            <IconSearch size={48} className="up-empty-icon" />
            <p>No courses or curricula found.</p>
          </div>
        )}
      </section>
    </main>
  )
}
