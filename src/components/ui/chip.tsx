import React from 'react';

interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export function Chip({
  active = false,
  className = '',
  children,
  ...props
}: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer shrink-0 ${ active ? 'bg-brand text-white' : 'border border-line bg-card text-ink hover:border-brand/50' } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}