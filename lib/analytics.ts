// lib/analytics.ts
// make sure this file is client-only so it never runs on the server
"use client";

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { MIXPANEL_PROXY } from "./mixpanel-snippet";

/**
 * Stand-in for `mixpanel.flags` while only the snippet stub is present.
 * The stub buffers tracking calls but not flag reads, so we hold flag calls
 * until the library fires its `loaded` callback, then forward them.
 * Every flags method the app uses returns a promise, so the delay is invisible.
 *
 * We wait with a timeout, never forever. Callers show fallback content from
 * their .catch(), so a library that never loads must reject, not hang.
 */
const deferredFlags: any = new Proxy(
  {},
  {
    get(_target, method) {
      if (typeof method !== "string") return undefined;
      return (...args: any[]) => whenMixpanelLoaded().then((mp: any) => mp.flags[method](...args));
    },
  }
);

/**
 * Live handle to the Mixpanel instance the snippet installs on `window`.
 *
 * We no longer import the bundled `mixpanel-browser` module: only the snippet
 * loader honors MIXPANEL_CUSTOM_LIB_URL, which points at the visual-experiments
 * build. See lib/mixpanel-snippet.ts and app/layout.tsx.
 *
 * The snippet installs a queuing stub synchronously, so calls made before the
 * real library finishes downloading are buffered, not dropped.
 */
const mixpanel: any = new Proxy(
  {},
  {
    get(_target, prop) {
      // Nothing to talk to during static prerender.
      if (typeof window === "undefined") return undefined;
      const mp: any = window.mixpanel;
      if (!mp) {
        // Symbol probes (React, promise unwrapping) must stay quiet.
        if (typeof prop !== "string") return undefined;
        throw new Error(`[SDK]: window.mixpanel is missing - the Mixpanel snippet did not run (read "${prop}")`);
      }
      // The snippet stub queues plain tracking calls but has no `flags` namespace.
      if (prop === "flags" && !mp.flags) return deferredFlags;
      const value = mp[prop];
      return typeof value === "function" ? value.bind(mp) : value;
    },
    set(_target, prop, value) {
      if (typeof window === "undefined") return true;
      const mp: any = window.mixpanel;
      if (!mp) {
        throw new Error(`[SDK]: window.mixpanel is missing - the Mixpanel snippet did not run (write "${String(prop)}")`);
      }
      mp[prop] = value;
      return true;
    },
  }
);

// Get token from URL or use default
function getMixpanelToken(): string {
  // Check for token in URL query params
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    if (urlToken) {
      console.log('[SDK]: Using token from URL:', urlToken.substring(0, 8) + '...');
      return urlToken;
    }
  }
  // Fall back to environment variable or default
  return process.env.REACT_APP_MIXPANEL_TOKEN || "7c02ad22ae575ab4e15cdd052cd730fb";
}

const MIXPANEL_TOKEN = getMixpanelToken();

let initialized = false;

/**
 * Has initMixpanelOnce() run for this page load?
 * Callers must not test `window.mixpanel` for this: the snippet defines that
 * global on every page, before any of our code runs.
 */
export function isMixpanelInitialized(): boolean {
  return initialized;
}

// Reset the initialized flag to allow re-initialization
export function resetInitialized() {
  initialized = false;
  console.log("[SDK]: RESET INITIALIZED FLAG");
}

/**
 * Resolved by the `loaded` callback of mixpanel.init().
 * That callback is the library's own "I am ready" signal, so we do not poll.
 */
let signalMixpanelLoaded: (mp: any) => void;
const mixpanelLoaded: Promise<any> = new Promise((resolve) => {
  signalMixpanelLoaded = resolve;
});

/**
 * Wait for the `loaded` callback WITHOUT triggering init.
 * Read-only observers (the Header and Footer device-ID badge) must use this.
 * They render on the landing page, where we deliberately never initialize.
 */
export function whenMixpanelLoaded(timeoutMs = 10000): Promise<any> {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`Mixpanel did not load within ${timeoutMs}ms`));
    }, timeoutMs);
  });

  // Cancel the timer once the library reports in, so it cannot fire a false alarm.
  return Promise.race([mixpanelLoaded, timeout]).finally(() => clearTimeout(timer));
}

// Helper function to wait for Mixpanel to be ready
export function waitForMixpanel(timeoutMs = 10000): Promise<any> {
  // The snippet buffers calls, so init is safe to request before the lib lands.
  // This also guarantees init runs before any caller starts tracking.
  initMixpanelOnce();
  return whenMixpanelLoaded(timeoutMs);
}

/**
 * Track microsite session start - called by each microsite landing page
 * Uses the SAME sessionStorage key as the loaded callback to avoid duplicates
 */
