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
      // NUKE EVERYTHING - clear all storage FIRST before resetting Mixpanel
      try {
        console.log("[MIXPANEL]: NUKING ALL STORAGE ON LANDING PAGE");

        // Clear ALL localStorage (including Mixpanel super properties)
        localStorage.clear();

        // Clear ALL sessionStorage (including session flags and cart data)
        sessionStorage.clear();

        console.log("[MIXPANEL]: STORAGE CLEARED");
      } catch (error) {
        console.error("error clearing storage:", error);
      }

      // Reset mixpanel if it exists
      if (typeof window !== "undefined" && window.mixpanel) {
        if (window?.mixpanel) {
          try {
            console.log("[MIXPANEL]: RESETTING MIXPANEL INSTANCE");
            if (window.mixpanel?.reset) mixpanel.reset();
            if (window.mixpanel?.stop_session_recording) mixpanel.stop_session_recording();
            console.log("[MIXPANEL]: RESET SUCCESSFUL");
          } catch (error) {
            console.error("error resetting mixpanel:", error);
          }
        }
      }

      // Reset the initialized flag so Mixpanel can be re-initialized fresh on next vertical
      resetInitialized();
    }
  }, [pathname]);

  return <>{children}</>;
}
