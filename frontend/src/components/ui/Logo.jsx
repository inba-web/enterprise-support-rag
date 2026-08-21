import React from "react";

export default function Logo({ className = "w-8 h-8", variant = "full" }) {
    // Fortune 500 corporate styling: interlocking search loops + neural path nodes
    return (
        <div className="flex items-center gap-2">
            <svg className={`${className} shrink-0 select-none animate-pulse-subtle`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="thedalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#22D3EE" /> {/* Cyan */}
                        <stop offset="50%" stopColor="#3B82F6" /> {/* Blue */}
                        <stop offset="100%" stopColor="#6366F1" /> {/* Indigo */}
                    </linearGradient>
                </defs>

                {/* Beautiful geometry inspired by tech leaders like IBM/Oracle/Nvidia */}
                <polygon
                    points="50,8 88,30 88,70 50,92 12,70 12,30"
                    fill="#080C14"
                    stroke="url(#thedalGrad)"
                    strokeWidth="7"
                    strokeLinejoin="round"
                />

                {/* overlapping search path & neural junction */}
                <path
                    d="M38 36H62 M50 36V66 M50 66L62 54"
                    stroke="#FFFFFF"
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Tech orbit rings */}
                <circle cx="50" cy="50" r="24" stroke="url(#thedalGrad)" strokeWidth="4.5" strokeDasharray="80 30" strokeLinecap="round" />
            </svg>
            {variant === "full" && (
                <span className="font-black text-sm tracking-wider uppercase bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    thedal-rag
                </span>
            )}
        </div>
    );
}
