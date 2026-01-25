"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, MessageCircle, FileText, Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * MobileNavigation
 *
 * Bottom navigation bar for small screens. Shows primary navigation actions
 * and highlights the active route.
 */
export default function MobileNavigation() {
  const pathname = usePathname() ?? "/"

  const items = React.useMemo(
    () => [
      { label: "Home", href: "/students", Icon: Home },
      { label: "Chat", href: "/students/chat", Icon: MessageCircle },
      { label: "Complaints", href: "/students/complaint", Icon: FileText },
      { label: "Suggestions", href: "/students/suggestion", Icon: Lightbulb },
    ],
    []
  )

  const normalize = (p = "") => p.split("?")[0].replace(/\/+$/, "")
  const current = normalize(pathname)

  const activeHref = React.useMemo(() => {
    let best = ""
    for (const it of items) {
      const n = normalize(it.href)
      if (current === n || current.startsWith(n + "/")) {
        if (n.length > best.length) best = n
      }
    }
    return best
  }, [items, current])

  const isActive = (href: string) => normalize(href) === activeHref

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="mx-auto max-w-5xl px-safe flex items-center justify-between gap-2 border-t bg-surface p-2">
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 rounded-md px-3 py-2 text-xs",
              isActive(it.href) ? "text-primary" : "text-muted-foreground hover:text-primary"
            )}
            aria-current={isActive(it.href) ? "page" : undefined}
          >
            <it.Icon className="w-5 h-5" />
            <span className="truncate text-[11px]">{it.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
