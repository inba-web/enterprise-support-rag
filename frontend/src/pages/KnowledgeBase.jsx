import { useState, useEffect } from "react";
import axios from "axios";
import Card, { CardContent } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";

const DOCS_URL = "http://localhost:5000/api/documents";

export default function KnowledgeBase() {
  const [documents, setDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(DOCS_URL);
      setDocuments(response.data);
    } catch (err) {
      console.error("Failed to load documents catalog:", err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Poll for document status updates if any document is in "uploaded" or "processing" status
  useEffect(() => {
    const hasPendingDocs = documents.some(
      (doc) => doc.status === "uploaded" || doc.status === "processing"
    );

    if (hasPendingDocs) {
      const interval = setInterval(() => {
        fetchDocuments();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [documents]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setErrorMsg("");
    setSuccessMsg("");

    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setErrorMsg("Error: Only PDF files can be uploaded.");
      setSelectedFile(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setErrorMsg("Error: File exceeds the 10MB maximum limit.");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg("Please select a PDF document first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setUploading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const response = await axios.post(`${DOCS_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (response.data.success) {
        setSuccessMsg(`"${selectedFile.name}" uploaded successfully. Chunks are being indexed in Pinecone in the background.`);
        setSelectedFile(null);
        fetchDocuments();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "File upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDoc = async (id) => {
    if (!window.confirm("Delete this document from the knowledge base? This action will purge all vector embeddings in Pinecone.")) {
      return;
    }

    try {
      await axios.delete(`${DOCS_URL}/${id}`);
      setSuccessMsg("Document purged successfully.");
      fetchDocuments();
    } catch (err) {
      setErrorMsg("Purge action failed.");
    }
  };

  const formatBytes = (bytes, decimals = 1) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Title Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Knowledge Base</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage manuals, user policies, and data sheets. Loaded items parse into RAG text chunks.
        </p>
      </div>

      {/* Upload Form Card */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-350 uppercase tracking-wide mb-3">
            Upload PDF Document
          </h3>
          <form onSubmit={handleUpload} className="flex flex-col gap-4">
            <div className="border border-dashed border-slate-200 dark:border-slate-800 hover:border-slate-950 dark:hover:border-slate-250 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50/30 dark:bg-slate-900/10 hover:bg-slate-50/60 dark:hover:bg-slate-900/30 transition-all cursor-pointer relative">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={uploading}
              />
              <span className="text-2xl mb-2">📥</span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                {selectedFile ? selectedFile.name : "Select or Drop PDF File"}
              </span>
              <span className="text-[10px] text-slate-450">
                {selectedFile ? formatBytes(selectedFile.size) : "PDF files only, up to 10MB"}
              </span>
            </div>

            {errorMsg && (
              <div className="px-3.5 py-2 border border-red-500/10 bg-red-500/5 text-red-500 text-[10px] rounded-lg font-semibold">
                ⚠️ {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="px-3.5 py-2 border border-emerald-500/10 bg-emerald-500/5 text-emerald-600 text-[10px] rounded-lg font-semibold">
                ✅ {successMsg}
              </div>
            )}

            <div className="flex justify-end gap-2.5">
              {selectedFile && (
                <Button variant="outline" size="sm" type="button" onClick={() => setSelectedFile(null)} disabled={uploading}>
                  Cancel
                </Button>
              )}
              <Button variant="default" size="sm" type="submit" disabled={uploading || !selectedFile} className="font-bold">
                {uploading ? "Uploading..." : "Upload Document"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Documents Catalog Card */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-350 uppercase tracking-wide mb-3">
            Document Catalog
          </h3>
          {documents.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-slate-100 dark:border-slate-800/80 rounded-xl">
              <p className="text-xs text-slate-400">No documents found. Upload a product manual to start.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold text-[10px] uppercase tracking-wide">
                    <th className="pb-3 pr-4">File Name</th>
                    <th className="pb-3 pr-4">Size</th>
                    <th className="pb-3 pr-4">Index Status</th>
                    <th className="pb-3 pr-4">Uploaded</th>
                    <th className="pb-3 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {documents.map((doc) => (
                    <tr key={doc._id} className="text-slate-750 dark:text-slate-350 hover:bg-slate-50/30 dark:hover:bg-slate-900/10">
                      <td className="py-3.5 pr-4 font-semibold max-w-[240px] truncate" title={doc.originalName}>
                        📄 {doc.originalName}
                      </td>
                      <td className="py-3.5 pr-4 text-slate-450">{formatBytes(doc.size)}</td>
                      <td className="py-3.5 pr-4">
                        <Badge
                          variant={
                            doc.status === "processed"
                              ? "success"
                              : doc.status === "failed"
                              ? "danger"
                              : "warning"
                          }
                          className="capitalize text-[9px] px-2 py-0.5 font-medium"
                        >
                          {doc.status === "uploaded" ? "Ready" : doc.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 pr-4 text-slate-450">
                        {new Date(doc.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => handleDeleteDoc(doc._id)}
                          className="text-slate-400 hover:text-red-500 font-semibold p-1 hover:bg-red-500/5 rounded transition-colors focus:outline-none"
                          title="Purge Document"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
