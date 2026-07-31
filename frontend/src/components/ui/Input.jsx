import React from "react";

export const Input = React.forwardRef(({ className = "", disabled, error, ...props }, ref) => {
  return (
    <div className="w-full flex flex-col gap-1.5">
      <input
        ref={ref}
        disabled={disabled}
        className={`w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-950 dark:focus:ring-slate-350 focus:border-slate-900 dark:focus:border-slate-300 disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-slate-900/50 transition-all duration-150 ${
          error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""
        } ${className}`}
        {...props}
      />
      {error && <span className="text-[10px] text-red-500 font-medium px-1">{error}</span>}
    </div>
  );
});

Input.displayName = "Input";
export default Input;
