import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  isLoading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  isLoading = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyle =
    "inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none border";

  const variantStyles = {
    primary:
      "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white border-transparent shadow-sm focus:ring-2 focus:ring-blue-500/20",
    secondary:
      "bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 border-slate-200 shadow-sm focus:ring-2 focus:ring-slate-500/10",
    danger:
      "bg-red-600 hover:bg-red-700 active:bg-red-800 text-white border-transparent shadow-sm focus:ring-2 focus:ring-red-500/20",
    ghost:
      "bg-transparent hover:bg-slate-100 active:bg-slate-200 text-slate-600 border-transparent",
  };

  return (
    <button
      className={`${baseStyle} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4.5 h-4.5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0"></span>
      ) : null}
      {children}
    </button>
  );
}
