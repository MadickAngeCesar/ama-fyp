/**
 * Chat UI types
 */
export interface Message {
  id: string;
  sender: 'USER' | 'AI' | 'STAFF';
  content: string;
  createdAt: string;
}

export interface ChatSession {
  id: string;
  title?: string;
  lastActivity: string;
  messages: Message[];
}