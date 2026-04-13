import { useNavigate } from "react-router-dom"
import {
  IconBook,
  IconLayoutList,
  IconUsers,
  IconUsersGroup,
  IconTrendingUp,
  IconClipboardCheck,
} from "@tabler/icons-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useLMS } from "@/hooks/use-lms-store"

export function DashboardPage() {
  const navigate = useNavigate()
  const { courses, curricula, users, userGroups } = useLMS()

  const publishedCourses = courses.filter((c) => c.status === "published").length

  const stats = [
    {
      title: "Total Courses",
      value: courses.length,
      description: `${publishedCourses} published`,
      icon: IconBook,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
      href: "/courses",
    },
    {
      title: "Curricula",
      value: curricula.length,
      description: "Learning paths",
      icon: IconLayoutList,
      color: "text-violet-600",
      bgColor: "bg-violet-500/10",
      href: "/curriculum",
    },
    {
      title: "Users",
      value: users.length,
      description: "Registered users",
      icon: IconUsers,
      color: "text-emerald-600",
      bgColor: "bg-emerald-500/10",
      href: "/users",
    },
    {
      title: "User Groups",
      value: userGroups.length,
      description: "Active batches",
      icon: IconUsersGroup,
      color: "text-amber-600",
      bgColor: "bg-amber-500/10",
      href: "/users/groups",
    },
  ]

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Welcome Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 border border-primary/10 shadow-sm">
        <div className="relative z-10 flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back, Admin 👋
          </h1>
          <p className="text-muted-foreground max-w-xl text-base">
            Here's what's happening in your learning management system today. You have <span className="font-medium text-foreground">{courses.length}</span> active courses and <span className="font-medium text-foreground">{users.length}</span> registered users.
          </p>
        </div>
        {/* Decorative background circle */}
        <div className="absolute -right-8 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-32 top-10 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl" />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="group cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/5 border-border/50 bg-card/60 backdrop-blur-xl"
            onClick={() => navigate(stat.href)}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                {stat.title}
              </CardTitle>
              <div className={`rounded-xl p-2.5 transition-transform group-hover:scale-110 duration-300 ${stat.bgColor}`}>
                <stat.icon className={`size-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-extrabold tracking-tight">{stat.value}</div>
              <p className="text-xs font-medium text-muted-foreground mt-1.5">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Two columns */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Courses */}
        <Card className="flex flex-col border-border/60 shadow-sm overflow-hidden">
          <CardHeader className="border-b bg-muted/30 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <IconTrendingUp className="size-4" />
                </div>
                <CardTitle className="text-lg">Recent Courses</CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate("/courses")} className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
                View All
              </Button>
            </div>
            <CardDescription className="pt-1.5">Latest engaging content and updates</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 p-4">
            {courses.slice(0, 4).map((course) => (
              <div
                key={course.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-transparent p-3.5 transition-colors hover:bg-muted/50 hover:border-border gap-3 sm:gap-0 cursor-pointer"
                onClick={() => navigate(`/courses/${course.id}`)}
              >
                <div className="flex items-center gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 transition-colors group-hover:bg-blue-500/20">
                    <IconBook className="size-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">{course.title}</span>
                    <span className="text-xs font-medium text-muted-foreground mt-0.5">
                      {course.modules.length} modules · Updated {course.updatedAt}
                    </span>
                  </div>
                </div>
                <Badge
                  variant={course.status === "published" ? "default" : "secondary"}
                  className="capitalize font-medium shadow-none w-fit"
                >
                  {course.status}
                </Badge>
              </div>
            ))}
            {courses.length === 0 && (
              <div className="py-10 text-center text-sm font-medium text-muted-foreground">
                No courses found.
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Progress Overview */}
        <Card className="flex flex-col border-border/60 shadow-sm overflow-hidden">
          <CardHeader className="border-b bg-muted/30 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <IconClipboardCheck className="size-4" />
                </div>
                <CardTitle className="text-lg">User Progress</CardTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate("/users")} className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
                View All
              </Button>
            </div>
            <CardDescription className="pt-1.5">
              Enrolled students and completion milestones
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 p-5">
            {users
              .filter((u) => u.enrolledCourseIds.length > 0)
              .slice(0, 5)
              .map((user) => {
                const avgProgress =
                  Object.values(user.courseProgress).length > 0
                    ? Math.round(
                        Object.values(user.courseProgress).reduce((a, b) => a + b, 0) /
                          Object.values(user.courseProgress).length,
                      )
                    : 0
                return (
                  <div key={user.id} className="group flex flex-col gap-3 rounded-xl p-2.5 transition-colors hover:bg-muted/40 cursor-pointer" onClick={() => navigate(`/users/${user.id}`)}>
                    <div className="flex items-center gap-3.5">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary ring-2 ring-transparent transition-all group-hover:ring-primary/20">
                        {user.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold group-hover:text-primary transition-colors">{user.name}</span>
                          <span className="text-sm font-extrabold tracking-tight">{avgProgress}%</span>
                        </div>
                        <span className="text-xs font-medium text-muted-foreground mt-0.5">
                          {user.enrolledCourseIds.length} course{user.enrolledCourseIds.length !== 1 ? 's' : ''} enrolled
                        </span>
                      </div>
                    </div>
                    <Progress value={avgProgress} className="h-1.5 bg-primary/10" />
                  </div>
                )
              })}
            {users.filter((u) => u.enrolledCourseIds.length > 0).length === 0 && (
              <div className="py-10 text-center text-sm font-medium text-muted-foreground">
                No enrolled users found.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
    </div>
  )
}
