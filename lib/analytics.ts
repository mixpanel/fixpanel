// lib/analytics.ts
// make sure this file is client-only so it never runs on the server
"use client";

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import mixpanel from "mixpanel-browser";

const MIXPANEL_TOKEN = process.env.REACT_APP_MIXPANEL_TOKEN || "7c02ad22ae575ab4e15cdd052cd730fb";
const MIXPANEL_PROXY = `https://express-proxy-lmozz6xkha-uc.a.run.app`;

let initialized = false;

// Reset the initialized flag to allow re-initialization
export function resetInitialized() {
  initialized = false;
  console.log("[SDK]: RESET INITIALIZED FLAG");
}

// Helper function to wait for Mixpanel to be ready
export function waitForMixpanel(maxAttempts = 20, interval = 100): Promise<any> {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const checkMixpanel = () => {
      attempts++;

      if (typeof window !== 'undefined' && window.mixpanel) {
        console.log(`[SDK]: MIXPANEL READY Found after ${attempts} attempts`);
        resolve(window.mixpanel);
        return;
      }

      if (attempts >= maxAttempts) {
        console.error(`[SDK]: MIXPANEL UN-READY Not found after ${maxAttempts} attempts`);
        reject(new Error('Mixpanel not loaded'));
        return;
      }

      setTimeout(checkMixpanel, interval);
    };

    checkMixpanel();
  });
}

// Track microsite session start (only once per session across ALL microsites)
export async function trackMicrositeSession(micrositeName: string): Promise<void> {
  try {
    const mp = await waitForMixpanel();
    const sessionKey = 'microsite_session_started';

    if (!sessionStorage.getItem(sessionKey)) {
      // Generate and register lucky number as super property
      const luckyNumber = Math.floor(Math.random() * 1000000) + 1;
      mp.register({ luckyNumber });
      console.log('[SESSION]: Registered luckyNumber:', luckyNumber);

      mp.track(`Session: ${micrositeName}`);
      sessionStorage.setItem(sessionKey, 'true');
      console.log(`[SESSION]: Started ${micrositeName} session`);
    }
  } catch (error) {
    console.error('[SESSION]: Failed to track session:', error);
  }
}

// parse a query-string safely
function qsToObj(queryString: string) {
  try {
    return Object.fromEntries(new URLSearchParams(queryString));
  } catch {
    return {};
  }
}

/**
 * Only read window.location.search at runtime in the browser.
 */
function getParams() {
  if (typeof window === "undefined") {
    return {};
  }
  return qsToObj(window.location.search);
}

// now *inside* your initMixpanel (or wherever) you do:
const PARAMS = getParams();
const { user = "" } = PARAMS;

