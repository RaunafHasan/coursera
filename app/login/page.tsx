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

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        setError("Invalid email or password")
      } else {
        router.push("/")
        router.refresh()
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
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
                Welcome Back
              </h1>
              <p className="text-gray-600 mt-2 text-base">
                Sign in to continue your learning journey
              </p>
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
            />
            
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link href="/signup" className="font-semibold text-[#056f80] hover:text-[#044d5a] transition-colors">
                Sign Up
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
