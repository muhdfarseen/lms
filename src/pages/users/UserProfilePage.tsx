import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  IconArrowLeft,
  IconPencil,
  IconTrash,
  IconMail,
  IconPhone,
  IconMapPin,
  IconCalendar,
  IconClock,
  IconPlus,
  IconBooks,
  IconBook,
  IconChartBar,
  IconCheck,
  IconX,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useLMS } from "@/hooks/use-lms-store"
import type { ProvisioningRule, User } from "@/data/types"

// ============================================
// Tab type
// ============================================
type Tab = "analytics" | "provisioned"

// ============================================
// Edit Profile Dialog
// ============================================
function EditProfileDialog({
  open,
  onClose,
  user,
  onSave,
}: {
  open: boolean
  onClose: () => void
  user: User
  onSave: (data: Partial<User>) => void
}) {
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [phone, setPhone] = useState(user.phone)
  const [location, setLocation] = useState(user.location)
  const [dob, setDob] = useState(user.dob)

  const handleSave = () => {
    onSave({ name, email, phone, location, dob })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update student profile details</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 flex flex-col gap-1.5">
            <Label htmlFor="ep-name">Full Name</Label>
            <Input id="ep-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ep-email">Email</Label>
            <Input id="ep-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ep-phone">Phone</Label>
            <Input id="ep-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ep-location">Location</Label>
            <Input id="ep-location" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ep-dob">Date of Birth</Label>
            <Input id="ep-dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ============================================
// Edit Provision Dialog
// ============================================
function EditProvisionDialog({
  open,
  onClose,
  rule,
  onSave,
}: {
  open: boolean
  onClose: () => void
  rule: ProvisioningRule
  onSave: (updates: Partial<ProvisioningRule>) => void
}) {
  const [startDate, setStartDate] = useState(rule.startDate ?? "")
  const [endDate, setEndDate] = useState(rule.endDate ?? "")

  const handleSave = () => {
    onSave({ startDate, endDate })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit Provision</DialogTitle>
          <DialogDescription>Update access start and end dates</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="prov-start">Start Date</Label>
            <Input
              id="prov-start"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="prov-end">End Date</Label>
            <Input
              id="prov-end"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ============================================
// Add Provision Dialog
// ============================================
function AddProvisionDialog({
  open,
  onClose,
  userId,
  existingRules,
  onSave,
}: {
  open: boolean
  onClose: () => void
  userId: string
  existingRules: ProvisioningRule[]
  onSave: (rule: Omit<ProvisioningRule, "id" | "assignedAt">) => void
}) {
  const { courses, curricula } = useLMS()
  const [resourceType, setResourceType] = useState<"course" | "curriculum">("course")
  const [resourceId, setResourceId] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const existingResourceIds = existingRules.map((r) => r.resourceId)
  const availableCourses = courses.filter((c) => !existingResourceIds.includes(c.id))
  const availableCurricula = curricula.filter((c) => !existingResourceIds.includes(c.id))

  const handleSave = () => {
    if (!resourceId) return
    onSave({
      targetType: "user",
      targetId: userId,
      resourceType,
      resourceId,
      startDate,
      endDate,
    })
    setResourceId(""); setStartDate(""); setEndDate("")
    onClose()
  }

  const handleClose = () => {
    setResourceId(""); setStartDate(""); setEndDate("")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add Provision</DialogTitle>
          <DialogDescription>Assign a course or curriculum access to this student</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Resource Type</Label>
            <Select value={resourceType} onValueChange={(v) => { setResourceType(v as "course" | "curriculum"); setResourceId("") }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="course">Course</SelectItem>
                <SelectItem value="curriculum">Curriculum</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Select {resourceType === "course" ? "Course" : "Curriculum"}</Label>
            <Select value={resourceId} onValueChange={setResourceId}>
              <SelectTrigger>
                <SelectValue placeholder={`Choose a ${resourceType}…`} />
              </SelectTrigger>
              <SelectContent>
                {(resourceType === "course" ? availableCourses : availableCurricula).map((item) => (
                  <SelectItem key={item.id} value={item.id}>{item.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="np-start">Start Date</Label>
              <Input id="np-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="np-end">End Date</Label>
              <Input id="np-end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!resourceId}>Assign</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


// ============================================
// Analytics Tab
// ============================================
function AnalyticsTab({ user }: { user: User }) {
  const { courses, curricula } = useLMS()

  const enrolledCourses = courses.filter((c) => user.enrolledCourseIds.includes(c.id))
  const enrolledCurricula = curricula.filter((c) => user.enrolledCurriculumIds.includes(c.id))

  const completedCourses = enrolledCourses.filter(
    (c) => (user.courseProgress[c.id] ?? 0) === 100,
  )

  const avgProgress =
    enrolledCourses.length > 0
      ? Math.round(
          enrolledCourses.reduce((sum, c) => sum + (user.courseProgress[c.id] ?? 0), 0) /
            enrolledCourses.length,
        )
      : 0

  return (
    <div className="flex flex-col gap-6">
      {/* Summary Cards */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex size-9 items-center justify-center rounded-full bg-blue-500/10">
              <IconBook className="size-4 text-blue-500" />
            </div>
            <span className="text-sm text-muted-foreground">Enrolled Courses</span>
          </div>
          <p className="text-2xl font-bold">{enrolledCourses.length}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex size-9 items-center justify-center rounded-full bg-green-500/10">
              <IconCheck className="size-4 text-green-500" />
            </div>
            <span className="text-sm text-muted-foreground">Completed</span>
          </div>
          <p className="text-2xl font-bold">{completedCourses.length}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex size-9 items-center justify-center rounded-full bg-amber-500/10">
              <IconChartBar className="size-4 text-amber-500" />
            </div>
            <span className="text-sm text-muted-foreground">Avg. Progress</span>
          </div>
          <p className="text-2xl font-bold">{avgProgress}%</p>
        </div>
      </div>

      {/* Course Progress */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Course Progress
        </h2>
        {enrolledCourses.length === 0 ? (
          <div className="rounded-xl border bg-muted/30 py-10 text-center text-sm text-muted-foreground">
            No courses enrolled yet
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {enrolledCourses.map((course) => {
              const progress = user.courseProgress[course.id] ?? 0
              return (
                <div key={course.id} className="rounded-xl border bg-card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <IconBook className="size-4 shrink-0 text-muted-foreground" />
                      <span className="font-medium truncate">{course.title}</span>
                    </div>
                    <Badge
                      variant={progress === 100 ? "default" : "secondary"}
                      className={progress === 100 ? "bg-green-600 hover:bg-green-600" : ""}
                    >
                      {progress === 100 ? "Completed" : `${progress}%`}
                    </Badge>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="mt-2 text-xs text-muted-foreground">
                    {progress}% complete · {course.modules.length} modules
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Curriculum Progress */}
      {enrolledCurricula.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Curriculum Progress
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {enrolledCurricula.map((cur) => {
              const progress = user.curriculumProgress[cur.id] ?? 0
              return (
                <div key={cur.id} className="rounded-xl border bg-card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <IconBooks className="size-4 shrink-0 text-muted-foreground" />
                      <span className="font-medium truncate">{cur.title}</span>
                    </div>
                    <Badge
                      variant={progress === 100 ? "default" : "secondary"}
                      className={progress === 100 ? "bg-green-600 hover:bg-green-600" : ""}
                    >
                      {progress === 100 ? "Completed" : `${progress}%`}
                    </Badge>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="mt-2 text-xs text-muted-foreground">
                    {progress}% complete · {cur.courseIds.length} courses
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// Provisioned Tab
// ============================================
function ProvisionedTab({ user }: { user: User }) {
  const { courses, curricula, provisioningRules, addProvisioningRule, updateProvisioningRule, deleteProvisioningRule } =
    useLMS()
  const [addOpen, setAddOpen] = useState(false)
  const [editingRule, setEditingRule] = useState<ProvisioningRule | null>(null)
  const [deletingRuleId, setDeletingRuleId] = useState<string | null>(null)

  const userRules = provisioningRules.filter(
    (r) => r.targetType === "user" && r.targetId === user.id,
  )

  const getResourceTitle = (rule: ProvisioningRule) => {
    if (rule.resourceType === "course") {
      return courses.find((c) => c.id === rule.resourceId)?.title ?? rule.resourceId
    }
    return curricula.find((c) => c.id === rule.resourceId)?.title ?? rule.resourceId
  }

  const formatDate = (d?: string) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
      : "—"

  const isActive = (rule: ProvisioningRule) => {
    const today = new Date()
    const start = rule.startDate ? new Date(rule.startDate) : null
    const end = rule.endDate ? new Date(rule.endDate) : null
    if (start && today < start) return false
    if (end && today > end) return false
    return true
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {userRules.length} provision{userRules.length !== 1 ? "s" : ""} assigned
          </p>
        </div>
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <IconPlus data-icon="inline-start" />
          Add Provision
        </Button>
      </div>

      {userRules.length === 0 ? (
        <div className="rounded-xl border bg-muted/30 py-12 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <IconBooks className="size-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No provisions assigned yet</p>
            <Button variant="outline" size="sm" onClick={() => setAddOpen(true)}>
              <IconPlus data-icon="inline-start" />
              Add Provision
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {userRules.map((rule) => {
            const active = isActive(rule)
            return (
              <div
                key={rule.id}
                className="rounded-xl border bg-card p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`flex size-9 shrink-0 items-center justify-center rounded-full ${
                        rule.resourceType === "course"
                          ? "bg-blue-500/10"
                          : "bg-purple-500/10"
                      }`}
                    >
                      {rule.resourceType === "course" ? (
                        <IconBook
                          className={`size-4 ${rule.resourceType === "course" ? "text-blue-500" : "text-purple-500"}`}
                        />
                      ) : (
                        <IconBooks className="size-4 text-purple-500" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium truncate">{getResourceTitle(rule)}</p>
                        <Badge
                          variant="outline"
                          className="text-xs capitalize shrink-0"
                        >
                          {rule.resourceType}
                        </Badge>
                        <Badge
                          variant={active ? "default" : "secondary"}
                          className={`text-xs shrink-0 ${active ? "bg-green-600 hover:bg-green-600" : ""}`}
                        >
                          {active ? "Active" : "Expired"}
                        </Badge>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <IconCalendar className="size-3" />
                          <span>Provisioned: {formatDate(rule.assignedAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <IconClock className="size-3" />
                          <span>
                            {formatDate(rule.startDate)} → {formatDate(rule.endDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => setEditingRule(rule)}
                    >
                      <IconPencil className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-destructive hover:text-destructive"
                      onClick={() => setDeletingRuleId(rule.id)}
                    >
                      <IconX className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add Provision Dialog */}
      <AddProvisionDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        userId={user.id}
        existingRules={userRules}
        onSave={addProvisioningRule}
      />

      {/* Edit Provision Dialog */}
      {editingRule && (
        <EditProvisionDialog
          open={!!editingRule}
          onClose={() => setEditingRule(null)}
          rule={editingRule}
          onSave={(updates) => {
            updateProvisioningRule(editingRule.id, updates)
            setEditingRule(null)
          }}
        />
      )}

      {/* Delete Confirm */}
      <AlertDialog open={!!deletingRuleId} onOpenChange={(o) => !o && setDeletingRuleId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Provision</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this provision? The student will lose access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deletingRuleId) deleteProvisioningRule(deletingRuleId)
                setDeletingRuleId(null)
              }}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// ============================================
// User Profile Page
// ============================================
export function UserProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { users, updateUser, deleteUser } = useLMS()
  const [activeTab, setActiveTab] = useState<Tab>("analytics")
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const user = users.find((u) => u.id === id)

  if (!user) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <p className="text-lg font-semibold">Student not found</p>
        <Button variant="outline" onClick={() => navigate("/users")}>
          <IconArrowLeft data-icon="inline-start" /> Back to Students
        </Button>
      </div>
    )
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const { userGroups } = useLMS()
  const groups = userGroups.filter((g) => user.groupIds.includes(g.id))

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "analytics", label: "Analytics", icon: IconChartBar },
    { id: "provisioned", label: "Provisioned", icon: IconBooks },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Back */}
      <Button
        variant="ghost"
        className="self-start -ml-2"
        onClick={() => navigate("/users")}
      >
        <IconArrowLeft data-icon="inline-start" />
        Back to Students
      </Button>

      {/* Profile Hero */}
      <div className="rounded-2xl border bg-card p-6">
        {/* Top row: avatar + name + actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
              {initials}
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight">{user.name}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Joined on:{" "}
                {new Date(user.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric", month: "short", year: "numeric",
                })}
              </p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
              <IconPencil data-icon="inline-start" />
              Edit Profile
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:bg-destructive/10 border-destructive/30"
              onClick={() => setDeleteOpen(true)}
            >
              <IconTrash data-icon="inline-start" />
              Delete
            </Button>
          </div>
        </div>

        {/* Contact details grid */}
        <div className="grid grid-cols-1 gap-y-3 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 mt-5">
          <div className="flex items-center gap-2.5 text-sm">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full ">
              <IconMail className="size-3.5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="font-medium truncate">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-sm">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full ">
              <IconPhone className="size-3.5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="font-medium">{user.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-sm">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full ">
              <IconMapPin className="size-3.5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="font-medium">{user.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-sm">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full">
              <IconCalendar className="size-3.5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Date of Birth</p>
              <p className="font-medium">
                {new Date(user.dob).toLocaleDateString("en-IN", {
                  day: "numeric", month: "short", year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Enrolled courses count */}
          <div className="flex items-center gap-2.5 text-sm">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full">
              <IconBook className="size-3.5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Courses</p>
              <p className="font-medium">{user.enrolledCourseIds.length} enrolled</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-sm">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full">
              <IconBooks className="size-3.5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Curricula</p>
              <p className="font-medium">{user.enrolledCurriculumIds.length} enrolled</p>
            </div>
          </div>
        </div>

        {/* Groups */}
        {groups.length > 0 && (
          <>
            <Separator className="my-4" />
            <div>
              <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Groups</p>
              <div className="flex flex-wrap gap-2">
                {groups.map((g) => (
                  <Badge key={g.id} variant="secondary" className="text-sm px-3 py-1">
                    {g.name}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border bg-muted/40 p-1 w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="size-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "analytics" && <AnalyticsTab user={user} />}
        {activeTab === "provisioned" && <ProvisionedTab user={user} />}
      </div>

      {/* Edit Dialog */}
      <EditProfileDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        user={user}
        onSave={(data) => updateUser(user.id, data)}
      />

      {/* Delete Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Student</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{user.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                deleteUser(user.id)
                navigate("/users")
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
