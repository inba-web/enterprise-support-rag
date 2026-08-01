import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Message from "./Message";
import Button from "./ui/Button";
import Badge from "./ui/Badge";

const API_URL = "http://localhost:5000/api/chat";

// Mock conversation history listing
const INITIAL_CONVERSATIONS = [
  { id: "conv-1", title: "General Inquiries & Pricing", summary: "View billing tiers and SLA uptime options." },
  { id: "conv-2", title: "Refund Policy Details", summary: "Request processes for transaction offsets." },
  { id: "conv-3", title: "Password Reset Troubleshooting", summary: "Reset guidelines for developer login portals." }
];

export default function ChatBox() {
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState("conv-1");
  
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! Welcome to the AI Support Console. Ask me questions about pricing, returns, or user account recoveries.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSimulatedMode, setIsSimulatedMode] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Advanced UX states: Voice & Attachments
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Simulate prompt suggestion clicks
  const handleSuggestionClick = (keyword) => {
    setInput(keyword);
    handleSend(keyword);
  };

  // Process RAG API or simulated fallback replies
  const handleSend = async (textToSend = input) => {
    const cleanText = textToSend.trim();
    if (!cleanText) return;

    const userMsg = {
      sender: "user",
      text: cleanText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setAttachedFile(null); // Clear attachment on send

    try {
      const response = await axios.post(API_URL, { message: cleanText });
      
      if (response.data.simulated) {
        setIsSimulatedMode(true);
        triggerMockReply(cleanText);
      } else {
        setIsSimulatedMode(false);
        let text = response.data.text;
        if (response.data.sources && response.data.sources.length > 0) {
          text += `\n\n*(Sources: ${response.data.sources.join(", ")})*`;
        }
        triggerReply(text);
      }
    } catch (err) {
      console.warn("RAG pipeline offline. Accessing local simulator:", err.message);
      setIsSimulatedMode(true);
      triggerMockReply(cleanText);
    }
  };

  const triggerReply = (text) => {
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      
      // Trigger feedback prompt occasionally
      if (messages.length >= 3) {
        setTimeout(() => setShowRating(true), 800);
      }
    }, 1500);
  };

  // Local simulated responses matching help-desk keywords
  const triggerMockReply = (userText) => {
    const textLower = userText.toLowerCase();
    let reply = `I'm ready to answer. Please load document manual PDFs or enter API keys in settings to configure custom answers.`;

    if (textLower.includes("pricing") || textLower.includes("cost") || textLower.includes("plan")) {
      reply = `### Pricing & Service Tiers
We offer three main pricing structures:
1. **Basic**: Free (1 chatbot, 100 queries/mo).
2. **Pro**: $29/mo (3 chatbots, unlimited chats, priority indexing).
3. **Enterprise**: Custom quotes (SLA agreements, private server, custom RAG channels).

*To upgrade, navigate to Billings under settings.*`;
    } else if (textLower.includes("refund") || textLower.includes("return") || textLower.includes("policy")) {
      reply = `### Return & Refund Guidelines
Our standard policy outlines:
* Full refunds are permitted within **14 days** of subscription creation.
* Cancellations stop subsequent renewal payments instantly.
* Mail queries to \`billing@aisupport.com\` to initiate a dispute.`;
    } else if (textLower.includes("password") || textLower.includes("account") || textLower.includes("login")) {
      reply = `### Password Reset Process
To reset your console passwords:
1. Navigate to the login window and click **"Forgot Password?"**.
2. Supply your organization email account.
3. Review your mail server for resetting verification links.`;
    } else if (textLower.includes("human") || textLower.includes("agent") || textLower.includes("support")) {
      reply = `### Contacting Customer Engineering
* **Office hours**: Mon-Fri 9AM-6PM EST.
* **General hotline**: \`+1 (800) 555-0199\`
* **Support queue**: \`support@aisupport.com\``;
    }

    triggerReply(reply);
  };

  // Select alternative conversation chain
  const selectConversation = (id) => {
    setActiveConvId(id);
    const conv = conversations.find(c => c.id === id);
    setMessages([
      {
        sender: "ai",
        text: `Loaded context for **"${conv.title}"**. ${conv.summary} Ask me questions regarding this topic.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setShowRating(false);
    setFeedbackSubmitted(false);
  };

  // Start new mock support conversation
  const createNewChat = () => {
    const newId = `conv-${Date.now()}`;
    const newConv = {
      id: newId,
      title: `Conversation #${conversations.length + 1}`,
      summary: "Fresh support assistant session query."
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveConvId(newId);
    setMessages([
      {
        sender: "ai",
        text: "New chat started. How can I help you resolve inquiries today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setShowRating(false);
    setFeedbackSubmitted(false);
    setIsSimulatedMode(false);
  };

  // Trigger simulated voice speech recording
  const toggleVoiceRecording = () => {
    if (isVoiceActive) {
      setIsVoiceActive(false);
      // Insert mock speech transcription
      setInput("View pricing plans");
    } else {
      setIsVoiceActive(true);
      // Automatically turn off after 3.5s and input query
      setTimeout(() => {
        setIsVoiceActive(false);
        setInput("View pricing plans");
      }, 3500);
    }
  };

  const handleRatingSubmit = (score) => {
    setRating(score);
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setShowRating(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `Thank you for rating this conversation **${score}/5 stars**! Your feedback helps us improve.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1500);
  };

  return (
    <div className="flex border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-950 h-[600px] shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
      
      {/* Session History Sidebar Panel */}
      <div className="hidden md:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 shrink-0">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Sessions</span>
          <Button variant="outline" size="sm" onClick={createNewChat} className="px-2 h-7 font-bold">
            + New
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1.5 custom-scrollbar">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => selectConversation(conv.id)}
              className={`text-left p-3 rounded-lg transition-all border ${
                activeConvId === conv.id
                  ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-850 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]"
                  : "border-transparent hover:bg-slate-100/50 dark:hover:bg-slate-900/50"
              }`}
            >
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-250 block truncate">
                {conv.title}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block truncate mt-0.5">
                {conv.summary}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Stream Container */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-950">
        {/* Chat Console Header */}
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMobileSidebar(true)}
              className="md:hidden p-1.5 -ml-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
              title="View Chat Sessions"
            >
              📂
            </button>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">SyncVantage AI Agent</span>
            <Badge variant="default" className="text-[9px] px-1.5 py-0 font-medium">Gemini 3.5 Flash</Badge>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
            <span className="text-[10px] font-semibold text-slate-400 tracking-wide uppercase">Active</span>
          </div>
        </div>

        {/* Simulated Warning Banner */}
        {isSimulatedMode && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-5 py-2 flex items-center justify-between text-[10px] text-amber-500 font-medium">
            <span>⚠️ Operating in Simulated Offline Mode. Configure API keys in Settings to connect live RAG.</span>
            <button onClick={() => setIsSimulatedMode(false)} className="text-amber-500 hover:text-amber-700">✕</button>
          </div>
        )}

        {/* Scrollable Messages Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-2 custom-scrollbar bg-slate-50/20 dark:bg-slate-950/10">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Message message={msg} />
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <Message message={{ sender: "ai", text: "" }} />
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Rating Prompt Overlay */}
        {showRating && (
          <div className="mx-5 mb-4 p-4 border border-indigo-150 dark:border-indigo-900/60 bg-indigo-50/20 dark:bg-indigo-950/10 rounded-xl relative flex flex-col items-center justify-center">
            <button onClick={() => setShowRating(false)} className="absolute top-2.5 right-2.5 text-slate-400 hover:text-slate-600">
              ✕
            </button>
            {!feedbackSubmitted ? (
              <>
                <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-2">Rate this conversation:</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRatingSubmit(star)}
                      className="text-xl transition-transform hover:scale-110"
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-[11px] font-semibold text-emerald-600">🎉 Feedback logged. Thank you!</p>
            )}
          </div>
        )}

        {/* Voice recording indicators */}
        {isVoiceActive && (
          <div className="mx-5 mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
              <span className="text-xs font-semibold text-red-500">Recording audio... Speak now</span>
            </div>
            {/* Minimalist interactive visual audio waveform */}
            <div className="flex gap-1 items-end h-5">
              <span className="w-0.5 bg-red-500 rounded animate-wave-bar" style={{ animationDelay: "0.1s" }}></span>
              <span className="w-0.5 bg-red-500 rounded animate-wave-bar" style={{ animationDelay: "0.3s" }}></span>
              <span className="w-0.5 bg-red-500 rounded animate-wave-bar" style={{ animationDelay: "0.5s" }}></span>
              <span className="w-0.5 bg-red-500 rounded animate-wave-bar" style={{ animationDelay: "0.2s" }}></span>
              <span className="w-0.5 bg-red-500 rounded animate-wave-bar" style={{ animationDelay: "0.4s" }}></span>
            </div>
          </div>
        )}

        {/* Chat Input Console Drawer */}
        <div className="p-4 border-t border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-950 shrink-0">
          
          {/* Quick-Prompt chips */}
          <div className="flex flex-wrap gap-2 mb-3">
            {[
              { label: "💳 Pricing Tiers", text: "What are your pricing plans?" },
              { label: "💰 Request refund", text: "How to request a refund?" },
              { label: "🔑 Reset account link", text: "How do I reset my password?" }
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(chip.text)}
                className="text-[10px] px-2.5 py-1 bg-slate-50 text-slate-500 border border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800 rounded-md hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors font-medium focus:outline-none"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Attachment tag preview drawer */}
          {attachedFile && (
            <div className="mb-3 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-between text-[10px]">
              <span className="text-slate-600 dark:text-slate-300 font-semibold truncate">
                📎 {attachedFile.name} (Ready to attach)
              </span>
              <button onClick={() => setAttachedFile(null)} className="text-rose-500 hover:text-rose-700">
                ✕
              </button>
            </div>
          )}

          {/* Input text box control container */}
          <div className="flex gap-2 items-center border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 bg-slate-50/50 dark:bg-slate-900/20 focus-within:border-slate-950 dark:focus-within:border-slate-100 transition-all duration-150">
            {/* Attachment icon trigger */}
            <label className="cursor-pointer text-slate-400 hover:text-slate-600 p-1 rounded-lg focus-within:ring-2 focus-within:ring-slate-350">
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => setAttachedFile(e.target.files[0])}
              />
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </label>

            {/* Main input */}
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              placeholder="Ask a support question..."
              className="flex-1 bg-transparent border-none outline-none text-slate-850 dark:text-slate-150 text-xs py-1"
              disabled={isTyping}
            />

            {/* Voice record microphone button */}
            <button
              onClick={toggleVoiceRecording}
              className={`p-1.5 rounded-lg transition-colors focus:outline-none ${
                isVoiceActive
                  ? "text-red-500 bg-red-500/10"
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              title="Voice Input"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>

            {/* Submit arrow button */}
            <button
              onClick={() => handleSend()}
              disabled={isTyping || !input.trim()}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                input.trim() && !isTyping
                  ? "bg-slate-900 text-white hover:bg-slate-850 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200"
                  : "text-slate-300 dark:text-slate-650"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {showMobileSidebar && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileSidebar(false)}
              className="fixed inset-0 bg-black z-30 md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.2 }}
              className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 z-40 flex flex-col p-4 md:hidden"
            >
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-900 mb-4">
                <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Sessions</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => { createNewChat(); setShowMobileSidebar(false); }} className="px-2 h-7 font-bold">
                    + New
                  </Button>
                  <button onClick={() => setShowMobileSidebar(false)} className="text-slate-400 text-sm p-1">✕</button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto flex flex-col gap-1.5 custom-scrollbar">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => { selectConversation(conv.id); setShowMobileSidebar(false); }}
                    className={`text-left p-3 rounded-lg transition-all border ${
                      activeConvId === conv.id
                        ? "bg-slate-50 dark:bg-slate-900 border-slate-250 dark:border-slate-800 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]"
                        : "border-transparent hover:bg-slate-50 dark:hover:bg-slate-900/50"
                    }`}
                  >
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-250 block truncate">
                      {conv.title}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block truncate mt-0.5">
                      {conv.summary}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
