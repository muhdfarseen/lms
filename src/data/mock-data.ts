import type {
  Course,
  CourseModule,
  Curriculum,
  MCQQuestion,
  ProvisioningRule,
  User,
  UserGroup,
} from "./types"

// ============================================
// Helper: generate IDs
// ============================================
let _id = 100
function uid(): string {
  return `id-${++_id}`
}

// ============================================
// Mock Users (Students only)
// ============================================
export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "Arjun Mehta",
    email: "arjun@example.com",
    phone: "+91 98765 43210",
    location: "Mumbai, Maharashtra",
    dob: "2003-04-12",
    role: "Student",
    createdAt: "2025-09-15",
    groupIds: ["group-1"],
    enrolledCourseIds: ["course-1", "course-2"],
    enrolledCurriculumIds: ["curriculum-1"],
    courseProgress: { "course-1": 85, "course-2": 42 },
    curriculumProgress: { "curriculum-1": 60 },
  },
  {
    id: "user-2",
    name: "Priya Sharma",
    email: "priya@example.com",
    phone: "+91 87654 32109",
    location: "Bangalore, Karnataka",
    dob: "2004-01-28",
    role: "Student",
    createdAt: "2025-10-01",
    groupIds: ["group-1", "group-2"],
    enrolledCourseIds: ["course-1", "course-3"],
    enrolledCurriculumIds: ["curriculum-1"],
    courseProgress: { "course-1": 100, "course-3": 20 },
    curriculumProgress: { "curriculum-1": 45 },
  },
  {
    id: "user-3",
    name: "Rahul Verma",
    email: "rahul@example.com",
    phone: "+91 76543 21098",
    location: "Delhi, NCR",
    dob: "2001-06-05",
    role: "Student",
    createdAt: "2025-08-20",
    groupIds: ["group-2"],
    enrolledCourseIds: ["course-2"],
    enrolledCurriculumIds: [],
    courseProgress: { "course-2": 68 },
    curriculumProgress: {},
  },
  {
    id: "user-4",
    name: "Sneha Patel",
    email: "sneha@example.com",
    phone: "+91 65432 10987",
    location: "Ahmedabad, Gujarat",
    dob: "2005-03-20",
    role: "Student",
    createdAt: "2025-11-12",
    groupIds: [],
    enrolledCourseIds: ["course-1"],
    enrolledCurriculumIds: ["curriculum-1"],
    courseProgress: { "course-1": 55 },
    curriculumProgress: { "curriculum-1": 30 },
  },
  {
    id: "user-5",
    name: "Vikram Singh",
    email: "vikram@example.com",
    phone: "+91 54321 09876",
    location: "Hyderabad, Telangana",
    dob: "2002-09-14",
    role: "Student",
    createdAt: "2025-07-01",
    groupIds: ["group-1"],
    enrolledCourseIds: ["course-1", "course-3"],
    enrolledCurriculumIds: ["curriculum-1"],
    courseProgress: { "course-1": 30, "course-3": 70 },
    curriculumProgress: { "curriculum-1": 15 },
  },
]

// ============================================
// Mock User Groups
// ============================================
export const mockUserGroups: UserGroup[] = [
  {
    id: "group-1",
    name: "Batch 2025-A",
    description: "First batch of 2025 engineering students",
    userIds: ["user-1", "user-2", "user-5"],
    assignedCourseIds: ["course-1"],
    assignedCurriculumIds: ["curriculum-1"],
    createdAt: "2025-09-01",
  },
  {
    id: "group-2",
    name: "Batch 2025-B",
    description: "Second batch of 2025 students — advanced track",
    userIds: ["user-2", "user-3"],
    assignedCourseIds: ["course-2", "course-3"],
    assignedCurriculumIds: [],
    createdAt: "2025-10-15",
  },
]

