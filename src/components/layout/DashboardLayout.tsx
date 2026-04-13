import { Outlet, useNavigate, useLocation } from "react-router-dom"
import {
  IconBook,
  IconLayoutList,
  IconLayoutDashboard,
  IconUsers,
  IconUsersGroup,
  IconLogout,
  IconSchool,
} from "@tabler/icons-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { useLMS } from "@/hooks/use-lms-store"

const navItems = [
  { title: "Dashboard", icon: IconLayoutDashboard, href: "/" },
  { title: "Courses", icon: IconBook, href: "/courses" },
  { title: "Curriculum", icon: IconLayoutList, href: "/curriculum" },
  { title: "Students", icon: IconUsers, href: "/users" },
  { title: "Groups", icon: IconUsersGroup, href: "/users/groups" },
]

export function DashboardLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useLMS()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className="cursor-pointer"
                onClick={() => navigate("/")}
              >
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <IconSchool className="size-5" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">LMS Admin</span>
                    <span className="text-xs text-muted-foreground">Learning Management</span>
                  </div>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={
                        item.href === "/"
                          ? location.pathname === "/"
                          : item.href === "/users/groups"
                          ? location.pathname === "/users/groups"
                          : item.href === "/users"
                          ? location.pathname === "/users" ||
                            (location.pathname.startsWith("/users/") &&
                              location.pathname !== "/users/groups")
                          : location.pathname.startsWith(item.href)
                      }
                      onClick={() => navigate(item.href)}
                      className="cursor-pointer"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleLogout} className="cursor-pointer text-destructive">
                <IconLogout />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="min-w-0 overflow-hidden">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="text-sm font-medium text-muted-foreground capitalize">
            {location.pathname === "/"
              ? "Dashboard"
              : location.pathname.split("/")[1]?.replace(/-/g, " ")}
          </span>
        </header>
        <main className="min-w-0 flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
