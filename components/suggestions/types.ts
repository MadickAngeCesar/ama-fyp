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
  status?: 'PENDING' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED';
  /** Assigned staff member name */
  assigneeName?: string;
  /** Assigned staff member id */
  assigneeId?: string;
  /** Category of the suggestion */
  category?: string;
  /** List of staff responses */
  responses?: SuggestionResponse[];
  /** Whether the current user has upvoted */
  userUpvoted?: boolean;
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

/**
 * API response type for suggestions list
 */
export interface SuggestionApiResponse {
  id: string;
  title: string;
  description: string;
  status: string;
  authorName: string | null;
  upvotes: number;
  createdAt: string;
  userUpvoted: boolean;
}

/**
 * API response type for users list
 */
export interface UserApiResponse {
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}
