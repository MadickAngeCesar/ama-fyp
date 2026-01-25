/**
 * ChatMessageList component
 * Renders a scrollable list of chat messages with loading and error states.
 *
 * @component
 * @param props.messages - Array of chat messages to display
 * @param props.loading - Whether a message is being sent/received
 * @param props.error - Optional error message to display
 */
import { ChatMessage } from "./ChatPanel";
import { ScrollArea } from "../ui/scroll-area";
import { Spinner } from "../ui/spinner";

interface ChatMessageListProps {
  messages: ChatMessage[];
  loading?: boolean;
  error?: string | null;
}

export default function ChatMessageList({ messages, loading, error }: ChatMessageListProps) {
  return (
    <ScrollArea className="flex-1 h-full px-4 py-2 overflow-y-auto">
      <div className="flex flex-col gap-3 pb-4">
        {messages.length === 0 && !loading && !error && (
          <div className="text-center text-muted-foreground mt-12">No messages yet. Start the conversation!</div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`rounded-lg px-4 py-2 max-w-[75%] shadow-sm text-sm whitespace-pre-line ${
                msg.sender === "user"
                  ? "bg-primary text-primary-foreground rounded-br-none"
                  : "bg-muted text-foreground rounded-bl-none border"
              }`}
            >
              {msg.content}
              <div className="text-xs text-muted-foreground mt-1 text-right">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-lg px-4 py-2 bg-muted text-foreground max-w-[75%] shadow-sm text-sm flex items-center gap-2">
              <Spinner className="w-4 h-4" />
              <span>AI is typing...</span>
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
