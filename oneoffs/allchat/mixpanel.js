/**
 * AllChat - Mixpanel Integration
 * Autocapture, Session Replay, Experiments, and Feature Flags
 */

// ========================================
// URL PARAMETER CONTROLS
// Use ?exp_active=true to enable experiment
// Use ?ff_active=true to enable feature flag
// Use ?exp_active=true&ff_active=true for both
// ========================================
const urlParams = new URLSearchParams(window.location.search);
const EXPERIMENT_ACTIVE = urlParams.get('exp_active') === 'true';
const FEATURE_FLAG_ACTIVE = urlParams.get('ff_active') === 'true';

// Configuration
const MIXPANEL_TOKEN = "281c0f62e328b044d47dfa8e78fcd505";
const MIXPANEL_PROXY = "https://express-proxy-lmozz6xkha-uc.a.run.app";
const MIXPANEL_CUSTOM_LIB_URL = `${MIXPANEL_PROXY}/lib.min.js`;
const MIXPANEL_DEBUG = true;

// Mixpanel Project Links (for quick access)
const MIXPANEL_PROJECT_URL = "https://mixpanel.com/project/3982239";
const MIXPANEL_EXPERIMENT_URL = "https://mixpanel.com/project/3982239/view/4478075/app/feature-flags/3872ce8a-5cea-4e4f-a399-bc7c90677805";
const MIXPANEL_FEATURE_FLAG_URL = "https://mixpanel.com/project/3982239/view/4478075/app/feature-flags/76108c6e-1d5f-4b52-bdee-c05ab9e3de7e";

// Mixpanel stub loader
(function (f, b) {
  if (!b.__SV) {
    var e, g, i, h;
    window.mixpanel = b;
    b._i = [];
    b.init = function (e, f, c) {
      function g(a, d) {
        var b = d.split(".");
        2 == b.length && ((a = a[b[0]]), (d = b[1]));
        a[d] = function () {
          a.push([d].concat(Array.prototype.slice.call(arguments, 0)));
        };
      }
      var a = b;
      "undefined" !== typeof c ? (a = b[c] = []) : (c = "mixpanel");
      a.people = a.people || [];
      a.toString = function (a) {
        var d = "mixpanel";
        "mixpanel" !== c && (d += "." + c);
        a || (d += " (stub)");
        return d;
      };
      a.people.toString = function () {
        return a.toString(1) + ".people (stub)";
      };
      i = "disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset init opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove start_session_recording stop_session_recording".split(" ");
      for (h = 0; h < i.length; h++) g(a, i[h]);
      var j = "set set_once union unset remove delete".split(" ");
      a.get_group = function () {
        function b(c) {
          d[c] = function () {
            call2_args = arguments;
            call2 = [c].concat(Array.prototype.slice.call(call2_args, 0));
            a.push([e, call2]);
          };
        }
        for (var d = {}, e = ["get_group"].concat(Array.prototype.slice.call(arguments, 0)), c = 0; c < j.length; c++) b(j[c]);
        return d;
      };
      b._i.push([e, f, c]);
    };
    b.__SV = 1.2;
    e = f.createElement("script");
    e.type = "text/javascript";
    e.async = !0;
    e.src = "undefined" !== typeof MIXPANEL_CUSTOM_LIB_URL ? MIXPANEL_CUSTOM_LIB_URL : "//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";
    g = f.getElementsByTagName("script")[0];
    g.parentNode.insertBefore(e, g);
  }
})(document, window.mixpanel || []);

// Store for experiment/flag values
window.allchatConfig = {
  layout: 'grid',
  showLayoutSwitcher: false,
  initialized: false
};

/**
 * Initialize Mixpanel with all features
 */
