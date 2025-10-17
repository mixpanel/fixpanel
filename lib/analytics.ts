// lib/analytics.ts
// make sure this file is client-only so it never runs on the server
"use client";

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import mixpanel from "mixpanel-browser";

const MIXPANEL_TOKEN = process.env.REACT_APP_MIXPANEL_TOKEN || "7c02ad22ae575ab4e15cdd052cd730fb";
const MIXPANEL_PROXY = `https://express-proxy-lmozz6xkha-uc.a.run.app`;

let initialized = false;

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
    loaded: (mp: any) => {
      console.log("[MIXPANEL]: LOADED");

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
      const isRootPage = document.location.pathname === "/fixpanel/" || document.location.pathname === "/";

      if (isRootPage) {
        mixpanel.reset();
        sessionStorage.removeItem("mixpanel_active_session");
        console.log("[MIXPANEL]: ROOT PAGE - RESETTING");
      }

      // Check if we have an active session marker in sessionStorage
      // sessionStorage persists across page navigations but is cleared when tab/window closes
      const hasActiveSession = sessionStorage.getItem("mixpanel_active_session") === "true";

      if (isTopLevelPage && !hasActiveSession) {
        // This is a fresh landing on a top-level page - reset and start new session
        console.log("[MIXPANEL]: FRESH LANDING - RESETTING");
        mp.stop_session_recording();
        mp.reset();
        sessionStorage.setItem("mixpanel_active_session", "true");
        mp.track(`START ${currentTopLevel}`);
        mp.track_pageview();
      }

      console.log(`[MIXPANEL]: DISTINCT_ID: ${mp.get_distinct_id()}\n`);
      if (typeof window !== "undefined") {
        console.log("[MIXPANEL]: EXPOSED GLOBALLY");
        mixpanel.start_session_recording();
        console.log("[MIXPANEL]: START SESSION RECORDING");
        // expose for debugging
        // @ts-ignore
        window.mixpanel = mp;

        //   monkey patch track to log to the console
        const originalTrack = mp.track;
        mp.track = function (event: string, props: any) {
          if (typeof props !== "object" || !props) props = {};
          if (Object.keys(props).length === 0) console.log(`[MIXPANEL]: ${event}`);
          else console.log(`[MIXPANEL]: EVENT ${event}`, props);
          originalTrack.call(mp, event, props);
        };

        //   monkey patch identify to log to the console
        const originalIdentify = mp.identify;
        mp.identify = function (distinctId: string) {
          console.log(`[MIXPANEL]: IDENTIFY ${distinctId}`);
          originalIdentify.call(mp, distinctId);
        };

        const PARAMS = getParams();
        const { user = "" } = PARAMS;
        if (user) {
          console.log(`[MIXPANEL]: FOUND USER ${user}`);
          mp.identify(user);
          mp.people.increment("# hits");
        }

        // @ts-ignore
        window.RESET = function () {
          // Create fade overlay element
          const overlay = document.createElement('div');
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
            overlay.style.opacity = '1';
          });

          setTimeout(() => {
            mp.track("END OF USER");
            setTimeout(() => {
              console.log("[MIXPANEL]: STOP SESSION RECORDING");
              mp.stop_session_recording();
              mp.reset();
              sessionStorage.removeItem("mixpanel_active_session");
              console.log("[MIXPANEL]: RESET");
              setTimeout(() => {
                window.location.reload();
              }, 200);
            }, 300);
          }, 500);
        };
      }
    },
  });

  initialized = true;
  return mixpanel;
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
