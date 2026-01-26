"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollManager() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    if (pathname !== "/livros") {
      return;
    }

    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}
