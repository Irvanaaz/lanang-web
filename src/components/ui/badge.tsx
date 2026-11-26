import React from "react";

interface BadgeProps {
  variant?: "open" | "closed" | "warning" | "neutral";
  children: React.ReactNode;
}

export function Badge({ variant = "neutral", children }: BadgeProps) {
  const styles = {
    open: "bg-open/15 text-open",
    closed: "bg-closed/15 text-closed",
    warning: "bg-sun/25 text-[#8a5d00] dark:text-sun",
    neutral: "bg-line/60 text-muted",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${styles[variant]}`}
    >
      {children}
    </span>
  );
}
