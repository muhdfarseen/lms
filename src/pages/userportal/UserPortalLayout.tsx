import { Outlet, useNavigate } from "react-router-dom"
import { useMemo } from "react"
import { useLMS } from "@/hooks/use-lms-store"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  IconFlame,
  IconStar,
  IconUser,
  IconLogout,
} from "@tabler/icons-react"

const CURRENT_USER_ID = "user-1"

export function UserPortalLayout() {
  const navigate = useNavigate()
  const { users } = useLMS()
  const currentUser = users.find((u) => u.id === CURRENT_USER_ID)!

  // Compute XP
  const expPoints = useMemo(() => {
    const totalProgress = Object.values(currentUser.courseProgress).reduce((a, b) => a + b, 0)
    return Math.round(totalProgress * 1.5)
  }, [currentUser])

  const currentStreak = 0

  return (
    <div className="up-page">
      {/* ─── Shared Header ─── */}
      <header className="up-header">
        <div className="up-header-inner">
          <div className="up-logo-group">
            <img src="/Company logo.svg" alt="Company Logo" className="up-logo" />
          </div>
          <div className="up-header-right">
            <div className="up-stat-pill">
              <span className="up-stat-value">{currentStreak}</span>
              <IconFlame size={18} className="up-flame-icon" />
            </div>
            <div className="up-stat-pill">
              <span className="up-stat-value">{expPoints}</span>
              <IconStar size={18} className="up-star-icon" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="up-user-trigger">
                  <span className="up-user-name">{currentUser.name.split(" ")[0]}</span>
                  <Avatar size="default" className="up-avatar">
                    <AvatarFallback className="up-avatar-fallback">
                      {currentUser.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={8}>
                <DropdownMenuItem onClick={() => navigate("/userportal/profile")}>
                  <IconUser size={16} />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={() => navigate("/login")}>
                  <IconLogout size={16} />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* ─── Page Content ─── */}
      <Outlet />
    </div>
  )
}
