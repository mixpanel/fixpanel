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
      // flags
      flags: {
        context: {
          // default: { distinct_id: mixpanel.get_distinct_id() }
        },
      },

      // autocapture
      autocapture: {
        pageview: "full-url",
        click: true,
        input: true,
        scroll: true,
        submit: true,
        capture_text_content: true,
      },

      // session replay
      record_sessions_percent: 100,
      record_inline_images: true,
      record_collect_fonts: true,
      record_mask_text_selector: "nope",
      record_block_selector: "nope",
      record_block_class: "nope",

      // favorites
      ignore_dnt: true,
      batch_flush_interval_ms: 0,
      api_host: MIXPANEL_PROXY,
      debug: true,
      api_payload_format: "json",
      api_transport: "XHR",
      persistence: "localStorage",

      loaded: (mp: any) => {
        console.log("\nMIXPANEL HATH LOADED\n");
        if (typeof window !== "undefined") {
          console.log("\nMIXPANEL HATH BEEN EXPOSED\n");
          // expose for debugging
          // @ts-ignore
          window.mixpanel = mp;
        }
        // @ts-ignore
        window.RESET = function () {
          console.log("\nMIXPANEL WILL RESET AND PAGE WILL REFRESH\n");
          mp.reset();
          window.location.reload();
        };

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
