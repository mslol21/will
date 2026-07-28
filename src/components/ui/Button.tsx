import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary" | "danger";
  size?: "default" | "sm" | "lg" | "icon";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-bold text-xs uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-slate-300",
          {
            "bg-[#8B5E34] text-white hover:bg-[#1F2A44] shadow-md dark:hover:bg-[#141C2E]": variant === "default",
            "bg-slate-100 text-[#1F2A44] hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700": variant === "secondary",
            "border border-slate-200 bg-transparent hover:bg-slate-100 text-slate-700 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800": variant === "outline",
            "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50 text-slate-600 dark:text-slate-300": variant === "ghost",
            "bg-red-500 text-white hover:bg-red-600 shadow-sm": variant === "danger",
            "h-9 px-4 py-2": size === "default",
            "h-8 rounded-lg px-3 text-[10px]": size === "sm",
            "h-10 rounded-xl px-8": size === "lg",
            "h-9 w-9": size === "icon",
          },
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
