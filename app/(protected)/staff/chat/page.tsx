/**
 * Chat Dashboard Page for staff.
 * Provides an interface for staff to respond to escalated student chats.
 */
import StaffChatPanel from "@/components/chat/StaffChatPanel";

export default function Page() {
  return (
    <main className="flex flex-col h-[calc(100vh-4rem)] max-w-7xl mx-auto bg-background rounded-lg shadow-lg border mt-6 p-6">
      <StaffChatPanel />
    </main>
  );
}