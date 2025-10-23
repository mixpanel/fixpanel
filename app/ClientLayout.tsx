"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initMixpanelOnce, resetInitialized } from "../lib/analytics";
import mixpanel from "mixpanel-browser";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Don't initialize Mixpanel on the landing page
    if (pathname !== "/") {
      initMixpanelOnce();
    }
    if (pathname === "/") {
      // Reset mixpanel if it exists
      if (typeof window !== "undefined" && window.mixpanel) {
        if (window?.mixpanel) {
          try {
            console.log("[MIXPANEL]: ATTEMPTING FULL RESET ON LANDING PAGE");
            if (window.mixpanel?.reset) mixpanel.reset();
            if (window.mixpanel?.stop_session_recording) mixpanel.stop_session_recording();

            // Clear all microsite session keys
            sessionStorage.removeItem("mixpanel_active_session");
            sessionStorage.removeItem("session_started_youAdmin");
            sessionStorage.removeItem("session_started_theyBuy");
            sessionStorage.removeItem("session_started_iBank");
            sessionStorage.removeItem("session_started_ourHeart");
            sessionStorage.removeItem("session_started_meTube");
            sessionStorage.removeItem("session_started_weRead");

            console.log("[MIXPANEL]: RESET SUCCESSFUL (including session keys)");
          } catch (error) {
            console.error("error resetting mixpanel:", error);
          }
        }
      }

      // Reset the initialized flag so Mixpanel can be re-initialized fresh on next vertical
      resetInitialized();

      // Completely nuke localStorage persistent data on landing page
      console.log("[MIXPANEL]: NUKING LOCALSTORAGE");
      localStorage.clear();
    }
  }, [pathname]);

  return <>{children}</>;
}
