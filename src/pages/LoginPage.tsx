import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { IconEye, IconEyeOff } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLMS } from "@/hooks/use-lms-store"

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useLMS()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [loginError, setLoginError] = useState("")

  const validate = () => {
    const e: { email?: string; password?: string } = {}
    if (!email.trim()) e.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email"
    if (!password.trim()) e.password = "Password is required"
    else if (password.length < 4) e.password = "Password must be at least 4 characters"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    if (!validate()) return
    const success = login(email, password)
    if (success) {
      navigate("/")
    } else {
      setLoginError("Invalid credentials. Please try again.")
    }
  }

  return (
    <div className="flex min-h-svh lg:h-svh lg:overflow-hidden">
      {/* Left side - Form */}
      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Login to your Lms account
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            {loginError && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {loginError}
              </div>
            )}

            {/* Email Field */}
            <div>
              <Label htmlFor="email" className="block text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2"
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="block text-sm font-medium">
                  Password
                </Label>
                <button
                  type="button"
                  className="text-sm font-medium text-primary hover:text-primary/80"
                >
                  Forgot your password?
                </button>
              </div>
              <div className="relative mt-2">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={!!errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <IconEyeOff className="size-4" /> : <IconEye className="size-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-destructive">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" size="lg">
              Login
            </Button>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="font-medium text-primary hover:text-primary/80"
              >
                Sign up
              </button>
            </p>
          </form>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden bg-muted lg:flex lg:w-1/2 lg:items-stretch lg:justify-center">
        <img
          src="/img.jpg"
          alt="Login illustration"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  )
}
