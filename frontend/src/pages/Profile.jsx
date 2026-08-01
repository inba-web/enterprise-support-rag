import Card, { CardContent } from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import { User, ShieldCheck, Database, Calendar } from "lucide-react";

export default function Profile({ user = { name: "john.doe", email: "john.doe@company.com" } }) {
  const parsedName = user.name ? user.name.replace(/[^a-zA-Z]/g, " ") : "John Doe";
  const initial = user.name ? user.name.substring(0, 2).toUpperCase() : "JD";

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
      
      {/* Title Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <User className="w-5 h-5 text-blue-500" /> Account Profile
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage personal credentials, security keys, and account options.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        
        {/* Profile Card Summary */}
        <Card className="border border-slate-200 dark:border-slate-850">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-5">
            {/* Avatar block */}
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center font-extrabold text-slate-700 dark:text-slate-300 text-lg shadow-inner shrink-0 select-none">
              {initial}
            </div>
            
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white capitalize truncate">
                  {parsedName}
                </h3>
                <Badge variant="success" className="font-bold text-[9px] px-1.5 py-0">Administrator</Badge>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{user.email}</p>
            </div>
          </CardContent>
        </Card>

        {/* Security / Permissions details card */}
        <Card className="border border-slate-200 dark:border-slate-850">
          <CardContent className="p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
              <div>
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Console Permissions</h3>
                <p className="text-[10px] text-slate-400">Account status and organizational privileges.</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-100 dark:border-slate-900 pt-4 text-xs">
              
              <div className="flex items-center justify-between py-1.5 border-b border-slate-50 dark:border-slate-900/40">
                <span className="font-medium text-slate-400 dark:text-slate-500">Security Clearance</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">Level 4 (Owner)</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-50 dark:border-slate-900/40">
                <span className="font-medium text-slate-400 dark:text-slate-500">Active Workspace</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">KnowledgeHub Workspace</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-50 dark:border-slate-900/40">
                <span className="font-medium text-slate-400 dark:text-slate-500">Indexing Authority</span>
                <Badge variant="success" className="text-[9px] font-bold">Granted</Badge>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="font-medium text-slate-400 dark:text-slate-500">Joined On</span>
                <span className="font-bold text-slate-850 dark:text-slate-200 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-500" /> August 1, 2026
                </span>
              </div>

            </div>
          </CardContent>
        </Card>

      </div>

    </div>
  );
}
