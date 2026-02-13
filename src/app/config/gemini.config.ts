import { GoogleGenAI } from "@google/genai";
import { envVars } from "./env";
export const ai = new GoogleGenAI({ apiKey: envVars.GEMINI_API_KEY });
