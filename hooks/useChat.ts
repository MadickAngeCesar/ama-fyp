"use client";

/**
 * Custom hook for debounced chat functionality with retry logic
 */
import { useState, useCallback, useRef } from 'react';
import { fetchWithRetry, RetryConfig } from '@/lib/retry';

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  content: string;
  createdAt: string;
}

export interface UseChatOptions {
  debounceMs?: number;
  retryConfig?: RetryConfig;
  onMessageSent?: (message: ChatMessage) => void;
  onResponseReceived?: (response: ChatMessage) => void;
  onError?: (error: string) => void;
}

export function useChat(options: UseChatOptions = {}) {
  const {
    debounceMs = 500,
    retryConfig,
    onMessageSent,
    onResponseReceived,
    onError
  } = options;

  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingMessageRef = useRef<string | null>(null);

  /**
   * Send a chat message with debouncing and retry logic
   */
  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    // Clear any pending debounced request
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set pending message
    pendingMessageRef.current = message;

    // Debounce the actual send
    debounceTimeoutRef.current = setTimeout(async () => {
      const messageToSend = pendingMessageRef.current;
      if (!messageToSend) return;

      pendingMessageRef.current = null;
      setLoading(true);

      try {
        // Create user message
        const userMsg: ChatMessage = {
          id: `${Date.now()}`,
          sender: "user",
          content: messageToSend,
          createdAt: new Date().toISOString(),
        };

        onMessageSent?.(userMsg);

        // Send request with retry logic
        const response = await fetchWithRetry("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId,
            message: messageToSend,
          }),
        }, retryConfig);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setSessionId(data.sessionId);

        // Create AI response message
        const aiMsg: ChatMessage = {
          id: `${Date.now()}-ai`,
          sender: "ai",
          content: data.response,
          createdAt: new Date().toISOString(),
        };

        onResponseReceived?.(aiMsg);

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        onError?.(errorMessage);
      } finally {
        setLoading(false);
      }
    }, debounceMs);

  }, [debounceMs, retryConfig, sessionId, onMessageSent, onResponseReceived, onError]);

  /**
   * Cancel any pending debounced request
   */
  const cancelPending = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = null;
    }
    pendingMessageRef.current = null;
  }, []);

  /**
   * Check if there's a pending message
   */
  const hasPendingMessage = useCallback(() => {
    return pendingMessageRef.current !== null;
  }, []);

  return {
    sendMessage,
    cancelPending,
    hasPendingMessage,
    loading,
    sessionId,
  };
}