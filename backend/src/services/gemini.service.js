import { GoogleGenerativeAI } from "@google/generative-ai";

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY") {
    console.warn("⚠️ Warning: GEMINI_API_KEY is missing or unconfigured. AI services will operate in simulation mode.");
    return null;
  }

  try {
    return new GoogleGenerativeAI(apiKey);
  } catch (error) {
    console.error("❌ Failed to initialize Google Generative AI client:", error.message);
    return null;
  }
};

const genAI = getGeminiClient();

// Check if Gemini services are active
export const isGeminiActive = () => {
  return genAI !== null;
};

// Generate 768-dimension embeddings for a text string
export const getEmbedding = async (text) => {
  if (!genAI) {
    throw new Error("Gemini API Client is not configured. (Missing API Key)");
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
    const result = await model.embedContent({
      content: { parts: [{ text }] },
      outputDimensionality: 768
    });
    
    if (result && result.embedding && result.embedding.values) {
      return result.embedding.values;
    } else {
      throw new Error("Invalid embedding response from Gemini API.");
    }
  } catch (error) {
    console.error("❌ Error generating embedding:", error.message);
    throw error;
  }
};

// Generate RAG answers based on matching text context
export const generateRAGAnswer = async (context, question) => {
  if (!genAI) {
    throw new Error("Gemini API Client is not configured. (Missing API Key)");
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    const systemPrompt = `You are a professional and friendly AI Customer Support Assistant.
Your objective is to answer the user's question accurately using ONLY the provided context blocks.

Instructions:
1. Provide a concise, clear, and professional response.
2. Rely ONLY on the information given in the context.
3. If the context does not contain enough information to answer the question, state that you don't have that information in your knowledge base and suggest they contact live customer support (details are in the context or tell them to click "Talk to a Human").
4. Use formatting (bold text, bullet points, code tags) in Markdown to make the answer easy to read.

---
CONTEXT:
${context}
---
USER QUESTION:
${question}

ASSISTANT RESPONSE:`;

    const result = await model.generateContent(systemPrompt);
    return result.response.text();
  } catch (error) {
    console.error("❌ Error generating RAG answer from Gemini:", error.message);
    throw error;
  }
};
