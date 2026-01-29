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
  type: string
  read: boolean
  createdAt: string
}

/**
 * NotificationsSheet
 *
 * Displays a sheet with notifications fetched from the API.
 */
export default function NotificationsSheet({ className }: { className?: string }) {
  const { t } = useTranslation()
  const [open, setOpen] = React.useState(false)
  const [items, setItems] = React.useState<Notification[]>([])
  const [loading, setLoading] = React.useState(false)
  const [markingIds, setMarkingIds] = React.useState<string[]>([])
  const [clearing, setClearing] = React.useState(false)

  const fetchNotifications = React.useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/notifications')
      if (response.ok) {
        const data = await response.json()
        setItems(data)
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    if (open) {
      fetchNotifications()
    }
  }, [open, fetchNotifications])

  const markRead = async (id: string) => {
    try {
      setMarkingIds((s) => [...s, id]);
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: 'POST',
      })
      if (response.ok) {
        setItems((s) => s.map((it) => (it.id === id ? { ...it, read: true } : it)))
      }
    } catch (error) {
      console.error("Failed to mark notification as read", error)
    } finally {
      setMarkingIds((s) => s.filter((x) => x !== id));
    }
  }

  const clearAll = async () => {
    try {
      setClearing(true);
      const response = await fetch('/api/notifications/clear', {
        method: 'POST',
      })
      if (response.ok) {
        setItems([])
      }
    } catch (error) {
      console.error("Failed to clear notifications", error)
    } finally {
      setClearing(false);
    }
  }

  const unreadCount = items.filter((i) => !i.read).length

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          className={cn("relative rounded-full p-2 text-muted-foreground", className)} 
          aria-label="Notifications"
          suppressHydrationWarning
        >
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
          {loading && <div className="p-4 text-sm text-muted-foreground">Loading...</div>}
          {!loading && items.length === 0 && <div className="p-4 text-sm text-muted-foreground">{t('notifications.none')}</div>}
          {!loading && items.map((n) => (
            <div key={n.id} className="flex items-start gap-3 p-4">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">{n.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </div>
                </div>
                {n.body && <div className="text-sm text-muted-foreground mt-1">{n.body}</div>}
                <div className="mt-2">
                  {!n.read ? (
                    <Button variant="ghost" size="sm" onClick={() => markRead(n.id)} loading={markingIds.includes(n.id)} loadingText={t('notifications.marking') ?? 'Marking...'}>
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
              <Button variant="ghost" onClick={clearAll} disabled={items.length === 0} loading={clearing} loadingText={t('notifications.clearing') ?? 'Clearing...'}>
                {t('notifications.clearAll')}
              </Button>
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