export async function trackMicrositeSession(micrositeName: string): Promise<void> {
  try {
    const mp = await waitForMixpanel();
    const sessionKey = 'mixpanel_active_session'; // Same key as loaded callback!

    if (!sessionStorage.getItem(sessionKey)) {
      // Generate and register lucky number as super property
      const luckyNumber = Math.floor(Math.random() * 1000000) + 1;
      mp.register({ luckyNumber });
      console.log('[SESSION]: Registered luckyNumber:', luckyNumber);

      mp.track(`Session: ${micrositeName}`);
      sessionStorage.setItem(sessionKey, 'true');
      console.log(`[SESSION]: Started ${micrositeName} session`);
    } else {
      console.log(`[SESSION]: Session already active, skipping ${micrositeName} session event`);
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

  // One explicit guard at the entry point. If the inline snippet never ran
  // (a CSP that blocks inline scripts, for example) we say so once and give up
  // on analytics. We do not let a missing SDK white-screen the demo site.
  if (typeof window === "undefined" || !window.mixpanel) {
    console.error("[SDK]: MIXPANEL SNIPPET DID NOT RUN - analytics disabled for this page load");
    return mixpanel;
  }

  mixpanel.init(MIXPANEL_TOKEN, {
    // your existing options ↓
    //@ts-ignore
    flags: {}, // ! turn on Mixpanel's feature flags
    visual_experiments: true, // ! turn on Mixpanel's visual experiments

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
    record_console: true,
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
    //         pages: ["https://mixpanel.github.io/fixpanel", "http://localhost"],
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

      // Release every waitForMixpanel() caller.
      signalMixpanelLoaded(mp);

      // Note: Session tracking is handled by trackMicrositeSession()
      // which is called by each microsite landing page
      // We don't track session here because the loaded callback only fires once
      // even with client-side routing

      console.log(`[SDK]: DISTINCT_ID: ${mp.get_distinct_id()}\n`);
      if (typeof window !== "undefined") {
        console.log("[SDK]: EXPOSED GLOBALLY");

        // Start session recording
        mp.start_session_recording();
        console.log("[SDK]: START SESSION RECORDING");

        // The snippet already put the instance on window; keep this explicit
        // so the debugging contract stays obvious.
        // @ts-ignore
        window.mixpanel = mp;

        // Monkey patch track to log to the console
        const originalTrack = mp.track;
        mp.track = function (event: string, props: any) {
          if (typeof props !== "object" || !props) props = {};
          if (Object.keys(props).length === 0) console.log(`[SDK]: ${event}`);
          else console.log(`[SDK]: EVENT ${event}`, props);
          originalTrack.call(mp, event, props);
        };

        // Monkey patch identify to log to the console
        const originalIdentify = mp.identify;
        mp.identify = function (distinctId: string) {
          console.log(`[SDK]: IDENTIFY ${distinctId}`);
          originalIdentify.call(mp, distinctId);
        };

        // Handle URL parameters
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

        // Expose global RESET function
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
 * NOTE: Always followed by a hard page reload, so no need for opt_out_tracking()
 */
export function cleanupEverything(): void {
  console.log("[CLEANUP]: STARTING COMPLETE CLEANUP");

  // 1. Destroy Mixpanel instance (if it exists)
  if (typeof window !== "undefined" && window.mixpanel) {
    try {
      console.log("[CLEANUP]: DESTROYING MIXPANEL INSTANCE");

      // Stop session recording
      if (window.mixpanel?.stop_session_recording) {
        window.mixpanel.stop_session_recording();
        console.log("[CLEANUP]: ✓ Session recording stopped");
      }

      // Reset Mixpanel instance (clears super properties, etc)
      if (window.mixpanel?.reset) {
        window.mixpanel.reset();
        console.log("[CLEANUP]: ✓ Mixpanel instance reset");
      }

      // We leave window.mixpanel in place. The snippet owns that global now,
      // and a hard reload always follows this cleanup, which rebuilds it.
      console.log("[CLEANUP]: ✓ Mixpanel torn down (global left to the snippet)");
    } catch (error) {
      console.error("[CLEANUP]: error destroying Mixpanel:", error);
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

  // 8. Reset the initialized flag
  resetInitialized();
  console.log("[CLEANUP]: ✓ Initialization flag reset");

  console.log("[CLEANUP]: 🧹 COMPLETE CLEANUP FINISHED");
}

/**
 * Get the base path of the current microsite
 * Examples:
 * - /fixpanel/financial/account → /fixpanel/financial/
 * - /fixpanel/wellness/chat → /fixpanel/wellness/
 * - /fixpanel/ → /fixpanel/
 * - /financial/account → /financial/
 * - / → /
 */
function getMicrositeBasePath(): string {
  const pathname = window.location.pathname;

  // Check if we have /fixpanel/ in the path (production)
  if (pathname.includes('/fixpanel/')) {
    const parts = pathname.split('/').filter(Boolean);
    // parts could be ['fixpanel'] or ['fixpanel', 'financial'] or ['fixpanel', 'financial', 'account']
    if (parts.length <= 1) {
      // We're on the homepage /fixpanel/ or /fixpanel
      return '/fixpanel/';
    } else {
      // We're in a microsite, return /fixpanel/microsite/
      return `/${parts[0]}/${parts[1]}/`;
    }
  } else {
    // Development mode (no /fixpanel/ prefix)
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length === 0) {
      // We're on the homepage /
      return '/';
    } else {
      // We're in a microsite, return /microsite/
      return `/${parts[0]}/`;
    }
  }
}

/**
 * Nuke everything with fade animation, then reload the current microsite.
 * This keeps users in their current vertical while resetting all tracking data.
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
    console.log("[RESET]: NUKING EVERYTHING AND RELOADING CURRENT MICROSITE");

    setTimeout(() => {
      // Use the centralized cleanup function
      cleanupEverything();

      // Navigate to current microsite's base path
      // This keeps users in their vertical while starting fresh
      setTimeout(() => {
        const targetPath = getMicrositeBasePath();
        console.log(`[RESET]: 🔄 Reloading current microsite: ${targetPath}`);
        window.location.href = window.location.origin + targetPath;
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