// ============================================
// Mock MCQ Questions (reusable)
// ============================================
const sampleAssessmentQuestions: MCQQuestion[] = [
  {
    id: "q-1",
    question: "What does HTML stand for?",
    options: [
      { id: "o-1a", text: "Hyper Text Markup Language", isCorrect: true },
      { id: "o-1b", text: "High Tech Modern Language", isCorrect: false },
      { id: "o-1c", text: "Home Tool Markup Language", isCorrect: false },
      { id: "o-1d", text: "Hyperlinks and Text Markup Language", isCorrect: false },
    ],
  },
  {
    id: "q-2",
    question: "Which CSS property is used to change the text color?",
    options: [
      { id: "o-2a", text: "font-color", isCorrect: false },
      { id: "o-2b", text: "text-color", isCorrect: false },
      { id: "o-2c", text: "color", isCorrect: true },
      { id: "o-2d", text: "foreground", isCorrect: false },
    ],
  },
  {
    id: "q-3",
    question: "Which tag is used for the largest heading in HTML?",
    options: [
      { id: "o-3a", text: "<heading>", isCorrect: false },
      { id: "o-3b", text: "<h6>", isCorrect: false },
      { id: "o-3c", text: "<h1>", isCorrect: true },
      { id: "o-3d", text: "<head>", isCorrect: false },
    ],
  },
]

const sampleQuizQuestions: MCQQuestion[] = [
  {
    id: "qq-1",
    question: "Is JavaScript a compiled language?",
    options: [
      { id: "oq-1a", text: "Yes", isCorrect: false },
      { id: "oq-1b", text: "No, it is interpreted", isCorrect: true },
    ],
  },
  {
    id: "qq-2",
    question: "Which keyword declares a constant in JavaScript?",
    options: [
      { id: "oq-2a", text: "var", isCorrect: false },
      { id: "oq-2b", text: "let", isCorrect: false },
      { id: "oq-2c", text: "const", isCorrect: true },
    ],
  },
]

// ============================================
// Mock Course Modules
// ============================================
const webDevModules: CourseModule[] = [
  {
    id: "mod-1",
    heading: "Introduction to Web Development",
    description: "Overview of modern web technologies and the development workflow.",
    contentType: "video",
    order: 0,
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: "mod-2",
    heading: "HTML Fundamentals",
    description: "Learn semantic HTML5, forms, and accessibility best practices.",
    contentType: "text",
    order: 1,
    textContent:
      "<h2>HTML Fundamentals</h2><p>HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure of a web page using a series of elements.</p><ul><li>Semantic elements: <code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code></li><li>Form elements: <code>&lt;input&gt;</code>, <code>&lt;select&gt;</code>, <code>&lt;textarea&gt;</code></li><li>Media elements: <code>&lt;img&gt;</code>, <code>&lt;video&gt;</code>, <code>&lt;audio&gt;</code></li></ul>",
  },
  {
    id: "mod-3",
    heading: "CSS Deep Dive",
    description: "Master CSS layouts, Flexbox, Grid, and responsive design patterns.",
    contentType: "pdf",
    order: 2,
    pdfUrl: "/sample.pdf",
  },
  {
    id: "mod-4",
    heading: "JavaScript Essentials",
    description: "Core JavaScript concepts including ES6+ features.",
    contentType: "audio",
    order: 3,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: "mod-5",
    heading: "Module Assessment",
    description: "Test your knowledge on web development fundamentals.",
    contentType: "assessment",
    order: 4,
    questions: sampleAssessmentQuestions,
  },
  {
    id: "mod-6",
    heading: "Quick Check — HTML Basics",
    description: "A quick quiz on HTML concepts.",
    contentType: "quiz",
    order: 5,
    questions: sampleQuizQuestions,
  },
]

const reactModules: CourseModule[] = [
  {
    id: "mod-7",
    heading: "React Introduction",
    description: "What is React, virtual DOM, and component-based architecture.",
    contentType: "video",
    order: 0,
    videoUrl: "https://www.youtube.com/watch?v=SqcY0GlETPk",
  },
  {
    id: "mod-8",
    heading: "JSX and Components",
    description: "Understanding JSX syntax and creating functional components.",
    contentType: "text",
    order: 1,
    textContent:
      "<h2>JSX & Components</h2><p>JSX is a syntax extension for JavaScript that lets you write HTML-like markup inside a JavaScript file. Components are reusable pieces of UI.</p><pre><code>function Welcome({ name }) {\n  return &lt;h1&gt;Hello, {name}&lt;/h1&gt;;\n}</code></pre>",
  },
  {
    id: "mod-9",
    heading: "State and Props",
    description: "Managing component state with useState and passing data via props.",
    contentType: "video",
    order: 2,
    videoUrl: "https://www.youtube.com/watch?v=O6P86uwfdR0",
  },
]

