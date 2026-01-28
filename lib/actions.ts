// Gemini AI
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini AI client
const genAI = new GoogleGenAI({
  apiKey: "AIzaSyAdWzkzmbOdxyiPerQaSlxEpypKH3jbS8w"
});

/**
 * Loads ICT University FAQs content for AI context
 * @returns The FAQs content as a string
 */
async function loadFAQsContext(): Promise<string> {
  try {
    // Import fs dynamically to read the FAQs file
    const fs = await import('fs');
    const path = await import('path');

    const faqsPath = path.join(process.cwd(), 'docs', 'references', 'FAQs.md');
    const faqsContent = fs.readFileSync(faqsPath, 'utf-8');

    // Try to fetch additional information from the university website
    let websiteContent = '';
    try {
      websiteContent = await fetchUniversityWebsiteInfo();
    } catch (error) {
      console.warn('Could not fetch university website content:', error);
    }

    return `${faqsContent}\n\nADDITIONAL INFORMATION FROM UNIVERSITY WEBSITE:\n${websiteContent}`;
  } catch (error) {
    console.error('Error loading FAQs:', error);
    return `
ICT UNIVERSITY - GENERAL INFORMATION:
ICT University is a technology-focused institution offering programs in ICT, Computer Science, Software Engineering, Information Systems and Networking, and Cybersecurity.

Key Contacts:
- Academic Department: ict.department@ictuniversity.edu.cm | Mme Vanessa (+237 697 737 272)
- Registrar's Office: registrar@ictuniversity.edu.cm | Phone: 680596171
- Cisco Lab: richardbareth.envinaatouba@ictuniversity.edu.cm

For specific questions, please contact the relevant department directly.
`;
  }
}

/**
 * Fetches key information from ICT University website
 * @returns Relevant website content as a string
 */
async function fetchUniversityWebsiteInfo(): Promise<string> {
  try {
    // Attempt to fetch content from the university website
    const response = await fetch('https://ictuniversity.org/', {
      method: 'GET',
      headers: {
        'User-Agent': 'ICT-University-Chatbot/1.0'
      },
      // Set a reasonable timeout
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const htmlContent = await response.text();

    // Extract relevant information from the HTML
    // This is a basic extraction - in production, you might want to use a proper HTML parser
    const extractedInfo = extractWebsiteInfo(htmlContent);

    return extractedInfo;
  } catch (error) {
    console.warn('Could not fetch university website content, using fallback:', error);

    // Fallback information
    return `
ICT UNIVERSITY WEBSITE INFORMATION (https://ictuniversity.org/):

ABOUT ICT UNIVERSITY:
ICT University is a leading institution of higher learning in Cameroon, specializing in Information and Communication Technology education. The university is committed to providing quality education that prepares students for the digital economy.

PROGRAMS OFFERED:
- Undergraduate Programs (BSc): ICT, Computer Science, Software Engineering, Information Systems and Networking, Cybersecurity, Renewable Energy, Applied ICT in Journalism and Mass Communication
- Graduate Programs (MSc): Information Systems and Networking, Information Systems Security, Information Technology, Applied ICT in Public Health, Applied ICT in Education, Applied ICT in Journalism and Mass Communication

ADMISSION REQUIREMENTS:
- Completed application form
- Certified copies of academic certificates (GCE O/L, A/L, or equivalent)
- Birth certificate and national ID/passport
- Application fee payment
- Additional documents may be required based on program

CAMPUS FACILITIES:
- Modern computer labs and Cisco networking facilities
- Library with extensive digital resources
- Student accommodation options
- Sports and recreational facilities
- Medical center for health services

INTERNATIONAL COLLABORATIONS:
ICT University maintains partnerships with international institutions and industry leaders to provide students with global exposure and industry-relevant skills.

For the most current information, please visit: https://ictuniversity.org/
`;
  }
}

/**
 * Extracts relevant information from website HTML content
 * @param htmlContent - The raw HTML content from the website
 * @returns Extracted and formatted information
 */
function extractWebsiteInfo(htmlContent: string): string {
  try {
    // Basic text extraction from HTML
    // Remove HTML tags and extract meaningful content
    const textContent = htmlContent
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove scripts
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // Remove styles
      .replace(/<[^>]+>/g, ' ') // Remove HTML tags
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    // Extract key sections (this is a basic implementation)
    const sections = {
      about: extractSection(textContent, 'about', 'mission', 'vision'),
      programs: extractSection(textContent, 'program', 'course', 'degree', 'bsc', 'msc'),
      admission: extractSection(textContent, 'admission', 'application', 'requirement'),
      facilities: extractSection(textContent, 'facility', 'lab', 'library', 'campus'),
      contact: extractSection(textContent, 'contact', 'phone', 'email', 'address')
    };

    return `
EXTRACTED FROM ICT UNIVERSITY WEBSITE (https://ictuniversity.org/):

ABOUT THE UNIVERSITY:
${sections.about || 'Information about ICT University\'s mission and vision.'}

ACADEMIC PROGRAMS:
${sections.programs || 'Various ICT and technology-related programs offered.'}

ADMISSIONS:
${sections.admission || 'Admission requirements and application process details.'}

CAMPUS FACILITIES:
${sections.facilities || 'Modern facilities including labs, library, and student services.'}

CONTACT INFORMATION:
${sections.contact || 'Contact details for various university departments.'}

For complete and current information, please visit: https://ictuniversity.org/
`;
  } catch (error) {
    console.error('Error extracting website info:', error);
    return 'Website content extraction failed. Please visit https://ictuniversity.org/ for current information.';
  }
}

/**
 * Extracts a section of text based on keywords
 * @param text - The full text content
 * @param keywords - Keywords to search for
 * @returns Extracted section or null
 */
function extractSection(text: string, ...keywords: string[]): string | null {
  const lowerText = text.toLowerCase();
  const matches: string[] = [];

  for (const keyword of keywords) {
    const index = lowerText.indexOf(keyword.toLowerCase());
    if (index !== -1) {
      // Extract a reasonable amount of text around the keyword
      const start = Math.max(0, index - 100);
      const end = Math.min(text.length, index + 200);
      const excerpt = text.substring(start, end).trim();
      if (excerpt.length > 20) {
        matches.push(excerpt);
      }
    }
  }

  return matches.length > 0 ? matches.join(' ... ') : null;
}

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
    // Load ICT University FAQs for context
    const faqsContext = await loadFAQsContext();

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
You are an AI assistant for ICT University's student support system. Help students with their inquiries about university services, complaints, and suggestions.

ICT UNIVERSITY FAQs AND INFORMATION:
${faqsContext}

Additional Context from the system (non-PII):
${context}

User's message: ${userMessage}

RESPONSE GUIDELINES:
- Be friendly and professional
- Provide accurate information based on the ICT University knowledge base above
- If uncertain about specific details, direct students to appropriate contacts or the university website (https://ictuniversity.org/)
- For emergencies, emphasize immediate action and provide correct contact information
- Always offer to help with follow-up questions
- Use the contact information provided in the FAQs when relevant
- When appropriate, suggest visiting the university website for the most current information

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

