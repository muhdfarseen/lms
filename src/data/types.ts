// ============================================
// LMS Admin Panel - Type Definitions
// ============================================

export type Visibility = "public" | "restricted"
export type CourseStatus = "draft" | "published"
export type ContentType = "video" | "audio" | "pdf" | "text" | "assessment" | "quiz"

export interface User {
  id: string
  name: string
  email: string
  phone: string
  location: string
  dob: string // date of birth, YYYY-MM-DD
  role: "Student"
  avatar?: string
  createdAt: string // joined on
  groupIds: string[]
  enrolledCourseIds: string[]
  enrolledCurriculumIds: string[]
  courseProgress: Record<string, number> // courseId -> percentage
  curriculumProgress: Record<string, number>
}

export interface UserGroup {
  id: string
  name: string
  description: string
  userIds: string[]
  assignedCourseIds: string[]
  assignedCurriculumIds: string[]
  createdAt: string
}

export interface MCQOption {
  id: string
  text: string
  isCorrect: boolean
}

export interface MCQQuestion {
  id: string
  question: string
  options: MCQOption[]
}

export interface CourseModule {
  id: string
  heading: string
  description: string
  contentType: ContentType
  order: number
  // Content-specific fields
  videoUrl?: string // youtube link for video
  audioUrl?: string // url or file ref for audio
  pdfUrl?: string // url or file ref for pdf
  textContent?: string // rich text content
  questions?: MCQQuestion[] // for assessment and quiz
}

export interface Course {
  id: string
  title: string
  description: string
  visibility: Visibility
  status: CourseStatus
  modules: CourseModule[]
  restrictedUserIds: string[]
  restrictedGroupIds: string[]
  createdAt: string
  updatedAt: string
}

export interface Curriculum {
  id: string
  title: string
  description: string
  visibility: Visibility
  status: CourseStatus
  courseIds: string[] // ordered list of course IDs
  restrictedUserIds: string[]
  restrictedGroupIds: string[]
  createdAt: string
  updatedAt: string
}

// Provisioning
export interface ProvisioningRule {
  id: string
  targetType: "user" | "group"
  targetId: string
  resourceType: "course" | "curriculum"
  resourceId: string
  assignedAt: string   // provisioned date
  startDate?: string   // access start date
  endDate?: string     // access end date
}
