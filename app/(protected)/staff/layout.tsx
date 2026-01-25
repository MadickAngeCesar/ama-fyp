import DesktopSidebar from "@/components/layout/desktop-sidebar"
import Header from "@/components/layout/header"
import MobileNavigation from "@/components/layout/mobile-navigation"

/**
 * Dashboard layout for staff area.
 * Renders the Desktop Sidebar and a main content region for dashboard pages.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const primaryItems = [
    { label: "Dashboard", href: "/staff", icon: "dashboard" },
    { label: "Chat", href: "/staff/chat", icon: "chat" },
  ]

  const secondaryItems = [
    { label: "Complaints", href: "/staff/complaint", icon: "complaint" },
    { label: "Suggestions", href: "/staff/suggestion", icon: "suggestion" },
  ]

  const mobileItems = [
    { label: "Home", href: "/staff", icon: "home" },
    { label: "Chat", href: "/staff/chat", icon: "chat" },
    { label: "Complaints", href: "/staff/complaint", icon: "complaint" },
    { label: "Suggestions", href: "/staff/suggestion", icon: "suggestion" },
  ]
  return (
    <div className="flex h-screen w-full bg-background">
      {/* Sidebar: fixed width, full height */}
      <aside className="hidden md:flex h-full w-72 shrink-0">
        <DesktopSidebar primaryItems={primaryItems} secondaryItems={secondaryItems} portal="Staff" />
      </aside>
      {/* Main area: header + content, fills remaining space */}
      <div className="flex min-w-0 flex-1 flex-col h-full">
        <Header title="Staff Dashboard" portal="Staff" />
        <main className="flex-1 min-h-0 overflow-auto p-6">{children}</main>
        <MobileNavigation items={mobileItems} />
      </div>
    </div>
  )
}
