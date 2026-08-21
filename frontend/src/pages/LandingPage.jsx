import { useState } from "react";
import { motion } from "framer-motion";
import Logo from "../components/ui/Logo";
import Button from "../components/ui/Button";
import Card, { CardContent } from "../components/ui/Card";
import {
  Database,
  Cpu,
  Search,
  FileText,
  ShieldCheck,
  ArrowRight,
  Activity,
  Terminal,
  RefreshCcw,
  Menu,
  X,
  Plus
} from "lucide-react";

export default function LandingPage({ onGetStarted }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const features = [
    {
      icon: <FileText className="w-5 h-5 text-blue-500" />,
      title: "Document Intelligence",
      description: "Upload corporate PDFs, manuals, and FAQs. The platform automatically extracts, parses, and formats document text."
    },
    {
      icon: <Cpu className="w-5 h-5 text-indigo-500" />,
      title: "Neural Embeddings",
      description: "Converts text splits into 768-dimensional vector embeddings using Google's gemini-embedding-001 model."
    },
    {
      icon: <Search className="w-5 h-5 text-cyan-500" />,
      title: "Vector Search",
      description: "Indexes document embeddings inside Pinecone Vector DB for low-latency semantic search matching."
    },
    {
      icon: <Database className="w-5 h-5 text-emerald-500" />,
      title: "Zero-Config Fallback",
      description: "Seamlessly switches to a local JSON file-based database if MongoDB Atlas is unreachable, keeping operations online."
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-violet-500" />,
      title: "Enterprise Security",
      description: "Rigorous encryption of integration credentials with compartmentalized tenant workspaces."
    },
    {
      icon: <Activity className="w-5 h-5 text-rose-500" />,
      title: "Performance Monitor",
      description: "Track system metrics, query load velocities, active chat sessions, and index throughput."
    }
  ];

  const faqs = [
    {
      question: "How does the Retrieval-Augmented Generation (RAG) pipeline function?",
      answer: "When a support agent or user submits a query, thedal-rag embeds the query and searches the Pinecone Vector Database for matching text chunks. These matching blocks are sent alongside the query to the Gemini 3.5 Flash model as secure context to synthesize a fact-grounded response."
    },
    {
      question: "What happens if our MongoDB database is unreachable?",
      answer: "thedal-rag features an automated database failover handler. If MongoDB Atlas is offline or blocked by IP whitelist restrictions, the backend dynamically switches all CRUD requests to a localized file-based JSON store. Your workspace continues working offline without data loss."
    },
    {
      question: "Are custom API integration keys stored securely?",
      answer: "Absolutely. All credentials (such as Gemini and Pinecone keys) can be configured directly inside your system environment variables or safely cached locally in your encrypted browser storage session."
    },
    {
      question: "Which document formats are currently supported?",
      answer: "We support high-fidelity PDF text extraction including tables, metadata nodes, and standard structural formatting. Uploads of up to 10MB per file are processed instantly in the background."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">

      {/* 1. Header Navbar */}
      <header className="fixed top-0 w-full z-50 border-b border-slate-200/60 dark:border-slate-900/60 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="w-7 h-7" variant="full" />
          </div>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">Features</a>
            <a href="#architecture" className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">Architecture</a>
            <a href="#faq" className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">FAQ</a>
            <Button variant="default" size="sm" onClick={onGetStarted} className="font-bold text-xs h-8 px-4">
              Enter Workspace <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </nav>

          {/* Mobile menu button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white">
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu expanded */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden border-b border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 p-4 flex flex-col gap-3.5 text-center"
          >
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-slate-500">Features</a>
            <a href="#architecture" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-slate-500">Architecture</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-slate-500">FAQ</a>
            <Button variant="default" size="sm" onClick={() => { setMobileMenuOpen(false); onGetStarted(); }} className="w-full font-bold">
              Enter Workspace
            </Button>
          </motion.div>
        )}
      </header>

      {/* 2. Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 flex flex-col gap-6 text-center lg:text-left items-center lg:items-start">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-600 dark:text-blue-400 text-[10px] font-bold tracking-wider uppercase"
          >
            ✦ Next-Gen Knowledge Management
          </motion.div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            Enterprise Knowledge <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-650 to-indigo-500 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">Intelligence Platform</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-550 dark:text-slate-400 max-w-xl leading-relaxed">
            Ingest unstructured organizational manuals, dynamically generate vector embeddings, and connect real-time contextual information to Gemini-powered AI assistants instantly.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button variant="default" size="md" onClick={onGetStarted} className="font-bold text-xs h-10 px-6">
              Enter Workspace
            </Button>
            <a href="#features">
              <Button variant="outline" size="md" className="font-bold text-xs h-10 px-6 w-full sm:w-auto">
                Explore Features
              </Button>
            </a>
          </div>
        </div>

        {/* Animated Vector Illustration Hero Right */}
        <div className="flex-1 w-full max-w-lg lg:max-w-none flex justify-center relative">
          <div className="absolute inset-0 bg-blue-550/5 dark:bg-blue-400/5 rounded-full blur-3xl filter"></div>

          <svg className="w-full max-w-md h-96 relative z-10 text-slate-200 dark:text-slate-800" viewBox="0 0 400 400" fill="none">
            {/* Background SVG Grid Pattern */}
            <defs>
              <pattern id="hero-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid)" className="text-slate-300 dark:text-slate-900" />

            {/* Connecting Graph/Brain Nodes */}
            <g className="stroke-slate-300 dark:stroke-slate-800" strokeWidth="1.5">
              <line x1="200" y1="100" x2="120" y2="180" />
              <line x1="200" y1="100" x2="280" y2="180" />
              <line x1="120" y1="180" x2="160" y2="280" />
              <line x1="280" y1="180" x2="240" y2="280" />
              <line x1="160" y1="280" x2="240" y2="280" />
              <line x1="120" y1="180" x2="280" y2="180" />
              <line x1="200" y1="100" x2="200" y2="230" />
              <line x1="200" y1="230" x2="160" y2="280" />
              <line x1="200" y1="230" x2="240" y2="280" />
            </g>

            {/* Glowing nodes (Circles) */}
            <circle cx="200" cy="100" r="8" className="fill-blue-500 animate-pulse" />
            <circle cx="120" cy="180" r="8" className="fill-indigo-500" />
            <circle cx="280" cy="180" r="8" className="fill-cyan-500" />
            <circle cx="200" cy="230" r="6" className="fill-violet-500 animate-pulse" />
            <circle cx="160" cy="280" r="8" className="fill-emerald-500" />
            <circle cx="240" cy="280" r="8" className="fill-indigo-650" />

            {/* Document Vector Symbols */}
            <rect x="90" y="150" width="16" height="20" rx="2" className="fill-slate-100 dark:fill-slate-950 stroke-slate-400 dark:stroke-slate-700" strokeWidth="1" />
            <line x1="94" y1="156" x2="102" y2="156" className="stroke-slate-400" />
            <line x1="94" y1="160" x2="102" y2="160" className="stroke-slate-400" />

            <rect x="290" y="240" width="16" height="20" rx="2" className="fill-slate-100 dark:fill-slate-950 stroke-slate-400 dark:stroke-slate-700" strokeWidth="1" />
            <line x1="294" y1="246" x2="302" y2="246" className="stroke-slate-400" />
            <line x1="294" y1="250" x2="302" y2="250" className="stroke-slate-400" />

            {/* Glowing Data Packets orbiting path */}
            <circle cx="160" cy="140" r="4" className="fill-blue-500 animate-bounce" />
            <circle cx="240" cy="140" r="4" className="fill-cyan-500 animate-ping" />
          </svg>
        </div>
      </section>

      {/* 3. Feature Grid Section */}
      <section id="features" className="py-20 bg-white dark:bg-slate-900/20 border-y border-slate-200/60 dark:border-slate-900/60 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col gap-3">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Structured Knowledge Management</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              An optimized workspace combining advanced data splitting, embeddings, database durability, and safety gates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, index) => (
              <Card key={index} className="hover:border-slate-300 dark:hover:border-slate-750 transition-all duration-300 hover:shadow-md">
                <CardContent className="p-6 flex flex-col gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850 flex items-center justify-center">
                    {feat.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-50">{feat.title}</h3>
                    <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 mt-2">{feat.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4. RAG Architecture Pipeline Section */}
      <section id="architecture" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-16">
        <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col gap-3">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">System Architecture</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            A secure flow diagram highlighting real-time vector queries and data fallbacks.
          </p>
        </div>

        <Card className="p-6 md:p-8 bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-slate-900">
          <CardContent className="flex flex-col gap-8">

            {/* Step-by-step layout flow using cards */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative">

              <div className="flex flex-col gap-3 p-4 rounded-xl border border-slate-200/70 dark:border-slate-850/60 bg-slate-50/50 dark:bg-slate-900/10">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 text-xs font-bold flex items-center justify-center">1</div>
                <span className="text-xs font-bold">1. Document Ingestion</span>
                <p className="text-[10px] text-slate-450 leading-relaxed">PDF Manuals uploaded, parsed, and split into recursive semantic text chunks.</p>
              </div>

              <div className="flex flex-col gap-3 p-4 rounded-xl border border-slate-200/70 dark:border-slate-850/60 bg-slate-50/50 dark:bg-slate-900/10">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 text-xs font-bold flex items-center justify-center">2</div>
                <span className="text-xs font-bold">2. Embedding Generation</span>
                <p className="text-[10px] text-slate-450 leading-relaxed">Gemini models generate high-fidelity vector representations from text splits.</p>
              </div>

              <div className="flex flex-col gap-3 p-4 rounded-xl border border-slate-200/70 dark:border-slate-850/60 bg-slate-50/50 dark:bg-slate-900/10">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-600 text-xs font-bold flex items-center justify-center">3</div>
                <span className="text-xs font-bold">3. Vector Storage</span>
                <p className="text-[10px] text-slate-450 leading-relaxed">Embeddings stored and indexed within Pinecone DB for low-latency searches.</p>
              </div>

              <div className="flex flex-col gap-3 p-4 rounded-xl border border-slate-200/70 dark:border-slate-850/60 bg-slate-50/50 dark:bg-slate-900/10">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 text-xs font-bold flex items-center justify-center">4</div>
                <span className="text-xs font-bold">4. Hybrid Query Synthesis</span>
                <p className="text-[10px] text-slate-450 leading-relaxed">Semantic context retrieved from Pinecone and merged into Gemini flash prompt inputs.</p>
              </div>

            </div>

            <div className="border-t border-slate-100 dark:border-slate-900 pt-6 text-center">
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider flex items-center justify-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-blue-500" /> Durability Policy: Local JSON DB triggers if MongoDB connections timeout.
              </span>
            </div>

          </CardContent>
        </Card>
      </section>

      {/* 5. FAQ Section */}
      <section id="faq" className="py-20 bg-white dark:bg-slate-900/10 border-t border-slate-200/60 dark:border-slate-900/60 scroll-mt-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 flex flex-col gap-3">
            <h2 className="text-2xl font-bold tracking-tight">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Quick insights regarding platforms, setups, and connectivity options.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="border border-slate-200/70 dark:border-slate-900/80 rounded-xl overflow-hidden bg-slate-50/20 dark:bg-slate-950/20 transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full text-left px-5 py-4 font-semibold text-xs text-slate-800 dark:text-slate-200 flex justify-between items-center outline-none select-none hover:bg-slate-50/50 dark:hover:bg-slate-900/20"
                  >
                    <span>{faq.question}</span>
                    <Plus className={`w-4 h-4 text-slate-400 transition-transform duration-250 ${isOpen ? "transform rotate-45 text-blue-500" : ""}`} />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-900/40">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Footer Section */}
      <footer className="border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 py-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Logo className="w-6 h-6" variant="full" />
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-550">
            &copy; {new Date().getFullYear()} thedal-rag Inc. Enterprise Knowledge Intelligence. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}