async function initMixpanel() {
  return new Promise((resolve) => {
    mixpanel.init(MIXPANEL_TOKEN, {
      api_host: MIXPANEL_PROXY,
      debug: MIXPANEL_DEBUG,
      ignore_dnt: true,

      // Enable feature flags
      flags: true,

      // Autocapture configuration
      autocapture: {
        pageview: "full-url",
        click: true,
        input: true,
        scroll: true,
        submit: true,
        capture_text_content: true
      },

      // Session replay configuration
      record_sessions_percent: 100,
      record_inline_images: true,
      record_collect_fonts: true,
      record_mask_text_selector: "nope",
      record_block_selector: "nope",
      record_block_class: "nope",

      // Performance settings
      batch_flush_interval_ms: 0,
      api_payload_format: "json",
      api_transport: "XHR",
      persistence: "localStorage",

      // Loaded callback
      loaded: async function (mp) {
        if (MIXPANEL_DEBUG) console.log("[MIXPANEL] Library loaded successfully");

        // Start session recording
        mp.start_session_recording();
        if (MIXPANEL_DEBUG) console.log("[MIXPANEL] Session recording started");

        // Fetch experiment and feature flag values
        await loadFlagsAndExperiments();

        // Setup global RESET function
        setupResetFunction(mp);

        // Mark as initialized
        window.allchatConfig.initialized = true;

        resolve();
      }
    });
  });
}

/**
 * Load experiment variants and feature flags
 */
async function loadFlagsAndExperiments() {
  // Build demo URLs with params
  const baseUrl = window.location.origin + window.location.pathname;
  const expOnlyUrl = `${baseUrl}?exp_active=true`;
  const ffOnlyUrl = `${baseUrl}?ff_active=true`;
  const bothUrl = `${baseUrl}?exp_active=true&ff_active=true`;

  // Print nice console instructions
  console.log(
    "%c\n" +
    "╔═══════════════════════════════════════════════════════════════╗\n" +
    "║                    🎯 AllChat Demo Console                    ║\n" +
    "╚═══════════════════════════════════════════════════════════════╝",
    "color: #7856FF; font-weight: bold; font-size: 12px;"
  );

  console.log(
    "%c📊 Current Status",
    "color: #A855F7; font-weight: bold; font-size: 11px; margin-top: 8px;"
  );
  console.log(
    `   Experiment (ui_grid_system):     %c${EXPERIMENT_ACTIVE ? '✅ ACTIVE' : '⏸️  INACTIVE'}`,
    EXPERIMENT_ACTIVE ? "color: #22C55E; font-weight: bold;" : "color: #6B7280;"
  );
  console.log(
    `   Feature Flag (grid_selector):    %c${FEATURE_FLAG_ACTIVE ? '✅ ACTIVE' : '⏸️  INACTIVE'}`,
    FEATURE_FLAG_ACTIVE ? "color: #22C55E; font-weight: bold;" : "color: #6B7280;"
  );

  console.log(
    "%c\n🔗 Quick Launch Links",
    "color: #A855F7; font-weight: bold; font-size: 11px;"
  );
  console.log(`   Experiment only:     ${expOnlyUrl}`);
  console.log(`   Feature flag only:   ${ffOnlyUrl}`);
  console.log(`   Both enabled:        ${bothUrl}`);
  console.log(`   Default (none):      ${baseUrl}`);

  console.log(
    "%c\n🎛️  Mixpanel Project Links",
    "color: #A855F7; font-weight: bold; font-size: 11px;"
  );
  console.log(`   Project:       ${MIXPANEL_PROJECT_URL}`);
  console.log(`   Experiment:    ${MIXPANEL_EXPERIMENT_URL}`);
  console.log(`   Feature Flag:  ${MIXPANEL_FEATURE_FLAG_URL}`);

  console.log(
    "%c\n💡 Tip: %cType %cRESET()%c to clear user data and start fresh",
    "color: #A855F7; font-weight: bold;",
    "color: #9CA3AF;",
    "color: #22C55E; font-weight: bold;",
    "color: #9CA3AF;"
  );
  console.log("");

  try {
    // Experiment: ui_grid_system
    // Controls initial layout: 'control' (grid), 'variant a' (vertical), 'variant b' (horizontal)
    if (EXPERIMENT_ACTIVE) {
      const layoutVariant = await mixpanel.flags.get_variant_value(
        "ui_grid_system",
        "control" // fallback
      );

      // Map experiment values to layout names
      const layoutMap = {
        "control": "grid",
        "variant a": "vertical",
        "variant b": "horizontal"
      };
      window.allchatConfig.layout = layoutMap[layoutVariant] || "grid";
      window.allchatConfig.experimentVariant = layoutVariant;
      if (MIXPANEL_DEBUG) console.log("[MIXPANEL] Experiment variant:", layoutVariant, "-> Layout:", window.allchatConfig.layout);
    } else {
      if (MIXPANEL_DEBUG) console.log("[MIXPANEL] Experiment disabled, using default layout: grid");
      window.allchatConfig.layout = 'grid';
      window.allchatConfig.experimentVariant = 'disabled';
    }

    // Feature Flag: grid_selector_control
    // Controls whether to show the layout switcher UI
    if (FEATURE_FLAG_ACTIVE) {
      const showSwitcher = await mixpanel.flags.is_enabled(
        "grid_selector_control",
        false // fallback
      );
      window.allchatConfig.showLayoutSwitcher = showSwitcher;
      if (MIXPANEL_DEBUG) console.log("[MIXPANEL] Layout switcher enabled:", showSwitcher);
    } else {
      if (MIXPANEL_DEBUG) console.log("[MIXPANEL] Feature flag disabled, layout switcher: false");
      window.allchatConfig.showLayoutSwitcher = false;
    }

  } catch (error) {
    console.error("[MIXPANEL] Error loading flags:", error);
    // Use defaults on error
    window.allchatConfig.layout = 'grid';
    window.allchatConfig.showLayoutSwitcher = false;
  }
}

