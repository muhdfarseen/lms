import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  IconPlus,
  IconSearch,
  IconUsers,
  IconMapPin,
  IconPhone,
  IconCalendar,
  IconChevronRight,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useLMS } from "@/hooks/use-lms-store"

// ============================================
// Add Student Dialog
// ============================================
function AddStudentDialog({
  open,
  onClose,
  onSave,
}: {
  open: boolean
  onClose: () => void
  onSave: (data: {
    name: string
    email: string
    phone: string
    location: string
    dob: string
  }) => void
}) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [location, setLocation] = useState("")
  const [dob, setDob] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = "Name is required"
    if (!email.trim()) e.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email"
    if (!phone.trim()) e.phone = "Phone is required"
    if (!location.trim()) e.location = "Location is required"
    if (!dob) e.dob = "Date of birth is required"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    onSave({ name, email, phone, location, dob })
    // reset
    setName(""); setEmail(""); setPhone(""); setLocation(""); setDob("")
    onClose()
  }

  const handleClose = () => {
    setName(""); setEmail(""); setPhone(""); setLocation(""); setDob("")
    setErrors({})
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Student</DialogTitle>
          <DialogDescription>Create a new student account</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="s-name">Full Name</Label>
              <Input
                id="s-name"
                placeholder="e.g. Arjun Mehta"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="s-email">Email</Label>
              <Input
                id="s-email"
                type="email"
                placeholder="student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="s-phone">Phone</Label>
              <Input
                id="s-phone"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="s-location">Location</Label>
              <Input
                id="s-location"
                placeholder="City, State"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              {errors.location && <p className="text-xs text-destructive">{errors.location}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="s-dob">Date of Birth</Label>
              <Input
                id="s-dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
              {errors.dob && <p className="text-xs text-destructive">{errors.dob}</p>}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Add Student</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ============================================
// Users Page
// ============================================
export function UsersPage() {
  const navigate = useNavigate()
  const { users, addUser } = useLMS()
  const [search, setSearch] = useState("")
  const [addOpen, setAddOpen] = useState(false)

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.location.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Students</h1>
        </div>
        <div className="flex gap-2 self-start">
          <div className="relative w-full sm:w-64">
              <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search students…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          <Button onClick={() => setAddOpen(true)}>
            <IconPlus data-icon="inline-start" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Table Card */}
      <Card className="pt-0 pb-2">
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <div className="rounded-full bg-muted p-4">
                <IconUsers className="size-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                {search ? "No students match your search" : "No students yet. Add your first student!"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-6">Student</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1.5">
                        <IconPhone className="size-3.5" />
                        Phone
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1.5">
                        <IconMapPin className="size-3.5" />
                        Location
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1.5">
                        <IconCalendar className="size-3.5" />
                        Joined On
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1.5">
                        <IconCalendar className="size-3.5" />
                        Date of Birth
                      </div>
                    </TableHead>
                    <TableHead className="w-8" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((user) => (
                    <TableRow
                      key={user.id}
                      className="cursor-pointer group"
                      onClick={() => navigate(`/users/${user.id}`)}
                    >
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-3">
                          <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                            {user.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium leading-none">{user.name}</p>
                            <p className="mt-0.5 text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{user.phone}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <IconMapPin className="size-3.5 shrink-0" />
                          {user.location}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(user.dob).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <IconChevronRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AddStudentDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={(data) => {
          addUser({
            ...data,
            role: "Student",
            groupIds: [],
            enrolledCourseIds: [],
            enrolledCurriculumIds: [],
            courseProgress: {},
            curriculumProgress: {},
          })
        }}
      />
    </div>
  )
}
