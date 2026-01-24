'use client'

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { users } from "@/lib/placeholder-data"

/**
 * Sign In page with custom form using placeholder data.
 * Redirects to corresponding dashboard based on user role.
 */
export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const user = users.find(u => u.email === email && u.password === password)
    if (user) {
      // Simulate login by storing user in localStorage
      localStorage.setItem('currentUser', JSON.stringify(user))
      // Redirect based on role
      if (user.role === 'STUDENT') {
        router.push('/students')
      } else if (user.role === 'STAFF') {
        router.push('/staff')
      } else if (user.role === 'ADMIN') {
        router.push('/admin')
      }
    } else {
      setError("Invalid email or password")
    }
  }

  return (
    <main className="min-h-screen bg-[#0B0F14] text-[#E6EAF2] flex flex-col">
      <header className="max-w-6xl sticky top-0 bg-[#0B0F14] z-50 mx-auto px-3 py-3 flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#4F7DFF] flex items-center justify-center text-white font-semibold">A</div>
          <div>
            <div className="text-lg font-semibold">ASSS</div>
            <div className="text-xs text-[#A9B1C7]">Student Support System</div>
          </div>
        </div>
        <Link href="/">
          <button className="text-sm text-[#A9B1C7] hover:text-white">Back to Home</button>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-[#121823] border border-[#273046] rounded-lg p-8">
          <h1 className="text-2xl font-semibold mb-6 text-center">Sign In</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-[#E6EAF2]">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#1A2232] border-[#273046] text-[#E6EAF2] placeholder-[#A9B1C7]"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-[#E6EAF2]">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#1A2232] border-[#273046] text-[#E6EAF2] placeholder-[#A9B1C7]"
                required
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <Button type="submit" className="w-full bg-[#4F7DFF] hover:bg-[#3D5FBF] text-white">
              Sign In
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-[#A9B1C7]">
            Don&apos;t have an account? <Link href="/signup" className="text-[#4F7DFF] hover:text-[#3D5FBF]">Sign up</Link>
          </p>
          <div className="mt-4 text-xs text-[#A9B1C7]">
            <p>Demo accounts:</p>
            <p>Student: student@example.com / password</p>
            <p>Staff: staff@example.com / password</p>
            <p>Admin: admin@example.com / password</p>
          </div>
        </div>
      </div>

      <footer className="mt-16 border-t border-[#273046] bg-[#0B0F14]">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#A9B1C7]">
          <div>© 2026 ASSS — Designed for universities. Privacy & Terms</div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}