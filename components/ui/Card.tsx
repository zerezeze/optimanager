import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`bg-white border border-slate-100 rounded-2xl shadow-sm p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
