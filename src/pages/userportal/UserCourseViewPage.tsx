import { useState, useEffect, useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useLMS } from "@/hooks/use-lms-store"
import { Progress } from "@/components/ui/progress"
import type { ContentType, CourseModule } from "@/data/types"
import {
  IconArrowLeft,
  IconVideo,
  IconHeadphones,
  IconFileTypePdf,
  IconFileText,
  IconClipboardCheck,
  IconQuestionMark,
  IconCircleCheck,
  IconCircle,
  IconPlayerPlay,
  IconBook2,
} from "@tabler/icons-react"

const CURRENT_USER_ID = "user-1"

const contentTypeIcons: Record<ContentType, typeof IconVideo> = {
  video: IconVideo,
  audio: IconHeadphones,
  pdf: IconFileTypePdf,
  text: IconFileText,
  assessment: IconClipboardCheck,
  quiz: IconQuestionMark,
}

const contentTypeLabels: Record<ContentType, string> = {
  video: "Video",
  audio: "Audio",
  pdf: "PDF Document",
  text: "Reading",
  assessment: "Assessment",
  quiz: "Quiz",
}

function extractYouTubeId(url: string): string {
  const match = url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/,
  )
  return match?.[1] ?? ""
}

function ModuleContent({ mod }: { mod: CourseModule }) {
  return (
    <div className="ucv-module-content">
      <div className="ucv-content-header">
        <h2 className="ucv-content-title">{mod.heading}</h2>
        <p className="ucv-content-desc">{mod.description}</p>
      </div>

      <div className="ucv-content-body">
        {mod.contentType === "video" && mod.videoUrl && (
          <div className="ucv-video-wrap">
            <iframe
              src={`https://www.youtube.com/embed/${extractYouTubeId(mod.videoUrl)}`}
              className="ucv-video-iframe"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={mod.heading}
            />
          </div>
        )}

        {mod.contentType === "audio" && mod.audioUrl && (
          <div className="ucv-audio-wrap">
            <div className="ucv-audio-icon">
              <IconHeadphones size={32} />
            </div>
            <audio controls src={mod.audioUrl} className="ucv-audio-player">
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {mod.contentType === "pdf" && mod.pdfUrl && (
          <div className="ucv-pdf-wrap">
            <IconFileTypePdf size={48} className="ucv-pdf-icon" />
            <p className="ucv-pdf-name">PDF Document</p>
            <p className="ucv-pdf-url">{mod.pdfUrl}</p>
          </div>
        )}

        {mod.contentType === "text" && mod.textContent && (
          <div
            className="ucv-text-content"
            dangerouslySetInnerHTML={{ __html: mod.textContent }}
          />
        )}

        {(mod.contentType === "assessment" || mod.contentType === "quiz") &&
          mod.questions && (
            <div className="ucv-quiz-wrap">
              {mod.questions.map((q, idx) => (
                <div key={q.id} className="ucv-quiz-question">
                  <p className="ucv-quiz-q-text">
                    {idx + 1}. {q.question}
                  </p>
                  <div className="ucv-quiz-options">
                    {q.options.map((opt) => (
                      <div
                        key={opt.id}
                        className={`ucv-quiz-option ${opt.isCorrect ? "ucv-quiz-correct" : ""}`}
                      >
                        <div
                          className={`ucv-quiz-dot ${opt.isCorrect ? "ucv-dot-correct" : ""}`}
                        />
                        <span>{opt.text}</span>
                        {opt.isCorrect && (
                          <span className="ucv-correct-badge">Correct</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  )
}

export function UserCourseViewPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { courses, users } = useLMS()
  const course = courses.find((c) => c.id === id)
  const currentUser = users.find((u) => u.id === CURRENT_USER_ID)!
  const sortedModules = course ? [...course.modules].sort((a, b) => a.order - b.order) : []

  const [activeModuleId, setActiveModuleId] = useState<string | null>(null)

  const progress = useMemo(() => {
    if (!course) return 0
    return currentUser.courseProgress[course.id] || 0
  }, [course, currentUser])

  useEffect(() => {
    if (sortedModules.length > 0 && !activeModuleId) {
      setActiveModuleId(sortedModules[0].id)
    }
  }, [sortedModules, activeModuleId])

  if (!course) {
    return (
      <main className="up-main">
        <div className="up-empty-state">
          <IconBook2 size={48} className="up-empty-icon" />
          <p>Course not found.</p>
          <button className="upp-back-btn" onClick={() => navigate("/userportal")}>
            <IconArrowLeft size={18} />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </main>
    )
  }

  const activeModule = sortedModules.find((m) => m.id === activeModuleId)

  return (
    <main className="up-main ucv-main">
      {/* Back button */}
      <button className="upp-back-btn" onClick={() => navigate("/userportal")}>
        <IconArrowLeft size={18} />
        <span>Back to Dashboard</span>
      </button>

      {/* Course Hero */}
      <div className="ucv-hero">
        <div className="ucv-hero-content">
          <div className="ucv-hero-badge">
            <IconBook2 size={14} />
            <span>Course</span>
          </div>
          <h1 className="ucv-hero-title">{course.title}</h1>
          <p className="ucv-hero-desc">{course.description}</p>
          <div className="ucv-hero-meta">
            <span className="ucv-hero-meta-item">{course.modules.length} Modules</span>
            <span className="ucv-hero-meta-item">{progress}% Complete</span>
          </div>
          <div className="ucv-hero-progress">
            <Progress value={progress} className="ucv-hero-progress-bar" />
          </div>
        </div>
      </div>

      {/* Module Viewer */}
      {sortedModules.length === 0 ? (
        <div className="up-empty-state">
          <p>No modules in this course yet.</p>
        </div>
      ) : (
        <div className="ucv-viewer">
          {/* Module Sidebar */}
          <div className="ucv-sidebar">
            <div className="ucv-sidebar-header">
              <h3>Modules</h3>
              <span className="ucv-sidebar-count">{sortedModules.length}</span>
            </div>
            <div className="ucv-sidebar-list">
              {sortedModules.map((mod, idx) => {
                const Icon = contentTypeIcons[mod.contentType]
                const isActive = activeModuleId === mod.id
                // Simulate: modules before progress% are "completed"
                const completedCount = Math.floor(
                  (progress / 100) * sortedModules.length,
                )
                const isCompleted = idx < completedCount

                return (
                  <button
                    key={mod.id}
                    onClick={() => setActiveModuleId(mod.id)}
                    className={`ucv-sidebar-item ${isActive ? "ucv-sidebar-active" : ""}`}
                  >
                    <div className="ucv-sidebar-item-icon">
                      {isCompleted ? (
                        <IconCircleCheck size={18} className="ucv-check-done" />
                      ) : isActive ? (
                        <IconPlayerPlay size={18} className="ucv-check-active" />
                      ) : (
                        <IconCircle size={18} className="ucv-check-pending" />
                      )}
                    </div>
                    <div className="ucv-sidebar-item-info">
                      <span className="ucv-sidebar-item-title">
                        {idx + 1}. {mod.heading}
                      </span>
                      <span className="ucv-sidebar-item-type">
                        <Icon size={12} />
                        {contentTypeLabels[mod.contentType]}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="ucv-content-area">
            {activeModule && <ModuleContent mod={activeModule} />}
          </div>
        </div>
      )}
    </main>
  )
}
