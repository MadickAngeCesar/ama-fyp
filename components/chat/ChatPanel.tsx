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
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { AlertTriangle, RotateCcw, Trash2, User } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useChat, ChatMessage } from "@/hooks/useChat";

export default function ChatPanel() {
  const { t } = useTranslation();
  // Placeholder state for messages
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  // New state for enhancements
  const [showEscalateDialog, setShowEscalateDialog] = useState(false);
  const [escalationType, setEscalationType] = useState<
    "complaint" | "suggestion"
  >("complaint");
  const [escalationCategory, setEscalationCategory] = useState("");
  const [escalationPriority, setEscalationPriority] = useState<
    "low" | "medium" | "high"
  >("medium");
  const [escalationDescription, setEscalationDescription] = useState("");
  const [isEscalating, setIsEscalating] = useState(false);

  // Use the chat hook with debouncing and retry logic
  const { sendMessage, cancelPending, hasPendingMessage, loading, sessionId } =
    useChat({
      debounceMs: 500, // 500ms debounce
      onMessageSent: (message) => {
        setMessages((msgs) => [...msgs, message]);
        setError(null);
      },
      onResponseReceived: (response) => {
        setMessages((msgs) => [...msgs, response]);
      },
      onError: (errorMsg) => {
        setError(errorMsg);
      },
    });

  /**
   * Handles sending a new chat message with debouncing and retry logic.
   * @param message - The message content to send
   */
  const handleSend = async (message: string) => {
    await sendMessage(message);
  };

  /**
   * Handles escalating the current chat session to staff.
   */
  const handleEscalate = async () => {
    if (!sessionId) {
      toast.error("No active chat session to escalate");
      return;
    }

    setIsEscalating(true);
    try {
      const escalationData = {
        type: escalationType,
        category: escalationCategory,
        priority: escalationPriority,
        description:
          escalationDescription ||
          `Escalated from chat session. Last message: ${messages[messages.length - 1]?.content || "N/A"}`,
      };

      const response = await fetch(`/api/chat/${sessionId}/escalate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(escalationData),
      });

      if (!response.ok) {
        throw new Error("Failed to escalate chat");
      }

      const data = await response.json();

      toast.success(
        escalationType === "complaint"
          ? "Chat escalated to complaint successfully"
          : "Chat escalated to suggestion successfully",
      );

      setShowEscalateDialog(false);
      setEscalationDescription("");

      // Optionally clear the chat or show a message
      const systemMsg: ChatMessage = {
        id: `${Date.now()}-system`,
        sender: "ai",
        content: `Your chat has been escalated to a ${escalationType}. A staff member will review it shortly. Reference ID: ${data.complaintId || data.suggestionId}`,
        createdAt: new Date().toISOString(),
      };
      setMessages((msgs) => [...msgs, systemMsg]);
    } catch (error) {
      console.error("Escalation error:", error);
      toast.error("Failed to escalate chat. Please try again.");
    } finally {
      setIsEscalating(false);
    }
  };

  /**
   * Clears the current chat session.
   */
  const handleClearChat = () => {
    setMessages([]);
    setError(null);
    toast.success("Chat cleared");
  };

  /**
   * Handles editing a user message and regenerating the AI response
   */
  const handleEditMessage = async (messageId: string, newContent: string) => {
    // Find the message to edit
    const messageIndex = messages.findIndex((msg) => msg.id === messageId);
    if (messageIndex === -1) return;

    // Update the message content
    const updatedMessages = [...messages];
    updatedMessages[messageIndex] = {
      ...updatedMessages[messageIndex],
      content: newContent,
    };

    // Remove all messages after the edited message (including AI responses)
    const messagesToKeep = updatedMessages.slice(0, messageIndex + 1);
    setMessages(messagesToKeep);

    // Regenerate AI response for the edited message using the hook
    await sendMessage(newContent);
  };

  /**
   * Regenerates the last AI response.
   */
  const handleRegenerate = async () => {
    if (messages.length < 2) return;

    const lastUserMessage = [...messages]
      .reverse()
      .find((msg) => msg.sender === "user");
    if (!lastUserMessage) return;

    // Remove the last AI response
    setMessages((msgs) => msgs.slice(0, -1));

    // Regenerate using the hook
    await sendMessage(lastUserMessage.content);
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="border-b bg-muted/50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold tracking-tight">
              {t("chat.title")}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {t("chat.description")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {sessionId && (
              <Badge variant="outline" className="text-xs">
                Session Active
              </Badge>
            )}
            <div className="flex gap-1">
              {messages.length > 0 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRegenerate}
                    loading={loading}
                    loadingText={"Regenerating..."}
                    title="Regenerate last response"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearChat}
                    title="Clear chat"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>{" "}
                  <Dialog
                    open={showEscalateDialog}
                    onOpenChange={setShowEscalateDialog}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={!sessionId || messages.length === 0}
                        title="Escalate to staff"
                      >
                        <User className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-orange-500" />
                          Escalate Chat to Staff
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">
                            Escalation Type
                          </label>
                          <Select
                            value={escalationType}
                            onValueChange={(
                              value: "complaint" | "suggestion",
                            ) => setEscalationType(value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="complaint">
                                Submit as Complaint
                              </SelectItem>
                              <SelectItem value="suggestion">
                                Submit as Suggestion
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-sm font-medium">
                            Category
                          </label>
                          <Select
                            value={escalationCategory}
                            onValueChange={setEscalationCategory}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="academic">Academic</SelectItem>
                              <SelectItem value="administrative">
                                Administrative
                              </SelectItem>
                              <SelectItem value="technical">
                                Technical
                              </SelectItem>
                              <SelectItem value="facilities">
                                Facilities
                              </SelectItem>
                              <SelectItem value="financial">
                                Financial
                              </SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-sm font-medium">
                            Priority
                          </label>
                          <Select
                            value={escalationPriority}
                            onValueChange={(value: "low" | "medium" | "high") =>
                              setEscalationPriority(value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low Priority</SelectItem>
                              <SelectItem value="medium">
                                Medium Priority
                              </SelectItem>
                              <SelectItem value="high">
                                High Priority
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-sm font-medium">
                            Additional Details (Optional)
                          </label>
                          <Textarea
                            placeholder="Provide any additional context or details..."
                            value={escalationDescription}
                            onChange={(e) =>
                              setEscalationDescription(e.target.value)
                            }
                            rows={3}
                          />
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            onClick={() => setShowEscalateDialog(false)}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleEscalate}
                            disabled={!escalationCategory}
                            loading={isEscalating}
                            loadingText={"Escalating..."}
                            className="flex-1"
                          >
                            {`Escalate as ${escalationType}`}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <ChatMessageList
          messages={messages}
          loading={loading}
          error={error}
          onEditMessage={handleEditMessage}
        />
      </CardContent>
      <div className="border-t p-4 bg-background">
        <ChatInput
          onSend={handleSend}
          disabled={loading}
          hasPendingMessage={hasPendingMessage()}
          onCancel={cancelPending}
        />
        {messages.length > 0 && (
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>{messages.length} messages in session</span>
            <span>Session Id: {sessionId ? sessionId.slice(-8) : "New"}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
