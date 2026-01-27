"use client";
import DesktopSidebar from "@/components/layout/desktop-sidebar"
import Header from "@/components/layout/header"
import MobileNavigation from "@/components/layout/mobile-navigation"
import { useTranslation } from "react-i18next"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"

/**
 * Dashboard layout for staff area.
 * Renders the Desktop Sidebar and a main content region for dashboard pages.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { t } = useTranslation()
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/')
      return
    }
    if (user) {
      fetch('/api/users/role')
        .then(res => res.json())
        .then(data => {
          if (data.role === 'STAFF') {
            setAuthorized(true)
          } else {
            router.push(`/${data.role.toLowerCase()}`)
          }
        })
        .catch(() => {
          router.push('/sign-in')
        })
    }
  }, [user, isLoaded, router])

  if (!authorized) {
    return <div>Loading...</div>
  }

  const primaryItems = [
    { label: t('nav.dashboard'), href: "/staff", icon: "dashboard" },
    { label: t('nav.chat'), href: "/staff/chat", icon: "chat" },
  ]

  const secondaryItems = [
    { label: t('nav.complaint'), href: "/staff/complaint", icon: "complaint" },
    { label: t('nav.suggestion'), href: "/staff/suggestion", icon: "suggestion" },
  ]

  const mobileItems = [
    { label: t('nav.home'), href: "/staff", icon: "home" },
    { label: t('nav.chat'), href: "/staff/chat", icon: "chat" },
    { label: t('nav.complaint'), href: "/staff/complaint", icon: "complaint" },
    { label: t('nav.suggestion'), href: "/staff/suggestion", icon: "suggestion" },
  ]
  return (
    <div className="flex h-screen w-full bg-background">
      {/* Sidebar: fixed width, full height */}
      <aside className="hidden md:flex h-full w-72 shrink-0">
        <DesktopSidebar primaryItems={primaryItems} secondaryItems={secondaryItems} portal="Staff" />
      </aside>
      {/* Main area: header + content, fills remaining space */}
      <div className="flex min-w-0 flex-1 flex-col h-full">
        <Header title={t('staff.dashboard.title')} portal="Staff" />
        <main className="flex-1 min-h-0 overflow-auto p-6">{children}</main>
        <MobileNavigation items={mobileItems} />
      </div>
    </div>
  )
}