export function initMixpanelOnce() {
  if (initialized) return mixpanel;

  mixpanel.init(MIXPANEL_TOKEN, {
    // your existing options ↓
    //@ts-ignore
    flags: {}, // ! turn on Mixpanel's feature flags

    autocapture: {
      pageview: "full-url",
      click: true,
      input: true,
      scroll: true,
      submit: true,
      capture_text_content: true,
    },
    record_heatmap_data: true,
    record_inline_images: true,
    record_collect_fonts: true,
    record_mask_text_selector: "nope",
    record_block_selector: "nope",
    record_block_class: "nope",
    ignore_dnt: true,
    batch_flush_interval_ms: 0,
    api_host: MIXPANEL_PROXY,
    debug: false,
    api_payload_format: "json",
    api_transport: "XHR",
    persistence: "localStorage",
    hooks: {
    //   before_send_events: function (row: any) {
    //     const { event = "", properties = {} } = row;
    //     const ignoreEventsAndPages = [
    //       {
    //         event: "$mp_page_leave",
    //         pages: ["https://ak--47.github.io/fixpanel", "http://localhost"],
    //       },
    //     ];
    //     for (let i = 0; i < ignoreEventsAndPages.length; i++) {
    //       const ignore = ignoreEventsAndPages[i];
    //       if (event === ignore.event) {
    //         const currentPage = properties["$current_url"] || "";
    //         for (let j = 0; j < ignore.pages.length; j++) {
    //           const pageToIgnore = ignore.pages[j];
    //           if (currentPage.startsWith(pageToIgnore)) {
    //             console.log(`[MIXPANEL]: IGNORING EVENT ${event} ON PAGE ${currentPage}`);
    //             row = {};
    //             return row;
    //           }
    //         }
    //       }
    //     }
    //     return row;
    //   },
    },
    loaded: (mp: any) => {
      console.log("[SDK]: MIXPANEL LOADED");

      // RESETTING MIXPANEL AND STARTING A NEW SESSION
      // WE ONLY WANT TO RESET MIXPANEL IF WE JUST LANDED ON a "top level" PAGE
      // ^ the use case we expect is users starts on / (no tracking) then goes to /financial and we should reset
      // the top level paths are: /financial /checkout /admin /lifestyle /streaming /wellness
      // IMPORTANTLY we DON'T want to reset if we're on a "sub page" like
      // /financial/testimonials or /checkout/cart etc
      // we ALSO don't want to reset if we navigated from a "sub page" back to a "top level" page
      // so /financial → /financial/testimonials → /financial should NOT reset

      const pageDepth = document.location.pathname.split("/").filter((a) => a).length;
      const topLevelPaths = ["financial", "checkout", "admin", "lifestyle", "streaming", "wellness"];
      const currentTopLevel = document.location.pathname.split("/").filter((a) => a)[0];
      const isTopLevelPage = pageDepth === 1 && topLevelPaths.includes(currentTopLevel);

      // Check if we have an active session marker in sessionStorage
      // sessionStorage persists across page navigation but is cleared when tab/window closes
      const hasActiveSession = sessionStorage.getItem("mixpanel_active_session") === "true";

      if (isTopLevelPage && !hasActiveSession) {
        // This is a fresh landing on a top-level page - reset and start new session
        console.log("[SDK]: FRESH LANDING - RESETTING");
        mp.stop_session_recording();
        mp.reset();
        sessionStorage.setItem("mixpanel_active_session", "true");
        mp.track(`START ${currentTopLevel}`);
        mp.track_pageview();
      }

      console.log(`[SDK]: DISTINCT_ID: ${mp.get_distinct_id()}\n`);
      if (typeof window !== "undefined") {
        console.log("[SDK]: EXPOSED GLOBALLY");

        // OPT IN to tracking (clears any previous opt-out state)
        if (mp.opt_in_tracking) {
          mp.opt_in_tracking();
          console.log("[SDK]: ✓ Opted in to tracking");
        }

        mixpanel.start_session_recording();
        console.log("[SDK]: START SESSION RECORDING");
        // expose for debugging
        // @ts-ignore
        window.mixpanel = mp;

        //   monkey patch track to log to the console
        const originalTrack = mp.track;
        mp.track = function (event: string, props: any) {
          if (typeof props !== "object" || !props) props = {};
          if (Object.keys(props).length === 0) console.log(`[SDK]: ${event}`);
          else console.log(`[SDK]: EVENT ${event}`, props);
          originalTrack.call(mp, event, props);
        };

        //   monkey patch identify to log to the console
        const originalIdentify = mp.identify;
        mp.identify = function (distinctId: string) {
          console.log(`[SDK]: IDENTIFY ${distinctId}`);
          originalIdentify.call(mp, distinctId);
        };

        const PARAMS = getParams();
        const { user = "", ...restParams } = PARAMS;
        if (user) {
          console.log(`[SDK]: FOUND USER ${user}`);
          mp.identify(user);
          mp.people.increment("# hits");
        }

		if (Object.keys(restParams).length > 0) {
			console.log("[SDK]: REGISTERING PARAMS AS SUPER PROPERTIES", restParams);
			mp.register(restParams);
		}

        // @ts-ignore
        window.RESET = () => nukePanel();
      }
    },
  });

  initialized = true;
  return mixpanel;
}

/**
 * Core cleanup function - clears all storage and destroys Mixpanel instance
 * Used by both landing page navigation and RESET button
 */
