/**
 * ChatMessageList component
 * Renders a scrollable list of chat messages with loading and error states.
 *
 * @component
 * @param props.messages - Array of chat messages to display
 * @param props.loading - Whether a message is being sent/received
 * @param props.error - Optional error message to display
 * @param props.onEditMessage - Callback to edit a user message
 */
import { ChatMessage } from "@/hooks/useChat";
import { ScrollArea } from "../ui/scroll-area";
import { Spinner } from "../ui/spinner";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";
import { Copy, Volume2, VolumeX, Edit } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface ChatMessageListProps {
  messages: ChatMessage[];
  loading?: boolean;
  error?: string | null;
  // Callback may perform async work and return a Promise
  onEditMessage?: (messageId: string, newContent: string) => void | Promise<void>;
}

function isPromise<T = unknown>(p: unknown): p is Promise<T> {
  return Boolean(p && typeof (p as { then?: unknown }).then === "function");
}

export default function ChatMessageList({ messages, loading, error, onEditMessage }: ChatMessageListProps) {
  const { t } = useTranslation();
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  // Cleanup speech synthesis when component unmounts
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  /**
   * Copies the message content to clipboard
   */
  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Message copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy message", { description: (error as Error).message });
    }
  };

  /**
   * Reads the message content aloud using speech synthesis or stops if already reading
   */
  const handleReadAloud = (messageId: string, content: string) => {
    if (!('speechSynthesis' in window)) {
      toast.error("Speech synthesis not supported in this browser");
      return;
    }

    // If this message is currently being read, stop it
    if (speakingMessageId === messageId) {
      speechSynthesis.cancel();
      setSpeakingMessageId(null);
      toast.success("Reading stopped");
      return;
    }

    // Stop any currently playing speech
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }

    // Start reading the new message
    const utterance = new SpeechSynthesisUtterance(content);
    setSpeakingMessageId(messageId);

    // Handle when speech ends
    utterance.onend = () => {
      setSpeakingMessageId(null);
    };

    // Handle speech errors
    utterance.onerror = () => {
      setSpeakingMessageId(null);
      toast.error("Error occurred while reading");
    };

    speechSynthesis.speak(utterance);
    toast.success("Reading message aloud");
  };

  /**
   * Starts editing a user message
   */
  const handleStartEdit = (message: ChatMessage) => {
    setEditingMessageId(message.id);
    setEditContent(message.content);
  };

  /**
   * Saves the edited message
   */
  const handleSaveEdit = async () => {
    if (editingMessageId && onEditMessage && editContent.trim()) {
      try {
        const res = onEditMessage(editingMessageId, editContent.trim());
        if (isPromise(res)) {
          setSaving(true);
          await res;
        }
        setEditingMessageId(null);
        setEditContent("");
        toast.success("Message updated");
      } catch (err) {
        console.error("Failed to save edit", err);
        toast.error("Failed to save edit");
      } finally {
        setSaving(false);
      }
    }
  };

  /**
   * Cancels editing
   */
  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditContent("");
  };

  return (
    <ScrollArea className="flex-1 h-full px-4 py-2 overflow-y-auto">
      <div className="flex flex-col gap-3 pb-4">
        {messages.length === 0 && !loading && !error && (
          <div className="text-center text-muted-foreground mt-12">{t('chat.noMessages')}</div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className="flex flex-col max-w-[75%]">
              <div
                className={`rounded-lg px-4 py-2 shadow-sm text-sm whitespace-pre-line relative group ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-muted text-foreground rounded-bl-none border"
                }`}
              >
                {editingMessageId === msg.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full bg-transparent border-none outline-none resize-none text-sm"
                      rows={Math.max(2, editContent.split('\n').length)}
                      autoFocus
                    />
                    <div className="flex gap-2 justify-end">
                      <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSaveEdit} loading={saving} loadingText={"Saving..."} disabled={!editContent.trim()}>
                        Save
                      </Button>
                    </div>
                  </div>
                  ) : (
                  <>
                    {msg.sender === 'ai' ? (
                      <div className="prose dark:prose-invert max-w-full wrap-break-word">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                    {/* Action buttons */}
                    <div className={`flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}>
                      {msg.sender === "ai" && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 hover:bg-muted-foreground/20"
                            onClick={() => handleCopy(msg.content)}
                            title="Copy message"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 hover:bg-muted-foreground/20"
                            onClick={() => handleReadAloud(msg.id, msg.content)}
                            title={speakingMessageId === msg.id ? "Stop reading" : "Read aloud"}
                          >
                            {speakingMessageId === msg.id ? (
                              <VolumeX className="h-3 w-3" />
                            ) : (
                              <Volume2 className="h-3 w-3" />
                            )}
                          </Button>
                        </>
                      )}
                      {msg.sender === "user" && onEditMessage && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 hover:bg-muted-foreground/20"
                          onClick={() => handleStartEdit(msg)}
                          title="Edit message"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </div>
              <div className={`text-xs text-muted-foreground mt-1 ${
                msg.sender === "user" ? "text-right" : "text-left"
              }`}>
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-lg px-4 py-2 bg-muted text-foreground max-w-[75%] shadow-sm text-sm flex items-center gap-2">
              <Spinner className="w-4 h-4" />
              <span>{t('chat.typing')}</span>
            </div>
          </div>
        )}
        {error && (
          <div className="text-center text-destructive mt-2">{error}</div>
        )}
      </div>
    </ScrollArea>
  );
}
