import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  IconArrowLeft,
  IconPlus,
  IconTrash,
  IconShieldCheck,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
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

export function ProvisioningPage() {
  const navigate = useNavigate()
  const {
    provisioningRules,
    addProvisioningRule,
    deleteProvisioningRule,
    users,
    userGroups,
    courses,
    curricula,
  } = useLMS()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [targetType, setTargetType] = useState<"user" | "group">("user")
  const [targetId, setTargetId] = useState("")
  const [resourceType, setResourceType] = useState<"course" | "curriculum">("course")
  const [resourceId, setResourceId] = useState("")

  const handleAdd = () => {
    if (!targetId || !resourceId) return
    addProvisioningRule({ targetType, targetId, resourceType, resourceId })
    setDialogOpen(false)
    setTargetId("")
    setResourceId("")
  }

  const getTargetName = (type: string, id: string) => {
    if (type === "user") return users.find((u) => u.id === id)?.name ?? id
    return userGroups.find((g) => g.id === id)?.name ?? id
  }

  const getResourceName = (type: string, id: string) => {
    if (type === "course") return courses.find((c) => c.id === id)?.title ?? id
    return curricula.find((c) => c.id === id)?.title ?? id
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/users")}>
          <IconArrowLeft />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">Access Provisioning</h1>
          <p className="text-muted-foreground">
            Assign courses and curricula to individual users or groups
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <IconPlus data-icon="inline-start" />
          Add Rule
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <IconShieldCheck className="size-5 text-primary" />
            <CardTitle>Provisioning Rules</CardTitle>
          </div>
          <CardDescription>
            {provisioningRules.length} active rules controlling access
          </CardDescription>
        </CardHeader>
        <CardContent>
          {provisioningRules.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <div className="rounded-full bg-muted p-4">
                <IconShieldCheck className="size-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No provisioning rules yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Target Type</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Resource Type</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Assigned</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {provisioningRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell>
                        <Badge variant={rule.targetType === "user" ? "default" : "secondary"}>
                          {rule.targetType}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {getTargetName(rule.targetType, rule.targetId)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{rule.resourceType}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {getResourceName(rule.resourceType, rule.resourceId)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{rule.assignedAt}</TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <IconTrash className="text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove Rule</AlertDialogTitle>
                              <AlertDialogDescription>
                                Remove this provisioning rule? The target will lose access to the
                                resource.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteProvisioningRule(rule.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Rule Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(o) => !o && setDialogOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Provisioning Rule</DialogTitle>
            <DialogDescription>
              Assign access to a course or curriculum for a user or group.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label>Target Type</Label>
                <Select
                  value={targetType}
                  onValueChange={(v) => {
                    setTargetType(v as "user" | "group")
                    setTargetId("")
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="group">Group</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Target</Label>
                <Select value={targetId} onValueChange={setTargetId}>
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${targetType}…`} />
                  </SelectTrigger>
                  <SelectContent>
                    {targetType === "user"
                      ? users.map((u) => (
                          <SelectItem key={u.id} value={u.id}>
                            {u.name}
                          </SelectItem>
                        ))
                      : userGroups.map((g) => (
                          <SelectItem key={g.id} value={g.id}>
                            {g.name}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label>Resource Type</Label>
                <Select
                  value={resourceType}
                  onValueChange={(v) => {
                    setResourceType(v as "course" | "curriculum")
                    setResourceId("")
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="course">Course</SelectItem>
                    <SelectItem value="curriculum">Curriculum</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Resource</Label>
                <Select value={resourceId} onValueChange={setResourceId}>
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${resourceType}…`} />
                  </SelectTrigger>
                  <SelectContent>
                    {resourceType === "course"
                      ? courses.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.title}
                          </SelectItem>
                        ))
                      : curricula.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.title}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd} disabled={!targetId || !resourceId}>
              Assign Access
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
