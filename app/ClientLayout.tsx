"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initMixpanelOnce } from "../lib/analytics";
import mixpanel from "mixpanel-browser";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Don't initialize Mixpanel on the landing page
    if (pathname !== "/") {
      initMixpanelOnce();
    }
    if (pathname === "/") {
      //reset mixpanel if it exists
      if (typeof window !== "undefined") {
        if (window?.mixpanel) {
          try {
            console.log("[MIXPANEL]: ATTEMPTING RESET");
            if (window.mixpanel?.reset) mixpanel.reset();
            if (window.mixpanel?.stop_session_recording) mixpanel.stop_session_recording();
            sessionStorage.removeItem("mixpanel_active_session");
            console.log("[MIXPANEL]: RESET SUCCESSFUL");
          } catch (error) {
            console.error("error resetting mixpanel:", error);
          }
        }
      }
      // completely nuke MixPanel persistent data on landing page
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
