"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initMixpanelOnce, cleanupEverything } from "../lib/analytics";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // LANDING PAGE: Clean everything and force hard refresh
    if (pathname === "/") {
      // If Mixpanel exists, we client-side navigated here from a microsite
      // Clean everything, then force a hard reload for a fresh start
      if (typeof window !== 'undefined' && window.mixpanel) {
        console.log("[CLIENT LAYOUT]: Client-side navigation to landing detected - cleaning and reloading");
        cleanupEverything();

        // Reload immediately after cleanup (no delay to prevent key recreation)
        window.location.href = window.location.pathname; // Hard reload
      } else {
        // Already on a fresh landing page (hard refresh or initial load)
        console.log("[CLIENT LAYOUT]: Fresh landing page - no tracking");
      }
    } else {
      // MICROSITE: Initialize Mixpanel
      initMixpanelOnce();
    }
  }, [pathname]);

  return <>{children}</>;
}
