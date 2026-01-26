"use client";

import { ReactNode, useEffect, useState } from "react";

interface PageFadeProps {
  enabled?: boolean;
  className?: string;
  children: ReactNode;
}

export default function PageFade({
  enabled = false,
  className = "",
  children,
}: PageFadeProps) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setActive(false);
      return;
    }
    const id = requestAnimationFrame(() => setActive(true));
    return () => cancelAnimationFrame(id);
  }, [enabled]);

  const classes = `${className}${active ? " page-fade-in" : ""}`;
  return <div className={classes}>{children}</div>;
}
