import DesktopSidebar from "@/components/layout/desktop-sidebar"
import Header from "@/components/layout/header"
import MobileNavigation from "@/components/layout/mobile-navigation"

/**
 * Dashboard layout for student area.
 * Renders the Desktop Sidebar and a main content region for dashboard pages.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const primaryItems = [
    { label: "Dashboard", href: "/students", icon: "home" },
    { label: "Chat", href: "/students/chat", icon: "chat" },
  ]

  const secondaryItems = [
    { label: "Complaints", href: "/students/complaint", icon: "complaint" },
    { label: "Suggestions", href: "/students/suggestion", icon: "suggestion" },
  ]

  const mobileItems = [
    { label: "Home", href: "/students", icon: "home" },
    { label: "Chat", href: "/students/chat", icon: "chat" },
    { label: "Complaints", href: "/students/complaint", icon: "complaint" },
    { label: "Suggestions", href: "/students/suggestion", icon: "suggestion" },
  ]
  return (
    <div className="flex h-screen w-full bg-background">
      {/* Sidebar: fixed width, full height */}
      <aside className="hidden md:flex h-full w-72 shrink-0">
        <DesktopSidebar primaryItems={primaryItems} secondaryItems={secondaryItems} portal="Student" />
      </aside>
      {/* Main area: header + content, fills remaining space */}
      <div className="flex min-w-0 flex-1 flex-col h-full">
        <Header title="Student Dashboard" portal="Student" />
        <main className="flex-1 min-h-0 overflow-auto p-6">{children}</main>
        <MobileNavigation items={mobileItems} />
      </div>
    </div>
  )
}