export function cleanupEverything(): void {
  console.log("[CLEANUP]: STARTING COMPLETE CLEANUP");

  // 1. OPT OUT of tracking FIRST (before clearing storage!)
  // This removes auto-capture event listeners and sets opt-out cookie
  if (typeof window !== "undefined" && window.mixpanel) {
    try {
      console.log("[CLEANUP]: OPTING OUT OF TRACKING");

      if (window.mixpanel?.opt_out_tracking) {
        window.mixpanel.opt_out_tracking();
        console.log("[SDK]: ✓ Opted out of tracking");
      }

      // Stop session recording
      if (window.mixpanel?.stop_session_recording) {
        window.mixpanel.stop_session_recording();
        console.log("[CLEANUP]: ✓ Session recording stopped");
      }

      // Reset Mixpanel instance
      if (window.mixpanel?.reset) {
        window.mixpanel.reset();
        console.log("[CLEANUP]: ✓ Mixpanel instance reset");
      }
    } catch (error) {
      console.error("[CLEANUP]: error during Mixpanel opt-out:", error);
    }
  }

  // 2. Clear ALL localStorage
  try {
    localStorage.clear();
    console.log("[CLEANUP]: ✓ localStorage cleared");
  } catch (e) {
    console.error("[CLEANUP]: ✗ localStorage clear failed:", e);
  }

  // 3. Clear ALL sessionStorage
  try {
    sessionStorage.clear();
    console.log("[CLEANUP]: ✓ sessionStorage cleared");
  } catch (e) {
    console.error("[CLEANUP]: ✗ sessionStorage clear failed:", e);
  }

  // 4. Clear ALL cookies
  try {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;";
      const domain = window.location.hostname;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + domain;
    }
    console.log("[CLEANUP]: ✓ Cookies cleared");
  } catch (e) {
    console.error("[CLEANUP]: ✗ Cookie clear failed:", e);
  }

  // 5. Clear ALL IndexedDB databases
  try {
    if (window.indexedDB && window.indexedDB.databases) {
      window.indexedDB.databases().then((databases) => {
        databases.forEach((db) => {
          if (db.name) window.indexedDB.deleteDatabase(db.name);
        });
      });
      console.log("[CLEANUP]: ✓ IndexedDB cleared");
    }
  } catch (e) {
    console.error("[CLEANUP]: ✗ IndexedDB clear failed:", e);
  }

  // 6. Clear ALL Cache storage
  try {
    if (window.caches) {
      caches.keys().then((names) => {
        names.forEach((name) => caches.delete(name));
      });
      console.log("[CLEANUP]: ✓ Cache storage cleared");
    }
  } catch (e) {
    console.error("[CLEANUP]: ✗ Cache storage clear failed:", e);
  }

  // 7. Clear Shared storage (experimental API)
  try {
    // @ts-ignore
    if (window.sharedStorage) {
      // @ts-ignore
      window.sharedStorage.clear();
      console.log("[CLEANUP]: ✓ Shared storage cleared");
    }
  } catch (e) {
    console.log("[CLEANUP]: ⓘ Shared storage not available or clear failed");
  }

  console.log("[CLEANUP]: ✓ ALL STORAGE CLEARED");

  // 8. DESTROY Mixpanel instance (after storage cleared)
  if (typeof window !== "undefined" && window.mixpanel) {
    try {
      // @ts-ignore
      window.mixpanel = null;
      console.log("[CLEANUP]: ✓ Mixpanel instance destroyed (set to null)");
    } catch (error) {
      console.error("[CLEANUP]: error destroying mixpanel:", error);
    }
  }

  // 9. Reset the initialized flag
  resetInitialized();
  console.log("[CLEANUP]: ✓ Initialization flag reset");

  console.log("[CLEANUP]: 🧹 COMPLETE CLEANUP FINISHED");
}

/**
 * Nuke everything with fade animation, then navigate to landing page.
 * This prevents creating a "third user" by ensuring we go through the landing page cleanup.
 */
export function nukePanel(): void {
  // Create fade overlay element
  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #1a1a1a;
    opacity: 0;
    transition: opacity 0.8s ease-in-out;
    z-index: 9999;
    pointer-events: none;
  `;
  document.body.appendChild(overlay);

  // Trigger fade in
  requestAnimationFrame(() => {
    overlay.style.opacity = "1";
  });

  setTimeout(() => {
    console.log("[RESET]: NUKING EVERYTHING AND RETURNING TO LANDING PAGE");

    setTimeout(() => {
      // Use the centralized cleanup function
      cleanupEverything();

      // Navigate to landing page (/) which will trigger ClientLayout cleanup again for double protection
      // This ensures we don't create a "third user" by reloading the current microsite
      setTimeout(() => {
        console.log("[RESET]: 🏠 Navigating to landing page...");
        window.location.href = window.location.origin + (window.location.pathname.includes('fixpanel') ? '/fixpanel/' : '/');
      }, 200);
    }, 300);
  }, 500);
}

// export the instance symbol so callers can just do mixpanel.track(...)
export { mixpanel };

/**
 * Track a page view via Mixpanel.
 */
export const trackPageView = (url: string) => {
  initMixpanelOnce();
  mixpanel.track_pageview({ url });
};

/**
 * Utility for merging classnames with Tailwind support.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Log every function on `obj`, including inherited ones, and
 * then recurse into any nested objects.
 */
function documentAllMethods(obj: any, seen = new WeakSet(), indent = "") {
  if (obj === null || seen.has(obj)) return;
  seen.add(obj);

  // 1) Log own methods (including non-enumerables & symbols)
  for (const key of Reflect.ownKeys(obj)) {
    let val;
    try {
      val = obj[key];
    } catch {
      // skip getters that throw
      continue;
    }
    if (typeof val === "function") {
      console.log(`${indent}${String(key)}()`);
    }
  }

  // 2) Traverse *this* object’s prototype chain
  const proto = Object.getPrototypeOf(obj);
  if (proto && !seen.has(proto)) {
    console.log(`${indent}[[Prototype]] → {`);
    documentAllMethods(proto, seen, indent + "  ");
    console.log(`${indent}}`);
  }

  // 3) Recurse into any nested objects
  for (const key of Reflect.ownKeys(obj)) {
    let val;
    try {
      val = obj[key];
    } catch {
      continue;
    }
    if (val && typeof val === "object") {
      console.log(`${indent}${String(key)} → {`);
      documentAllMethods(val, seen, indent + "  ");
      console.log(`${indent}}`);
    }
  }
}

if (typeof window !== "undefined") {
  // @ts-ignore
  window.documentAllMethods = documentAllMethods;
}
