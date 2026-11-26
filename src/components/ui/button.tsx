import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "whatsapp" | "outline" | "danger";
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  fullWidth = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer shadow-xs";

  const variants = {
    primary: "bg-[#e8590c] text-white hover:bg-[#d14e09]",
    secondary: "bg-[#ffb81c] text-[#241613] hover:bg-[#f0a90c] font-heading",
    whatsapp: "bg-[#177a54] text-white hover:bg-[#136646]",
    outline: "border border-line bg-card text-ink hover:bg-line/30",
    danger: "bg-[#c93a2b] text-white hover:bg-[#b03225]",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
