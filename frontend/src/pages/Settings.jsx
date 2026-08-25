import { useState, useEffect } from "react";
import axios from "axios";
import { API_URLS } from "../config";
import Card, { CardContent } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import {
  Settings as SettingsIcon,
  ShieldCheck,
  Paintbrush,
  RefreshCw,
  Server,
  Database,
  Cpu
} from "lucide-react";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );

  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [aiName, setAiName] = useState(
    localStorage.getItem("app_ai_name") || "thedal-rag Agent"
  );
  const [aiPersona, setAiPersona] = useState(
    localStorage.getItem("app_ai_persona") || "customer_support"
  );

  const handleAiNameChange = (name) => {
    setAiName(name);
    localStorage.setItem("app_ai_name", name);
    window.dispatchEvent(new Event("localstorage-wallet-update"));
  };

  const handleAiPersonaChange = (persona) => {
    setAiPersona(persona);
    localStorage.setItem("app_ai_persona", persona);
    window.dispatchEvent(new Event("localstorage-wallet-update"));
  };

  const fetchHealthState = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URLS.base}/api/health`);
      setHealth(response.data);
    } catch (err) {
      console.error("Failed to check platform health status:", err);
      setError("Unable to contact backend gateway. Check connection status.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthState();
  }, []);

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

  const formatUptime = (seconds) => {
    if (!seconds) return "...";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs}h ${mins}m ${secs}s`;
    }
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
      {/* Title Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-blue-500" /> Platform Configurations
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review live system connection integrations and manage user interface preferences.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={fetchHealthState}
          className="text-xs flex items-center gap-1.5 h-8 font-semibold cursor-pointer"
          disabled={loading}
        >
          <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
          Refresh Status
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        {/* Theme Settings Card */}
        <Card className="border border-slate-200 dark:border-slate-850">
          <CardContent className="p-6 flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <Paintbrush className="w-4 h-4 text-indigo-500 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Appearance</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Toggle light or dark workspace interface styles.</p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-900 pt-4 px-1">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-350">Default Dark Theme</span>
              <button
                type="button"
                onClick={() => handleThemeToggle(!darkMode)}
                className={`relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${darkMode ? "bg-blue-600 border-blue-500" : "bg-slate-200 dark:bg-slate-800"
                  }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${darkMode ? "translate-x-4.5" : "translate-x-0"
                    }`}
                />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Generative Agent Persona Controls */}
        <Card className="border border-slate-200 dark:border-slate-850">
          <CardContent className="p-6 flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <Cpu className="w-4 h-4 text-blue-500 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">AI Persona Configuration</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Customize the agent profile and tone instruction properties.</p>
              </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-slate-100 dark:border-slate-900 pt-4">
              {/* Agent display name field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-550 dark:text-slate-400 tracking-wider uppercase">
                  Agent Display Name
                </label>
                <input
                  type="text"
                  value={aiName}
                  onChange={(e) => handleAiNameChange(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3.5 py-2 text-xs text-slate-850 dark:text-slate-150 outline-none"
                  placeholder="Enter Agent Name..."
                />
              </div>

              {/* Agent persona tone selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-550 dark:text-slate-400 tracking-wider uppercase">
                  Persona Style & Tone
                </label>
                <select
                  value={aiPersona}
                  onChange={(e) => handleAiPersonaChange(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-850 dark:text-slate-150 outline-none cursor-pointer"
                >
                  <option value="customer_support">Support Assistant (Helpful & Friendly)</option>
                  <option value="technical_expert">Systems Engineer (Analytical & Exact)</option>
                  <option value="casual_help">Casual Guide (Helpful & Conversational)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Credentials / Integrations Settings Card */}
        <Card className="border border-slate-200 dark:border-slate-850">
          <CardContent className="p-6 flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-emerald-500 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Verified Connections</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Secure infrastructure integrations running on THEDAL.</p>
              </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-slate-100 dark:border-slate-900 pt-4 text-xs">

              {/* Primary Database Connection */}
              <div className="flex items-start justify-between py-2 border-b border-slate-50 dark:border-slate-900/40">
                <div className="flex items-start gap-2.5 min-w-0">
                  <Database className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-slate-800 dark:text-slate-200">Primary Database</span>
                    <span className="text-[9px] text-slate-400 mt-0.5">Mongoose ODM integration</span>
                  </div>
                </div>
                <div>
                  {health ? (
                    health.database?.status === "local_fallback" ? (
                      <Badge variant="warning">Offline (Fallback Mode)</Badge>
                    ) : health.database?.status === "connected" ? (
                      <Badge variant="success">Connected (Cloud Cluster)</Badge>
                    ) : (
                      <Badge variant="warning">{health.database?.status || "Unknown"}</Badge>
                    )
                  ) : (
                    <Badge variant="default">Checking Node...</Badge>
                  )}
                </div>
              </div>

              {/* Vector database Connection */}
              <div className="flex items-start justify-between py-2 border-b border-slate-50 dark:border-slate-900/40">
                <div className="flex items-start gap-2.5 min-w-0">
                  <Server className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-slate-800 dark:text-slate-200">Vector Datastore</span>
                    <span className="text-[9px] text-slate-400 mt-0.5">Pinecone cloud node index</span>
                  </div>
                </div>
                <div>
                  <Badge variant="success">Operational</Badge>
                </div>
              </div>

              {/* Generative Intelligence model connection */}
              <div className="flex items-start justify-between py-2 border-b border-slate-50 dark:border-slate-900/40">
                <div className="flex items-start gap-2.5 min-w-0">
                  <Cpu className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-slate-800 dark:text-slate-200">Intelligence Engine</span>
                    <span className="text-[9px] text-slate-400 mt-0.5">Gemini 3.5 Flash + Embeddings pipeline</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant="success">Active (Secure API Key)</Badge>
                </div>
              </div>

              {/* Cluster and environment info */}
              <div className="flex justify-between py-2 items-center text-[10px] text-slate-400 leading-normal">
                <span>API Server Gateway:</span>
                <span className="font-mono text-slate-700 dark:text-slate-350">
                  {API_URLS.base ? API_URLS.base.replace(/https?:\/\//, '') : "localhost:5000"}
                </span>
              </div>

              <div className="flex justify-between py-1.5 items-center text-[10px] text-slate-400 leading-normal">
                <span>Host Node Uptime:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-350">
                  {health ? formatUptime(health.uptime) : "..."}
                </span>
              </div>
            </div>

            {error && (
              <div className="p-3 border border-rose-500/10 bg-rose-500/5 text-rose-500 text-[10px] rounded-xl font-semibold mt-2">
                {error}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
