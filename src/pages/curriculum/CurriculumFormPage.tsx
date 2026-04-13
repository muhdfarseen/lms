import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  IconArrowLeft,
  IconDeviceFloppy,
  IconGripVertical,
  IconPlus,
  IconX,
  IconBook,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
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
import { Separator } from "@/components/ui/separator"
import { useLMS } from "@/hooks/use-lms-store"
import type { CourseStatus, Visibility } from "@/data/types"

// ============================================
// Sortable Course Item for Curriculum
// ============================================
function SortableCourseItem({
  courseId,
  courseTitle,
  moduleCount,
  onRemove,
}: {
  courseId: string
  courseTitle: string
  moduleCount: number
  onRemove: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: courseId })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 rounded-lg border bg-card p-3 shadow-sm"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none text-muted-foreground hover:text-foreground"
      >
        <IconGripVertical className="size-5" />
      </button>
      <IconBook className="size-4 text-primary" />
      <div className="flex flex-1 flex-col">
        <span className="font-medium text-sm">{courseTitle}</span>
        <span className="text-xs text-muted-foreground">{moduleCount} modules</span>
      </div>
      <Button variant="ghost" size="icon" onClick={onRemove} className="size-8">
        <IconX className="size-4" />
      </Button>
    </div>
  )
}

export function CurriculumFormPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { curricula, courses, addCurriculum, updateCurriculum } = useLMS()

  const isEditing = !!id
  const existing = isEditing ? curricula.find((c) => c.id === id) : undefined

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [visibility, setVisibility] = useState<Visibility>("public")
  const [status, setStatus] = useState<CourseStatus>("draft")
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([])
  const [addCourseId, setAddCourseId] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (existing) {
      setTitle(existing.title)
      setDescription(existing.description)
      setVisibility(existing.visibility)
      setStatus(existing.status)
      setSelectedCourseIds(existing.courseIds)
    }
  }, [existing])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const availableCourses = courses.filter((c) => !selectedCourseIds.includes(c.id))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = selectedCourseIds.indexOf(active.id as string)
    const newIndex = selectedCourseIds.indexOf(over.id as string)
    setSelectedCourseIds(arrayMove(selectedCourseIds, oldIndex, newIndex))
  }

  const handleAddCourse = () => {
    if (addCourseId && !selectedCourseIds.includes(addCourseId)) {
      setSelectedCourseIds([...selectedCourseIds, addCourseId])
      setAddCourseId("")
    }
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!title.trim()) e.title = "Title is required"
    if (!description.trim()) e.description = "Description is required"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    const data = {
      title,
      description,
      visibility,
      status,
      courseIds: selectedCourseIds,
      restrictedUserIds: existing?.restrictedUserIds ?? [],
      restrictedGroupIds: existing?.restrictedGroupIds ?? [],
    }

    if (isEditing && id) {
      updateCurriculum(id, data)
    } else {
      addCurriculum(data)
    }
    navigate("/curriculum")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/curriculum")}>
          <IconArrowLeft />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isEditing ? "Edit Curriculum" : "Create Curriculum"}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? "Update curriculum details" : "Build a new learning path"}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Details */}
        <Card>
          <CardHeader>
            <CardTitle>Curriculum Details</CardTitle>
            <CardDescription>Basic information about this curriculum</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="cur-title">Title</Label>
              <Input
                id="cur-title"
                placeholder="e.g. Full-Stack Developer Path"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                aria-invalid={!!errors.title}
              />
              {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="cur-desc">Description</Label>
              <Textarea
                id="cur-desc"
                placeholder="Describe this learning path…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                aria-invalid={!!errors.description}
              />
              {errors.description && (
                <p className="text-xs text-destructive">{errors.description}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Status</Label>
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <Switch
                  checked={status === "published"}
                  onCheckedChange={(checked) => setStatus(checked ? "published" : "draft")}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {status === "published" ? "Published" : "Draft"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {status === "published"
                      ? "Visible to learners"
                      : "Hidden from learners until published"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Visibility</Label>
              <Select
                value={visibility}
                onValueChange={(v) => setVisibility(v as Visibility)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="restricted">Restricted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Course Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Courses in Curriculum</CardTitle>
            <CardDescription>
              Add and reorder courses. Drag to change the sequence.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {/* Add course */}
            <div className="flex gap-2">
              <Select value={addCourseId} onValueChange={setAddCourseId}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a course to add…" />
                </SelectTrigger>
                <SelectContent>
                  {availableCourses.length === 0 ? (
                    <SelectItem value="__none" disabled>
                      No more courses available
                    </SelectItem>
                  ) : (
                    availableCourses.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.title}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <Button onClick={handleAddCourse} disabled={!addCourseId}>
                <IconPlus data-icon="inline-start" />
                Add
              </Button>
            </div>

            <Separator />

            {selectedCourseIds.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <IconBook className="size-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No courses added yet.
                </p>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={selectedCourseIds}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex flex-col gap-2">
                    {selectedCourseIds.map((cid) => {
                      const course = courses.find((c) => c.id === cid)
                      return (
                        <SortableCourseItem
                          key={cid}
                          courseId={cid}
                          courseTitle={course?.title ?? "Unknown"}
                          moduleCount={course?.modules.length ?? 0}
                          onRemove={() =>
                            setSelectedCourseIds((prev) => prev.filter((id) => id !== cid))
                          }
                        />
                      )
                    })}
                  </div>
                </SortableContext>
              </DndContext>
            )}

            {selectedCourseIds.length > 0 && (
              <div className="text-xs text-muted-foreground">
                <Badge variant="secondary">{selectedCourseIds.length}</Badge> courses in this
                curriculum
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => navigate("/curriculum")}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          <IconDeviceFloppy data-icon="inline-start" />
          {isEditing ? "Save Changes" : "Create Curriculum"}
        </Button>
      </div>
    </div>
  )
}
