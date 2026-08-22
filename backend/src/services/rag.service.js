import fs from "fs";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { PDFParse } from "pdf-parse";
import Document from "../models/Document.js";
import { getEmbedding, isGeminiActive } from "./gemini.service.js";
import { getPineconeIndex } from "./pinecone.service.js";

// Helper function to extract text from a local PDF file
const extractPdfText = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const parser = new PDFParse({ data: dataBuffer });
  const result = await parser.getText();
  await parser.destroy(); // Always call destroy() to free memory
  return result.text;
};

// Process an uploaded document in the background: Extract → Chunk → Embed → Index
export const processDocumentBackground = async (docId) => {
  // Retrieve document record from DB
  const doc = await Document.findById(docId);
  if (!doc) {
    console.error(`❌ processDocumentBackground: Document not found with ID ${docId}`);
    return;
  }

  console.log(`🤖 Starting text extraction & indexing for document: "${doc.originalName}"`);

  try {
    // 1. Update status to 'processing'
    doc.status = "processing";
    await doc.save();

    // 2. Validate API settings are active
    if (!isGeminiActive()) {
      throw new Error("Gemini API key is not configured.");
    }
    const pineconeIndex = getPineconeIndex();
    if (!pineconeIndex) {
      throw new Error("Pinecone Index is not initialized.");
    }

    // 3. Extract text from PDF
    console.log(`📄 Extracting text from PDF: ${doc.path}...`);
    const rawText = await extractPdfText(doc.path);
    if (!rawText || !rawText.trim()) {
      throw new Error("The PDF document is empty or could not be parsed.");
    }

    // Compute document profile statistics
    const characterCount = rawText.length;
    const wordCount = rawText.trim().split(/\s+/).filter(w => w.length > 0).length;
    const pageCount = Math.max(1, Math.ceil(characterCount / 2200));

    doc.characterCount = characterCount;
    doc.wordCount = wordCount;
    doc.pageCount = pageCount;
    await doc.save();

    // 4. Split text into chunks using LangChain
    console.log(`✂️ Splitting document text into chunks...`);
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200
    });

    // createDocuments returns array of Document objects with pageContent
    const chunks = await splitter.createDocuments([rawText]);
    console.log(`📝 Generated ${chunks.length} chunks for indexing.`);

    if (chunks.length === 0) {
      throw new Error("Text chunking yielded 0 splits.");
    }

    // 5. Generate embeddings and prepare vectors for Pinecone
    const vectors = [];
    console.log(`🧠 Generating Gemini embeddings for chunks...`);

    for (let i = 0; i < chunks.length; i++) {
      const chunkText = chunks[i].pageContent;
      // Fetch 768-dim embedding values
      const embeddingValues = await getEmbedding(chunkText);

      vectors.push({
        id: `${doc._id}-chunk-${i}`,
        values: embeddingValues,
        metadata: {
          text: chunkText,
          source: doc.originalName,
          documentId: doc._id.toString()
        }
      });

      // Prevent API throttling with a tiny delay
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // 6. Upsert vectors to Pinecone Index
    console.log(`🚀 Upserting vectors into Pinecone...`);
    // Pinecone allows batch upsert.
    // Upsert in batches of 100 to prevent payload size errors
    const batchSize = 100;
    for (let i = 0; i < vectors.length; i += batchSize) {
      const batch = vectors.slice(i, i + batchSize);
      await pineconeIndex.upsert({ records: batch });
    }

    // 7. Update status to 'processed'
    doc.status = "processed";
    await doc.save();
    console.log(`✅ Document "${doc.originalName}" fully indexed in Pinecone!`);

  } catch (error) {
    console.error(`❌ Failed to index document "${doc.originalName}":`, error.message);
    doc.status = "failed";
    await doc.save();
  }
};

// Delete all vectors associated with a document ID from Pinecone
export const deleteDocumentVectors = async (docId) => {
  const pineconeIndex = getPineconeIndex();
  if (!pineconeIndex) {
    console.warn("⚠️ Warning: Pinecone is not active. Vectors cannot be cleared.");
    return;
  }

  try {
    console.log(`🗑️ Deleting all vectors in Pinecone for documentId: ${docId}`);
    // In Pinecone, we can delete by metadata filtering
    await pineconeIndex.deleteMany({
      filter: {
        documentId: docId.toString()
      }
    });
    console.log(`✅ Deleted vectors in Pinecone.`);
  } catch (error) {
    console.error(`❌ Error deleting Pinecone vectors: ${error.message}`);
  }
};
