"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Send, MessageSquare } from "lucide-react";

interface ChatSession {
  id: string;
  title: string;
  user: {
    id: string;
    name: string;
  };
  messages: Array<{
    id: string;
    sender: "USER" | "AI" | "STAFF";
    content: string;
    createdAt: string;
  }>;
  lastActivity: string;
}

interface StaffChatPanelProps {
  sessionId?: string;
}

export default function StaffChatPanel({ sessionId }: StaffChatPanelProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch escalated chat sessions
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch('/api/staff/chat/sessions');
        if (response.ok) {
          const data = await response.json();
          setSessions(data);
        }
      } catch (error) {
        console.error('Failed to fetch chat sessions:', error);
      }
    };

    fetchSessions();
  }, []);

  // Load selected session messages
  useEffect(() => {
    if (selectedSession) {
      // Messages are already included in selectedSession
    }
  }, [selectedSession]);

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedSession) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/chat/${selectedSession.id}/staff-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      if (response.ok) {
        // Add message to local state
        const newMessage = {
          id: Date.now().toString(),
          sender: "STAFF" as const,
          content: message,
          createdAt: new Date().toISOString(),
        };

        setSelectedSession(prev => prev ? {
          ...prev,
          messages: [...prev.messages, newMessage]
        } : null);

        setMessage("");
        toast.success("Message sent");
      } else {
        toast.error("Failed to send message");
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-full gap-4">
      {/* Sessions List */}
      <Card className="w-80 flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Escalated Chats
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-2">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={`p-3 rounded-lg border cursor-pointer hover:bg-muted/50 ${
                    selectedSession?.id === session.id ? 'bg-muted' : ''
                  }`}
                  onClick={() => setSelectedSession(session)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {session.user.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm">{session.user.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {session.title || 'Untitled Chat'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(session.lastActivity).toLocaleDateString()}
                  </p>
                </div>
              ))}
              {sessions.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No escalated chats
                </p>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="flex-1 flex flex-col">
        {selectedSession ? (
          <>
            <CardHeader className="border-b">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarFallback>
                    {selectedSession.user.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{selectedSession.user.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {selectedSession.title || 'Untitled Chat'}
                  </p>
                </div>
                <Badge variant="destructive" className="ml-auto">
                  Escalated
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {selectedSession.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-2 ${msg.sender === 'STAFF' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.sender !== 'STAFF' && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {msg.sender === 'USER' ? selectedSession.user.name?.charAt(0) || 'U' : 'AI'}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          msg.sender === 'STAFF'
                            ? 'bg-primary text-primary-foreground'
                            : msg.sender === 'AI'
                            ? 'bg-muted'
                            : 'bg-muted/50'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {formatTime(msg.createdAt)}
                        </p>
                      </div>
                      {msg.sender === 'STAFF' && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">S</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your response..."
                    className="min-h-15 resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    loading={loading}
                    size="icon"
                    className="self-end"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a chat session to start responding</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}