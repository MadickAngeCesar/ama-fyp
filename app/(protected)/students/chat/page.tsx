"use client";
import React, { useState } from "react";
import { chatSessions, messages } from "@/lib/placeholder-data";
import { Message, ChatSession } from "@/components/chat/types";
import ChatWindow from "@/components/chat/ChatWindow";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Page() {
  // Load initial session from placeholder data
  const initialSession: ChatSession = {
    id: chatSessions[0]?.id || 'session-1',
    title: chatSessions[0]?.title || 'WiFi Issue',
    lastActivity: chatSessions[0]?.lastActivity.toISOString() || new Date().toISOString(),
    messages: messages.map((m) => ({
      id: m.id,
      sender: m.sender,
      content: m.content,
      createdAt: m.createdAt.toISOString(),
    })),
  };

  const [session, setSession] = useState<ChatSession>(initialSession);
  const [loading, setLoading] = useState(false);

  const handleSend = async (content: string) => {
    const userMessage: Message = {
      id: String(Date.now()),
      sender: 'USER',
      content,
      createdAt: new Date().toISOString(),
    };

    setSession((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
    }));

    setLoading(true);

    // Simulate AI response (in real app, call API)
    setTimeout(() => {
      const aiMessage: Message = {
        id: String(Date.now() + 1),
        sender: 'AI',
        content: `Thank you for your message: "${content}". How can I assist you further?`,
        createdAt: new Date().toISOString(),
      };

      setSession((prev) => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
      }));

      setLoading(false);
    }, 1000);
  };

  const handleEscalate = () => {
    // In real app, call API to create complaint
    alert('Escalation feature: This would create a complaint from the chat.');
  };

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-6">
      <header className="flex items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold">AI Chat Assistant</h1>
          <p className="text-sm text-muted-foreground">Get help with your questions or escalate to a complaint.</p>
        </div>
        <div className="hidden sm:flex gap-2">
          <Button variant="outline" onClick={handleEscalate}>
            Escalate to Complaint
          </Button>
          <Button variant="ghost">Help</Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Chat Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="p-2 border rounded cursor-pointer bg-primary/10">
                  <div className="text-sm font-medium">{session.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(session.lastActivity).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        <main className="lg:col-span-3">
          <ChatWindow messages={session.messages} onSend={handleSend} loading={loading} />
        </main>
      </div>
    </div>
  );
}