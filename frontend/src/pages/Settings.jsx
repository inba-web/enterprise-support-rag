import { useState, useEffect } from "react";
import Card, { CardContent } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Badge from "../components/ui/Badge";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );

  const [keys, setKeys] = useState({
    geminiKey: localStorage.getItem("DEMO_GEMINI_KEY") || "••••••••••••••••••••••••",
    pineconeKey: localStorage.getItem("DEMO_PINECONE_KEY") || "••••••••••••••••••••••••",
    indexName: localStorage.getItem("DEMO_INDEX_NAME") || "ai-support-assistant"
  });

  const [activeModel, setActiveModel] = useState("gemini-3.5-flash");
  const [saved, setSaved] = useState(false);

  // Sync theme changes with DOM
  const handleThemeToggle = (checked) => {
    setDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem("DEMO_GEMINI_KEY", keys.geminiKey);
    localStorage.setItem("DEMO_PINECONE_KEY", keys.pineconeKey);
    localStorage.setItem("DEMO_INDEX_NAME", keys.indexName);
    
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
      
      {/* Title Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Settings</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Adjust platform preferences, credentials, and language model options.
        </p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        
        {/* Theme Settings Card */}
        <Card>
          <CardContent className="p-6 flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-1">Visual Theme</h3>
              <p className="text-[11px] text-slate-400">Toggle dark mode interface preferences.</p>
            </div>
            
            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-4">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Dark Mode</span>
              <button
                type="button"
                onClick={() => handleThemeToggle(!darkMode)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  darkMode ? "bg-slate-900 border-slate-700 dark:bg-slate-100" : "bg-slate-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    darkMode ? "translate-x-4 dark:bg-slate-900" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Credentials Settings Card */}
        <Card>
          <CardContent className="p-6 flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-1">API Integration Keys</h3>
              <p className="text-[11px] text-slate-400">Manage vector store access keys and neural credentials.</p>
            </div>

            <div className="flex flex-col gap-4 border-t border-slate-100 dark:border-slate-800/80 pt-4">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Gemini API Key
                </label>
                <Input
                  type="password"
                  value={keys.geminiKey}
                  onChange={(e) => setKeys(prev => ({ ...prev, geminiKey: e.target.value }))}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Pinecone API Key
                </label>
                <Input
                  type="password"
                  value={keys.pineconeKey}
                  onChange={(e) => setKeys(prev => ({ ...prev, pineconeKey: e.target.value }))}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Pinecone Index Name
                </label>
                <Input
                  type="text"
                  value={keys.indexName}
                  onChange={(e) => setKeys(prev => ({ ...prev, indexName: e.target.value }))}
                />
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Model Configurations Card */}
        <Card>
          <CardContent className="p-6 flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-1">Large Language Model (LLM)</h3>
              <p className="text-[11px] text-slate-400">Select model sizing for RAG question answering.</p>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-4">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Active Model</span>
              <select
                value={activeModel}
                onChange={(e) => setActiveModel(e.target.value)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-100 outline-none"
              >
                <option value="gemini-3.5-flash">Gemini 3.5 Flash (Default)</option>
                <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                <option value="gemini-2.5-pro">Gemini 2.5 Pro (Analytical)</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Save Controls */}
        <div className="flex justify-end items-center gap-3">
          {saved && (
            <Badge variant="success">Saved Successfully!</Badge>
          )}
          <Button
            type="submit"
            variant="default"
            className="px-5 h-9 font-bold text-xs"
          >
            Save configurations
          </Button>
        </div>

      </form>
    </div>
  );
}
