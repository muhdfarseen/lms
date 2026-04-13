import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type {
  Course,
  CourseModule,
  Curriculum,
  ProvisioningRule,
  User,
  UserGroup,
} from "@/data/types"
import {
  mockCourses,
  mockCurricula,
  mockProvisioningRules,
  mockUserGroups,
  mockUsers,
  generateId,
} from "@/data/mock-data"

// ============================================
// Auth
// ============================================
interface AuthState {
  isAuthenticated: boolean
  login: (email: string, password: string) => boolean
  logout: () => void
}

// ============================================
// Store shape
// ============================================
interface LMSStore extends AuthState {
  // Courses
  courses: Course[]
  addCourse: (course: Omit<Course, "id" | "createdAt" | "updatedAt">) => string
  updateCourse: (id: string, updates: Partial<Course>) => void
  deleteCourse: (id: string) => void
  // Course Modules
  addModule: (courseId: string, mod: Omit<CourseModule, "id" | "order">) => void
  updateModule: (courseId: string, moduleId: string, updates: Partial<CourseModule>) => void
  deleteModule: (courseId: string, moduleId: string) => void
  reorderModules: (courseId: string, modules: CourseModule[]) => void
  // Curriculum
  curricula: Curriculum[]
  addCurriculum: (c: Omit<Curriculum, "id" | "createdAt" | "updatedAt">) => void
  updateCurriculum: (id: string, updates: Partial<Curriculum>) => void
  deleteCurriculum: (id: string) => void
  // Users
  users: User[]
  addUser: (u: Omit<User, "id" | "createdAt">) => void
  updateUser: (id: string, updates: Partial<User>) => void
  deleteUser: (id: string) => void
  // User Groups
  userGroups: UserGroup[]
  addUserGroup: (g: Omit<UserGroup, "id" | "createdAt">) => void
  updateUserGroup: (id: string, updates: Partial<UserGroup>) => void
  deleteUserGroup: (id: string) => void
  // Provisioning
  provisioningRules: ProvisioningRule[]
  addProvisioningRule: (rule: Omit<ProvisioningRule, "id" | "assignedAt">) => void
  updateProvisioningRule: (id: string, updates: Partial<ProvisioningRule>) => void
  deleteProvisioningRule: (id: string) => void
}

const LMSContext = createContext<LMSStore | null>(null)

export function useLMS(): LMSStore {
  const ctx = useContext(LMSContext)
  if (!ctx) throw new Error("useLMS must be inside LMSProvider")
  return ctx
}

