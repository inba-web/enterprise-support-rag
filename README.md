# 🔮 SyncVantage AI — Enterprise Support Console

> A premium, high-performance RAG-powered Customer Support Console built for modern enterprises. Powered by Google Gemini and Pinecone Vector Database, with a zero-configuration local database fallback.

![SyncVantage AI Dashboard](./frontend/src/assets/dashboard_preview.png)

---

## 🚀 Key Features

*   **⚡ Live RAG (Retrieval-Augmented Generation)**: Upload product manuals, custom user guides, or FAQs to inject real-time context directly into LLM support conversations.
*   **🧠 Dual Model Intelligence**:
    *   **Embeddings**: Powered by `gemini-embedding-001` (optimized to `768` dimensions).
    *   **Generation**: Powered by the advanced `gemini-3.5-flash` model, ensuring fast response times and low-latency.
*   **💾 Zero-Configuration Local DB Fallback**: If MongoDB Atlas connection fails or encounters firewall blockages (such as missing IP whitelisting), the server automatically activates a local JSON database fallback (`documents.json`) to keep the system fully functional.
*   **📱 Glassmorphic Responsive Layout**: Beautiful Vercel/Linear-inspired dark/light theme options, responsive top navbar, and an overlay sidebar drawer designed for seamless mobile navigation.
*   **🔄 Automated Index Status Polling**: The frontend automatically polls processing documents from the server and updates RAG indexing statuses in real-time.
*   **📊 Integrated Performance Dashboard**: Visualizes weekly query volumes and logs server event streams dynamically.

---

## 🛠️ Tech Stack

*   **Frontend**: React (v19), Vite, Tailwind CSS (v4), Framer Motion, Axios.
*   **Backend**: Node.js, Express, Mongoose, nodemon.
*   **AI & Search**: Google Generative AI SDK, Pinecone SDK, `@langchain/textsplitters`, `pdf-parse`.

---

## 📂 Project Architecture

```mermaid
graph TD
    User([User Client]) -->|Interacts| Frontend[React Single Page Application]
    Frontend -->|RAG Queries & Uploads| Backend[Express REST API]
    
    subgraph Data Layer
        Backend -->|Metadata fallback if Atlas offline| LocalDB[(Local documents.json)]
        Backend -->|Primary Metadata| MongoAtlas[(MongoDB Atlas Cluster)]
    end
    
    subgraph Vector Pipeline
        Backend -->|PDF Parsing & Chunking| LangChain[LangChain Splitters]
        LangChain -->|Text Chunks| GeminiEmbed[gemini-embedding-001]
        GeminiEmbed -->|768-dim Vectors| Pinecone[(Pinecone Vector DB)]
    end
    
    subgraph Answer Synthesis
        Backend -->|Query Search| Pinecone
        Pinecone -->|Relevant Context| ContextAggregator[Context Aggregator]
        ContextAggregator -->|System Prompt| GeminiLLM[gemini-3.5-flash]
        GeminiLLM -->|Synthesized Response| Backend
    end
```

---

## ⚙️ Quick Installation

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18 or higher) installed.

### 1. Setup Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` folder and configure it using the template below:
   ```env
   # Database Configuration (Atlas or Local fallback)
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dbname

   # Google Gemini API
   GEMINI_API_KEY=your_gemini_api_key_here

   # Pinecone Vector Database Configuration
   PINE_CONE_API_KEY=your_pinecone_api_key_here
   PINECONE_INDEX_NAME=ai-support-assistant
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

### 2. Setup Frontend
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open the application in your browser at `http://localhost:5173`.

---

## 🛡️ Database Fallback Mechanism
SyncVantage AI contains a fallback system in `src/config/db.js` and `src/models/Document.js`. If the `MONGO_URI` connection times out or fails (e.g., due to IP Whitelisting restrictions on remote clusters), the system logs a warning:
> `⚠️ Falling back to local JSON database (documents.json) for storage.`

All metadata creations, retrievals, and deletions automatically redirect to a local database at `backend/data/documents.json`. This keeps the API online and allows you to test vector indexing and RAG pipeline workflows entirely offline.
