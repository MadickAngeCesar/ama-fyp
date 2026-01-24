"use client";
import React from "react";
import { Message } from "./types";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  message: Message;
};

export default function MessageBubble({ message }: Props) {
  const isUser = message.sender === 'USER';
  const isAI = message.sender === 'AI';
  const isStaff = message.sender === 'STAFF';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <Card className={`max-w-[70%] ${isUser ? 'bg-primary text-primary-foreground' : isAI ? 'bg-surface-muted' : 'bg-secondary'}`}>
        <CardContent className="p-3">
          <p className="text-sm">{message.content}</p>
          <div className="text-xs opacity-70 mt-1">
            {new Date(message.createdAt).toLocaleTimeString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}