"use client"

import * as React from "react"
import { Settings } from "lucide-react"

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

/**
 * SettingsSheet
 *
 * A settings sheet for students that allows toggling language and theme.
 * Persists preferences to localStorage and applies theme by toggling `dark` class
 * on `document.documentElement`.
 */
export default function SettingsSheet({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false)
  const [language, setLanguage] = React.useState<"en" | "fr">("en")
  const [dark, setDark] = React.useState(false)
  const [user, setUser] = React.useState<{ name?: string; email?: string; image?: string } | null>(null)

  React.useEffect(() => {
    const storedLang = typeof window !== "undefined" && localStorage.getItem("prefLanguage")
    const storedTheme = typeof window !== "undefined" && localStorage.getItem("prefTheme")
    if (storedLang === "fr") setLanguage("fr")
    if (storedTheme === "dark") setDark(true)
    if (storedTheme === "light") setDark(false)
    try {
      const name = localStorage.getItem("userName")
      const email = localStorage.getItem("userEmail")
      const image = localStorage.getItem("userImage")
      if (name || email || image) setUser({ name: name ?? undefined, email: email ?? undefined, image: image ?? undefined })
    } catch (e) {
        console.error("Failed to load user info", e)
    }
  }, [])

  React.useEffect(() => {
    try {
      localStorage.setItem("prefLanguage", language)
    } catch (e) {
        console.error("Failed to save language preference", e)
    }
  }, [language])

  React.useEffect(() => {
    try {
      localStorage.setItem("prefTheme", dark ? "dark" : "light")
    } catch (e) {
        console.error("Failed to save theme preference", e)
    }

    if (typeof document !== "undefined") {
      const root = document.documentElement
      if (dark) root.classList.add("dark")
      else root.classList.remove("dark")
    }
  }, [dark])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className={cn("rounded-full p-2 text-muted-foreground", className)} aria-label="Settings">
          <Settings className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-sm">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>Adjust language and theme preferences.</SheetDescription>
        </SheetHeader>

        {/* Mobile-only user details + logout */}
        <div className="px-4 md:hidden">
          <div className="flex items-center gap-3 py-4">
            <div className="h-10 w-10 rounded-md bg-primary flex items-center justify-center">
              <span className="text-sm font-semibold text-primary-foreground">{(user?.name ?? "?")[0]}</span>
            </div>
            <div className="flex-1">
              <div className="font-medium">{user?.name ?? "Guest"}</div>
              <div className="text-xs text-muted-foreground">{user?.email ?? "Student"}</div>
            </div>
            <div>
              <Button variant="ghost" onClick={() => {
                try {
                  localStorage.removeItem("userName"); localStorage.removeItem("userEmail"); localStorage.removeItem("userImage")
                } catch (e) {
                    console.error("Failed to clear user info", e)
                }
                // simple logout: reload page
                if (typeof window !== "undefined") window.location.reload()
              }}>Logout</Button>
            </div>
          </div>
        </div>

        <div className="p-4 pt-0">
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">Language</label>
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2">
                <input
                  name="language"
                  type="radio"
                  value="en"
                  checked={language === "en"}
                  onChange={() => setLanguage("en")}
                />
                <span className="text-sm">English</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  name="language"
                  type="radio"
                  value="fr"
                  checked={language === "fr"}
                  onChange={() => setLanguage("fr")}
                />
                <span className="text-sm">Français</span>
              </label>
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">Theme</label>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm">Light / Dark</div>
                <div className="text-xs text-muted-foreground">Toggle between light and dark themes</div>
              </div>
              <Switch checked={dark} onCheckedChange={(v) => setDark(Boolean(v))} />
            </div>
          </div>
        </div>

        <SheetFooter>
          <div className="flex w-full items-center justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button onClick={() => setOpen(false)}>Save</Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