const pythonModules: CourseModule[] = [
  {
    id: "mod-10",
    heading: "Python Basics",
    description: "Variables, data types, and control flow in Python.",
    contentType: "video",
    order: 0,
    videoUrl: "https://www.youtube.com/watch?v=kqtD5dpn9C8",
  },
  {
    id: "mod-11",
    heading: "Functions and Modules",
    description: "Writing reusable functions and organizing code into modules.",
    contentType: "text",
    order: 1,
    textContent:
      '<h2>Python Functions</h2><p>Functions in Python are defined using the <code>def</code> keyword.</p><pre><code>def greet(name):\n    return f"Hello, {name}!"</code></pre>',
  },
]

// ============================================
// Mock Courses
// ============================================
export const mockCourses: Course[] = [
  {
    id: "course-1",
    title: "Web Development Fundamentals",
    description:
      "A comprehensive course covering HTML, CSS, JavaScript, and modern web development practices. Perfect for beginners looking to build their first websites.",
    visibility: "public",
    status: "published",
    modules: webDevModules,
    restrictedUserIds: [],
    restrictedGroupIds: [],
    createdAt: "2025-08-01",
    updatedAt: "2025-11-20",
  },
  {
    id: "course-2",
    title: "React.js Masterclass",
    description:
      "Deep dive into React.js — from components and hooks to advanced patterns like context, reducers, and performance optimization.",
    visibility: "restricted",
    status: "published",
    modules: reactModules,
    restrictedUserIds: ["user-1", "user-3"],
    restrictedGroupIds: ["group-2"],
    createdAt: "2025-09-10",
    updatedAt: "2025-12-01",
  },
  {
    id: "course-3",
    title: "Python for Data Science",
    description:
      "Learn Python programming from the ground up with a focus on data analysis, NumPy, Pandas, and visualization with Matplotlib.",
    visibility: "public",
    status: "draft",
    modules: pythonModules,
    restrictedUserIds: [],
    restrictedGroupIds: [],
    createdAt: "2025-10-20",
    updatedAt: "2025-10-20",
  },
]

// ============================================
// Mock Curriculum
// ============================================
export const mockCurricula: Curriculum[] = [
  {
    id: "curriculum-1",
    title: "Full-Stack Developer Path",
    description:
      "A complete learning path that takes you from web basics through React and beyond to become a full-stack developer.",
    visibility: "public",
    status: "published",
    courseIds: ["course-1", "course-2"],
    restrictedUserIds: [],
    restrictedGroupIds: [],
    createdAt: "2025-09-15",
    updatedAt: "2025-11-30",
  },
  {
    id: "curriculum-2",
    title: "Data Engineering Bootcamp",
    description:
      "Intensive curriculum combining Python, data analysis tools, and backend development skills for aspiring data engineers.",
    visibility: "restricted",
    status: "draft",
    courseIds: ["course-3"],
    restrictedUserIds: ["user-2"],
    restrictedGroupIds: ["group-1"],
    createdAt: "2025-10-25",
    updatedAt: "2025-12-05",
  },
]

// ============================================
// Mock Provisioning Rules
// ============================================
export const mockProvisioningRules: ProvisioningRule[] = [
  {
    id: "prov-1",
    targetType: "group",
    targetId: "group-1",
    resourceType: "course",
    resourceId: "course-1",
    assignedAt: "2025-09-01",
    startDate: "2025-09-01",
    endDate: "2026-03-01",
  },
  {
    id: "prov-2",
    targetType: "user",
    targetId: "user-1",
    resourceType: "curriculum",
    resourceId: "curriculum-1",
    assignedAt: "2025-09-15",
    startDate: "2025-09-15",
    endDate: "2026-06-15",
  },
  {
    id: "prov-3",
    targetType: "group",
    targetId: "group-2",
    resourceType: "course",
    resourceId: "course-2",
    assignedAt: "2025-10-15",
    startDate: "2025-10-15",
    endDate: "2026-04-15",
  },
  {
    id: "prov-4",
    targetType: "user",
    targetId: "user-2",
    resourceType: "course",
    resourceId: "course-3",
    assignedAt: "2025-11-01",
    startDate: "2025-11-01",
    endDate: "2026-05-01",
  },
  {
    id: "prov-5",
    targetType: "user",
    targetId: "user-1",
    resourceType: "course",
    resourceId: "course-1",
    assignedAt: "2025-09-01",
    startDate: "2025-09-01",
    endDate: "2026-03-01",
  },
]

// ============================================
// Helper: ID generator for new items
// ============================================
export function generateId(prefix: string = "id"): string {
  return `${prefix}-${uid()}`
}
