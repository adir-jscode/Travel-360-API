import Groq from "groq-sdk";
import { envVars } from "./env";

export const groq = new Groq({
  apiKey: envVars.GROQ_API_KEY,
});
