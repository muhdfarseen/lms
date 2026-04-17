import { useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useLMS } from "@/hooks/use-lms-store"
import { Progress } from "@/components/ui/progress"
import {
  IconArrowLeft,
  IconArrowUpRight,
  IconBook2,
  IconStack2,
} from "@tabler/icons-react"

const CURRENT_USER_ID = "user-1"

export function UserCurriculumViewPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { curricula, courses, users } = useLMS()
  const currentUser = users.find((u) => u.id === CURRENT_USER_ID)!

  const curriculum = curricula.find((c) => c.id === id)

  const progress = useMemo(() => {
    if (!curriculum) return 0
    return currentUser.curriculumProgress[curriculum.id] || 0
  }, [curriculum, currentUser])

  const curriculumCourses = useMemo(() => {
    if (!curriculum) return []
    return curriculum.courseIds
      .map((cid) => courses.find((c) => c.id === cid))
      .filter(Boolean)
      .map((c) => ({
        ...c!,
        progress: currentUser.courseProgress[c!.id] || 0,
      }))
  }, [curriculum, courses, currentUser])

  if (!curriculum) {
    return (
      <main className="up-main">
        <div className="up-empty-state">
          <IconStack2 size={48} className="up-empty-icon" />
          <p>Curriculum not found.</p>
          <button className="upp-back-btn" onClick={() => navigate("/userportal")}>
            <IconArrowLeft size={18} />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="up-main ucv-main">
      {/* Back button */}
      <button className="upp-back-btn" onClick={() => navigate("/userportal")}>
        <IconArrowLeft size={18} />
        <span>Back to Dashboard</span>
      </button>

      {/* Curriculum Hero */}
      <div className="ucv-hero ucur-hero">
        <div className="ucv-hero-content">
          <div className="ucv-hero-badge ucur-badge">
            <IconStack2 size={14} />
            <span>Curriculum</span>
          </div>
          <h1 className="ucv-hero-title">{curriculum.title}</h1>
          <p className="ucv-hero-desc">{curriculum.description}</p>
          <div className="ucv-hero-meta">
            <span className="ucv-hero-meta-item">{curriculumCourses.length} Courses</span>
            <span className="ucv-hero-meta-item">{progress}% Complete</span>
          </div>
          <div className="ucv-hero-progress">
            <Progress value={progress} className="ucv-hero-progress-bar" />
          </div>
        </div>
      </div>

      {/* Course List */}
      <section className="ucur-courses-section">
        <div className="ucur-courses-header">
          <h2 className="ucur-courses-title">Courses in this Curriculum</h2>
          <span className="ucur-courses-count">{curriculumCourses.length} courses</span>
        </div>

        <div className="up-cards-grid">
          {curriculumCourses.map((course) => {
            const hasProgress = course.progress > 0

            return (
              <div
                key={course.id}
                className="up-card up-course-card"
                onClick={() => navigate(`/userportal/course/${course.id}`)}
              >
                <div className="up-course-card-header">
                  <div className="up-course-type-badge up-badge-course">
                    <IconBook2 size={14} />
                    <span>Course</span>
                  </div>
                </div>
                <h3 className="up-course-title">{course.title}</h3>
                <p className="up-course-desc">{course.description}</p>
                <div className="up-course-card-footer">
                  {hasProgress ? (
                    <div className="up-course-progress">
                      <span className="up-progress-text">{course.progress}% Completed</span>
                      <Progress value={course.progress} className="up-progress-bar" />
                    </div>
                  ) : (
                    <div className="up-course-meta">
                      <span className="up-meta-text">{course.modules.length} Modules</span>
                    </div>
                  )}
                  <button className="up-card-action" title="Open">
                    <IconArrowUpRight size={18} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {curriculumCourses.length === 0 && (
          <div className="up-empty-state">
            <p>No courses in this curriculum yet.</p>
          </div>
        )}
      </section>
    </main>
  )
}
