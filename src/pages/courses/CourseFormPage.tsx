import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useLMS } from "@/hooks/use-lms-store"
import type { CourseStatus, Visibility } from "@/data/types"
import { CourseModulesEditor } from "./CourseModulesEditor"

export function CourseFormPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { courses, addCourse, updateCourse } = useLMS()

  const isEditing = !!id
  const existingCourse = isEditing ? courses.find((c) => c.id === id) : undefined

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [visibility, setVisibility] = useState<Visibility>("public")
  const [status, setStatus] = useState<CourseStatus>("draft")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [courseId, setCourseId] = useState<string | undefined>(id)
  const [currentTab, setCurrentTab] = useState("details")

  useEffect(() => {
    if (existingCourse) {
      setTitle(existingCourse.title)
      setDescription(existingCourse.description)
      setVisibility(existingCourse.visibility)
      setStatus(existingCourse.status)
      setCourseId(existingCourse.id)
    }
  }, [existingCourse])

  const validate = () => {
    const e: Record<string, string> = {}
    if (!title.trim()) e.title = "Title is required"
    if (!description.trim()) e.description = "Description is required"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNextStep = () => {
    if (!validate()) return

    if (!isEditing) {
      const newId = addCourse({
        title,
        description,
        visibility,
        status,
        modules: [],
        restrictedUserIds: [],
        restrictedGroupIds: [],
      })
      setCourseId(newId)
      navigate(`/courses/${newId}/edit`, { replace: true })
    } else {
      updateCourse(id!, { title, description, visibility, status })
    }
    setCurrentTab("modules")
  }

  const handleSave = () => {
    if (validate()) {
      updateCourse(courseId!, { title, description, visibility, status })
      navigate("/courses")
    }
  }

  const handleTabChange = (tab: string) => {
    if (tab === "modules" && !courseId) return
    if (tab === "publish" && !courseId) return
    setCurrentTab(tab)
  }

  const canGoToModules = !!courseId
  const canGoToPublish = !!courseId

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/courses")}>
          <IconArrowLeft />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isEditing ? "Edit Course" : "Create Course"}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? "Update course details and modules" : "Set up a new course"}
          </p>
        </div>
      </div>

      {/* Tabs with Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Tabs value={currentTab} onValueChange={handleTabChange} className="flex-1">
          <TabsList className="grid w-fit grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="modules" disabled={!canGoToModules}>
              Modules
            </TabsTrigger>
            <TabsTrigger value="publish" disabled={!canGoToPublish}>
              Publish
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-2">
          {currentTab !== "details" && (
            <Button variant="outline" onClick={() => {
              if (currentTab === "modules") setCurrentTab("details")
              else if (currentTab === "publish") setCurrentTab("modules")
            }}>
              Back
            </Button>
          )}
          {currentTab === "details" && (
            <>
              <Button variant="outline" onClick={() => navigate("/courses")}>
                Cancel
              </Button>
              <Button onClick={handleNextStep}>
                Next
              </Button>
            </>
          )}
          {currentTab === "modules" && (
            <Button onClick={() => setCurrentTab("publish")}>
              Next
            </Button>
          )}
          {currentTab === "publish" && (
            <Button onClick={handleSave}>
              <IconDeviceFloppy data-icon="inline-start" />
              {isEditing ? "Save Changes" : "Create Course"}
            </Button>
          )}
        </div>
      </div>

      {/* Tab Content */}
      <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
        {/* Details Tab */}
        <TabsContent value="details" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
              <CardDescription>
                Fill in the basic details of your course
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="course-title">Title</Label>
                <Input
                  id="course-title"
                  placeholder="e.g. Web Development Fundamentals"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  aria-invalid={!!errors.title}
                />
                {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="course-desc">Description</Label>
                <Textarea
                  id="course-desc"
                  placeholder="Describe what this course covers…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  aria-invalid={!!errors.description}
                />
                {errors.description && (
                  <p className="text-xs text-destructive">{errors.description}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Modules Tab */}
        {courseId && (
          <TabsContent value="modules" className="mt-0">
            <CourseModulesEditor courseId={courseId} />
          </TabsContent>
        )}

        {/* Publish Tab */}
        {courseId && (
          <TabsContent value="publish" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Publish Settings</CardTitle>
                <CardDescription>
                  Configure your course visibility and publishing status
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                {/* Publication Status */}
                <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
                  <Switch
                    checked={status === "published"}
                    onCheckedChange={(checked) =>
                      setStatus(checked ? "published" : "draft")
                    }
                  />
                  <div className="flex flex-col flex-1">
                    <span className="text-sm font-medium">
                      {status === "published" ? "Published" : "Draft"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {status === "published"
                        ? "Course is live and accessible to learners"
                        : "Course is hidden from learners until published"}
                    </span>
                  </div>
                </div>

                <Separator />

                {/* Visibility Settings */}
                <div className="flex flex-col gap-3">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Who can access this course?</h3>
                    <Select
                      value={visibility}
                      onValueChange={(v) => setVisibility(v as Visibility)}
                    >
                      <SelectTrigger className="w-fit">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public - Everyone</SelectItem>
                        <SelectItem value="restricted">Restricted - Selected users/groups</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {visibility === "public"
                      ? "This course is visible to all users in the system"
                      : "This course is only visible to assigned users or groups"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
