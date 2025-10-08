import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

//! todo: add types
//@ts-ignore
import mixpanel from "mixpanel-browser";

// ? https://mixpanel.com/project/3276012/app/settings#project/3276012
const MIXPANEL_TOKEN = process.env.REACT_APP_MIXPANEL_TOKEN || "7c02ad22ae575ab4e15cdd052cd730fb";
const MIXPANEL_PROXY = `https://express-proxy-lmozz6xkha-uc.a.run.app`;

// Singleton promise to ensure we only init once and know when mixpanel is ready
let mixpanelReady: Promise<typeof mixpanel> | null = null;

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

/**
 * Initialize Mixpanel and return a promise that resolves when loaded.
 * Subsequent calls return the same promise without re-initializing.
 */
export function initMixpanel(): Promise<typeof mixpanel> {
  if (mixpanelReady) {
    return mixpanelReady;
  }

  mixpanelReady = new Promise((resolve) => {
    if (!MIXPANEL_TOKEN) {
      console.warn("Mixpanel token is missing! Check your .env file.");
      resolve(mixpanel);
      return;
    }

    mixpanel.init(MIXPANEL_TOKEN, {
      //@ts-ignore //todo: make sure this is updated for our types!
      flags: {}, // ! turn on Mixpanel's feature flags

      // autocapture
      autocapture: {
        pageview: "full-url",
        click: true,
        input: true,
        scroll: true,
        submit: true,
        capture_text_content: true,
      },
      record_heatmap_data: true,

      // session replay
      //   record_sessions_percent: 100, //instead we start() and stop() manually
      record_inline_images: true,
      record_collect_fonts: true,
      record_mask_text_selector: "nope",
      record_block_selector: "nope",
      record_block_class: "nope",

      // favorites
      ignore_dnt: true,
      batch_flush_interval_ms: 0,
    //   api_host: MIXPANEL_PROXY,
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

		const pageDepth = document.location.pathname.split("/").filter(a=>a).length;
		const topLevelPaths = ['financial', 'checkout', 'admin', 'lifestyle', 'streaming', 'wellness'];
		const currentTopLevel = document.location.pathname.split("/").filter(a=>a)[0];
		const isTopLevelPage = pageDepth === 1 && topLevelPaths.includes(currentTopLevel);

		// Check if we have an active session marker in sessionStorage
		// sessionStorage persists across page navigations but is cleared when tab/window closes
		const hasActiveSession = sessionStorage.getItem('mixpanel_active_session') === 'true';

		if (isTopLevelPage && !hasActiveSession) {
			// This is a fresh landing on a top-level page - reset and start new session
			console.log("[MIXPANEL]: FRESH LANDING - RESETTING");
			mp.stop_session_recording();
			mp.reset();
			sessionStorage.setItem('mixpanel_active_session', 'true');
			mp.track("START OF USER");
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

          if (user) {
            console.log(`[MIXPANEL]: FOUND USER ${user}`);
            mp.identify(user);
            mp.people.increment("# hits");
          }

          // @ts-ignore
          window.RESET = function () {
            setTimeout(() => {
              mp.track("END OF USER");
              setTimeout(() => {
                console.log("[MIXPANEL]: STOP SESSION RECORDING");
                mp.stop_session_recording();
                mp.reset();
                sessionStorage.removeItem('mixpanel_active_session');
                console.log("[MIXPANEL]: RESET");
                setTimeout(() => {
                  window.location.reload();
                }, 500);
              }, 500);
            }, 500);
          };
        }
        resolve(mp);
      },
    });
  });

  return mixpanelReady;
}

/**
 * Track a page view via Mixpanel.
 */
export const trackPageView = (url: string) => {
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
