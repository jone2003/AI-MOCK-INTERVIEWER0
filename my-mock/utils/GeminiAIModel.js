 import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ Get API key from environment variable
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("Missing Gemini API key. Please set NEXT_PUBLIC_GEMINI_API_KEY in .env.local");
}

const genAI = new GoogleGenerativeAI(apiKey);

// ✅ Use Gemini 2.5 Flash (latest and fastest model)
const model = genAI.getGenerativeModel({
  model: "models/gemini-2.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// ✅ Start a chat session
export const chatSession = model.startChat({
  generationConfig,
});
