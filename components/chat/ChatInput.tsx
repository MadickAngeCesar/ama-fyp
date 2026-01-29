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
import { useTranslation } from "react-i18next";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  hasPendingMessage?: boolean;
  onCancel?: () => void;
}

export default function ChatInput({ onSend, disabled, hasPendingMessage, onCancel }: ChatInputProps) {
  const { t } = useTranslation()
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

  /**
   * Handles canceling the pending message.
   */
  const handleCancel = () => {
    onCancel?.();
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        placeholder={hasPendingMessage ? t('chat.waiting') : t('chat.placeholder')}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled || hasPendingMessage}
        className="flex-1"
        aria-label="Chat message input"
        autoComplete="off"
      />
      {hasPendingMessage ? (
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          aria-label={t('chat.cancel')}
        >
          {t('chat.cancel')}
        </Button>
      ) : (
        <Button type="submit" disabled={disabled || !value.trim()} loading={disabled} loadingText={t('chat.sending') ?? 'Sending...'} aria-label={t('chat.send')}>
          {t('chat.send')}
        </Button>
      )}
    </form>
  );
}
