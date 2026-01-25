/**
 * Suggestion domain types
 */

/**
 * Represents a student suggestion with management fields for staff.
 */
export interface Suggestion {
  /** Unique identifier for the suggestion */
  id: string;
  /** Title of the suggestion */
  title: string;
  /** Detailed description */
  description: string;
  /** Name of the author (optional) */
  authorName?: string;
  /** Number of upvotes */
  upvotes: number;
  /** ISO string of creation date */
  createdAt: string;
  /** Current status of the suggestion */
  status?: 'pending' | 'in_progress' | 'resolved' | 'closed';
  /** Assigned staff member */
  assignedTo?: string;
  /** Category of the suggestion */
  category?: string;
  /** List of staff responses */
  responses?: SuggestionResponse[];
}

/**
 * Represents a response to a suggestion by staff.
 */
export interface SuggestionResponse {
  /** Unique identifier for the response */
  id: string;
  /** Content of the response */
  content: string;
  /** Name of the responding staff member */
  authorName: string;
  /** ISO string of response date */
  createdAt: string;
}
