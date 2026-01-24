'use client'

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

/**
 * Sign Up page with custom form including privacy and terms acceptance.
 * Styled to match the app's dark theme.
 */
export default function SignUpPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (!agreeTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy")
      return
    }
    // For now, just redirect to signin (placeholder)
    router.push('/signin')
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
          <h1 className="text-2xl font-semibold mb-6 text-center">Sign Up</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-[#E6EAF2]">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#1A2232] border-[#273046] text-[#E6EAF2] placeholder-[#A9B1C7]"
                required
              />
            </div>
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
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#1A2232] border-[#273046] text-[#E6EAF2] placeholder-[#A9B1C7]"
                required
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="text-[#E6EAF2]">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-[#1A2232] border-[#273046] text-[#E6EAF2] placeholder-[#A9B1C7]"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
              />
              <Label htmlFor="terms" className="text-sm text-[#A9B1C7]">
                I agree to the <Link href="/terms" className="text-[#4F7DFF] hover:text-[#3D5FBF]">Terms of Service</Link> and <Link href="/privacy" className="text-[#4F7DFF] hover:text-[#3D5FBF]">Privacy Policy</Link>
              </Label>
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <Button type="submit" className="w-full bg-[#4F7DFF] hover:bg-[#3D5FBF] text-white">
              Sign Up
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-[#A9B1C7]">
            Already have an account? <Link href="/signin" className="text-[#4F7DFF] hover:text-[#3D5FBF]">Sign in</Link>
          </p>
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