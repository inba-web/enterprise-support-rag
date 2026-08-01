import { useState, useEffect } from "react";
import Card, { CardContent } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Badge from "../components/ui/Badge";
import {
  Settings as SettingsIcon,
  Key,
  Database,
  Cpu,
  Paintbrush,
  Check,
  Save
} from "lucide-react";

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
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-blue-500" /> Platform Settings
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Adjust platform preferences, credentials, and language model options.
        </p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">

        {/* Theme Settings Card */}
        <Card className="border border-slate-200 dark:border-slate-850">
          <CardContent className="p-6 flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <Paintbrush className="w-4 h-4 text-indigo-500 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Visual Theme</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Toggle light or dark mode user interface preferences.</p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-900 pt-4 px-1">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Dark Mode Interface</span>
              <button
                type="button"
                onClick={() => handleThemeToggle(!darkMode)}
                className={`relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${darkMode ? "bg-slate-900 border-slate-800 dark:bg-slate-100" : "bg-slate-250"
                  }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${darkMode ? "translate-x-4.5 dark:bg-slate-900" : "translate-x-0"
                    }`}
                />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Credentials Settings Card */}
        <Card className="border border-slate-200 dark:border-slate-850">
          <CardContent className="p-6 flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <Key className="w-4 h-4 text-cyan-500 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">API Integration Keys</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Manage vector store access keys and neural credentials.</p>
              </div>
            </div>

            <div className="flex flex-col gap-4.5 border-t border-slate-100 dark:border-slate-900 pt-4">

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-0.5">
                  Gemini API Key
                </label>
                <Input
                  type="password"
                  value={keys.geminiKey}
                  onChange={(e) => setKeys(prev => ({ ...prev, geminiKey: e.target.value }))}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-0.5">
                  Pinecone API Key
                </label>
                <Input
                  type="password"
                  value={keys.pineconeKey}
                  onChange={(e) => setKeys(prev => ({ ...prev, pineconeKey: e.target.value }))}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-0.5">
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
        <Card className="border border-slate-200 dark:border-slate-850">
          <CardContent className="p-6 flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <Cpu className="w-4 h-4 text-violet-500 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Generative Model (LLM)</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Select model parameters for conversational contexts.</p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-900 pt-4 px-1">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-350">Active Generation Model</span>
              <select
                value={activeModel}
                onChange={(e) => setActiveModel(e.target.value)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-100 outline-none cursor-pointer"
              >
                <option value="gemini-3.5-flash">Gemini 3.5 Flash (Default)</option>
                <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Save Controls */}
        <div className="flex justify-end items-center gap-3">
          {saved && (
            <Badge variant="success" className="font-bold text-[9px] px-2.5 py-0.5">
              <Check className="w-3 h-3 mr-1 inline" /> Saved Successfully!
            </Badge>
          )}
          <Button
            type="submit"
            variant="default"
            className="px-5 h-9 font-bold text-xs flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" /> Save configurations
          </Button>
        </div>

      </form>
    </div>
  );
}
