import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatBox from "../components/ChatBox";
import Overview from "./Overview";
import KnowledgeBase from "./KnowledgeBase";
import Settings from "./Settings";
import Profile from "./Profile";
import Button from "../components/ui/Button";

export default function Home({ user, onSignOut }) {
  const [activePage, setActivePage] = useState("overview");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [showBanner, setShowBanner] = useState(true);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#/", "");
      if (["overview", "chat", "knowledge", "settings", "profile"].includes(hash)) {
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

  // Navigation items config
  const navItems = [
    { id: "overview", label: "Dashboard", icon: "📊" },
    { id: "chat", label: "AI Console", icon: "💬" },
    { id: "knowledge", label: "Knowledge Hub", icon: "📤" },
    { id: "settings", label: "System Config", icon: "⚙️" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      
      {/* 1. Header Alert Banner */}
      {showBanner && (
        <div className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2 flex items-center justify-between text-xs font-semibold select-none border-b border-slate-800 dark:border-slate-200">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-center">
            <span>💡</span>
            <span>Enterprise Workspace: Custom API Keys can be configured in the <button onClick={() => navigateTo("settings")} className="underline hover:text-slate-350 dark:hover:text-slate-700">System Config</button> tab to connect live models.</span>
          </div>
          <button onClick={() => setShowBanner(false)} className="text-slate-400 hover:text-white dark:text-slate-500 dark:hover:text-slate-900 font-bold p-1 cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* 2. Glassmorphic Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-850 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateTo("overview")}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-650 to-blue-500 dark:from-indigo-500 dark:to-cyan-400 flex items-center justify-center font-bold text-white text-base shadow-[0_2px_10px_-2px_rgba(79,70,229,0.3)]">
              S
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 dark:from-white dark:via-slate-200 dark:to-indigo-200 bg-clip-text text-transparent">
                SyncVantage AI
              </span>
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Enterprise Hub</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 h-full">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className={`relative px-4 py-2 text-xs font-semibold transition-all rounded-lg flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? "bg-slate-100/80 text-slate-950 dark:bg-slate-900/60 dark:text-white"
                      : "text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900/30"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Actions & Avatar */}
          <div className="flex items-center gap-3">
            
            {/* Status Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              RAG API Active
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-450 transition-all cursor-pointer"
              title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>

            {/* Profile Avatar Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-250 dark:border-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 text-xs cursor-pointer select-none"
              >
                {userInitials}
              </button>

              <AnimatePresence>
                {userDropdownOpen && (
                  <>
                    {/* Overlay to close on click outside */}
                    <div className="fixed inset-0 z-10" onClick={() => setUserDropdownOpen(false)}></div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.1 }}
                      className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-1.5 shadow-xl z-20"
                    >
                      <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-900 flex flex-col mb-1.5">
                        <span className="text-xs font-bold text-slate-850 dark:text-slate-200 truncate capitalize">
                          {parsedName}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                          {user?.email}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => navigateTo("profile")}
                        className="w-full text-left px-3 py-2 text-xs text-slate-650 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900/50 rounded-lg font-semibold flex items-center gap-2.5 cursor-pointer"
                      >
                        👤 Account Profile
                      </button>

                      <button
                        onClick={() => navigateTo("settings")}
                        className="w-full text-left px-3 py-2 text-xs text-slate-650 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900/50 rounded-lg font-semibold flex items-center gap-2.5 cursor-pointer"
                      >
                        ⚙️ System Settings
                      </button>
                      
                      <div className="border-t border-slate-100 dark:border-slate-900 my-1.5"></div>
                      
                      <button
                        onClick={onSignOut}
                        className="w-full text-left px-3 py-2 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/5 rounded-lg font-bold flex items-center gap-2.5 cursor-pointer"
                      >
                        🚪 Sign Out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </header>

      {/* 3. Mobile Navigation Header (Only visible on small screens) */}
      <div className="md:hidden border-b border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 px-4 py-2.5 flex items-center justify-around text-xs font-semibold transition-all">
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`flex flex-col items-center gap-1.5 py-1 px-3 rounded-lg cursor-pointer ${
                isActive ? "text-indigo-650 dark:text-cyan-400" : "text-slate-400 dark:text-slate-500"
              }`}
            >
              <span className="text-sm">{item.icon}</span>
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. Page Contents Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.15 }}
            className="w-full h-full flex flex-col"
          >
            {activePage === "overview" && <Overview />}
            {activePage === "chat" && <ChatBox />}
            {activePage === "knowledge" && <KnowledgeBase />}
            {activePage === "settings" && <Settings />}
            {activePage === "profile" && <Profile user={user} />}
          </motion.div>
        </AnimatePresence>
      </main>

    </div>
  );
}
