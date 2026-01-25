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
  category?: string;
  description: string;
  status?: string;
  reporterName?: string;
  assigneeName?: string | null;
  createdAt: string;
  responses?: ComplaintResponse[];
}
