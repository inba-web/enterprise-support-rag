// API Configurations for thedal-rag
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const API_URLS = {
    chat: `${BASE_URL}/api/chat`,
    documents: `${BASE_URL}/api/documents`,
    base: BASE_URL
};
