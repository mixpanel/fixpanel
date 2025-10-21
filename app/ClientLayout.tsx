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
      // Check for custom token in URL params
      const params = new URLSearchParams(window.location.search);
      const urlToken = params.get("token");

      // If token is in URL, store it in sessionStorage for this session
      if (urlToken) {
        sessionStorage.setItem("mixpanel_custom_token", urlToken);
        console.log("[MIXPANEL]: STORED CUSTOM TOKEN IN SESSION");
      }

      // Check URL first, then sessionStorage, then fall back to default
      const tokenToUse = urlToken || sessionStorage.getItem("mixpanel_custom_token") || undefined;
      initMixpanelOnce(tokenToUse);
    }
    if (pathname === "/") {
      // Reset mixpanel if it exists
      if (typeof window !== "undefined" && window.mixpanel) {
        if (window?.mixpanel) {
          try {
            console.log("[MIXPANEL]: ATTEMPTING FULL RESET ON LANDING PAGE");
            if (window.mixpanel?.reset) mixpanel.reset();
            if (window.mixpanel?.stop_session_recording) mixpanel.stop_session_recording();
            sessionStorage.removeItem("mixpanel_active_session");
            sessionStorage.removeItem("mixpanel_custom_token");
            console.log("[MIXPANEL]: RESET SUCCESSFUL");
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
