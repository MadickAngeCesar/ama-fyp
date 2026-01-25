"use client";
import DesktopSidebar from "@/components/layout/desktop-sidebar"
import Header from "@/components/layout/header"
import MobileNavigation from "@/components/layout/mobile-navigation"
import { useTranslation } from "react-i18next"

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
