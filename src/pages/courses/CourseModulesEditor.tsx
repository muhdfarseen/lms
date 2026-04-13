import { useState, useEffect } from "react"
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
  IconGripVertical,
  IconPlus,
  IconPencil,
  IconTrash,
  IconVideo,
  IconHeadphones,
  IconFileTypePdf,
  IconFileText,
  IconClipboardCheck,
  IconQuestionMark,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RichTextEditor } from "@/components/RichTextEditor"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useLMS } from "@/hooks/use-lms-store"
import type { ContentType, CourseModule, MCQQuestion } from "@/data/types"
import { generateId } from "@/data/mock-data"

const contentTypeConfig: Record<
  ContentType,
  { label: string; icon: typeof IconVideo; color: string }
> = {
  video: { label: "Video", icon: IconVideo, color: "text-red-500" },
  audio: { label: "Audio", icon: IconHeadphones, color: "text-orange-500" },
  pdf: { label: "PDF", icon: IconFileTypePdf, color: "text-rose-500" },
  text: { label: "Text", icon: IconFileText, color: "text-blue-500" },
  assessment: { label: "Assessment", icon: IconClipboardCheck, color: "text-emerald-500" },
  quiz: { label: "Quiz", icon: IconQuestionMark, color: "text-violet-500" },
}

