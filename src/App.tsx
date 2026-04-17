import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useLMS } from "@/hooks/use-lms-store"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { LoginPage } from "@/pages/LoginPage"
import { DashboardPage } from "@/pages/DashboardPage"
import { CoursesPage } from "@/pages/courses/CoursesPage"
import { CourseFormPage } from "@/pages/courses/CourseFormPage"
import { CoursePreviewPage } from "@/pages/courses/CoursePreviewPage"
import { CurriculumPage } from "@/pages/curriculum/CurriculumPage"
import { CurriculumFormPage } from "@/pages/curriculum/CurriculumFormPage"
import { UsersPage } from "@/pages/users/UsersPage"
import { UserGroupsPage } from "@/pages/users/UserGroupsPage"
import { UserProfilePage } from "@/pages/users/UserProfilePage"
import { ProvisioningPage } from "@/pages/users/ProvisioningPage"
import { UserPortalLayout } from "@/pages/userportal/UserPortalLayout"
import { UserPortalPage } from "@/pages/userportal/UserPortalPage"
import { UserProfilePortalPage } from "@/pages/userportal/UserProfilePortalPage"
import { UserCourseViewPage } from "@/pages/userportal/UserCourseViewPage"
import { UserCurriculumViewPage } from "@/pages/userportal/UserCurriculumViewPage"

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useLMS()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* User Portal — no auth required */}
        <Route element={<UserPortalLayout />}>
          <Route path="/userportal" element={<UserPortalPage />} />
          <Route path="/userportal/profile" element={<UserProfilePortalPage />} />
          <Route path="/userportal/course/:id" element={<UserCourseViewPage />} />
          <Route path="/userportal/curriculum/:id" element={<UserCurriculumViewPage />} />
        </Route>

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<DashboardPage />} />

          {/* Courses */}
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/new" element={<CourseFormPage />} />
          <Route path="/courses/:id/edit" element={<CourseFormPage />} />
          <Route path="/courses/:id/preview" element={<CoursePreviewPage />} />

          {/* Curriculum */}
          <Route path="/curriculum" element={<CurriculumPage />} />
          <Route path="/curriculum/new" element={<CurriculumFormPage />} />
          <Route path="/curriculum/:id/edit" element={<CurriculumFormPage />} />

          {/* Users */}
          <Route path="/users" element={<UsersPage />} />
          <Route path="/users/groups" element={<UserGroupsPage />} />
          <Route path="/users/:id" element={<UserProfilePage />} />
          <Route path="/users/provisioning" element={<ProvisioningPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
