"use client";
/**
 * ChatInput component
 * Renders a text input and send button for chat messages.
 *
 * @component
 * @param props.onSend - Callback when a message is sent
 * @param props.disabled - Whether the input is disabled
 */
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");

  /**
   * Handles sending the message and clearing the input.
   * @param e - Form event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSend(value);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        placeholder="Type your message..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        className="flex-1"
        aria-label="Chat message input"
        autoComplete="off"
      />
      <Button type="submit" disabled={disabled || !value.trim()} aria-label="Send message">
        Send
      </Button>
    </form>
  );
}
