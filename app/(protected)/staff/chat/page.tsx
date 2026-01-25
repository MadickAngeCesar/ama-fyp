/**
 * Chat Dashboard Page for students.
 * Provides a professional chat UI for student inquiries and AI chatbot interaction.
 * Uses shadcn/ui components for layout and styling.
 */
import ChatPanel from "@/components/chat/ChatPanel";

export default function Page() {
  return (
    <main className="flex flex-col h-[calc(100vh-4rem)] max-w-2xl mx-auto bg-background rounded-lg shadow-lg border mt-6">
      <ChatPanel />
    </main>
  );
}