import StudentSidebar from "@/components/layout/students/sidebar"
import StudentHeader from "@/components/layout/students/header"
import MobileNavigation from "@/components/layout/students/mobile-navigation"

/**
 * Dashboard layout for student area.
 * Renders the student sidebar and a main content region for dashboard pages.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen w-full bg-background">
      {/* Sidebar: fixed width, full height */}
      <aside className="hidden md:flex h-full w-72 shrink-0">
        <StudentSidebar />
      </aside>
      {/* Main area: header + content, fills remaining space */}
      <div className="flex min-w-0 flex-1 flex-col h-full">
        <StudentHeader />
        <main className="flex-1 min-h-0 overflow-auto p-6">{children}</main>
        <MobileNavigation />
      </div>
    </div>
  )
}
