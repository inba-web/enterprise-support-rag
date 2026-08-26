import { useEffect, useState } from "react";
import axios from "axios";
import { API_URLS } from "../config";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import Card, { CardContent, CardHeader } from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import {
  FileText,
  Search,
  Cpu,
  FolderTree,
  Upload,
  MessageSquare,
  Activity,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  Server
} from "lucide-react";

export default function Overview() {
  const [stats, setStats] = useState({
    documentsCount: 0,
    apiQueries: 184,
    embeddingCount: 0,
    collectionsCount: 3,
    activeChats: 5
  });

  const [recentUploads, setRecentUploads] = useState([]);
  const [metricType, setMetricType] = useState("queries");
  const [logFilter, setLogFilter] = useState("all");
  const [activityTimeline, setActivityTimeline] = useState([
    { id: 1, type: "system", event: "Workspace console initialized", status: "success", time: "10m ago" },
    { id: 2, type: "database", event: "MongoDB Atlas cluster online", status: "success", time: "15m ago" },
    { id: 3, type: "index", event: "Pinecone index 'ai-support-assistant' check success", status: "success", time: "16m ago" }
  ]);

  // Chart data for daily queries
  const chartData = [
    { day: "Mon", queries: 24, latency: 190 },
    { day: "Tue", queries: 35, latency: 220 },
    { day: "Wed", queries: 30, latency: 205 },
    { day: "Thu", queries: 48, latency: 240 },
    { day: "Fri", queries: 55, latency: 215 },
    { day: "Sat", queries: 32, latency: 198 },
    { day: "Sun", queries: 42, latency: 210 }
  ];

  useEffect(() => {
    const fetchStatsData = async () => {
      try {
        const response = await axios.get(API_URLS.documents);
        const docs = response.data;

        // Calculate mock embedding count: roughly 4 chunks per doc
        const docsCount = docs.length;
        const processedDocs = docs.filter(d => d.status === "processed").length;
        const totalEmbeddings = processedDocs * 4;

        setStats(prev => ({
          ...prev,
          documentsCount: docsCount,
          embeddingCount: totalEmbeddings
        }));

        setRecentUploads(docs.slice(0, 3));

        if (docs.length > 0) {
          const docActivities = docs.slice(0, 3).map((doc, idx) => ({
            id: `doc-act-${idx}`,
            type: "document",
            event: `File "${doc.originalName}" ingestion status: ${doc.status}`,
            status: doc.status === "processed" ? "success" : doc.status === "failed" ? "danger" : "warning",
            time: new Date(doc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));
          setActivityTimeline(prev => [...docActivities, ...prev.filter(a => typeof a.id === "number")]);
        }
      } catch (err) {
        console.warn("Failed to retrieve dashboard telemetry:", err.message);
      }
    };
    fetchStatsData();
  }, []);

  return (
    <div className="flex flex-col gap-6 w-full">

      {/* 1. Header welcome */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Workspace Overview</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Monitor search latency metrics, vector database capacities, and ingestion activity.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          <Server className="w-3.5 h-3.5 text-blue-500" /> Cluster Node: AWS US-EAST-1
        </div>
      </div>

      {/* 2. KPI Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Card 1: Documents Indexed */}
        <Card className="hover:border-slate-300 dark:hover:border-slate-800 transition-all duration-300">
          <CardContent className="p-5 flex flex-col justify-between h-28">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Documents Ingested</span>
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{stats.documentsCount}</span>
              <div className="text-[9px] text-slate-450 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-500" /> +100% since validation
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Cumulative Queries */}
        <Card className="hover:border-slate-300 dark:hover:border-slate-800 transition-all duration-300">
          <CardContent className="p-5 flex flex-col justify-between h-28">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Queries Logged</span>
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 flex items-center justify-center">
                <Search className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{stats.apiQueries}</span>
              <div className="text-[9px] text-slate-450 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-500" /> +12% query load today
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Embedding Count */}
        <Card className="hover:border-slate-300 dark:hover:border-slate-800 transition-all duration-300">
          <CardContent className="p-5 flex flex-col justify-between h-28">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vector Chunks</span>
              <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <Cpu className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{stats.embeddingCount}</span>
              <div className="text-[9px] text-slate-450 mt-1">768-dim Google Embeddings</div>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Active Chat Sessions */}
        <Card className="hover:border-slate-300 dark:hover:border-slate-800 transition-all duration-300">
          <CardContent className="p-5 flex flex-col justify-between h-28">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Chat Sessions</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{stats.activeChats}</span>
              <div className="text-[9px] text-slate-450 mt-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-500" /> Gemini 3.5 Flash Model
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* 3. Performance Graph (Recharts Area Chart) */}
      <Card className="hover:shadow-sm">
        <CardHeader className="flex justify-between items-center px-6 pt-5 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Query Latency & Load Metrics</h3>
            <span className="text-[10px] text-slate-400">Weekly query hits and performance indicators</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setMetricType("queries")}
              className={`px-3 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${metricType === "queries"
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-850 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                }`}
            >
              Queries
            </button>
            <button
              onClick={() => setMetricType("latency")}
              className={`px-3 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${metricType === "latency"
                  ? "bg-cyan-500 text-white border-cyan-500 shadow-sm"
                  : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-850 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                }`}
            >
              Latency (ms)
            </button>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-2 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={metricType === "queries" ? "#4F46E5" : "#06B6D4"} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={metricType === "queries" ? "#4F46E5" : "#06B6D4"} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-900" />
              <XAxis dataKey="day" tick={{ fontSize: 9, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "11px",
                  color: "inherit"
                }}
              />
              <Area type="monotone" dataKey={metricType} stroke={metricType === "queries" ? "#4F46E5" : "#06B6D4"} strokeWidth={2} fillOpacity={1} fill="url(#colorMetric)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 4. Live Activity Timeline & Ingestion Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Side: Recent Upload Ingestion Queue */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex items-center justify-between px-6 pt-5 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Knowledge Uploads</h3>
            <span className="text-[10px] font-semibold text-slate-400">Database Records</span>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="flex flex-col gap-3">
              {recentUploads.length === 0 ? (
                <div className="py-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/20 dark:bg-slate-950/20">
                  <Upload className="w-7 h-7 text-slate-350 mx-auto" />
                  <p className="text-[10px] text-slate-400 mt-2">No documents uploaded to this workspace yet.</p>
                </div>
              ) : (
                recentUploads.map((doc) => (
                  <div
                    key={doc._id}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/50 dark:border-slate-850 bg-slate-50/20 dark:bg-slate-950/20"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/5 text-blue-500 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-slate-850 dark:text-slate-200 truncate">{doc.originalName}</span>
                        <span className="text-[9px] text-slate-400 mt-0.5">{(doc.size / 1024).toFixed(1)} KB • {new Date(doc.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Badge variant={doc.status === "processed" ? "success" : doc.status === "failed" ? "danger" : "warning"}>
                      {doc.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right Side: Activity Timeline Log */}
        <Card>
          <CardHeader className="flex items-center justify-between px-6 pt-5 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Workspace Audit Logs</h3>
            <div className="flex items-center gap-1.5 text-[9px] text-emerald-500 font-bold uppercase tracking-wider">
              <Activity className="w-3 h-3 animate-pulse" /> Live
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            {/* Filter Pills */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {["all", "system", "database", "document"].map((type) => (
                <button
                  key={type}
                  onClick={() => setLogFilter(type)}
                  className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${logFilter === type
                      ? "bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 border-transparent shadow-sm"
                      : "bg-transparent text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-600 dark:hover:text-slate-200"
                    }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-5 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-slate-100 dark:before:bg-slate-850">
              {activityTimeline
                .filter(log => logFilter === "all" || log.type === logFilter)
                .map((log) => (
                  <div key={log.id} className="flex gap-4 relative">
                    <div className={`w-4 h-4 rounded-full border border-white dark:border-slate-950 flex items-center justify-center shrink-0 z-10 ${log.status === "success" ? "bg-emerald-500" : log.status === "danger" ? "bg-rose-500" : "bg-amber-500"
                      }`}>
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-slate-750 dark:text-slate-250 leading-snug">{log.event}</span>
                      <span className="text-[9px] text-slate-400 mt-0.5">{log.time}</span>
                    </div>
                  </div>
                ))}
              {activityTimeline.filter(log => logFilter === "all" || log.type === logFilter).length === 0 && (
                <p className="text-[10px] text-slate-400 text-center py-4">No audit logs matching this filter category.</p>
              )}
            </div>
          </CardContent>
        </Card>

      </div>

    </div>
  );
}