/**
 * Setup global RESET function
 */
function setupResetFunction(mp) {
  window.RESET = function () {
    console.log("[MIXPANEL] Initiating reset...");

    // Create fade overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: #000;
      opacity: 0;
      z-index: 9999;
      transition: opacity 0.5s ease;
      pointer-events: none;
    `;
    document.body.appendChild(overlay);

    // Trigger fade to black
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
    });

    setTimeout(() => {
      // Track bounce event before reset
      mp.track("bounce", {
        session_duration: Date.now() - (window.sessionStartTime || Date.now())
      });

      setTimeout(() => {
        // Stop session recording
        console.log("[MIXPANEL] Stopping session recording...");
        mp.stop_session_recording();

        setTimeout(() => {
          // Reset Mixpanel (clears user ID and properties)
          console.log("[MIXPANEL] Resetting user...");
          mp.reset();

          // Reload the page
          window.location.assign(window.location.href.split('?')[0]);
        }, 300);
      }, 300);
    }, 500);
  };

  // Store session start time
  window.sessionStartTime = Date.now();
}

/**
 * Track custom events with standard properties
 */
window.trackEvent = function (eventName, properties = {}) {
  if (typeof mixpanel !== 'undefined' && typeof mixpanel.track === 'function') {
    const enrichedProperties = {
      ...properties,
      layout: window.allchatConfig.layout,
      layout_switcher_visible: window.allchatConfig.showLayoutSwitcher,
      timestamp: new Date().toISOString()
    };

    mixpanel.track(eventName, enrichedProperties);

    if (MIXPANEL_DEBUG) {
      console.log(`[MIXPANEL] Event: ${eventName}`, enrichedProperties);
    }
  }
};

/**
 * Specific event tracking helpers
 */
window.trackPromptSent = function (promptText, promptIndex, isScripted) {
  trackEvent("prompt_sent", {
    prompt_text: promptText,
    prompt_index: promptIndex,
    is_scripted: isScripted,
    prompt_length: promptText.length
  });
};

window.trackResponseCompleted = function (llmName, responseTimeMs, characterCount) {
  trackEvent("response_completed", {
    llm_name: llmName,
    response_time_ms: responseTimeMs,
    character_count: characterCount
  });
};

window.trackRatingGiven = function (llmName, rating, promptIndex) {
  trackEvent("rating_given", {
    llm_name: llmName,
    rating: rating, // 'up' or 'down'
    prompt_index: promptIndex
  });
};

window.trackFocusModeEntered = function (llmName) {
  trackEvent("focus_mode_entered", {
    llm_name: llmName
  });
};

window.trackFocusModeExited = function (llmName, durationMs) {
  trackEvent("focus_mode_exited", {
    llm_name: llmName,
    duration_ms: durationMs
  });
};

window.trackLayoutChanged = function (newLayout, oldLayout, source) {
  trackEvent("layout_changed", {
    new_layout: newLayout,
    old_layout: oldLayout,
    change_source: source // 'switcher', 'experiment', 'focus_mode'
  });
};

window.trackNextPromptClicked = function (fromIndex, toIndex) {
  trackEvent("next_prompt_clicked", {
    from_index: fromIndex,
    to_index: toIndex
  });
};

// Initialize Mixpanel when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMixpanel);
} else {
  initMixpanel();
}
