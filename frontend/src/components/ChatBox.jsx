import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Message from "./Message";
import Button from "./ui/Button";
import Badge from "./ui/Badge";
import {
  Sparkles,
  Send,
  Paperclip,
  Mic,
  FolderOpen,
  Info,
  Check,
  Star,
  CornerDownLeft,
  X,
  History,
  Volume2,
  VolumeX,
  Download
} from "lucide-react";

import { API_URLS } from "../config";
const API_URL = API_URLS.chat;

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
  const [selectedStars, setSelectedStars] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);

  // Audio response states
  const [speakingMsgIndex, setSpeakingMsgIndex] = useState(null);
  const [speechSentences, setSpeechSentences] = useState([]);
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(0);
  const [isSpeechPaused, setIsSpeechPaused] = useState(false);
  const [autoPlayVoice, setAutoPlayVoice] = useState(() => {
    const saved = localStorage.getItem("autoPlayVoice");
    return saved !== null ? JSON.parse(saved) : false;
  });

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("autoPlayVoice", JSON.stringify(autoPlayVoice));
  }, [autoPlayVoice]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const splitIntoSentences = (text) => {
    const plainText = text
      .replace(/#{1,6}\s?/g, '')
      .replace(/\*\*|__/g, '')
      .replace(/\*|_/g, '')
      .replace(/`{1,3}[^`]*`{1,3}/g, '')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
      .replace(/[-*+]\s/g, '')
      .trim();

    // Split by sentence endings (. ! ?) followed by space or line ending, ignoring decimal points
    const sentenceRegex = /[^.!?\s][^.!?]*(?:[.!?]+(?!\d(?:\s|$))|(?=\s|$))/g;
    const matches = plainText.match(sentenceRegex) || [];
    return matches.map(s => s.trim()).filter(s => s.length > 0);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeakingMsgIndex(null);
    setSpeechSentences([]);
    setCurrentSentenceIdx(0);
    setIsSpeechPaused(false);
  };

  const speakSentence = (sentences, index) => {
    if (!window.speechSynthesis || sentences.length === 0 || index < 0 || index >= sentences.length) {
      stopSpeaking();
      return;
    }

    window.speechSynthesis.cancel();
    setCurrentSentenceIdx(index);
    setIsSpeechPaused(false);

    const utterance = new SpeechSynthesisUtterance(sentences[index]);

    // Search for Indian English (en-IN) / Hindi (hi-IN) male voices to match the "Modi" style
    if (window.speechSynthesis.getVoices) {
      const voices = window.speechSynthesis.getVoices();

      // 1. Try Indian English Male
      let selectedVoice = voices.find(v =>
        v.lang === "en-IN" &&
        (v.name.toLowerCase().includes("ravi") || v.name.toLowerCase().includes("rishi") || v.name.toLowerCase().includes("male"))
      );

      // 2. Try any Indian English voice
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.toLowerCase().includes("in") && v.lang.toLowerCase().startsWith("en"));
      }

      // 3. Try Hindi voice (Modi native speaker language)
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.toLowerCase().includes("hi"));
      }

      // 4. Try any Male English voice
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.toLowerCase().startsWith("en") && v.name.toLowerCase().includes("male"));
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    utterance.onend = () => {
      const nextIndex = index + 1;
      if (nextIndex < sentences.length) {
        speakSentence(sentences, nextIndex);
      } else {
        stopSpeaking();
      }
    };

    utterance.onerror = (e) => {
      if (e.error !== "interrupted" && e.error !== "cancelled") {
        console.error("Speech synthesis error:", e);
        stopSpeaking();
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePlayPauseVoice = (text, index) => {
    if (!window.speechSynthesis) return;

    if (speakingMsgIndex === index) {
      if (isSpeechPaused) {
        setIsSpeechPaused(false);
        speakSentence(speechSentences, currentSentenceIdx);
      } else {
        window.speechSynthesis.cancel();
        setIsSpeechPaused(true);
      }
    } else {
      window.speechSynthesis.cancel();
      const parsedSentences = splitIntoSentences(text);
      if (parsedSentences.length === 0) return;

      setSpeakingMsgIndex(index);
      setSpeechSentences(parsedSentences);
      setCurrentSentenceIdx(0);
      setIsSpeechPaused(false);

      speakSentence(parsedSentences, 0);
    }
  };

  const handleSkipForward = () => {
    if (speechSentences.length === 0) return;
    const nextIdx = currentSentenceIdx + 1;
    if (nextIdx < speechSentences.length) {
      speakSentence(speechSentences, nextIdx);
    } else {
      stopSpeaking();
    }
  };

  const handleSkipBackward = () => {
    if (speechSentences.length === 0) return;
    const prevIdx = currentSentenceIdx - 1;
    const targetIdx = prevIdx >= 0 ? prevIdx : 0;
    speakSentence(speechSentences, targetIdx);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSuggestionClick = (keyword) => {
    setInput(keyword);
    handleSend(keyword);
  };

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

      const newMsg = {
        sender: "ai",
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => {
        const nextMsgs = [...prev, newMsg];
        if (autoPlayVoice) {
          const newIdx = nextMsgs.length - 1;
          setTimeout(() => {
            speakText(newMsg.text, newIdx);
          }, 100);
        }
        return nextMsgs;
      });

      if (messages.length >= 3) {
        setTimeout(() => setShowRating(true), 800);
      }
    }, 1200);
  };

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

  const selectConversation = (id) => {
    stopSpeaking();
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

  const createNewChat = () => {
    stopSpeaking();
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

  const toggleVoiceRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice speech recording is not supported in this browser. Please try Chrome, Edge, or Safari.");
      setInput("View pricing plans");
      return;
    }

    if (isVoiceActive) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsVoiceActive(false);
    } else {
      setIsVoiceActive(true);

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsVoiceActive(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(transcript);
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsVoiceActive(false);
      };

      recognition.onend = () => {
        setIsVoiceActive(false);
      };

      recognitionRef.current = recognition;
      try {
        recognition.start();
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
        setIsVoiceActive(false);
      }
    }
  };

  const handleRatingSubmit = () => {
    setRating(selectedStars);
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setShowRating(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `Thank you for rating this conversation **${selectedStars}/5 stars**!${feedbackComment.trim() ? ` Your feedback comment: *"${feedbackComment.trim()}"* has been logged.` : " Your feedback helps us improve."}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setSelectedStars(0);
      setFeedbackComment("");
    }, 1000);
  };

  const handleExportChat = () => {
    if (messages.length === 0) return;

    // Format chat into readable transcript text
    const transcript = messages
      .map(msg => `[${msg.timestamp}] ${msg.sender === "user" ? "User" : "Agent"}: ${msg.text}`)
      .join("\n\n");

    const blob = new Blob([transcript], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `chat-transcript-${activeConvId || "default"}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex border border-slate-200 dark:border-slate-850 rounded-2xl overflow-hidden bg-white dark:bg-slate-950 h-[560px] shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">

      {/* Session History Sidebar Panel */}
      <div className="hidden md:flex flex-col w-60 border-r border-slate-200/80 dark:border-slate-850 bg-slate-50/20 dark:bg-slate-900/10 shrink-0">
        <div className="p-4 border-b border-slate-100 dark:border-slate-900 flex justify-between items-center">
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-blue-500" /> Active Sessions
          </span>
          <button
            onClick={createNewChat}
            className="text-[10px] font-bold text-blue-600 hover:text-blue-550 border border-blue-200 hover:bg-blue-500/5 px-2 py-1 rounded-lg cursor-pointer"
          >
            + New
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1.5 custom-scrollbar">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => selectConversation(conv.id)}
              className={`text-left p-3 rounded-xl transition-all border ${activeConvId === conv.id
                ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-[0_1px_2.5px_0_rgba(0,0,0,0.03)]"
                : "border-transparent hover:bg-slate-50 dark:hover:bg-slate-900/40"
                }`}
            >
              <span className="text-xs font-bold text-slate-850 dark:text-slate-200 block truncate">
                {conv.title}
              </span>
              <span className="text-[9px] text-slate-450 dark:text-slate-500 block truncate mt-0.5">
                {conv.summary}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Stream Container */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-950">

        {/* Chat Console Header */}
        <div className="px-5 py-3 border-b border-slate-150 dark:border-slate-900 flex items-center justify-between shrink-0 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowMobileSidebar(true)}
              className="md:hidden p-1.5 rounded-lg border border-slate-200 dark:border-slate-850 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
            >
              <FolderOpen className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-bold text-slate-850 dark:text-slate-100">thedal-rag Agent</span>
            <Badge variant="default" className="text-[9px] px-1.5 py-0 font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
              Gemini 3.5 Flash
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            {/* Export Chat Logs Button */}
            <button
              onClick={handleExportChat}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-[10px] font-bold cursor-pointer transition-colors h-7"
              title="Export Transcript"
            >
              <Download className="w-3.5 h-3.5" /> Export Logs
            </button>

            {/* Voice Mode Toggle Switch */}
            <div className="flex items-center gap-2 border border-slate-200/60 dark:border-slate-800 rounded-lg px-2 py-1 bg-slate-50/50 dark:bg-slate-900/10 transition-colors">
              <span className="text-[9px] font-bold text-slate-455 dark:text-slate-400 uppercase tracking-wider select-none flex items-center gap-1">
                <Volume2 className="w-3 h-3 text-blue-500 animate-pulse" style={{ animationPlayState: speakingMsgIndex !== null ? "running" : "paused" }} /> Voice Response
              </span>
              <button
                onClick={() => setAutoPlayVoice(!autoPlayVoice)}
                className={`w-7 h-4 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer ${autoPlayVoice ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-800"
                  }`}
                title={autoPlayVoice ? "Auto-play: Enabled" : "Auto-play: Disabled"}
              >
                <div
                  className={`w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-200 ${autoPlayVoice ? "translate-x-3" : "translate-x-0"
                    }`}
                />
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">Pipeline Active</span>
            </div>
          </div>
        </div>

        {/* Offline simulated banner */}
        {isSimulatedMode && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-5 py-2 flex items-center justify-between text-[10px] text-amber-600 dark:text-amber-400 font-bold">
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              Operating in Simulated Offline Mode. Configure API keys in Settings to connect live RAG.
            </span>
            <button onClick={() => setIsSimulatedMode(false)} className="text-amber-500 hover:text-amber-700">✕</button>
          </div>
        )}

        {/* Scrollable Messages Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-2 custom-scrollbar bg-slate-50/10 dark:bg-slate-950/5">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.12 }}
              >
                <Message
                  message={msg}
                  isSpeaking={speakingMsgIndex === i}
                  isSpeakingPaused={speakingMsgIndex === i && isSpeechPaused}
                  speechProgress={
                    speakingMsgIndex === i
                      ? { current: currentSentenceIdx + 1, total: speechSentences.length }
                      : null
                  }
                  onPlayPauseVoice={() => handlePlayPauseVoice(msg.text, i)}
                  onSkipForward={handleSkipForward}
                  onSkipBackward={handleSkipBackward}
                  onStopVoice={stopSpeaking}
                />
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
          <div className="mx-5 mb-4 p-4 border border-blue-200/50 dark:border-blue-900/40 bg-blue-500/5 dark:bg-blue-950/10 rounded-xl relative flex flex-col items-center justify-center">
            <button onClick={() => setShowRating(false)} className="absolute top-2.5 right-2.5 text-slate-450 hover:text-slate-655 cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
            {!feedbackSubmitted ? (
              <div className="w-full max-w-sm flex flex-col items-center gap-3">
                <p className="text-[11px] font-bold text-slate-700 dark:text-slate-350">Rate this conversation:</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setSelectedStars(star)}
                      className="text-lg transition-transform hover:scale-110 cursor-pointer"
                    >
                      <Star className={`w-5 h-5 ${star <= selectedStars ? "text-amber-400 fill-amber-400" : "text-slate-300 dark:text-slate-700"}`} />
                    </button>
                  ))}
                </div>
                {selectedStars > 0 && (
                  <div className="w-full flex flex-col gap-2 mt-1">
                    <textarea
                      placeholder="Add an optional comment..."
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                      rows={2}
                      className="w-full text-[10px] p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none resize-none placeholder-slate-400 text-slate-800 dark:text-slate-100"
                    />
                    <Button variant="default" size="sm" onClick={handleRatingSubmit} className="text-[9px] font-bold h-7 align-right self-end px-3">
                      Submit Feedback
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-[11px] font-bold text-emerald-600">🎉 Feedback logged. Thank you!</p>
            )}
          </div>
        )}

        {/* Voice recording indicators */}
        {isVoiceActive && (
          <div className="mx-5 mb-4 p-3.5 bg-rose-500/5 border border-rose-500/10 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping"></span>
              <span className="text-xs font-bold text-rose-500 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4" /> Recording audio... Speak now
              </span>
            </div>
            {/* Audio Waveform bouncing bars */}
            <div className="flex gap-0.5 items-end h-5">
              <span className="w-[2px] bg-rose-500 rounded animate-wave-bar" style={{ animationDelay: "0.1s" }}></span>
              <span className="w-[2px] bg-rose-500 rounded animate-wave-bar" style={{ animationDelay: "0.3s" }}></span>
              <span className="w-[2px] bg-rose-500 rounded animate-wave-bar" style={{ animationDelay: "0.5s" }}></span>
              <span className="w-[2px] bg-rose-500 rounded animate-wave-bar" style={{ animationDelay: "0.2s" }}></span>
              <span className="w-[2px] bg-rose-500 rounded animate-wave-bar" style={{ animationDelay: "0.4s" }}></span>
            </div>
          </div>
        )}

        {/* Chat Input Console Drawer */}
        <div className="p-4 border-t border-slate-150 dark:border-slate-900 bg-white dark:bg-slate-950 shrink-0">

          {/* Quick-Prompt Suggestions */}
          <div className="flex flex-wrap gap-2 mb-3">
            {[
              { label: "💳 Pricing Tiers", text: "What are your pricing plans?" },
              { label: "💰 Request refund", text: "How to request a refund?" },
              { label: "🔑 Reset account link", text: "How do I reset my password?" }
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(chip.text)}
                className="text-[10px] px-2.5 py-1 bg-slate-50 text-slate-500 border border-slate-200/80 dark:bg-slate-900/60 dark:text-slate-400 dark:border-slate-850 rounded-lg hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors font-semibold focus:outline-none cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Attachment preview */}
          {attachedFile && (
            <div className="mb-3 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-lg flex items-center justify-between text-[10px]">
              <span className="text-slate-655 dark:text-slate-350 font-bold truncate">
                📎 {attachedFile.name} (Ready to attach)
              </span>
              <button onClick={() => setAttachedFile(null)} className="text-rose-500 hover:text-rose-700 cursor-pointer">
                ✕
              </button>
            </div>
          )}

          {/* Input text box control container */}
          <div className="flex gap-2.5 items-center border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 bg-slate-50/20 dark:bg-slate-900/30 focus-within:border-slate-950 dark:focus-within:border-slate-200 transition-all duration-150">

            {/* Attachment trigger */}
            <label className="cursor-pointer text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => setAttachedFile(e.target.files[0])}
              />
              <Paperclip className="w-3.5 h-3.5" />
            </label>

            {/* Input text field */}
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              placeholder="Ask a support question..."
              className="flex-1 bg-transparent border-none outline-none text-slate-850 dark:text-slate-100 text-xs py-1 placeholder-slate-400"
              disabled={isTyping}
            />

            {/* Voice record microphone button */}
            <button
              onClick={toggleVoiceRecording}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${isVoiceActive
                ? "text-rose-500 bg-rose-500/10 animate-pulse"
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-850"
                }`}
              title="Voice Input"
            >
              <Mic className="w-3.5 h-3.5" />
            </button>

            {/* Submit arrow button */}
            <button
              onClick={() => handleSend()}
              disabled={isTyping || !input.trim()}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${input.trim() && !isTyping
                ? "bg-slate-950 text-white hover:bg-slate-900 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200"
                : "text-slate-300 dark:text-slate-800 bg-transparent"
                }`}
            >
              <Send className="w-3.5 h-3.5" />
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
              transition={{ type: "tween", duration: 0.18 }}
              className="fixed inset-y-0 left-0 w-60 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-850 z-40 flex flex-col p-4 md:hidden"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-900 mb-4">
                <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Sessions</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => { createNewChat(); setShowMobileSidebar(false); }}
                    className="text-[10px] font-bold text-blue-600 border border-blue-200 hover:bg-blue-500/5 px-2 py-1 rounded-lg cursor-pointer"
                  >
                    + New
                  </button>
                  <button onClick={() => setShowMobileSidebar(false)} className="text-slate-400 text-sm p-1">✕</button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto flex flex-col gap-1.5 custom-scrollbar">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => { selectConversation(conv.id); setShowMobileSidebar(false); }}
                    className={`text-left p-3 rounded-xl transition-all border ${activeConvId === conv.id
                      ? "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-[0_1px_2.5px_0_rgba(0,0,0,0.02)]"
                      : "border-transparent hover:bg-slate-50 dark:hover:bg-slate-900/40"
                      }`}
                  >
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
                      {conv.title}
                    </span>
                    <span className="text-[9px] text-slate-450 dark:text-slate-500 block truncate mt-0.5">
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
