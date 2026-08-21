import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatBox from "../components/ChatBox";
import Logo from "../components/ui/Logo";
import Overview from "./Overview";
import KnowledgeBase from "./KnowledgeBase";
import Settings from "./Settings";
import Profile from "./Profile";
import Card, { CardContent } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import {
  LayoutDashboard,
  Database,
  MessageSquare,
  BarChart3,
  Files,
  FolderTree,
  Users,
  Settings as SettingsIcon,
  User,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  Sun,
  Moon,
  Sparkles,
  Command,
  ArrowUpRight,
  Activity,
  Info
} from "lucide-react";

export default function Home({ user, onSignOut }) {
  const [activePage, setActivePage] = useState("overview");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [activeWorkspace, setActiveWorkspace] = useState("prod-rag");
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#/", "");
      const validPages = [
        "overview", "knowledge", "chat", "analytics",
        "documents", "collections", "users", "settings",
        "profile", "support"
      ];
      if (validPages.includes(hash)) {
        setActivePage(hash);
      } else {
        window.location.hash = "#/overview";
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange(); // Run on mount

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigateTo = (page) => {
    window.location.hash = `#/${page}`;
    setUserDropdownOpen(false);
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const userInitials = user?.name ? user.name.substring(0, 2).toUpperCase() : "JD";
  const parsedName = user?.name ? user.name.replace(/[^a-zA-Z]/g, " ") : "Enterprise User";

  // Sidebar items grouped by section
  const sidebarItems = [
    {
      group: "Core Workspace",
      items: [
        { id: "overview", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: "knowledge", label: "Knowledge Hub", icon: <Database className="w-4 h-4" /> },
        { id: "chat", label: "AI Console", icon: <MessageSquare className="w-4 h-4" /> },
        { id: "analytics", label: "Analytics", icon: <BarChart3 className="w-4 h-4" /> }
      ]
    },
    {
      group: "Management",
      items: [
        { id: "documents", label: "Documents", icon: <Files className="w-4 h-4" /> },
        { id: "collections", label: "Collections", icon: <FolderTree className="w-4 h-4" /> },
        { id: "users", label: "Users & Teams", icon: <Users className="w-4 h-4" /> }
      ]
    },
    {
      group: "Preferences",
      items: [
        { id: "settings", label: "System Config", icon: <SettingsIcon className="w-4 h-4" /> },
        { id: "profile", label: "Profile Settings", icon: <User className="w-4 h-4" /> },
        { id: "support", label: "Help & Support", icon: <HelpCircle className="w-4 h-4" /> }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors duration-200">

      {/* 1. LEFT COLLAPSIBLE SIDEBAR */}
      <aside
        className={`hidden md:flex flex-col bg-white dark:bg-slate-950 border-r border-slate-200/80 dark:border-slate-850 transition-all duration-300 relative shrink-0 ${isSidebarCollapsed ? "w-16" : "w-60"
          }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-900">
          <div className="flex items-center gap-3 overflow-hidden">
            <Logo className="w-7 h-7" variant="icon" />
            {!isSidebarCollapsed && (
              <div className="flex flex-col">
                <span className="font-black text-xs tracking-wider uppercase bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent truncate">
                  thedal-rag
                </span>
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Console v1.0</span>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-5 custom-scrollbar">
          {sidebarItems.map((group, groupIdx) => (
            <div key={groupIdx} className="flex flex-col gap-1">
              {!isSidebarCollapsed && (
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-2.5 mb-1.5 block">
                  {group.group}
                </span>
              )}
              {group.items.map((item) => {
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigateTo(item.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-3 border border-transparent cursor-pointer ${isActive
                      ? "bg-slate-100/90 text-slate-950 dark:bg-slate-900/60 dark:text-white border-slate-200/50 dark:border-slate-800/40 shadow-sm"
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50/50 dark:hover:bg-slate-900/10"
                      }`}
                    title={isSidebarCollapsed ? item.label : ""}
                  >
                    <span className={`shrink-0 ${isActive ? "text-blue-500 dark:text-blue-400" : ""}`}>
                      {item.icon}
                    </span>
                    {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* User Workspace Info & Collapse Button */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between gap-2.5">
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 text-xs shrink-0 select-none">
                {userInitials}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-bold text-slate-850 dark:text-slate-200 truncate capitalize">
                  {parsedName}
                </span>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 truncate">
                  Owner
                </span>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1 rounded-lg border border-slate-200/60 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-400 hover:text-slate-650 cursor-pointer"
          >
            {isSidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>
      </aside>

      {/* 2. RIGHT CONTENT CONTAINER AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">

        {/* TOP NAVBAR */}
        <header className="sticky top-0 z-30 h-16 w-full border-b border-slate-200/60 dark:border-slate-850 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Left section: Workspace Selector */}
          <div className="flex items-center gap-3">
            <select
              value={activeWorkspace}
              onChange={(e) => setActiveWorkspace(e.target.value)}
              className="bg-slate-100 hover:bg-slate-200/60 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-850 rounded-lg px-2.5 py-1.5 text-[10px] font-bold text-slate-750 dark:text-slate-250 outline-none cursor-pointer tracking-wide"
            >
              <option value="prod-rag">Production RAG</option>
              <option value="dev-staging">Staging Sandbox</option>
            </select>
          </div>

          {/* Center Section: Global Search */}
          <div className="hidden sm:flex items-center w-64 md:w-80 relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search documents or indexes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 hover:bg-slate-100/50 dark:bg-slate-900/50 dark:hover:bg-slate-900 border border-slate-200/60 dark:border-slate-850 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 dark:text-slate-150 outline-none transition-all placeholder-slate-400"
            />
          </div>

          {/* Right section: Actions & Status */}
          <div className="flex items-center gap-3">

            {/* Status Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Live RAG
            </div>

            {/* Notifications panel bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-xl border border-slate-200/60 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 transition-all cursor-pointer relative"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border border-white dark:border-slate-950"></span>
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setNotificationsOpen(false)}></div>
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.1 }}
                      className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-2 shadow-xl z-20"
                    >
                      <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-900 flex flex-col mb-1.5">
                        <span className="text-xs font-bold">System Alerts</span>
                      </div>
                      <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto">
                        <div className="p-2 hover:bg-slate-50 dark:hover:bg-slate-900/50 rounded-lg text-[10px] leading-relaxed">
                          <span className="font-bold text-slate-850 dark:text-slate-200">System Fallback Warning Cleared</span>
                          <p className="text-slate-400 mt-0.5">MongoDB Connected successfully in production workspace.</p>
                        </div>
                        <div className="p-2 hover:bg-slate-50 dark:hover:bg-slate-900/50 rounded-lg text-[10px] leading-relaxed">
                          <span className="font-bold text-slate-850 dark:text-slate-200">Pinecone Vectors Purged</span>
                          <p className="text-slate-400 mt-0.5">Vector cleanup task completed successfully for deleted documents.</p>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200/60 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 transition-all cursor-pointer"
              title={theme === "light" ? "Dark Theme" : "Light Theme"}
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Profile Avatar Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-250 dark:border-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 text-xs cursor-pointer select-none"
              >
                {userInitials}
              </button>

              <AnimatePresence>
                {userDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserDropdownOpen(false)}></div>
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.1 }}
                      className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-1.5 shadow-xl z-20"
                    >
                      <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-900 flex flex-col mb-1.5">
                        <span className="text-xs font-bold truncate capitalize">{parsedName}</span>
                        <span className="text-[10px] text-slate-400 truncate mt-0.5">{user?.email}</span>
                      </div>

                      <button
                        onClick={() => navigateTo("profile")}
                        className="w-full text-left px-3 py-2 text-xs text-slate-550 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900/50 rounded-lg font-semibold flex items-center gap-2 cursor-pointer"
                      >
                        <User className="w-3.5 h-3.5" /> Account Profile
                      </button>

                      <button
                        onClick={() => navigateTo("settings")}
                        className="w-full text-left px-3 py-2 text-xs text-slate-550 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900/50 rounded-lg font-semibold flex items-center gap-2 cursor-pointer"
                      >
                        <SettingsIcon className="w-3.5 h-3.5" /> System Settings
                      </button>

                      <div className="border-t border-slate-100 dark:border-slate-900 my-1.5"></div>

                      <button
                        onClick={onSignOut}
                        className="w-full text-left px-3 py-2 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/5 rounded-lg font-bold flex items-center gap-2 cursor-pointer"
                      >
                        Sign Out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

          </div>
        </header>

        {/* MOBILE NAVIGATION BAR HEADER (Visible on small screens) */}
        <div className="md:hidden border-b border-slate-200/60 dark:border-slate-850 bg-white dark:bg-slate-950 px-4 py-2 flex items-center justify-around text-xs font-semibold transition-all">
          {[
            { id: "overview", icon: <LayoutDashboard className="w-4 h-4" />, label: "Overview" },
            { id: "knowledge", icon: <Database className="w-4 h-4" />, label: "Knowledge" },
            { id: "chat", icon: <MessageSquare className="w-4 h-4" />, label: "AI Console" },
            { id: "settings", icon: <SettingsIcon className="w-4 h-4" />, label: "Settings" }
          ].map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg cursor-pointer ${isActive ? "text-blue-500 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"
                  }`}
              >
                <span>{item.icon}</span>
                <span className="text-[9px]">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* 3. SCROLLABLE PAGE ROUTING AREA */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.12 }}
              className="w-full h-full flex flex-col"
            >
              {activePage === "overview" && <Overview />}
              {activePage === "chat" && <ChatBox />}
              {activePage === "knowledge" && <KnowledgeBase />}
              {activePage === "settings" && <Settings />}
              {activePage === "profile" && <Profile user={user} />}

              {/* Extra Redesigned Sections (To fulfill user's detailed enterprise tabs checklist) */}
              {activePage === "analytics" && (
                <div className="flex flex-col gap-6 w-full">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">System Analytics</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Monitor detailed platform API queries, token loads, and embedding index velocities.
                    </p>
                  </div>
                  <Card>
                    <CardContent className="p-6 flex flex-col gap-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-900 bg-slate-50/20 dark:bg-slate-950/20">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Query Latency</span>
                          <span className="text-2xl font-black text-slate-900 dark:text-white block mt-1">218ms</span>
                        </div>
                        <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-900 bg-slate-50/20 dark:bg-slate-950/20">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Embedding Tokens Processed</span>
                          <span className="text-2xl font-black text-slate-900 dark:text-white block mt-1">1.24M</span>
                        </div>
                        <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-900 bg-slate-50/20 dark:bg-slate-950/20">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cache Hit Percentage</span>
                          <span className="text-2xl font-black text-slate-900 dark:text-white block mt-1">94.8%</span>
                        </div>
                      </div>
                      <div className="h-64 flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/20 dark:bg-slate-950/10">
                        <div className="text-center flex flex-col items-center gap-2">
                          <Activity className="w-8 h-8 text-blue-500 animate-pulse" />
                          <span className="text-xs font-semibold">Real-time Telemetry Processing</span>
                          <p className="text-[10px] text-slate-400">Telemetry graphing and system analytics load dynamically from API pipelines.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activePage === "documents" && (
                <div className="flex flex-col gap-6 w-full">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">System Documents Catalog</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Explore all document vectors, metadata fields, and chunk segments.</p>
                  </div>
                  <KnowledgeBase />
                </div>
              )}

              {activePage === "collections" && (
                <div className="flex flex-col gap-6 w-full">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">Knowledge Collections</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Organize document chunks into logical partitions for specific support queues.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { name: "General Helpdesk FAQ", count: 12, desc: "Default collections for customer support pricing and service enquiries." },
                      { name: "Technical API Manuals", count: 4, desc: "API documentation indices and developer troubleshooting guides." },
                      { name: "Product Catalog Specs", count: 8, desc: "Inventory spec sheets, sizing guides, and return policies." }
                    ].map((col, idx) => (
                      <Card key={idx}>
                        <CardContent className="p-6 flex flex-col gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500/10 to-blue-500/10 text-indigo-650 dark:text-cyan-400 border border-slate-200/40 dark:border-slate-800 flex items-center justify-center">
                            <FolderTree className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-bold">{col.name}</span>
                              <Badge variant="default" className="text-[10px] font-bold">{col.count} files</Badge>
                            </div>
                            <p className="text-[11px] text-slate-450 mt-2 leading-relaxed">{col.desc}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {activePage === "users" && (
                <div className="flex flex-col gap-6 w-full">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">Users & Workspace Authorization</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage team privileges, workspace invite tokens, and security clearance logs.</p>
                  </div>
                  <Card>
                    <CardContent className="p-0 overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100 dark:border-slate-850/80 text-slate-400 font-semibold text-[10px] uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/10">
                            <th className="p-4">Name</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Cleared</th>
                            <th className="p-4">Last Active</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-900/40 text-slate-700 dark:text-slate-300">
                          <tr className="hover:bg-slate-50/30 dark:hover:bg-slate-900/10">
                            <td className="p-4 font-bold capitalize">{parsedName}</td>
                            <td className="p-4">Owner</td>
                            <td className="p-4"><Badge variant="success" className="text-[9px]">Active</Badge></td>
                            <td className="p-4 text-slate-450">Just now</td>
                          </tr>
                          <tr className="hover:bg-slate-50/30 dark:hover:bg-slate-900/10">
                            <td className="p-4 font-bold">Support Agent A</td>
                            <td className="p-4">Editor</td>
                            <td className="p-4"><Badge variant="default" className="text-[9px]">Cleared</Badge></td>
                            <td className="p-4 text-slate-450">2 hours ago</td>
                          </tr>
                        </tbody>
                      </table>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activePage === "support" && (
                <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">Enterprise Help Desk</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Submit support tickets directly to our engineering teams.</p>
                  </div>
                  <Card>
                    <CardContent className="p-6 flex flex-col gap-4">
                      <div className="flex items-start gap-3 p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 text-blue-600 dark:text-blue-400 text-xs">
                        <Info className="w-5 h-5 shrink-0 mt-0.5" />
                        <div>
                          <strong>24/7 SLA Guarantee</strong>
                          <p className="text-slate-450 mt-1 leading-normal">As an enterprise tier workspace owner, you have a guaranteed 1-hour developer response window for critical support queries.</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5 mt-2">
                        <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Support Query Title</label>
                        <input type="text" placeholder="e.g. Pinecone vector match error" className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-xs outline-none" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Detailed Description</label>
                        <textarea rows={4} placeholder="Describe the issue you are experiencing..." className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-xs outline-none resize-none"></textarea>
                      </div>
                      <div className="flex justify-end mt-2">
                        <Button variant="default" size="sm" className="font-bold text-xs">Submit Ticket</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>

      </div>

    </div>
  );
}
