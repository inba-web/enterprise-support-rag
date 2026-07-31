import React from "react";

export const Button = React.forwardRef(
  ({ className = "", variant = "default", size = "default", disabled, ...props }, ref) => {
    
    // Core class tags for Stripe-like buttons
    const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg text-xs transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";
    
    const variants = {
      default: "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-950 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200 dark:focus:ring-slate-300",
      secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-300 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-700 dark:focus:ring-slate-700",
      outline: "border border-slate-200 text-slate-700 hover:bg-slate-50 focus:ring-slate-300 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800/50 dark:focus:ring-slate-800",
      ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-200 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 dark:focus:ring-slate-800",
      danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-850"
    };

    const sizes = {
      default: "px-4 py-2 h-9",
      sm: "px-3 py-1.5 h-8 text-[11px]",
      lg: "px-6 py-3 h-10 text-sm",
      icon: "w-9 h-9 p-0"
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
export default Button;
