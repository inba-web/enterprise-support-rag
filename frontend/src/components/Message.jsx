import { useState } from "react";
import ReactMarkdown from "react-markdown";
import Badge from "./ui/Badge";

function Message({ message }) {
  const isUser = message.sender === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-start gap-4 w-full py-5 border-b border-slate-100 dark:border-slate-800/60 last:border-b-0 px-2 group">
      
      {/* Avatar Wrapper */}
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border shadow-[0_1px_2px_0_rgba(0,0,0,0.03)] ${
          isUser
            ? "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs"
            : "bg-slate-900 border-slate-950 text-white dark:bg-slate-50 dark:border-slate-100 dark:text-slate-900 font-bold"
        }`}
      >
        {isUser ? (
          "U"
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        )}
      </div>

      {/* Message Content Area */}
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        
        {/* Sender Name & Meta details */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-tight">
            {isUser ? "You" : "SyncVantage Assistant"}
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">
            {message.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {!isUser && !message.text && (
            <Badge variant="warning" className="text-[9px] px-1.5 py-0">Typing</Badge>
          )}
        </div>

        {/* Message Markdown Text */}
        <div className="prose-custom text-slate-700 dark:text-slate-300 font-normal">
          {message.text ? (
            <ReactMarkdown>{message.text}</ReactMarkdown>
          ) : (
            <div className="flex items-center gap-1.5 py-1">
              <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-600 rounded-full animate-typing-dot delay-0"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-600 rounded-full animate-typing-dot delay-200"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-600 rounded-full animate-typing-dot delay-400"></span>
            </div>
          )}
        </div>

        {/* Actions (Copy buttons) for AI response */}
        {!isUser && message.text && (
          <div className="flex items-center gap-3 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <button
              onClick={handleCopy}
              className="text-[10px] font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 transition-colors focus:outline-none"
            >
              {copied ? (
                <>
                  <svg className="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Copied
                </>
              ) : (
                <>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  Copy response
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default Message;
