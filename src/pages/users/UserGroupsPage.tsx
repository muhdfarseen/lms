import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  IconArrowLeft,
  IconPlus,
  IconPencil,
  IconTrash,
  IconUsersGroup,
  IconX,
  IconBook,
  IconBooks,
  IconSearch,
  IconCalendar,
  IconChevronRight,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

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
import { useLMS } from "@/hooks/use-lms-store"
import type { UserGroup } from "@/data/types"

// ============================================
// Group Form Dialog
// ============================================
function GroupFormDialog({
  open,
  onClose,
  initial,
  onSave,
}: {
  open: boolean
  onClose: () => void
  initial?: UserGroup
  onSave: (data: {
    name: string
    description: string
    userIds: string[]
    assignedCourseIds: string[]
    assignedCurriculumIds: string[]
  }) => void
}) {

  const [name, setName] = useState(initial?.name ?? "")
  const [description, setDescription] = useState(initial?.description ?? "")

  const handleSave = () => {
    if (!name.trim()) return
    onSave({
      name,
      description,
      userIds: initial?.userIds ?? [],
      assignedCourseIds: initial?.assignedCourseIds ?? [],
      assignedCurriculumIds: initial?.assignedCurriculumIds ?? [],
    })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Group" : "Create Group"}</DialogTitle>
          <DialogDescription>
            {initial ? "Update group details" : "Create a new student group (batch)"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="group-name">Group Name</Label>
            <Input
              id="group-name"
              placeholder="e.g. Batch 2025-A"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="group-desc">Description</Label>
            <Textarea
              id="group-desc"
              placeholder="Describe this group…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            {initial ? "Save Changes" : "Create Group"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ============================================
// Group Detail View
// ============================================
function GroupDetailView({
  group,
  onBack,
  onEdit,
  onDelete,
}: {
  group: UserGroup
  onBack: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  const { users, courses, curricula, updateUserGroup } = useLMS()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("members")

  const [memberSearch, setMemberSearch] = useState("")
  const [addMemberSearch, setAddMemberSearch] = useState("")
  const [showAddMembers, setShowAddMembers] = useState(false)

  const [courseSearch, setCourseSearch] = useState("")
  const [addCourseSearch, setAddCourseSearch] = useState("")
  const [showAddCourses, setShowAddCourses] = useState(false)

  const [curSearch, setCurSearch] = useState("")
  const [addCurSearch, setAddCurSearch] = useState("")
  const [showAddCur, setShowAddCur] = useState(false)
  const [removingItem, setRemovingItem] = useState<{ type: "member" | "course" | "curriculum"; id: string; name: string } | null>(null)

  const groupUsers = users.filter((u) => group.userIds.includes(u.id))
  const nonMembers = users.filter((u) => !group.userIds.includes(u.id))
  const groupCourses = courses.filter((c) => group.assignedCourseIds.includes(c.id))
  const unassignedCourses = courses.filter((c) => !group.assignedCourseIds.includes(c.id))
  const groupCurricula = curricula.filter((c) => group.assignedCurriculumIds.includes(c.id))
  const unassignedCurricula = curricula.filter((c) => !group.assignedCurriculumIds.includes(c.id))

  const filteredMembers = groupUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(memberSearch.toLowerCase()),
  )
  const filteredNonMembers = nonMembers.filter(
    (u) =>
      u.name.toLowerCase().includes(addMemberSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(addMemberSearch.toLowerCase()),
  )
  const filteredCourses = groupCourses.filter((c) =>
    c.title.toLowerCase().includes(courseSearch.toLowerCase()),
  )
  const filteredUnassignedCourses = unassignedCourses.filter((c) =>
    c.title.toLowerCase().includes(addCourseSearch.toLowerCase()),
  )
  const filteredCurricula = groupCurricula.filter((c) =>
    c.title.toLowerCase().includes(curSearch.toLowerCase()),
  )
  const filteredUnassignedCur = unassignedCurricula.filter((c) =>
    c.title.toLowerCase().includes(addCurSearch.toLowerCase()),
  )

  const addMember = (userId: string) =>
    updateUserGroup(group.id, { userIds: [...group.userIds, userId] })
  const addCourse = (courseId: string) =>
    updateUserGroup(group.id, { assignedCourseIds: [...group.assignedCourseIds, courseId] })
  const addCurriculum = (curId: string) =>
    updateUserGroup(group.id, { assignedCurriculumIds: [...group.assignedCurriculumIds, curId] })

  const confirmRemove = () => {
    if (!removingItem) return
    if (removingItem.type === "member") {
      updateUserGroup(group.id, { userIds: group.userIds.filter((id) => id !== removingItem.id) })
    } else if (removingItem.type === "course") {
      updateUserGroup(group.id, { assignedCourseIds: group.assignedCourseIds.filter((id) => id !== removingItem.id) })
    } else {
      updateUserGroup(group.id, { assignedCurriculumIds: group.assignedCurriculumIds.filter((id) => id !== removingItem.id) })
    }
    setRemovingItem(null)
  }

  const groupTabs = [
    { id: "members" as const, label: "Members", icon: IconUsersGroup },
    { id: "courses" as const, label: "Courses", icon: IconBook },
    { id: "curricula" as const, label: "Curricula", icon: IconBooks },
  ]

  return (
    <div className="flex flex-col gap-6">
      <Button variant="ghost" className="self-start -ml-2" onClick={onBack}>
        <IconArrowLeft data-icon="inline-start" />
        Back to Groups
      </Button>

      {/* Group Hero */}
      <div className="rounded-2xl border bg-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary/5">
              <IconUsersGroup className="size-7 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight">{group.name}</h1>
              {group.description && (
                <p className="mt-0.5 text-sm text-muted-foreground">{group.description}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <IconPencil data-icon="inline-start" />
              Edit Group
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:bg-destructive/10 border-destructive/30"
              onClick={onDelete}
            >
              <IconTrash data-icon="inline-start" />
              Delete
            </Button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3 max-w-sm">
          <div className="rounded-lg bg-muted/50 px-3 py-2 text-center">
            <p className="text-lg font-bold">{groupUsers.length}</p>
            <p className="text-xs text-muted-foreground">Members</p>
          </div>
          <div className="rounded-lg bg-muted/50 px-3 py-2 text-center">
            <p className="text-lg font-bold">{groupCourses.length}</p>
            <p className="text-xs text-muted-foreground">Courses</p>
          </div>
          <div className="rounded-lg bg-muted/50 px-3 py-2 text-center">
            <p className="text-lg font-bold">{groupCurricula.length}</p>
            <p className="text-xs text-muted-foreground">Curricula</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border bg-muted/40 p-1 w-fit">
        {groupTabs.map((tab) => {
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

        {/* ── Members Tab ── */}
        {activeTab === "members" && (
          <div className="rounded-2xl border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <div>
                <h2 className="font-semibold">Members</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {groupUsers.length} student{groupUsers.length !== 1 ? "s" : ""} in this group
                </p>
              </div>
              <Button size="sm" variant={showAddMembers ? "secondary" : "default"} onClick={() => setShowAddMembers((p) => !p)}>
                {showAddMembers ? <IconX className="size-4 mr-1.5" /> : <IconPlus className="size-4 mr-1.5" />}
                {showAddMembers ? "Cancel" : "Add Members"}
              </Button>
            </div>

            {showAddMembers && (
              <div className="border-b bg-muted/20 px-5 py-4">
                <p className="text-sm font-medium mb-3 text-muted-foreground">Select students to add</p>
                <div className="relative mb-3">
                  <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input placeholder="Search students…" value={addMemberSearch} onChange={(e) => setAddMemberSearch(e.target.value)} className="pl-9" />
                </div>
                {filteredNonMembers.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    {addMemberSearch ? "No students match your search" : "All students are already members"}
                  </p>
                ) : (
                  <div className="max-h-64 overflow-y-auto flex flex-col divide-y rounded-lg border bg-card">
                    {filteredNonMembers.map((u) => (
                      <div key={u.id} className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted/40 transition-colors">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {u.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{u.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                        </div>
                        <Button size="sm" variant="outline" className="shrink-0 h-7 text-xs" onClick={() => addMember(u.id)}>
                          <IconPlus className="size-3 mr-1" /> Add
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {groupUsers.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-muted-foreground">
                No members yet. Click &ldquo;Add Members&rdquo; to get started.
              </div>
            ) : (
              <>
                {groupUsers.length > 5 && (
                  <div className="px-5 pt-4 pb-2">
                    <div className="relative">
                      <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input placeholder="Search members…" value={memberSearch} onChange={(e) => setMemberSearch(e.target.value)} className="pl-9" />
                    </div>
                  </div>
                )}
                <div className="divide-y max-h-96 overflow-y-auto">
                  {filteredMembers.length === 0 ? (
                    <div className="px-5 py-6 text-center text-sm text-muted-foreground">No members match your search</div>
                  ) : (
                    filteredMembers.map((u) => (
                      <div key={u.id} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/30 transition-colors group">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                          {u.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1 cursor-pointer" onClick={() => navigate(`/users/${u.id}`)}>
                          <p className="text-sm font-medium truncate">{u.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                        </div>
                        <Button size="sm" variant="ghost" className="shrink-0 h-8 text-xs opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive hover:bg-destructive/10 transition-all" onClick={() => setRemovingItem({ type: "member", id: u.id, name: u.name })}>
                          <IconX className="size-3.5 mr-1" /> Remove
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Courses Tab ── */}
        {activeTab === "courses" && (
          <div className="rounded-2xl border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <div>
                <h2 className="font-semibold">Assigned Courses</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {groupCourses.length} course{groupCourses.length !== 1 ? "s" : ""} assigned
                </p>
              </div>
              <Button size="sm" variant={showAddCourses ? "secondary" : "default"} onClick={() => setShowAddCourses((p) => !p)}>
                {showAddCourses ? <IconX className="size-4 mr-1.5" /> : <IconPlus className="size-4 mr-1.5" />}
                {showAddCourses ? "Cancel" : "Add Courses"}
              </Button>
            </div>

            {showAddCourses && (
              <div className="border-b bg-muted/20 px-5 py-4">
                <p className="text-sm font-medium mb-3 text-muted-foreground">Select courses to assign</p>
                <div className="relative mb-3">
                  <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input placeholder="Search courses…" value={addCourseSearch} onChange={(e) => setAddCourseSearch(e.target.value)} className="pl-9" />
                </div>
                {filteredUnassignedCourses.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    {addCourseSearch ? "No courses match your search" : "All courses are already assigned"}
                  </p>
                ) : (
                  <div className="max-h-64 overflow-y-auto flex flex-col divide-y rounded-lg border bg-card">
                    {filteredUnassignedCourses.map((c) => (
                      <div key={c.id} className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted/40 transition-colors">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-500/10">
                          <IconBook className="size-3.5 text-blue-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{c.title}</p>
                          <p className="text-xs text-muted-foreground">{c.modules.length} modules · {c.status}</p>
                        </div>
                        <Button size="sm" variant="outline" className="shrink-0 h-7 text-xs" onClick={() => addCourse(c.id)}>
                          <IconPlus className="size-3 mr-1" /> Assign
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {groupCourses.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-muted-foreground">
                No courses assigned. Click &ldquo;Add Courses&rdquo; to get started.
              </div>
            ) : (
              <>
                {groupCourses.length > 5 && (
                  <div className="px-5 pt-4 pb-2">
                    <div className="relative">
                      <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input placeholder="Search assigned courses…" value={courseSearch} onChange={(e) => setCourseSearch(e.target.value)} className="pl-9" />
                    </div>
                  </div>
                )}
                <div className="divide-y max-h-96 overflow-y-auto">
                  {filteredCourses.length === 0 ? (
                    <div className="px-5 py-6 text-center text-sm text-muted-foreground">No courses match your search</div>
                  ) : (
                    filteredCourses.map((c) => (
                      <div key={c.id} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/30 transition-colors group">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-500/10">
                          <IconBook className="size-4 text-blue-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{c.title}</p>
                          <p className="text-xs text-muted-foreground">{c.modules.length} modules · {c.status}</p>
                        </div>
                        <Badge variant="outline" className="text-xs shrink-0 capitalize mr-2">{c.status}</Badge>
                        <Button size="sm" variant="ghost" className="shrink-0 h-8 text-xs opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive hover:bg-destructive/10 transition-all" onClick={() => setRemovingItem({ type: "course", id: c.id, name: c.title })}>
                          <IconX className="size-3.5 mr-1" /> Remove
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Curricula Tab ── */}
        {activeTab === "curricula" && (
          <div className="rounded-2xl border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <div>
                <h2 className="font-semibold">Assigned Curricula</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {groupCurricula.length} curricul{groupCurricula.length !== 1 ? "a" : "um"} assigned
                </p>
              </div>
              <Button size="sm" variant={showAddCur ? "secondary" : "default"} onClick={() => setShowAddCur((p) => !p)}>
                {showAddCur ? <IconX className="size-4 mr-1.5" /> : <IconPlus className="size-4 mr-1.5" />}
                {showAddCur ? "Cancel" : "Add Curricula"}
              </Button>
            </div>

            {showAddCur && (
              <div className="border-b bg-muted/20 px-5 py-4">
                <p className="text-sm font-medium mb-3 text-muted-foreground">Select curricula to assign</p>
                <div className="relative mb-3">
                  <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input placeholder="Search curricula…" value={addCurSearch} onChange={(e) => setAddCurSearch(e.target.value)} className="pl-9" />
                </div>
                {filteredUnassignedCur.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    {addCurSearch ? "No curricula match your search" : "All curricula are already assigned"}
                  </p>
                ) : (
                  <div className="max-h-64 overflow-y-auto flex flex-col divide-y rounded-lg border bg-card">
                    {filteredUnassignedCur.map((c) => (
                      <div key={c.id} className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted/40 transition-colors">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-purple-500/10">
                          <IconBooks className="size-3.5 text-purple-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{c.title}</p>
                          <p className="text-xs text-muted-foreground">{c.courseIds.length} courses · {c.status}</p>
                        </div>
                        <Button size="sm" variant="outline" className="shrink-0 h-7 text-xs" onClick={() => addCurriculum(c.id)}>
                          <IconPlus className="size-3 mr-1" /> Assign
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {groupCurricula.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-muted-foreground">
                No curricula assigned. Click &ldquo;Add Curricula&rdquo; to get started.
              </div>
            ) : (
              <>
                {groupCurricula.length > 5 && (
                  <div className="px-5 pt-4 pb-2">
                    <div className="relative">
                      <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input placeholder="Search assigned curricula…" value={curSearch} onChange={(e) => setCurSearch(e.target.value)} className="pl-9" />
                    </div>
                  </div>
                )}
                <div className="divide-y max-h-96 overflow-y-auto">
                  {filteredCurricula.length === 0 ? (
                    <div className="px-5 py-6 text-center text-sm text-muted-foreground">No curricula match your search</div>
                  ) : (
                    filteredCurricula.map((c) => (
                      <div key={c.id} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/30 transition-colors group">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-purple-500/10">
                          <IconBooks className="size-4 text-purple-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{c.title}</p>
                          <p className="text-xs text-muted-foreground">{c.courseIds.length} courses</p>
                        </div>
                        <Badge variant="outline" className="text-xs shrink-0 capitalize mr-2">{c.status}</Badge>
                        <Button size="sm" variant="ghost" className="shrink-0 h-8 text-xs opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive hover:bg-destructive/10 transition-all" onClick={() => setRemovingItem({ type: "curriculum", id: c.id, name: c.title })}>
                          <IconX className="size-3.5 mr-1" /> Remove
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        )}

      </div>

      {/* Remove Confirmation */}
      <AlertDialog open={!!removingItem} onOpenChange={(o) => !o && setRemovingItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {removingItem?.type === "member" ? "Member" : removingItem?.type === "course" ? "Course" : "Curriculum"}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{" "}
              <span className="font-semibold text-foreground">{removingItem?.name}</span> from{" "}
              <span className="font-semibold text-foreground">{group.name}</span>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmRemove}
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
// User Groups Page
// ============================================
export function UserGroupsPage() {
  const { userGroups, users, addUserGroup, updateUserGroup, deleteUserGroup } = useLMS()
  const [search, setSearch] = useState("")
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<UserGroup | undefined>()
  const [deletingGroupId, setDeletingGroupId] = useState<string | null>(null)

  const selectedGroup = userGroups.find((g) => g.id === selectedGroupId)

  const filtered = userGroups.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.description.toLowerCase().includes(search.toLowerCase()),
  )

  // If a group is selected, show detail view
  if (selectedGroup) {
    return (
      <>
        <GroupDetailView
          group={selectedGroup}
          onBack={() => setSelectedGroupId(null)}
          onEdit={() => {
            setEditingGroup(selectedGroup)
            setFormOpen(true)
          }}
          onDelete={() => setDeletingGroupId(selectedGroup.id)}
        />

        <GroupFormDialog
          open={formOpen}
          onClose={() => {
            setFormOpen(false)
            setEditingGroup(undefined)
          }}
          initial={editingGroup}
          onSave={(data) => {
            if (editingGroup) updateUserGroup(editingGroup.id, data)
          }}
        />

        <AlertDialog
          open={!!deletingGroupId}
          onOpenChange={(o) => !o && setDeletingGroupId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Group</AlertDialogTitle>
              <AlertDialogDescription>
                Delete "{selectedGroup.name}"? This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (deletingGroupId) deleteUserGroup(deletingGroupId)
                  setDeletingGroupId(null)
                  setSelectedGroupId(null)
                }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    )
  }

  // Groups list view
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">Groups</h1>
        </div>
        {/* Search */}
      {userGroups.length > 0 && (
        <div className="relative w-full sm:w-72">
          <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search groups…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      )}
        <Button
          onClick={() => {
            setEditingGroup(undefined)
            setFormOpen(true)
          }}
        >
          <IconPlus data-icon="inline-start" />
          Create Group
        </Button>
      </div>

      

      {/* Empty State */}
      {userGroups.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border bg-muted/30 py-20 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-muted">
            <IconUsersGroup className="size-8 text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold">No groups yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Create your first student batch</p>
          </div>
          <Button onClick={() => { setEditingGroup(undefined); setFormOpen(true) }}>
            <IconPlus data-icon="inline-start" />
            Create Group
          </Button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border bg-muted/30 py-10 text-center text-sm text-muted-foreground">
          No groups match your search
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((group) => {
            const memberCount = group.userIds.length
            const courseCount = group.assignedCourseIds.length
            const curriculaCount = group.assignedCurriculumIds.length
            const groupUsersList = users.filter((u) => group.userIds.includes(u.id))

            return (
              <button
                key={group.id}
                onClick={() => setSelectedGroupId(group.id)}
                className="flex flex-col rounded-2xl border bg-card p-5 text-left transition-shadow hover:shadow-md group cursor-pointer"
              >
                {/* Icon + name */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/5">
                    <IconUsersGroup className="size-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold truncate">{group.name}</p>
                      <IconChevronRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 shrink-0" />
                    </div>
                    {group.description && (
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                        {group.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="rounded-lg bg-muted/50 py-2 text-center">
                    <p className="text-base font-bold">{memberCount}</p>
                    <p className="text-xs text-muted-foreground">Members</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 py-2 text-center">
                    <p className="text-base font-bold">{courseCount}</p>
                    <p className="text-xs text-muted-foreground">Courses</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 py-2 text-center">
                    <p className="text-base font-bold">{curriculaCount}</p>
                    <p className="text-xs text-muted-foreground">Curricula</p>
                  </div>
                </div>

                {/* Member avatars */}
                {groupUsersList.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <div className="flex -space-x-2">
                      {groupUsersList.slice(0, 4).map((u) => (
                        <div
                          key={u.id}
                          className="flex size-7 items-center justify-center rounded-full border-2 border-background bg-primary/10 text-xs font-semibold text-primary"
                          title={u.name}
                        >
                          {u.name.slice(0, 2).toUpperCase()}
                        </div>
                      ))}
                    </div>
                    {groupUsersList.length > 4 && (
                      <span className="text-xs text-muted-foreground">
                        +{groupUsersList.length - 4} more
                      </span>
                    )}
                    {groupUsersList.length <= 4 && (
                      <span className="text-xs text-muted-foreground">
                        {groupUsersList.map((u) => u.name.split(" ")[0]).join(", ")}
                      </span>
                    )}
                  </div>
                )}

                {/* Created date */}
                <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                  <IconCalendar className="size-3" />
                  Created{" "}
                  {new Date(group.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* Group Form Dialog (for create) */}
      <GroupFormDialog
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setEditingGroup(undefined)
        }}
        initial={editingGroup}
        onSave={(data) => {
          if (editingGroup) {
            updateUserGroup(editingGroup.id, data)
          } else {
            addUserGroup(data)
          }
        }}
      />
    </div>
  )
}
