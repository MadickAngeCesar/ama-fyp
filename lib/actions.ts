// Gemini AI
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini AI client
const genAI = new GoogleGenAI({
  apiKey: "AIzaSyAdWzkzmbOdxyiPerQaSlxEpypKH3jbS8w"
});

/**
 * Generates a chat response using Gemini AI with contextual information.
 * @param userMessage - The user's message
 * @param context - Contextual information (e.g., recent tickets, FAQs)
 * @returns The AI-generated response
 */
export async function generateChatResponse(
  userMessage: string,
  context: string = ""
): Promise<string> {
  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
You are an AI assistant for a student support system. Help students with their inquiries about university services, complaints, and suggestions.

Context from the system (non-PII):
${context}

User's message: ${userMessage}

Provide a helpful, concise response. If the user wants to escalate to a formal complaint, suggest they use the escalation feature.
`,
    });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Error generating chat response:", error);
    return "I'm sorry, I'm having trouble responding right now. Please try again later.";
  }
}

/**
 * Generates a UI prototype suggestion based on the chat context.
 * @param prompt - The prompt describing the UI needed
 * @returns A JSON schema for the UI prototype
 */
export async function generateUIPrototype(prompt: string): Promise<unknown> {
  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
Generate a JSON schema for a UI component based on this description: ${prompt}

Return only valid JSON that describes a simple form or interface element.
`,
    });
    const jsonText = response.text || "{}";
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error generating UI prototype:", error);
    return null;
  }
}


// In App and Email notifications

/**
 * Logs an audit event to the database.
 * @param actorId - The ID of the user performing the action (optional for system actions)
 * @param action - The action performed (e.g., 'CREATE', 'UPDATE', 'DELETE')
 * @param entity - The entity type (e.g., 'Suggestion', 'Complaint')
 * @param entityId - The ID of the entity
 * @param detail - Additional details about the action
 */
export async function logAuditEvent(
  actorId: string | null,
  action: string,
  entity: string,
  entityId: string,
  detail?: string
) {
  try {
    const { db } = await import('./db');
    await db.auditLog.create({
      data: {
        actorId,
        action,
        entity,
        entityId,
        detail,
      },
    });
  } catch (error) {
    console.error('Error logging audit event:', error);
  }
}

