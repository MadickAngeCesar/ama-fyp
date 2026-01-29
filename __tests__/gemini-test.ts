import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import fs from 'fs';
import dotenv from 'dotenv';

// Prefer .env value if present (local dev); otherwise use process.env
let localKey: string | undefined;
try {
  const parsed = dotenv.parse(fs.readFileSync('.env'));
  localKey = parsed.GEMINI_API_KEY?.replace(/^"|"$/g, '');
} catch (e) {
  localKey = undefined;
  console.log(e)
}
const KEY = localKey || process.env.GEMINI_API_KEY!;

async function main() {
  try {
    const ai = new GoogleGenAI({ apiKey: KEY });
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      contents: "Explain how AI works in a few words",
    });

    console.log(response.text);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();