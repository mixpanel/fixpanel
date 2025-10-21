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

      // Get the currently active token (what we're using right now)
      const currentActiveToken = sessionStorage.getItem("mixpanel_active_token");

      // Determine which token to use (URL takes priority, then sessionStorage)
      const tokenToUse = urlToken || sessionStorage.getItem("mixpanel_custom_token") || undefined;

      // If we found a new token (different from current), we need to update the config
      if (tokenToUse && tokenToUse !== currentActiveToken) {
        console.log(`[MIXPANEL]: NEW TOKEN DETECTED - UPDATING CONFIG`);
        console.log(`[MIXPANEL]: OLD TOKEN: ${currentActiveToken || "default"}`);
        console.log(`[MIXPANEL]: NEW TOKEN: ${tokenToUse}`);

        // Reset Mixpanel and update config with new token
        if (window.mixpanel?.reset) {
          mixpanel.reset();
          mixpanel.set_config({ token: tokenToUse });
          console.log(`[MIXPANEL]: CONFIG UPDATED TO TOKEN: ${tokenToUse}`);
        }

        // Store the new token
        sessionStorage.setItem("mixpanel_custom_token", tokenToUse);
        sessionStorage.setItem("mixpanel_active_token", tokenToUse);

        // Restart session recording
        if (window.mixpanel?.start_session_recording) {
          mixpanel.start_session_recording();
          console.log("[MIXPANEL]: SESSION RECORDING RESTARTED");
        }
      } else if (!currentActiveToken) {
        // First initialization - store what we're using
        const finalToken = tokenToUse || "default";
        sessionStorage.setItem("mixpanel_active_token", finalToken);
        if (tokenToUse) {
          sessionStorage.setItem("mixpanel_custom_token", tokenToUse);
          console.log("[MIXPANEL]: STORED CUSTOM TOKEN IN SESSION");
        }
        initMixpanelOnce(tokenToUse);
      }
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
            sessionStorage.removeItem("mixpanel_active_token");
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
