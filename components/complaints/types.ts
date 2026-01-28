/**
 * Complaint UI types
 */
export interface ComplaintResponse {
  id: string;
  content: string;
  authorName: string;
  createdAt: string;
}

export interface Complaint {
  id: string;
  category: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  response?: string;
  attachment?: string;
  authorName: string;
  assigneeName?: string;
  createdAt: string;
  updatedAt: string;
  responses?: ComplaintResponse[];
}
