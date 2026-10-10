"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * ScrollReset: Ensures any stuck body or document scroll locks
 * are immediately and safely cleared whenever the user navigates between routes.
 */
export default function ScrollReset() {
  const pathname = usePathname();

  useEffect(() => {
    // Always clear inline overflow locks on route change
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  }, [pathname]);

  return null;
}
