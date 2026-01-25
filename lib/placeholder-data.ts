// Placeholder data for ASSS app development and testing
// Based on Prisma schema from SRS

export const users = [
  {
    id: 'user-1',
    email: 'student@example.com',
    password: 'password', // In real app, this would be hashed
    name: 'John Student',
    role: 'STUDENT' as const,
    clerkId: 'clerk-student-1', // Placeholder
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: 'user-2',
    email: 'staff@example.com',
    password: 'password',
    name: 'Jane Staff',
    role: 'STAFF' as const,
    clerkId: 'clerk-staff-1',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: 'user-3',
    email: 'admin@example.com',
    password: 'password',
    name: 'Admin User',
    role: 'ADMIN' as const,
    clerkId: 'clerk-admin-1',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
  {
    id: 'user-4',
    email: 'madick@example.com',
    password: 'password123',
    name: 'Admin User',
    role: 'ADMIN' as const,
    clerkId: 'clerk-admin-1',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  },
]

export const complaints = [
  {
    id: 'complaint-1',
    userId: 'user-1',
    category: 'Facilities',
    description: 'The lecture room is leaking water from the ceiling.',
    status: 'PENDING' as const,
    response: null,
    attachment: null,
    assigneeId: null,
    createdAt: new Date('2026-01-20'),
    updatedAt: new Date('2026-01-20'),
  },
  {
    id: 'complaint-2',
    userId: 'user-1',
    category: 'IT Support',
    description: 'WiFi is not working in the library.',
    status: 'IN_PROGRESS' as const,
    response: 'We are investigating the issue.',
    attachment: 'wifi-issue.jpg',
    assigneeId: 'user-2',
    createdAt: new Date('2026-01-18'),
    updatedAt: new Date('2026-01-22'),
  },
  {
    id: 'complaint-3',
    userId: 'user-1',
    category: 'Academic',
    description: 'Professor is not responding to emails.',
    status: 'RESOLVED' as const,
    response: 'Issue has been resolved with the professor.',
    attachment: null,
    assigneeId: 'user-2',
    createdAt: new Date('2026-01-10'),
    updatedAt: new Date('2026-01-15'),
  },
]

// Add categories
export const suggestions = [
  {
    id: 'suggestion-1',
    userId: 'user-1',
    title: 'Add more study spaces',
    description: 'The university needs more quiet study areas.',
    status: 'PENDING' as const,
    upvotes: 5,
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-01-15'),
  },
  {
    id: 'suggestion-2',
    userId: 'user-1',
    title: 'Improve cafeteria food',
    description: 'Better quality and variety in cafeteria meals.',
    status: 'APPROVED' as const,
    upvotes: 12,
    createdAt: new Date('2026-01-10'),
    updatedAt: new Date('2026-01-12'),
  },
]

export const upvotes = [
  {
    id: 'upvote-1',
    userId: 'user-1',
    suggestionId: 'suggestion-1',
    createdAt: new Date('2026-01-16'),
  },
]

export const auditLogs = [
  {
    id: 'audit-1',
    actorId: 'user-2',
    action: 'UPDATE',
    entity: 'Complaint',
    entityId: 'complaint-1',
    detail: 'Status changed to IN_PROGRESS',
    createdAt: new Date('2026-01-21'),
  },
  {
    id: 'audit-2',
    actorId: 'user-1',
    action: 'CREATE',
    entity: 'Complaint',
    entityId: 'complaint-1',
    detail: 'New complaint submitted',
    createdAt: new Date('2026-01-20'),
  },
  {
    id: 'audit-3',
    actorId: 'user-1',
    action: 'CREATE',
    entity: 'Suggestion',
    entityId: 'suggestion-1',
    detail: 'New suggestion submitted',
    createdAt: new Date('2026-01-15'),
  },
  {
    id: 'audit-4',
    actorId: 'user-3',
    action: 'DELETE',
    entity: 'User',
    entityId: 'user-4',
    detail: 'User account deleted',
    createdAt: new Date('2026-01-14'),
  },
  {
    id: 'audit-5',
    actorId: 'user-3',
    action: 'UPDATE',
    entity: 'User',
    entityId: 'user-2',
    detail: 'Role changed to STAFF',
    createdAt: new Date('2026-01-13'),
  },
  {
    id: 'audit-6',
    actorId: 'user-1',
    action: 'LOGIN',
    entity: 'Session',
    entityId: 'session-1',
    detail: 'User logged in',
    createdAt: new Date('2026-01-22'),
  },
  {
    id: 'audit-7',
    actorId: 'user-2',
    action: 'UPDATE',
    entity: 'Suggestion',
    entityId: 'suggestion-2',
    detail: 'Status changed to APPROVED',
    createdAt: new Date('2026-01-12'),
  },
  {
    id: 'audit-8',
    actorId: 'user-3',
    action: 'CREATE',
    entity: 'User',
    entityId: 'user-4',
    detail: 'New user registered',
    createdAt: new Date('2026-01-10'),
  },
  {
    id: 'audit-9',
    actorId: 'user-2',
    action: 'DELETE',
    entity: 'Complaint',
    entityId: 'complaint-3',
    detail: 'Complaint archived',
    createdAt: new Date('2026-01-16'),
  },
  {
    id: 'audit-10',
    actorId: 'user-1',
    action: 'LOGOUT',
    entity: 'Session',
    entityId: 'session-1',
    detail: 'User logged out',
    createdAt: new Date('2026-01-22'),
  },
]

export const chatSessions = [
  {
    id: 'session-1',
    userId: 'user-1',
    status: 'OPEN' as const,
    title: 'WiFi Issue',
    lastActivity: new Date('2026-01-22'),
    createdAt: new Date('2026-01-20'),
  },
]

export const messages = [
  {
    id: 'message-1',
    sessionId: 'session-1',
    sender: 'USER' as const,
    content: 'My WiFi is not working.',
    metadata: null,
    createdAt: new Date('2026-01-20'),
  },
  {
    id: 'message-2',
    sessionId: 'session-1',
    sender: 'AI' as const,
    content: 'I can help with that. Have you tried restarting your device?',
    metadata: null,
    createdAt: new Date('2026-01-20'),
  },
]

export const uiPrototypes = [
  {
    id: 'ui-1',
    sessionId: 'session-1',
    promptHash: 'hash123',
    schemaJson: '{"type": "faq", "question": "WiFi troubleshooting"}',
    previewPath: null,
    costCents: 5,
    createdAt: new Date('2026-01-20'),
  },
]