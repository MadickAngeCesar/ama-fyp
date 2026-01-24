/**
 * Complaint UI types
 */
export interface Complaint {
  id: string;
  category?: string;
  description: string;
  status?: string;
  reporterName?: string;
  assigneeName?: string | null;
  createdAt: string;
}
