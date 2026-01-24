import StudentSidebar from "@/components/layout/student-sidebar"

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
    <div className="flex h-screen">
      <aside className="hidden md:block">
        <StudentSidebar />
      </aside>
      <main className="flex-1 overflow-auto bg-background p-6">{children}</main>
    </div>
  )
}