export function LMSProvider({ children }: { children: ReactNode }) {
  // Auth
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const login = useCallback((email: string, _password: string) => {
    // Mock login – any non-empty email/password works
    if (email && _password) {
      setIsAuthenticated(true)
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => setIsAuthenticated(false), [])

  // Courses
  const [courses, setCourses] = useState<Course[]>(mockCourses)

  const addCourse = useCallback(
    (course: Omit<Course, "id" | "createdAt" | "updatedAt">) => {
      const id = generateId("course")
      const now = new Date().toISOString().split("T")[0]
      setCourses((prev) => [...prev, { ...course, id, createdAt: now, updatedAt: now }])
      return id
    },
    [],
  )

  const updateCourse = useCallback((id: string, updates: Partial<Course>) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString().split("T")[0] } : c,
      ),
    )
  }, [])

  const deleteCourse = useCallback((id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id))
  }, [])

  // Modules
  const addModule = useCallback(
    (courseId: string, mod: Omit<CourseModule, "id" | "order">) => {
      setCourses((prev) =>
        prev.map((c) => {
          if (c.id !== courseId) return c
          const newMod: CourseModule = {
            ...mod,
            id: generateId("mod"),
            order: c.modules.length,
          }
          return { ...c, modules: [...c.modules, newMod] }
        }),
      )
    },
    [],
  )

  const updateModule = useCallback(
    (courseId: string, moduleId: string, updates: Partial<CourseModule>) => {
      setCourses((prev) =>
        prev.map((c) => {
          if (c.id !== courseId) return c
          return {
            ...c,
            modules: c.modules.map((m) => (m.id === moduleId ? { ...m, ...updates } : m)),
          }
        }),
      )
    },
    [],
  )

  const deleteModule = useCallback((courseId: string, moduleId: string) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== courseId) return c
        return {
          ...c,
          modules: c.modules
            .filter((m) => m.id !== moduleId)
            .map((m, i) => ({ ...m, order: i })),
        }
      }),
    )
  }, [])

  const reorderModules = useCallback((courseId: string, modules: CourseModule[]) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== courseId) return c
        return { ...c, modules: modules.map((m, i) => ({ ...m, order: i })) }
      }),
    )
  }, [])

  // Curriculum
  const [curricula, setCurricula] = useState<Curriculum[]>(mockCurricula)

  const addCurriculum = useCallback(
    (cur: Omit<Curriculum, "id" | "createdAt" | "updatedAt">) => {
      const now = new Date().toISOString().split("T")[0]
      setCurricula((prev) => [
        ...prev,
        { ...cur, id: generateId("curriculum"), createdAt: now, updatedAt: now },
      ])
    },
    [],
  )

  const updateCurriculum = useCallback((id: string, updates: Partial<Curriculum>) => {
    setCurricula((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString().split("T")[0] } : c,
      ),
    )
  }, [])

  const deleteCurriculum = useCallback((id: string) => {
    setCurricula((prev) => prev.filter((c) => c.id !== id))
  }, [])

  // Users
  const [users, setUsers] = useState<User[]>(mockUsers)

  const addUser = useCallback((u: Omit<User, "id" | "createdAt">) => {
    setUsers((prev) => [
      ...prev,
      { ...u, id: generateId("user"), createdAt: new Date().toISOString().split("T")[0] },
    ])
  }, [])

  const updateUser = useCallback((id: string, updates: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)))
  }, [])

  const deleteUser = useCallback((id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }, [])

  // User Groups
  const [userGroups, setUserGroups] = useState<UserGroup[]>(mockUserGroups)

  const addUserGroup = useCallback((g: Omit<UserGroup, "id" | "createdAt">) => {
    setUserGroups((prev) => [
      ...prev,
      { ...g, id: generateId("group"), createdAt: new Date().toISOString().split("T")[0] },
    ])
  }, [])

  const updateUserGroup = useCallback((id: string, updates: Partial<UserGroup>) => {
    setUserGroups((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)))
  }, [])

  const deleteUserGroup = useCallback((id: string) => {
    setUserGroups((prev) => prev.filter((g) => g.id !== id))
  }, [])

  // Provisioning
  const [provisioningRules, setProvisioningRules] =
    useState<ProvisioningRule[]>(mockProvisioningRules)

  const addProvisioningRule = useCallback(
    (rule: Omit<ProvisioningRule, "id" | "assignedAt">) => {
      setProvisioningRules((prev) => [
        ...prev,
        {
          ...rule,
          id: generateId("prov"),
          assignedAt: new Date().toISOString().split("T")[0],
        },
      ])
    },
    [],
  )

  const updateProvisioningRule = useCallback((id: string, updates: Partial<ProvisioningRule>) => {
    setProvisioningRules((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)))
  }, [])

  const deleteProvisioningRule = useCallback((id: string) => {
    setProvisioningRules((prev) => prev.filter((r) => r.id !== id))
  }, [])

  const value: LMSStore = {
    isAuthenticated,
    login,
    logout,
    courses,
    addCourse,
    updateCourse,
    deleteCourse,
    addModule,
    updateModule,
    deleteModule,
    reorderModules,
    curricula,
    addCurriculum,
    updateCurriculum,
    deleteCurriculum,
    users,
    addUser,
    updateUser,
    deleteUser,
    userGroups,
    addUserGroup,
    updateUserGroup,
    deleteUserGroup,
    provisioningRules,
    addProvisioningRule,
    updateProvisioningRule,
    deleteProvisioningRule,
  }

  return <LMSContext.Provider value={value}>{children}</LMSContext.Provider>
}
