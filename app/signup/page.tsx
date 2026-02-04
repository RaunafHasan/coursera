"use client"

import { useState, FormEvent } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Footer } from "@/components/footer"
import { BookOpen, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Something went wrong")
        setLoading(false)
        return
      }

      // Auto login after signup
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false
      })

      if (result?.error) {
        setError("Account created but login failed. Please login manually.")
        setTimeout(() => router.push("/login"), 2000)
      } else {
        router.push("/")
        router.refresh()
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center bg-gray-800 px-4 py-12">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-[#056f80] rounded-2xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-12 h-12 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-[#056f80]" style={{ fontFamily: "'Times New Roman', serif" }}>
                Create Account
              </h1>
              <p className="text-gray-600 mt-2 text-base">
                Start your learning journey today
              </p>
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            
            <Input
              label="Full Name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
              required
            />
            
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your.email@example.com"
              required
            />
            
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter password (min 6 characters)"
              required
            />
            
            <Input
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="Re-enter your password"
              required
            />
            
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-[#056f80] hover:text-[#044d5a] transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
      </div>
      <Footer />
    </div>
  )
}
