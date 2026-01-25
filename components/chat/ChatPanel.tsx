"use client";
/**
 * ChatPanel component
 * Main chat interface for student inquiries and AI chatbot interaction.
 * Renders chat messages, input box, and handles UI states.
 *
 * @component
 */
import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useState } from "react";

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  content: string;
  createdAt: string;
}

export default function ChatPanel() {
  // Placeholder state for messages
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles sending a new chat message.
   * @param message - The message content to send
   */
  const handleSend = async (message: string) => {
    if (!message.trim()) return;
    setLoading(true);
    setError(null);
    // Add user message optimistically
    const userMsg: ChatMessage = {
      id: `${Date.now()}`,
      sender: "user",
      content: message,
      createdAt: new Date().toISOString(),
    };
    setMessages((msgs) => [...msgs, userMsg]);
    try {
      // TODO: Call backend API for AI response
      // Simulate AI response for now
      const aiMsg: ChatMessage = {
        id: `${Date.now()}-ai`,
        sender: "ai",
        content: "This is a sample AI response.",
        createdAt: new Date().toISOString(),
      };
      setTimeout(() => {
        setMessages((msgs) => [...msgs, aiMsg]);
        setLoading(false);
      }, 900);
    } catch {
      setError("Failed to send message. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="border-b bg-muted/50">
        <CardTitle className="text-lg font-semibold tracking-tight">Student Support Chat</CardTitle>
        <p className="text-sm text-muted-foreground">Chat with our AI assistant or escalate to staff if needed.</p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <ChatMessageList messages={messages} loading={loading} error={error} />
      </CardContent>
      <div className="border-t p-4 bg-background">
        <ChatInput onSend={handleSend} disabled={loading} />
      </div>
    </Card>
  );
}
