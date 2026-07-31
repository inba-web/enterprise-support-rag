import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import ChatBox from "../components/ChatBox";
import Overview from "./Overview";
import Settings from "./Settings";
import Profile from "./Profile";
import Card, { CardContent } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";

const DOCS_URL = "http://localhost:5000/api/documents";

export default function Home({ user, onSignOut }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  // Knowledge base state variables
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
      console.error("Failed to load documents catalogue:", err);
    }
  };

  useEffect(() => {
    if (activeTab === "knowledge") {
      fetchDocuments();
      setErrorMsg("");
      setSuccessMsg("");
    }
  }, [activeTab]);

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

  const parsedName = user?.name ? user.name.replace(/[^a-zA-Z]/g, " ") : "John Doe";
  const userInitials = user?.name ? user.name.substring(0, 2).toUpperCase() : "JD";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col md:flex-row transition-colors">
      
      {/* SaaS Sidebar layout (Stripe / Vercel style) */}
      <aside className={`bg-white dark:bg-slate-950 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col justify-between shrink-0 ${
        isSidebarCollapsed ? "w-full md:w-16" : "w-full md:w-64"
      } p-4 md:p-5`}>
        
        <div className="flex flex-col gap-6">
          {/* Brand logotype header */}
          <div className="flex items-center gap-2.5 px-1 justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-slate-50 flex items-center justify-center font-bold text-white dark:text-slate-900 text-base shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
                Ω
              </div>
              {!isSidebarCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-xs tracking-wide truncate">Antigravity AI</span>
                  <span className="text-[9px] uppercase font-bold text-slate-400 mt-0.5 tracking-wider">Console v1.0</span>
                </div>
              )}
            </div>
            
            {/* Collapse Sidebar Button (Hidden on Mobile) */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden md:block text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-md focus:outline-none"
            >
              {isSidebarCollapsed ? "→" : "←"}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            {[
              { id: "overview", label: "Overview", icon: "📊" },
              { id: "chat", label: "Chat Assistant", icon: "💬" },
              { id: "knowledge", label: "Knowledge Base", icon: "📤" },
              { id: "settings", label: "Settings", icon: "⚙️" },
              { id: "profile", label: "Profile", icon: "👤" }
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-3 focus:outline-none ${
                  activeTab === link.id
                    ? "bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-50 border border-slate-200 dark:border-slate-800"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-450 dark:hover:text-slate-200 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 border border-transparent"
                }`}
              >
                <span className="text-base shrink-0">{link.icon}</span>
                {!isSidebarCollapsed && <span className="truncate">{link.label}</span>}
              </button>
            ))}
          </nav>
        </div>

        {/* User Card & Logout Trigger */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 mt-6">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 text-xs shrink-0">
              {userInitials}
            </div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-bold text-slate-850 dark:text-slate-250 truncate capitalize">
                  {parsedName}
                </span>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                  {user?.email}
                </span>
              </div>
            )}
          </div>
          {!isSidebarCollapsed && (
            <button
              onClick={onSignOut}
              className="text-[10px] text-slate-400 hover:text-rose-500 font-semibold p-1 hover:bg-rose-500/5 rounded-md transition-colors focus:outline-none"
              title="Sign Out"
            >
              🚪
            </button>
          )}
        </div>
      </aside>

      {/* Main Panel Area (Vercel-like padding splits) */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Banner header alert */}
        {showBanner && (
          <div className="bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 px-6 py-2.5 flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-2 text-[10px] font-semibold tracking-wide">
              <span>💡</span>
              <p>Demo Workspace Mode. Setup API Keys inside the Settings tab to connect live neural chains.</p>
            </div>
            <button onClick={() => setShowBanner(false)} className="text-slate-400 hover:text-white dark:text-slate-500 dark:hover:text-slate-900 text-xs font-bold p-1">
              ✕
            </button>
          </div>
        )}

        <div className="p-6 md:p-8 flex-1 w-full max-w-5xl mx-auto flex flex-col gap-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.12 }}
              className="flex-1 flex flex-col"
            >
              {activeTab === "overview" && <Overview />}
              {activeTab === "chat" && <ChatBox />}
              {activeTab === "settings" && <Settings />}
              {activeTab === "profile" && <Profile user={user} />}
              
              {activeTab === "knowledge" && (
                <div className="flex flex-col gap-6">
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
                      <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-3">
                        Upload PDF Document
                      </h3>
                      <form onSubmit={handleUpload} className="flex flex-col gap-4">
                        <div className="border border-dashed border-slate-200 dark:border-slate-800 hover:border-slate-950 dark:hover:border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50/30 dark:bg-slate-900/10 hover:bg-slate-50/60 dark:hover:bg-slate-900/30 transition-all cursor-pointer relative">
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
                          <span className="text-[10px] text-slate-400">
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
                      <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-3">
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
                                <tr key={doc._id} className="text-slate-700 dark:text-slate-300 hover:bg-slate-50/30 dark:hover:bg-slate-900/10">
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
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

    </div>
  );
}
