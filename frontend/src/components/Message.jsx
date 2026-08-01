import { useState } from "react";
import ReactMarkdown from "react-markdown";
import Badge from "./ui/Badge";
import { Copy, Check, Sparkles } from "lucide-react";

function Message({ message }) {
  const isUser = message.sender === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-start gap-4 w-full py-5 border-b border-slate-100 dark:border-slate-900/60 last:border-b-0 px-2 group">
      
      {/* Avatar Wrapper */}
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border shadow-[0_1px_2px_0_rgba(0,0,0,0.03)] ${
          isUser
            ? "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-355 font-bold text-xs"
            : "bg-slate-950 border-slate-950 text-white dark:bg-slate-50 dark:border-slate-100 dark:text-slate-900 font-bold"
        }`}
      >
        {isUser ? (
          "U"
        ) : (
          <Sparkles className="w-3.5 h-3.5 text-blue-400 dark:text-blue-600 animate-pulse" />
        )}
      </div>

      {/* Message Content Area */}
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        
        {/* Sender Name & Meta details */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-tight">
            {isUser ? "You" : "KnowledgeHub Assistant"}
          </span>
          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">
            {message.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {!isUser && !message.text && (
            <Badge variant="warning" className="text-[9px] px-1.5 py-0 font-bold">Thinking</Badge>
          )}
        </div>

        {/* Message Markdown Text */}
        <div className="prose-custom text-slate-700 dark:text-slate-300 font-normal">
          {message.text ? (
            <ReactMarkdown>{message.text}</ReactMarkdown>
          ) : (
            <div className="flex items-center gap-1.5 py-1">
              <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-650 rounded-full animate-typing-dot delay-0"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-650 rounded-full animate-typing-dot delay-200"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-650 rounded-full animate-typing-dot delay-400"></span>
            </div>
          )}
        </div>

        {/* Actions (Copy buttons) for AI response */}
        {!isUser && message.text && (
          <div className="flex items-center gap-3 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <button
              onClick={handleCopy}
              className="text-[10px] font-bold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1 transition-colors focus:outline-none cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-500" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
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
