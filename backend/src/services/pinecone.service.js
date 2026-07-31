import { Pinecone } from "@pinecone-database/pinecone";

const getPineconeClient = () => {
  const apiKey = process.env.PINE_CONE_API_KEY || process.env.PINECONE_API_KEY;
  
  if (!apiKey || apiKey.startsWith("YOUR_")) {
    console.warn("⚠️ Warning: Pinecone API Key is missing or default. Pinecone client will not be initialized.");
    return null;
  }

  try {
    return new Pinecone({ apiKey });
  } catch (error) {
    console.error("❌ Failed to initialize Pinecone Client:", error.message);
    return null;
  }
};

const pinecone = getPineconeClient();
const indexName = process.env.PINECONE_INDEX_NAME || "ai-support-assistant";

// Initialize/Create index programmatically if missing
export const initializePineconeIndex = async () => {
  if (!pinecone) return null;

  try {
    console.log("🔍 Checking Pinecone index state...");
    const indexList = await pinecone.listIndexes();
    const indexExists = indexList.indexes?.some((idx) => idx.name === indexName);

    if (!indexExists) {
      console.log(`🚀 Index "${indexName}" not found. Provisioning serverless Pinecone index (Dimension: 768)...`);
      await pinecone.createIndex({
        name: indexName,
        dimension: 768,
        metric: "cosine",
        spec: {
          serverless: {
            cloud: "aws",
            region: "us-east-1"
          }
        }
      });
      console.log(`✨ Pinecone index "${indexName}" created successfully.`);
    } else {
      console.log(`✅ Pinecone index "${indexName}" is active.`);
    }

    return pinecone.index(indexName);
  } catch (error) {
    console.error(`❌ Error initializing Pinecone Index: ${error.message}`);
    return null;
  }
};

// Export index wrapper
export const getPineconeIndex = () => {
  if (!pinecone) return null;
  return pinecone.index(indexName);
};

export default pinecone;
