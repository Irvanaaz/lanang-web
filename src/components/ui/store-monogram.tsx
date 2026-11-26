import React from 'react';

const PALETTE = [
  'bg-[#e8590c] text-white',
  'bg-[#177a54] text-white',
  'bg-[#34211c] text-[#ffb81c]',
  'bg-[#9c4221] text-white',
  'bg-[#2b6cb0] text-white',
  'bg-[#744210] text-white',
];

export function StoreMonogram({ name }: { name: string }) {
  const words = name.trim().split(/\s+/);
  const initials =
    words.length >= 2
      ? (words[0][0] + words[1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase();

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorClass = PALETTE[Math.abs(hash) % PALETTE.length];

  return (
    <div
      aria-hidden="true"
      className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl font-heading text-xl font-bold tracking-wide ${colorClass}`}
    >
      {initials}
    </div>
  );
}