// ============================================
// MCQ Editor sub-component
// ============================================
function MCQEditor({
  questions,
  onChange,
}: {
  questions: MCQQuestion[]
  onChange: (q: MCQQuestion[]) => void
}) {
  const addQuestion = () => {
    onChange([
      ...questions,
      {
        id: generateId("q"),
        question: "",
        options: [
          { id: generateId("o"), text: "", isCorrect: true },
          { id: generateId("o"), text: "", isCorrect: false },
        ],
      },
    ])
  }

  const updateQuestion = (qIdx: number, text: string) => {
    const updated = [...questions]
    updated[qIdx] = { ...updated[qIdx], question: text }
    onChange(updated)
  }

  const addOption = (qIdx: number) => {
    const updated = [...questions]
    updated[qIdx] = {
      ...updated[qIdx],
      options: [...updated[qIdx].options, { id: generateId("o"), text: "", isCorrect: false }],
    }
    onChange(updated)
  }

  const updateOption = (qIdx: number, oIdx: number, text: string) => {
    const updated = [...questions]
    const opts = [...updated[qIdx].options]
    opts[oIdx] = { ...opts[oIdx], text }
    updated[qIdx] = { ...updated[qIdx], options: opts }
    onChange(updated)
  }

  const setCorrect = (qIdx: number, oIdx: number) => {
    const updated = [...questions]
    const opts = updated[qIdx].options.map((o, i) => ({
      ...o,
      isCorrect: i === oIdx,
    }))
    updated[qIdx] = { ...updated[qIdx], options: opts }
    onChange(updated)
  }

  const removeQuestion = (qIdx: number) => {
    onChange(questions.filter((_, i) => i !== qIdx))
  }

  const removeOption = (qIdx: number, oIdx: number) => {
    const updated = [...questions]
    updated[qIdx] = {
      ...updated[qIdx],
      options: updated[qIdx].options.filter((_, i) => i !== oIdx),
    }
    onChange(updated)
  }

  return (
    <div className="flex flex-col gap-4">
      {questions.map((q, qIdx) => (
        <Card key={q.id}>
          <CardContent className="flex flex-col gap-3 pt-4">
            <div className="flex items-start gap-2">
              <span className="mt-2 text-sm font-semibold text-muted-foreground">
                Q{qIdx + 1}.
              </span>
              <div className="flex flex-1 flex-col gap-1">
                <Input
                  placeholder="Enter question…"
                  value={q.question}
                  onChange={(e) => updateQuestion(qIdx, e.target.value)}
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeQuestion(qIdx)}
                className="size-8 shrink-0"
              >
                <IconTrash className="size-4 text-destructive" />
              </Button>
            </div>

            <div className="ml-6 flex flex-col gap-2">
              {q.options.map((opt, oIdx) => (
                <div key={opt.id} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    checked={opt.isCorrect}
                    onChange={() => setCorrect(qIdx, oIdx)}
                    className="accent-primary"
                  />
                  <Input
                    placeholder={`Option ${oIdx + 1}`}
                    value={opt.text}
                    onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                    className="flex-1"
                  />
                  {q.options.length > 2 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(qIdx, oIdx)}
                      className="size-7"
                    >
                      <IconTrash className="size-3 text-destructive" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => addOption(qIdx)}
                className="self-start"
              >
                <IconPlus data-icon="inline-start" />
                Add Option
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      <Button variant="outline" onClick={addQuestion}>
        <IconPlus data-icon="inline-start" />
        Add Question
      </Button>
    </div>
  )
}

// ============================================
// Module Form Dialog
// ============================================
function ModuleFormDialog({
  open,
  onClose,
  initial,
  onSave,
}: {
  open: boolean
  onClose: () => void
  initial?: CourseModule
  onSave: (data: Omit<CourseModule, "id" | "order">) => void
}) {
  const [heading, setHeading] = useState(initial?.heading ?? "")
  const [description, setDescription] = useState(initial?.description ?? "")
  const [contentType, setContentType] = useState<ContentType>(initial?.contentType ?? "video")
  const [videoUrl, setVideoUrl] = useState(initial?.videoUrl ?? "")
  const [audioUrl, setAudioUrl] = useState(initial?.audioUrl ?? "")
  const [pdfUrl, setPdfUrl] = useState(initial?.pdfUrl ?? "")
  const [textContent, setTextContent] = useState(initial?.textContent ?? "")
  const [questions, setQuestions] = useState<MCQQuestion[]>(initial?.questions ?? [])

  const handleSave = () => {
    if (!heading.trim()) return
    onSave({
      heading,
      description,
      contentType,
      videoUrl: contentType === "video" ? videoUrl : undefined,
      audioUrl: contentType === "audio" ? audioUrl : undefined,
      pdfUrl: contentType === "pdf" ? pdfUrl : undefined,
      textContent: contentType === "text" ? textContent : undefined,
      questions: contentType === "assessment" || contentType === "quiz" ? questions : undefined,
    })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Module" : "Add Module"}</DialogTitle>
          <DialogDescription>
            Configure the module heading, content type, and content.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="mod-heading">Heading</Label>
            <Input
              id="mod-heading"
              placeholder="Module heading"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="mod-desc">Description</Label>
            <Textarea
              id="mod-desc"
              placeholder="Brief description of this module"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Content Type</Label>
            <Select
              value={contentType}
              onValueChange={(v) => setContentType(v as ContentType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(contentTypeConfig).map(([key, cfg]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <cfg.icon className={`size-4 ${cfg.color}`} />
                      {cfg.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Content Type specific fields */}
          {contentType === "video" && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="video-url">YouTube URL</Label>
              <Input
                id="video-url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
              {videoUrl && (
                <div className="mt-2 aspect-video overflow-hidden rounded-lg border">
                  <iframe
                    src={`https://www.youtube.com/embed/${extractYouTubeId(videoUrl)}`}
                    className="size-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Video preview"
                  />
                </div>
              )}
            </div>
          )}

          {contentType === "audio" && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="audio-url">Audio URL</Label>
              <Input
                id="audio-url"
                placeholder="https://example.com/audio.mp3 or upload file"
                value={audioUrl}
                onChange={(e) => setAudioUrl(e.target.value)}
              />
              {audioUrl && (
                <audio controls src={audioUrl} className="mt-2 w-full">
                  Your browser does not support the audio element.
                </audio>
              )}
            </div>
          )}

          {contentType === "pdf" && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="pdf-url">PDF URL or upload</Label>
              <Input
                id="pdf-url"
                placeholder="https://example.com/document.pdf"
                value={pdfUrl}
                onChange={(e) => setPdfUrl(e.target.value)}
              />
              {pdfUrl && (
                <div className="mt-2 flex h-48 items-center justify-center rounded-lg border bg-muted">
                  <div className="text-center">
                    <IconFileTypePdf className="mx-auto size-10 text-rose-500" />
                    <p className="mt-2 text-sm text-muted-foreground">PDF Preview</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {contentType === "text" && (
            <div className="flex flex-col gap-2">
              <Label>Rich Text Content</Label>
              <RichTextEditor
                value={textContent}
                onChange={setTextContent}
                placeholder="Enter your course content here..."
              />
              {textContent && (
                <div className="mt-4 rounded-lg border p-4">
                  <p className="mb-2 text-xs font-semibold text-muted-foreground">Preview:</p>
                  <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: textContent }} />
                </div>
              )}
            </div>
          )}

          {(contentType === "assessment" || contentType === "quiz") && (
            <div className="flex flex-col gap-2">
              <Label>
                {contentType === "assessment" ? "Assessment Questions" : "Quiz Questions"}
              </Label>
              <MCQEditor questions={questions} onChange={setQuestions} />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!heading.trim()}>
            {initial ? "Update Module" : "Add Module"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function extractYouTubeId(url: string): string {
  const match = url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/,
  )
  return match?.[1] ?? ""
}

// ============================================
// Main Modules Editor
// ============================================
export function CourseModulesEditor({ courseId }: { courseId: string }) {
  const { courses, addModule, updateModule, deleteModule, reorderModules } = useLMS()
  const course = courses.find((c) => c.id === courseId)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingModule, setEditingModule] = useState<CourseModule | undefined>()
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  if (!course) return null

  const sortedModules = [...course.modules].sort((a, b) => a.order - b.order)
  
  useEffect(() => {
    if (sortedModules.length > 0 && !selectedModuleId) {
      setSelectedModuleId(sortedModules[0].id)
    }
  }, [sortedModules, selectedModuleId])
  
  const selectedModule = sortedModules.find((m) => m.id === selectedModuleId)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = sortedModules.findIndex((m) => m.id === active.id)
    const newIndex = sortedModules.findIndex((m) => m.id === over.id)
    const reordered = arrayMove(sortedModules, oldIndex, newIndex)
    reorderModules(courseId, reordered)
  }

  const handleSaveModule = (data: Omit<CourseModule, "id" | "order">) => {
    if (editingModule) {
      updateModule(courseId, editingModule.id, data)
    } else {
      addModule(courseId, data)
    }
    setEditingModule(undefined)
    setDialogOpen(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Course Modules</h3>
          <p className="text-sm text-muted-foreground">
            {sortedModules.length} modules · Drag to reorder
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingModule(undefined)
            setDialogOpen(true)
          }}
        >
          <IconPlus data-icon="inline-start" />
          Add Module
        </Button>
      </div>

      {sortedModules.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <div className="rounded-full bg-muted p-4">
              <IconFileText className="size-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              No modules yet. Add your first module to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr]">
          {/* Left Side: Module List */}
          <Card className="flex flex-col overflow-hidden h-fit py-0">
            <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                
                  items={sortedModules.map((m) => m.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex flex-col ">
                    {sortedModules.map((mod, idx) => {
                      const cfg = contentTypeConfig[mod.contentType]
                      const isSelected = selectedModuleId === mod.id
                      return (
                        <div key={mod.id}>
                          <SortableModuleListItem
                            mod={mod}
                            idx={idx}
                            cfg={cfg}
                            isSelected={isSelected}
                            onSelect={() => setSelectedModuleId(mod.id)}
                          />
                        </div>
                      )
                    })}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          </Card>

          {/* Right Side: Module Details/Editor */}
          <Card className="flex flex-col overflow-hidden">
            {selectedModule ? (
              <>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`rounded-md p-1.5 ${contentTypeConfig[selectedModule.contentType].color} bg-muted`}
                      >
                        {contentTypeConfig[selectedModule.contentType].icon &&
                          (() => {
                            const Icon = contentTypeConfig[selectedModule.contentType].icon
                            return <Icon className="size-4" />
                          })()}
                      </div>
                      <CardTitle className="text-base">
                        {selectedModule.heading}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingModule(selectedModule)
                          setDialogOpen(true)
                        }}
                        className="size-8"
                      >
                        <IconPencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          deleteModule(courseId, selectedModule.id)
                          setSelectedModuleId(null)
                        }}
                        className="size-8"
                      >
                        <IconTrash className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription className="text-xs mt-1">
                    {selectedModule.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 text-sm flex-1 overflow-y-auto">
                  {selectedModule.contentType === "video" && selectedModule.videoUrl && (
                    <div>
                      <div className="aspect-video overflow-hidden rounded-lg border">
                        <iframe
                          src={`https://www.youtube.com/embed/${extractYouTubeId(selectedModule.videoUrl)}`}
                          className="size-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={selectedModule.heading}
                        />
                      </div>
                    </div>
                  )}

                  {selectedModule.contentType === "audio" && selectedModule.audioUrl && (
                    <div>
                      <audio controls src={selectedModule.audioUrl} className="w-full">
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}

                  {selectedModule.contentType === "pdf" && selectedModule.pdfUrl && (
                    <div>
                      <p className="text-xs text-muted-foreground truncate">{selectedModule.pdfUrl}</p>
                    </div>
                  )}

                  {selectedModule.contentType === "text" && selectedModule.textContent && (
                    <div>
                      <div
                        className="prose prose-sm max-w-none rounded-lg border p-3 bg-muted/30 max-h-64 overflow-y-auto"
                        dangerouslySetInnerHTML={{ __html: selectedModule.textContent }}
                      />
                    </div>
                  )}

                  {(selectedModule.contentType === "assessment" ||
                    selectedModule.contentType === "quiz") &&
                    selectedModule.questions && (
                      <div>
                        <span className="text-muted-foreground">
                          {selectedModule.questions.length} {selectedModule.contentType === "assessment" ? "Assessment" : "Quiz"} Questions
                        </span>
                      </div>
                    )}
                </CardContent>
              </>
            ) : (
              <>
                <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                  <p className="text-sm text-muted-foreground">
                    Select a module to view details
                  </p>
                </CardContent>
              </>
            )}
          </Card>
        </div>
      )}

      <ModuleFormDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false)
          setEditingModule(undefined)
        }}
        initial={editingModule}
        onSave={handleSaveModule}
      />
    </div>
  )
}

// Sortable List Item for Modules Sidebar
function SortableModuleListItem({
  mod,
  idx,
  cfg,
  isSelected,
  onSelect,
}: {
  mod: CourseModule
  idx: number
  cfg: (typeof contentTypeConfig)[keyof typeof contentTypeConfig]
  isSelected: boolean
  onSelect: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: mod.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <button
        onClick={onSelect}
        className={`flex w-full items-start gap-2 border-b px-4 py-3 text-left transition-all hover:bg-muted/50 ${
          isSelected ? "bg-primary/10 text-primary font-medium" : ""
        }`}
      >
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none text-muted-foreground hover:text-foreground pt-0.5"
        >
          <IconGripVertical className="size-3.5" />
        </button>
        <div className={`rounded-md p-1 ${cfg.color} bg-muted shrink-0`}>
          <cfg.icon className="size-3" />
        </div>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-xs leading-tight text-foreground truncate">
            {idx + 1}. {mod.heading}
          </span>
          <span className="text-[10px] text-muted-foreground capitalize">{cfg.label}</span>
        </div>
      </button>
    </div>
  )
}
