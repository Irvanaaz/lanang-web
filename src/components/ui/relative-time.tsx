"use client";

import { useState, useEffect } from "react";
import { formatRelativeTime } from "@/lib/format";

export function RelativeTime({ isoDate }: { isoDate: string }) {
  const [label, setLabel] = useState<string>("baru saja diperbarui");

  useEffect(() => {
    setLabel(formatRelativeTime(isoDate));
  }, [isoDate]);

  return <span suppressHydrationWarning>{label}</span>;
}
