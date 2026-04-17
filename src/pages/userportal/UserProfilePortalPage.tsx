import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useLMS } from "@/hooks/use-lms-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  IconArrowLeft,
  IconUser,
  IconMail,
  IconPhone,
  IconMapPin,
  IconCalendar,
  IconLock,
  IconCheck,
  IconEdit,
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react"

const CURRENT_USER_ID = "user-1"

export function UserProfilePortalPage() {
  const navigate = useNavigate()
  const { users, updateUser } = useLMS()
  const currentUser = users.find((u) => u.id === CURRENT_USER_ID)!

  // Editable form state
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone,
    location: currentUser.location,
    dob: currentUser.dob,
  })

  // Password modal state
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)

  // Save success state
  const [saved, setSaved] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    updateUser(CURRENT_USER_ID, formData)
    setIsEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleCancel = () => {
    setFormData({
      name: currentUser.name,
      email: currentUser.email,
      phone: currentUser.phone,
      location: currentUser.location,
      dob: currentUser.dob,
    })
    setIsEditing(false)
  }

  const handlePasswordSave = () => {
    // Mock password change — just close the modal
    setPasswordSaved(true)
    setTimeout(() => {
      setPasswordOpen(false)
      setCurrentPassword("")
      setNewPassword("")
      setShowCurrent(false)
      setShowNew(false)
      setPasswordSaved(false)
    }, 1500)
  }

  const profileFields = [
    { key: "name", label: "Full Name", icon: IconUser, type: "text" },
    { key: "email", label: "Email Address", icon: IconMail, type: "email" },
    { key: "phone", label: "Phone Number", icon: IconPhone, type: "tel" },
    { key: "location", label: "Location", icon: IconMapPin, type: "text" },
    { key: "dob", label: "Date of Birth", icon: IconCalendar, type: "date" },
  ]

  return (
    <>
      {/* ─── Main Content ─── */}
      <main className="up-main">
        {/* Back button */}
        <button className="upp-back-btn" onClick={() => navigate("/userportal")}>
          <IconArrowLeft size={18} />
          <span>Back to Dashboard</span>
        </button>

        {/* Profile Card */}
        <div className="upp-profile-card">
          {/* Profile Header */}
          <div className="upp-profile-header">
            <div className="upp-profile-avatar-section">
              <div className="upp-large-avatar">
                <span>{currentUser.name.charAt(0)}</span>
              </div>
              <div className="upp-profile-name-section">
                <h1 className="upp-profile-name">{formData.name}</h1>
                <p className="upp-profile-joined">
                  Joined {new Date(currentUser.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </p>
              </div>
            </div>
            <div className="upp-profile-actions">
              {!isEditing ? (
                <Button
                  variant="outline"
                  className="upp-edit-btn"
                  onClick={() => setIsEditing(true)}
                >
                  <IconEdit size={16} data-icon="inline-start" />
                  Edit Profile
                </Button>
              ) : (
                <div className="upp-edit-actions">
                  <Button variant="outline" onClick={handleCancel} className="upp-cancel-btn">
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="upp-save-btn">
                    <IconCheck size={16} data-icon="inline-start" />
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Success Toast */}
          {saved && (
            <div className="upp-toast">
              <IconCheck size={16} />
              <span>Profile updated successfully!</span>
            </div>
          )}

          {/* Profile Fields */}
          <div className="upp-fields-grid">
            {profileFields.map((field) => {
              const Icon = field.icon
              return (
                <div key={field.key} className="upp-field">
                  <Label className="upp-field-label">
                    <Icon size={15} className="upp-field-icon" />
                    {field.label}
                  </Label>
                  {isEditing ? (
                    <Input
                      type={field.type}
                      value={formData[field.key as keyof typeof formData]}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                      className="upp-field-input"
                    />
                  ) : (
                    <div className="upp-field-value">
                      {field.key === "dob"
                        ? new Date(formData.dob).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : formData[field.key as keyof typeof formData]}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Password Section */}
          <div className="upp-password-section">
            <div className="upp-password-info">
              <div className="upp-password-icon-wrap">
                <IconLock size={20} />
              </div>
              <div>
                <h3 className="upp-password-title">Password & Security</h3>
                <p className="upp-password-desc">Change your password to keep your account secure</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setPasswordOpen(true)}
              className="upp-change-pw-btn"
            >
              <IconLock size={16} data-icon="inline-start" />
              Change Password
            </Button>
          </div>
        </div>
      </main>

      {/* ─── Password Change Modal ─── */}
      <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
        <DialogContent className="upp-pw-dialog">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new one.
            </DialogDescription>
          </DialogHeader>

          <div className="upp-pw-fields">
            <div className="upp-pw-field">
              <Label htmlFor="current-password">Current Password</Label>
              <div className="upp-pw-input-wrap">
                <Input
                  id="current-password"
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="upp-pw-input"
                />
                <button
                  type="button"
                  className="upp-pw-toggle"
                  onClick={() => setShowCurrent(!showCurrent)}
                >
                  {showCurrent ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                </button>
              </div>
            </div>
            <div className="upp-pw-field">
              <Label htmlFor="new-password">New Password</Label>
              <div className="upp-pw-input-wrap">
                <Input
                  id="new-password"
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="upp-pw-input"
                />
                <button
                  type="button"
                  className="upp-pw-toggle"
                  onClick={() => setShowNew(!showNew)}
                >
                  {showNew ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                </button>
              </div>
            </div>
          </div>

          {passwordSaved && (
            <div className="upp-toast upp-toast-inline">
              <IconCheck size={16} />
              <span>Password changed successfully!</span>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setPasswordOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handlePasswordSave}
              disabled={!currentPassword || !newPassword || passwordSaved}
            >
              {passwordSaved ? "Saved!" : "Update Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
