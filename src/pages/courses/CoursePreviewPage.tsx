import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  IconArrowLeft,
  IconVideo,
  IconHeadphones,
  IconFileTypePdf,
  IconFileText,
  IconClipboardCheck,
  IconQuestionMark,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useLMS } from "@/hooks/use-lms-store"
import type { ContentType, CourseModule } from "@/data/types"

const contentTypeIcons: Record<ContentType, typeof IconVideo> = {
  video: IconVideo,
  audio: IconHeadphones,
  pdf: IconFileTypePdf,
  text: IconFileText,
  assessment: IconClipboardCheck,
  quiz: IconQuestionMark,
}

function extractYouTubeId(url: string): string {
  const match = url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/,
  )
  return match?.[1] ?? ""
}

function ModulePreview({ mod }: { mod: CourseModule }) {
  const Icon = contentTypeIcons[mod.contentType]

  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="border-b py-2 px-4">
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-primary/10 p-1.5">
            <Icon className="size-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base truncate">{mod.heading}</CardTitle>
            <CardDescription className="text-xs line-clamp-1">{mod.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        {mod.contentType === "video" && mod.videoUrl && (
          <div className="aspect-video overflow-hidden rounded-lg border">
            <iframe
              src={`https://www.youtube.com/embed/${extractYouTubeId(mod.videoUrl)}`}
              className="size-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={mod.heading}
            />
          </div>
        )}

        {mod.contentType === "audio" && mod.audioUrl && (
          <audio controls src={mod.audioUrl} className="w-full">
            Your browser does not support the audio element.
          </audio>
        )}

        {mod.contentType === "pdf" && mod.pdfUrl && (
          <div className="flex h-64 items-center justify-center rounded-lg border bg-muted/50">
            <div className="text-center">
              <IconFileTypePdf className="mx-auto size-12 text-rose-500" />
              <p className="mt-2 text-sm font-medium">PDF Document</p>
              <p className="text-xs text-muted-foreground">{mod.pdfUrl}</p>
            </div>
          </div>
        )}

        {mod.contentType === "text" && mod.textContent && (
          <div
            className="prose prose-sm max-w-none rounded-lg border p-4"
            dangerouslySetInnerHTML={{ __html: mod.textContent }}
          />
        )}

        {(mod.contentType === "assessment" || mod.contentType === "quiz") &&
          mod.questions && (
            <div className="flex flex-col gap-3">
              {mod.questions.map((q, idx) => (
                <div key={q.id} className="flex flex-col gap-2 rounded-lg border p-3 bg-muted/30">
                  <p className="text-sm font-medium">
                    {idx + 1}. {q.question}
                  </p>
                  <div className="ml-3 flex flex-col gap-1.5">
                    {q.options.map((opt) => (
                      <div
                        key={opt.id}
                        className={`flex items-center gap-2 rounded-md p-2 text-xs ${
                          opt.isCorrect
                            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                            : ""
                        }`}
                      >
                        <div
                          className={`size-2.5 rounded-full border-2 ${
                            opt.isCorrect
                              ? "border-emerald-500 bg-emerald-500"
                              : "border-muted-foreground"
                          }`}
                        />
                        {opt.text}
                        {opt.isCorrect && (
                          <Badge variant="secondary" className="ml-auto text-[10px] px-1.5 py-0">
                            Correct
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
      </CardContent>
    </Card>
  )
}

export function CoursePreviewPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { courses, updateCourse, deleteCourse } = useLMS()
  const course = courses.find((c) => c.id === id)
  const sortedModules = course ? [...course.modules].sort((a, b) => a.order - b.order) : []

  const [activeModuleId, setActiveModuleId] = useState<string | null>(null)

  useEffect(() => {
    if (sortedModules.length > 0 && !activeModuleId) {
      setActiveModuleId(sortedModules[0].id)
    }
  }, [sortedModules, activeModuleId])

  if (!course) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <p className="text-muted-foreground">Course not found</p>
        <Button variant="outline" onClick={() => navigate("/courses")}>
          Back to Courses
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Course Header Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate("/courses")}>
                <IconArrowLeft className="size-5" />
              </Button>
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold">{course.title}</h1>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={course.status === "published" ? "default" : "secondary"}>
                    {course.status}
                  </Badge>
                  <Badge variant="outline">{course.visibility}</Badge>
                  <span className="text-xs text-muted-foreground">{course.modules.length} modules</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-1">
                <Switch
                  checked={course.status === "published"}
                  onCheckedChange={(checked) =>
                    updateCourse(course.id, { status: checked ? "published" : "draft" })
                  }
                />
                <span className="text-sm font-medium">
                  {course.status === "published" ? "Published" : "Draft"}
                </span>
              </div>
              <Button size="sm" variant="outline" onClick={() => navigate(`/courses/${course.id}/edit`)}>
                <IconPencil className="size-4" data-icon="inline-start" />
                Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="outline" className="text-destructive hover:text-destructive">
                    <IconTrash className="size-4" data-icon="inline-start" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Course</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{course.title}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        deleteCourse(course.id)
                        navigate("/courses")
                      }}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">{course.description}</p>
        </CardContent>
      </Card>

      {/* Module Navigation & Preview */}
      {sortedModules.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <p className="text-muted-foreground">No modules in this course yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr]">
          {/* Left Side: Module List */}
          <Card className="flex flex-col overflow-hidden h-fit py-0">
            <div className="overflow-y-auto max-h-[calc(100vh-280px)]">
              <div className="flex flex-col">
                {sortedModules.map((mod, idx) => {
                  const Icon = contentTypeIcons[mod.contentType]
                  const isActive = activeModuleId === mod.id
                  return (
                    <button
                      key={mod.id}
                      onClick={() => setActiveModuleId(mod.id)}
                      className={`flex w-full items-start gap-2 border-b px-4 py-3 text-left transition-all hover:bg-muted/50 ${
                        isActive 
                          ? "bg-primary/10 text-primary font-medium" 
                          : "text-muted-foreground"
                      }`}
                    >
                      <Icon className="mt-0.5 size-4 shrink-0" />
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-xs leading-tight text-foreground truncate">
                          {idx + 1}. {mod.heading}
                        </span>
                        <span className="text-[10px] text-muted-foreground capitalize">{mod.contentType}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </Card>

          {/* Right Side: Active Module Preview */}
          <div className="flex flex-col">
            {activeModuleId && (
              <ModulePreview
                mod={sortedModules.find((m) => m.id === activeModuleId)!}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
