import Card, { CardContent } from "../components/ui/Card";
import Badge from "../components/ui/Badge";

export default function Profile({ user = { name: "john.doe", email: "john.doe@company.com" } }) {
  const parsedName = user.name ? user.name.replace(/[^a-zA-Z]/g, " ") : "John Doe";
  const initial = user.name ? user.name.substring(0, 2).toUpperCase() : "JD";

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
      
      {/* Title Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Profile Settings</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage personal credentials, security keys, and account options.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        
        {/* Profile Card Summary */}
        <Card>
          <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-5">
            {/* Avatar block */}
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 text-xl shadow-inner shrink-0">
              {initial}
            </div>
            
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-50 capitalize truncate">
                  {parsedName}
                </h3>
                <Badge variant="success">Admin</Badge>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{user.email}</p>
            </div>
          </CardContent>
        </Card>

        {/* Security / Permissions details card */}
        <Card>
          <CardContent className="p-6 flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-1">Console Permissions</h3>
              <p className="text-[11px] text-slate-400">Account status and organizational privileges.</p>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-100 dark:border-slate-800/80 pt-4 text-xs">
              
              <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-800/40">
                <span className="font-medium text-slate-500 dark:text-slate-400">Security Clearance</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">Level 4 (Owner)</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-800/40">
                <span className="font-medium text-slate-500 dark:text-slate-400">Organizations</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">SyncVantage Workspace</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-800/40">
                <span className="font-medium text-slate-500 dark:text-slate-400">Indexing Authority</span>
                <Badge variant="success">Granted</Badge>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="font-medium text-slate-500 dark:text-slate-400">Joined On</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">July 31, 2026</span>
              </div>

            </div>
          </CardContent>
        </Card>

      </div>

    </div>
  );
}
