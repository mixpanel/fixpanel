"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initMixpanelOnce, cleanupEverything } from "../lib/analytics";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Don't initialize Mixpanel on the landing page
    if (pathname !== "/") {
      initMixpanelOnce();
    }

    // NUKE EVERYTHING on landing page - use centralized cleanup function
    if (pathname === "/") {
      cleanupEverything();
    }
  }, [pathname]);

  return <>{children}</>;
}
