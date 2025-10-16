"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initMixpanelOnce } from "../lib/analytics";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Don't initialize Mixpanel on the landing page
    if (pathname !== "/") {
      initMixpanelOnce();
    }
    if (pathname === "/") {
      // completely nuke Mixpanel
      try {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith("mp_")) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach((key) => {
          localStorage.removeItem(key);
          console.log("removed localStorage key:", key);
        });
        console.log(`cleared ${keysToRemove.length} localStorage items`);
		
      } catch (error) {
        console.error("error stopping session replay:", error);
      }
    }
  }, [pathname]);

  return <>{children}</>;
}
