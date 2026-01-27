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
import { useTranslation } from "react-i18next";

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  content: string;
  createdAt: string;
}

export default function ChatPanel() {
  const { t } = useTranslation()
  // Placeholder state for messages
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

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
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();
      setSessionId(data.sessionId);

      // Add AI response
      const aiMsg: ChatMessage = {
        id: `${Date.now()}-ai`,
        sender: "ai",
        content: data.response,
        createdAt: new Date().toISOString(),
      };
      setMessages((msgs) => [...msgs, aiMsg]);
      setLoading(false);
    } catch {
      setError(t('chat.error'));
      setLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="border-b bg-muted/50">
        <CardTitle className="text-lg font-semibold tracking-tight">{t('staff.chat.title')}</CardTitle>
        <p className="text-sm text-muted-foreground">{t('staff.chat.description')}</p>
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
