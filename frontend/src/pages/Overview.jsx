import { useEffect, useState } from "react";
import axios from "axios";
import Card, { CardContent, CardHeader } from "../components/ui/Card";
import Badge from "../components/ui/Badge";

export default function Overview() {
  const [stats, setStats] = useState({
    activeChats: 3,
    documentsCount: 0,
    apiQueries: 142,
    uptime: "99.99%"
  });

  const [auditLogs, setAuditLogs] = useState([
    { id: 1, event: "Express server initialized", status: "success", time: "Just now" },
    { id: 2, event: "MongoDB Connected: Cluster0", status: "success", time: "10 mins ago" },
    { id: 3, event: "Pinecone index check: ai-support-assistant", status: "success", time: "11 mins ago" },
    { id: 4, event: "Environment configurations loaded successfully", status: "success", time: "15 mins ago" }
  ]);

  useEffect(() => {
    // Dynamically retrieve document count
    const fetchDocCount = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/documents");
        setStats(prev => ({
          ...prev,
          documentsCount: response.data.length
        }));

        // Add uploaded documents events dynamically to the audit log if any exist
        if (response.data.length > 0) {
          const docLogs = response.data.slice(0, 3).map((doc, idx) => ({
            id: `doc-${idx}`,
            event: `PDF Document "${doc.originalName}" loaded (${doc.status})`,
            status: doc.status === "failed" ? "danger" : doc.status === "processed" ? "success" : "warning",
            time: new Date(doc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));
          setAuditLogs(prev => [...docLogs, ...prev.filter(l => typeof l.id === "number")]);
        }
      } catch (err) {
        console.warn("Failed to retrieve stats from API:", err.message);
      }
    };
    fetchDocCount();
  }, []);

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      
      {/* Overview Title Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Overview</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Monitor search metrics, vector database indexes, and database logs.
        </p>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {[
          { title: "Active Session Chats", value: stats.activeChats, badge: "Live", badgeVar: "success", desc: "User conversations" },
          { title: "Knowledge Documents", value: stats.documentsCount, badge: `${stats.documentsCount} loaded`, badgeVar: stats.documentsCount > 0 ? "success" : "default", desc: "RAG training materials" },
          { title: "Cumulative Queries", value: stats.apiQueries, badge: "+12% today", badgeVar: "info", desc: "Chat RAG requests" },
          { title: "Platform SLA Uptime", value: stats.uptime, badge: "Stable", badgeVar: "success", desc: "Health status OK" }
        ].map((item, index) => (
          <Card key={index}>
            <CardContent className="p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {item.title}
                </span>
                <Badge variant={item.badgeVar}>{item.badge}</Badge>
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
                  {item.value}
                </span>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{item.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Grid: SVG Performance Graph & Audit Log List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Performance Chart Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Query Volume (Weekly)</h3>
            <span className="text-[10px] font-medium text-slate-400">Hits/Hour</span>
          </CardHeader>
          <CardContent className="p-5 flex justify-center items-center h-64">
            {/* Minimalist SVG Vector Line Chart (Stripe-style) */}
            <svg viewBox="0 0 500 200" className="w-full h-full text-slate-300 dark:text-slate-800">
              {/* Grid Lines */}
              <line x1="0" y1="40" x2="500" y2="40" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4,4" />
              <line x1="0" y1="90" x2="500" y2="90" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4,4" />
              <line x1="0" y1="140" x2="500" y2="140" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4,4" />
              
              {/* Chart Line Path */}
              <path
                d="M 10 160 Q 80 130 150 145 T 290 80 T 430 50 T 490 65"
                fill="none"
                stroke="rgb(79, 70, 229)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              
              {/* Shadow Fill Area */}
              <path
                d="M 10 160 Q 80 130 150 145 T 290 80 T 430 50 T 490 65 L 490 200 L 10 200 Z"
                fill="url(#gradient-purple)"
                opacity="0.06"
              />

              {/* Vector definitions */}
              <defs>
                <linearGradient id="gradient-purple" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgb(79, 70, 229)" />
                  <stop offset="100%" stopColor="rgb(79, 70, 229)" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Data points */}
              <circle cx="290" cy="80" r="4.5" fill="rgb(79, 70, 229)" stroke="white" strokeWidth="1.5" className="cursor-pointer" />
              <circle cx="430" cy="50" r="4.5" fill="rgb(79, 70, 229)" stroke="white" strokeWidth="1.5" className="cursor-pointer" />
              
              {/* Day Labels */}
              <text x="10" y="195" fill="currentColor" fontSize="9" fontWeight="500">Mon</text>
              <text x="90" y="195" fill="currentColor" fontSize="9" fontWeight="500">Tue</text>
              <text x="170" y="195" fill="currentColor" fontSize="9" fontWeight="500">Wed</text>
              <text x="250" y="195" fill="currentColor" fontSize="9" fontWeight="500">Thu</text>
              <text x="330" y="195" fill="currentColor" fontSize="9" fontWeight="500">Fri</text>
              <text x="410" y="195" fill="currentColor" fontSize="9" fontWeight="500">Sat</text>
              <text x="470" y="195" fill="currentColor" fontSize="9" fontWeight="500">Sun</text>
            </svg>
          </CardContent>
        </Card>

        {/* Audit Log list card */}
        <Card>
          <CardHeader>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">Audit Log</h3>
            <span className="text-[10px] font-semibold text-emerald-500">Live</span>
          </CardHeader>
          <CardContent className="p-5 flex flex-col gap-4">
            {auditLogs.map((log) => (
              <div key={log.id} className="flex items-start justify-between gap-3 border-b border-slate-50 dark:border-slate-800/50 pb-3 last:border-b-0 last:pb-0">
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate" title={log.event}>
                    {log.event}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{log.time}</span>
                </div>
                <Badge variant={log.status === "success" ? "success" : log.status === "danger" ? "danger" : "warning"}>
                  •
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

      </div>

    </div>
  );
}
