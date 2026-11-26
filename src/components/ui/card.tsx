import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ className = '', children, ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-line bg-card p-4 shadow-xs ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}