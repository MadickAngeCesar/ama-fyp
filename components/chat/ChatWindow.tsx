"use client";
import React, { useRef, useEffect } from "react";
import { Message } from "./types";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";

type Props = {
  messages: Message[];
  onSend: (message: string) => void;
  loading?: boolean;
};

export default function ChatWindow({ messages, onSend, loading }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-150 border rounded-lg">
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            Start a conversation with the AI assistant.
          </div>
        ) : (
          messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
        )}
        {loading && (
          <div className="flex justify-start mb-4">
            <div className="bg-surface-muted p-3 rounded-lg">
              <div className="text-sm text-muted-foreground">AI is typing...</div>
            </div>
          </div>
        )}
      </ScrollArea>
      <ChatInput onSend={onSend} disabled={loading} />
    </div>
  );
}