import { useState, useEffect } from "react";
import axios from "axios";
import Card, { CardContent } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import {
  Upload,
  Trash2,
  Search,
  FileText,
  Eye,
  Info,
  Calendar,
  Layers,
  Database,
  ExternalLink,
  ChevronRight,
  Filter,
  CheckCircle,
  XCircle,
  RefreshCw,
  X
} from "lucide-react";

import { API_URLS } from "../config";
const DOCS_URL = API_URLS.documents;

export default function KnowledgeBase() {
  const [documents, setDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDocDetails, setSelectedDocDetails] = useState(null);

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

  const validateFile = (file) => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!file) return false;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setErrorMsg("Error: Only PDF files can be uploaded.");
      setSelectedFile(null);
      return false;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setErrorMsg("Error: File exceeds the 10MB maximum limit.");
      setSelectedFile(null);
      return false;
    }

    setSelectedFile(file);
    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    validateFile(file);
  };

  // Drag and Drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    validateFile(file);
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

  const handleDeleteDoc = async (e, id) => {
    e.stopPropagation(); // Avoid opening panel when clicking delete
    if (!window.confirm("Delete this document from the knowledge base? This action will purge all vector embeddings in Pinecone.")) {
      return;
    }

    try {
      await axios.delete(`${DOCS_URL}/${id}`);
      setSuccessMsg("Document purged successfully.");
      if (selectedDocDetails?._id === id) {
        setSelectedDocDetails(null);
      }
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

  // Filter & Search Logic
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.originalName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" ? true : doc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex gap-6 w-full relative">

      {/* LEFT SECTION - Main workspace */}
      <div className="flex-1 flex flex-col gap-6 min-w-0">

        {/* Title Header */}
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Documents Library</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Ingest manuals, reference guides, and FAQs. Documents are chunked and vectorized for semantic search context.
          </p>
        </div>

        {/* Upload Container Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Upload Zone Card */}
          <Card className="md:col-span-1 border border-slate-200 dark:border-slate-850">
            <CardContent className="p-5 flex flex-col gap-4">
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wider">
                Ingest PDF Manual
              </h3>

              <form onSubmit={handleUpload} className="flex flex-col gap-4">

                {/* Drag and Drop Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer relative ${isDragOver
                    ? "border-blue-500 bg-blue-500/5 dark:bg-blue-500/5"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-350 bg-slate-50/20 dark:bg-slate-900/10 hover:bg-slate-50/40 dark:hover:bg-slate-900/20"
                    }`}
                >
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploading}
                  />
                  <Upload className={`w-8 h-8 mb-3 transition-transform duration-200 ${isDragOver ? "transform -translate-y-1 text-blue-500" : "text-slate-400"}`} />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    {selectedFile ? selectedFile.name : "Select or Drop PDF File"}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    {selectedFile ? formatBytes(selectedFile.size) : "PDF manual, max limit 10MB"}
                  </span>
                </div>

                {/* Progress Indicators & Errors */}
                {uploading && (
                  <div className="flex flex-col gap-1.5 p-2 rounded-lg bg-blue-500/5 border border-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px]">
                    <div className="flex justify-between font-bold">
                      <span>Ingesting PDF...</span>
                      <span className="animate-pulse">Loading</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full animate-pulse w-3/4"></div>
                    </div>
                  </div>
                )}

                {errorMsg && (
                  <div className="px-3 py-2 border border-rose-500/10 bg-rose-500/5 text-rose-500 text-[10px] rounded-lg font-semibold flex items-center gap-1.5">
                    <XCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {successMsg && (
                  <div className="px-3 py-2 border border-emerald-500/10 bg-emerald-500/5 text-emerald-600 text-[10px] rounded-lg font-semibold flex items-start gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{successMsg}</span>
                  </div>
                )}

                <div className="flex justify-end gap-2.5">
                  {selectedFile && (
                    <Button variant="outline" size="sm" type="button" onClick={() => setSelectedFile(null)} disabled={uploading} className="font-bold text-[10px] h-8">
                      Cancel
                    </Button>
                  )}
                  <Button variant="default" size="sm" type="submit" disabled={uploading || !selectedFile} className="font-bold text-[10px] h-8 flex-1">
                    {uploading ? "Ingesting..." : "Ingest Document"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Search, Filter, and Data Grid Card */}
          <Card className="md:col-span-2 border border-slate-200 dark:border-slate-850">
            <CardContent className="p-5 flex flex-col gap-4">

              {/* Header Action toolbar */}
              <div className="flex flex-col sm:flex-row gap-3 justify-between">

                {/* Search query input */}
                <div className="flex-1 relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search ingested documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 dark:text-slate-150 outline-none placeholder-slate-400"
                  />
                </div>

                {/* Filter dropdown */}
                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-900 border border-slate-200/65 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-[10px] font-bold text-slate-655 dark:text-slate-250 outline-none cursor-pointer"
                  >
                    <option value="all">All Documents</option>
                    <option value="processed">Processed</option>
                    <option value="processing">Processing</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>

              {/* Data Grid table */}
              {filteredDocuments.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-250 dark:border-slate-800 rounded-xl bg-slate-50/10 dark:bg-slate-950/10">
                  <FileText className="w-8 h-8 text-slate-350 mx-auto" />
                  <p className="text-xs text-slate-400 mt-2">No documents found matching the criteria.</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-slate-100 dark:border-slate-900 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-900 text-slate-400 font-semibold text-[10px] uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/10">
                        <th className="p-3.5">Document Name</th>
                        <th className="p-3.5">Size</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5">Uploaded</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-900/40 text-slate-700 dark:text-slate-300">
                      {filteredDocuments.map((doc) => {
                        const isSelected = selectedDocDetails?._id === doc._id;
                        return (
                          <tr
                            key={doc._id}
                            onClick={() => setSelectedDocDetails(doc)}
                            className={`hover:bg-slate-50/50 dark:hover:bg-slate-900/15 cursor-pointer transition-colors ${isSelected ? "bg-slate-100/50 dark:bg-slate-900/10" : ""
                              }`}
                          >
                            <td className="p-3.5 font-bold max-w-[200px] truncate flex items-center gap-2">
                              <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                              <span title={doc.originalName}>{doc.originalName}</span>
                            </td>
                            <td className="p-3.5 text-slate-450">{formatBytes(doc.size)}</td>
                            <td className="p-3.5">
                              <Badge
                                variant={
                                  doc.status === "processed"
                                    ? "success"
                                    : doc.status === "failed"
                                      ? "danger"
                                      : "warning"
                                }
                                className="capitalize text-[9px] px-2 py-0.5 font-bold"
                              >
                                {doc.status === "uploaded" ? "Ready" : doc.status}
                              </Badge>
                            </td>
                            <td className="p-3.5 text-slate-450">
                              {new Date(doc.createdAt).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </td>
                            <td className="p-3.5 text-right flex items-center justify-end gap-1.5">
                              <button
                                onClick={(e) => { e.stopPropagation(); setSelectedDocDetails(doc); }}
                                className="p-1.5 rounded-lg border border-slate-200/50 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400 hover:text-slate-655"
                                title="Inspect Details"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => handleDeleteDoc(e, doc._id)}
                                className="p-1.5 rounded-lg border border-slate-250/50 dark:border-slate-800 hover:bg-rose-500/5 text-slate-400 hover:text-rose-600"
                                title="Purge Document"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* RIGHT SIDE INSPECTOR PANEL - Slide out details sheet */}
      {selectedDocDetails && (
        <div className="w-80 border border-slate-200 dark:border-slate-850 rounded-2xl bg-white dark:bg-slate-950 p-5 shrink-0 flex flex-col gap-5 self-start sticky top-20 shadow-lg">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-900">
            <span className="text-xs font-bold flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-500" /> Document Details
            </span>
            <button
              onClick={() => setSelectedDocDetails(null)}
              className="p-1 rounded-lg border border-slate-200/60 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-400 hover:text-slate-655"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-col gap-4 text-[10px]">
            <div className="flex flex-col gap-1.5">
              <span className="font-bold text-slate-400 uppercase tracking-wider">Document Name</span>
              <p className="text-slate-800 dark:text-slate-200 text-xs font-bold break-all leading-normal">
                {selectedDocDetails.originalName}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <span className="font-bold text-slate-400 uppercase tracking-wider">Size</span>
                <p className="text-slate-700 dark:text-slate-300 font-semibold">{formatBytes(selectedDocDetails.size)}</p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-bold text-slate-400 uppercase tracking-wider">Status</span>
                <div>
                  <Badge variant={selectedDocDetails.status === "processed" ? "success" : selectedDocDetails.status === "failed" ? "danger" : "warning"}>
                    {selectedDocDetails.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-900 my-1"></div>

            <h4 className="text-[10px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Vector Index Parameters</h4>

            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-slate-500">
                <Calendar className="w-3.5 h-3.5 shrink-0 text-blue-500" />
                <span>Indexed: {new Date(selectedDocDetails.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <Layers className="w-3.5 h-3.5 shrink-0 text-indigo-500" />
                <span>Dimensions: 768-dim Vectors</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <Database className="w-3.5 h-3.5 shrink-0 text-cyan-500" />
                <span>Workspace Namespace: prod-rag-vectors</span>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-900 my-1"></div>

            <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-250/20 dark:border-slate-850/60">
              <div className="flex items-center justify-between text-slate-850 dark:text-slate-250 font-bold mb-1">
                <span>Ingestion Status</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-normal">
                Document parsed, split into recursive characters with overlap, and verified in index.
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
