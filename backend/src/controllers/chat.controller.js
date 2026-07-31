import { getEmbedding, generateRAGAnswer, isGeminiActive } from "../services/gemini.service.js";
import { getPineconeIndex } from "../services/pinecone.service.js";

// @desc    Process user support chat query (RAG Pipeline)
// @route   POST /api/chat
// @access  Public
export const handleChatQuery = async (req, res, next) => {
  const { message } = req.body;

  try {
    if (!message || !message.trim()) {
      res.status(400);
      throw new Error("Message body is required.");
    }

    // Check if live API keys are set. Fall back to simulation mode otherwise.
    if (!isGeminiActive()) {
      console.log("ℹ️ RAG Chat: Gemini API key is missing. Returning simulated fallback code.");
      return res.status(200).json({
        success: true,
        text: "",
        simulated: true,
        message: "Gemini API key is unconfigured. Entering simulated response mode."
      });
    }

    const pineconeIndex = getPineconeIndex();
    if (!pineconeIndex) {
      console.log("ℹ️ RAG Chat: Pinecone is inactive. Returning simulated fallback code.");
      return res.status(200).json({
        success: true,
        text: "",
        simulated: true,
        message: "Pinecone index is not initialized. Entering simulated response mode."
      });
    }

    console.log(`💬 RAG Chat query: "${message}"`);

    // 1. Embed query
    console.log("🧠 Generating query vector embedding...");
    const queryVector = await getEmbedding(message);

    // 2. Query Pinecone
    console.log("🔍 Querying Pinecone vector database...");
    const searchResponse = await pineconeIndex.query({
      vector: queryVector,
      topK: 4,
      includeMetadata: true
    });

    const matches = searchResponse.matches || [];
    console.log(`🎯 Found ${matches.length} matching context blocks in Pinecone.`);

    // If no context match is found, we fall back to a standard chat without context
    let contextText = "";
    let sources = [];
    
    if (matches.length > 0) {
      contextText = matches
        .filter(m => m.score > 0.3) // Only keep relevant chunks
        .map(m => `[Source: ${m.metadata.source}] ${m.metadata.text}`)
        .join("\n\n");
      
      sources = Array.from(new Set(matches.map(m => m.metadata.source)));
    }

    // 3. Generate response using Gemini
    console.log("🤖 Asking Gemini with context...");
    const generatedAnswer = await generateRAGAnswer(
      contextText || "No document context available for this question.", 
      message
    );

    res.status(200).json({
      success: true,
      text: generatedAnswer,
      simulated: false,
      sources: sources
    });

  } catch (error) {
    console.error("❌ Error in handleChatQuery RAG Pipeline:", error.message);
    next(error);
  }
};
