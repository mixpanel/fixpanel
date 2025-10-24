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
      // NUKE EVERYTHING - complete cleanup of all persistence layers
      try {
        console.log("[CLEANUP]: STARTING COMPLETE CLEANUP ON LANDING PAGE");

        // 1. Clear ALL localStorage (including Mixpanel super properties, lucky numbers, etc)
        try {
          localStorage.clear();
          console.log("[CLEANUP]: ✓ localStorage cleared");
        } catch (e) {
          console.error("[CLEANUP]: ✗ localStorage clear failed:", e);
        }

        // 2. Clear ALL sessionStorage (including session flags, cart data, form data, etc)
        try {
          sessionStorage.clear();
          console.log("[CLEANUP]: ✓ sessionStorage cleared");
        } catch (e) {
          console.error("[CLEANUP]: ✗ sessionStorage clear failed:", e);
        }

        // 3. Clear ALL cookies (for current domain and path)
        try {
          const cookies = document.cookie.split(";");
          for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
            // Delete cookie for current path
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
            // Delete cookie for root path
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;";
            // Delete cookie for current domain
            const domain = window.location.hostname;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + domain;
          }
          console.log("[CLEANUP]: ✓ cookies cleared");
        } catch (e) {
          console.error("[CLEANUP]: ✗ cookie clear failed:", e);
        }

        // 4. Clear ALL IndexedDB databases
        try {
          if (window.indexedDB && window.indexedDB.databases) {
            window.indexedDB.databases().then((databases) => {
              databases.forEach((db) => {
                if (db.name) {
                  window.indexedDB.deleteDatabase(db.name);
                }
              });
            });
            console.log("[CLEANUP]: ✓ IndexedDB cleared");
          }
        } catch (e) {
          console.error("[CLEANUP]: ✗ IndexedDB clear failed:", e);
        }

        // 5. Clear ALL Cache storage (Service Worker caches)
        try {
          if (window.caches) {
            caches.keys().then((names) => {
              names.forEach((name) => {
                caches.delete(name);
              });
            });
            console.log("[CLEANUP]: ✓ Cache storage cleared");
          }
        } catch (e) {
          console.error("[CLEANUP]: ✗ Cache storage clear failed:", e);
        }

        // 6. Clear Shared storage (if available - experimental API)
        try {
          // @ts-ignore - Shared Storage is experimental
          if (window.sharedStorage) {
            // @ts-ignore
            window.sharedStorage.clear();
            console.log("[CLEANUP]: ✓ Shared storage cleared");
          }
        } catch (e) {
          // Silently fail - shared storage might not be available
          console.log("[CLEANUP]: ⓘ Shared storage not available or clear failed");
        }

        console.log("[CLEANUP]: ALL STORAGE CLEARED");
      } catch (error) {
        console.error("[CLEANUP]: error during storage cleanup:", error);
      }

      // 7. Reset Mixpanel completely (stop recording, reset instance, clear state)
      if (typeof window !== "undefined" && window.mixpanel) {
        try {
          console.log("[CLEANUP]: RESETTING MIXPANEL INSTANCE");

          // Stop session recording first
          if (window.mixpanel?.stop_session_recording) {
            window.mixpanel.stop_session_recording();
            console.log("[CLEANUP]: ✓ Session recording stopped");
          }

          // Reset Mixpanel instance (clears distinct_id, super properties, etc)
          if (window.mixpanel?.reset) {
            window.mixpanel.reset();
            console.log("[CLEANUP]: ✓ Mixpanel instance reset");
          }

          console.log("[CLEANUP]: MIXPANEL RESET COMPLETE");
        } catch (error) {
          console.error("[CLEANUP]: error resetting mixpanel:", error);
        }
      }

      // 8. Reset the initialized flag so Mixpanel can be re-initialized fresh on next microsite
      resetInitialized();
      console.log("[CLEANUP]: ✓ Initialization flag reset");
      console.log("[CLEANUP]: 🧹 COMPLETE CLEANUP FINISHED - READY FOR FRESH START");
    }
  }, [pathname]);

  return <>{children}</>;
}
