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
 * StudentSettingsSheet
 *
 * A settings sheet for students that allows toggling language and theme.
 * Persists preferences to localStorage and applies theme by toggling `dark` class
 * on `document.documentElement`.
 */
export default function StudentSettingsSheet({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false)
  const [language, setLanguage] = React.useState<"en" | "fr">("en")
  const [dark, setDark] = React.useState(false)

  React.useEffect(() => {
    const storedLang = typeof window !== "undefined" && localStorage.getItem("prefLanguage")
    const storedTheme = typeof window !== "undefined" && localStorage.getItem("prefTheme")
    if (storedLang === "fr") setLanguage("fr")
    if (storedTheme === "dark") setDark(true)
    if (storedTheme === "light") setDark(false)
  }, [])

  React.useEffect(() => {
    try {
      localStorage.setItem("prefLanguage", language)
    } catch (e) {}
  }, [language])

  React.useEffect(() => {
    try {
      localStorage.setItem("prefTheme", dark ? "dark" : "light")
    } catch (e) {}

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
