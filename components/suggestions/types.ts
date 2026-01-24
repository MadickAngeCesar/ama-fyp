/**
 * Suggestion domain types
 */
export interface Suggestion {
  id: string;
  title: string;
  description: string;
  authorName?: string;
  upvotes: number;
  createdAt: string;
}
