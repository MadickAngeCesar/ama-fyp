"use client"

import * as React from "react"
import { Bell } from "lucide-react"
import { useTranslation } from "react-i18next"

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
import { cn } from "@/lib/utils"

type Notification = {
  id: string
  title: string
  body?: string
  time?: string
  read?: boolean
}

/**
 * NotificationsSheet
 *
 * Displays a sheet with a short list of notifications. Notifications are
 * persisted to localStorage for demo purposes and can be marked read or cleared.
 */
export default function NotificationsSheet({ className }: { className?: string }) {
  const { t } = useTranslation()
  const [open, setOpen] = React.useState(false)
  const [items, setItems] = React.useState<Notification[]>([])

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("Notifications")
      if (raw) setItems(JSON.parse(raw))
      else {
        const seed: Notification[] = [
          { id: "1", title: "Welcome to the portal", body: "Get started by creating a complaint.", time: "now", read: false },
          { id: "2", title: "Suggestion accepted", body: "Your suggestion was upvoted.", time: "1d", read: false },
        ]
        setItems(seed)
      }
    } catch (e) {
        console.error("Failed to load notifications", e)
      setItems([])
    }
  }, [])

  React.useEffect(() => {
    try {
      localStorage.setItem("Notifications", JSON.stringify(items))
    } catch (e) {
        console.error("Failed to save notifications", e)
    }
  }, [items])

  function markRead(id: string) {
    setItems((s) => s.map((it) => (it.id === id ? { ...it, read: true } : it)))
  }

  function clearAll() {
    setItems([])
  }

  const unreadCount = items.filter((i) => !i.read).length

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className={cn("relative rounded-full p-2 text-muted-foreground", className)} aria-label="Notifications">
          <Bell className="size-5" />
          {unreadCount > 0 && <span className="absolute -right-0.5 -top-0.5 block h-2 w-2 rounded-full bg-primary" />}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full max-w-sm">
        <SheetHeader>
          <SheetTitle>{t('notifications.title')}</SheetTitle>
          <SheetDescription>{t('notifications.description')}</SheetDescription>
        </SheetHeader>

        <div className="divide-y overflow-auto">
          {items.length === 0 && <div className="p-4 text-sm text-muted-foreground">{t('notifications.none')}</div>}
          {items.map((n) => (
            <div key={n.id} className="flex items-start gap-3 p-4">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">{n.title}</div>
                  <div className="text-xs text-muted-foreground">{n.time}</div>
                </div>
                {n.body && <div className="text-sm text-muted-foreground mt-1">{n.body}</div>}
                <div className="mt-2">
                  {!n.read ? (
                    <Button variant="ghost" size="sm" onClick={() => markRead(n.id)}>
                      {t('notifications.markRead')}
                    </Button>
                  ) : (
                    <span className="text-xs text-muted-foreground">{t('notifications.read')}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <SheetFooter>
          <div className="flex w-full items-center justify-between gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t('settings.close')}
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={clearAll} disabled={items.length === 0}>
                {t('notifications.clearAll')}
              </Button>
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
