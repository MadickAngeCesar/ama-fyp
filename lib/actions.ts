// Gemini AI
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini AI client
const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
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

