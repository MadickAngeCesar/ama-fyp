import DesktopSidebar from "@/components/layout/desktop-sidebar"
import Header from "@/components/layout/header"
import MobileNavigation from "@/components/layout/mobile-navigation"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"

/**
 * Dashboard layout for admin area.
 * Renders the Desktop Sidebar and a main content region for dashboard pages.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') {
    redirect('/')
  }
  const primaryItems = [
    { label: "Dashboard", href: "/admin", icon: "dashboard" },
    { label: "Audit", href: "/admin/audit", icon: "audit" },
  ]

  const secondaryItems = [
    { label: "Users", href: "/admin/users", icon: "users" },
    { label: "Configuration", href: "/admin/configuration", icon: "configuration" },
  ]

  const mobileItems = [
    { label: "Home", href: "/admin", icon: "home" },
    { label: "Audit", href: "/admin/audit", icon: "audit" },
    { label: "Users", href: "/admin/users", icon: "users" },
    { label: "Configuration", href: "/admin/configuration", icon: "configuration" },
  ]
  return (
    <div className="flex h-screen w-full bg-background">
      {/* Sidebar: fixed width, full height */}
      <aside className="hidden md:flex h-full w-72 shrink-0">
        <DesktopSidebar primaryItems={primaryItems} secondaryItems={secondaryItems} portal="Admin" />
      </aside>
      {/* Main area: header + content, fills remaining space */}
      <div className="flex min-w-0 flex-1 flex-col h-full">
        <Header title="Admin Dashboard" portal="Admin" />
        <main className="flex-1 min-h-0 overflow-auto p-6">{children}</main>
        <MobileNavigation items={mobileItems} />
      </div>
    </div>
  )
}