var params = new URLSearchParams(window.location.search);

window.mixtapeState = {
    isAnonymous: true,
    isSubscriber: false,
    userEmail: null,
    subscriptionPlan: null,

    sessionTrackCount: 0,
    sessionNumber: 1,
    trackLimit: 2,

    experimentVariant: "c",

    bugMode: params.get("bug") === "true",

    currentScreen: "landing",

    tasteProfileStep: null,
    selectedGenres: [],
    selectedArtists: [],

    currentTrack: null,
    isPlaying: false,
    playbackTimer: null,

    signupTrigger: "organic",
    lastCompletedOnboardingStep: null
};

var preIdentifyUser = params.get("user");

async function loadExperiment() {
    var urlVariant = params.get("variant");

    if (urlVariant && ["a", "b", "c"].indexOf(urlVariant) !== -1) {
        window.mixtapeState.experimentVariant = urlVariant;
        console.log("[Mixtape] Experiment variant forced via URL: " + urlVariant);
        return;
    }

    try {
        var variant = await mixpanel.flags.get_variant_value("paywall_social_proof_v1", "c");
        window.mixtapeState.experimentVariant = variant;
        console.log("[Mixtape] Experiment variant from Mixpanel: " + variant);
    } catch (e) {
        window.mixtapeState.experimentVariant = "c";
        console.log("[Mixtape] Experiment fallback to control");
    }
}

function setupResetFunction(mp) {
    window.RESET = function () {
        console.log("[Mixtape] Initiating reset...");
        var overlay = document.createElement("div");
        overlay.style.cssText = "position:fixed;inset:0;background:#000;opacity:0;z-index:9999;transition:opacity 0.5s ease;pointer-events:none;";
        document.body.appendChild(overlay);

        requestAnimationFrame(function () { overlay.style.opacity = "1"; });

        setTimeout(function () {
            mp.stop_session_recording();
            setTimeout(function () {
                mp.reset();
                window.location.assign(window.location.href.split("?")[0]);
            }, 300);
        }, 500);
    };

    window.sessionStartTime = Date.now();
}

mixpanel.init(MIXPANEL_TOKEN, {
    api_host: MIXPANEL_PROXY,
    debug: true,
    ignore_dnt: true,
    flags: true,
	track_pageview: false,
    autocapture: {
        pageview: false,
        click: false,
        dead_click: true,
        rage_click: true,
        input: false,
        scroll: false,
        submit: false,
        capture_text_content: false,
    },

    record_sessions_percent: 100,
    record_block_class: new RegExp('^$'),
    record_block_selector: '',
    record_idle_timeout_ms: 86400000,
    record_mask_all_text: false,
    record_mask_all_inputs: false,
    record_canvas: true,
    record_heatmap_data: true,
    record_collect_fonts: true,
    record_inline_images: true,
    record_console: true,
    record_network: true,
    record_network_options: {
        recordHeaders: { request: ['*'], response: ['*'] },
        recordBodyUrls: { request: ['.*'], response: ['.*'] },
        recordInitialRequests: true
    },

    batch_flush_interval_ms: 0,
    api_payload_format: "json",
    api_transport: "XHR",
    persistence: "localStorage",

    loaded: async function (mp) {
        mp.start_session_recording();
        mp.register({ platform: "web" });

        await loadExperiment();

        if (window.mixtapeState.bugMode) {
            mp.register({
                $browser: "Chrome",
                $browser_version: 124
            });
        }

        if (preIdentifyUser) {
            mp.identify(preIdentifyUser);
            mp.people.set({ $email: preIdentifyUser });
            window.mixtapeState.isAnonymous = false;
            window.mixtapeState.userEmail = preIdentifyUser;
            window.mixtapeState.trackLimit = 8;
            console.log("[Mixtape] Pre-identified user: " + preIdentifyUser);
        }

        console.log(
            "%c\n" +
            "=======================================================\n" +
            "   Mixtape - Music Streaming Demo\n" +
            "   Mixpanel Workshop\n" +
            "=======================================================",
            "color: #8B5CF6; font-weight: bold; font-size: 12px;"
        );
        console.log("%cMixpanel loaded - session recording active", "color: #22C55E; font-weight: bold;");
        console.log("%cTip: %cType %cRESET()%c in console to clear user data and start fresh",
            "color: #A855F7; font-weight: bold;", "color: #9CA3AF;", "color: #22C55E; font-weight: bold;", "color: #9CA3AF;");

        setupResetFunction(mp);

        if (typeof window.onMixpanelReady === "function") {
            window.onMixpanelReady();
        }
    },
});

// ── Event Helpers ──

function trackEvent(eventName, properties) {
    properties = properties || {};
    mixpanel.track(eventName, properties);
}

// Anonymous Phase
function trackPageViewed(pageName) {
    var p = new URLSearchParams(window.location.search);
    trackEvent("Page Viewed", {
        page_name: pageName,
        referrer_domain: document.referrer ? new URL(document.referrer).hostname : "direct",
        utm_source: p.get("utm_source") || null,
        utm_medium: p.get("utm_medium") || null,
        utm_campaign: p.get("utm_campaign") || null
    });
}

function trackTrackPlayed(track) {
    window.mixtapeState.sessionTrackCount++;
    trackEvent("Track Played", {
        content_genre: track.genre,
        is_anonymous: window.mixtapeState.isAnonymous,
        session_track_count: window.mixtapeState.sessionTrackCount
    });
}

function trackTrackCompleted(track, listenDepth) {
    trackEvent("Track Completed", {
        content_genre: track.genre,
        is_anonymous: window.mixtapeState.isAnonymous,
        listen_depth: listenDepth
    });
}

function trackListenLimitReached() {
    trackEvent("Listen Limit Reached", {
        is_anonymous: window.mixtapeState.isAnonymous,
        session_track_count: window.mixtapeState.sessionTrackCount
    });
}

function trackPaywallViewed(triggerReason) {
    trackEvent("Paywall Viewed", {
        is_anonymous: window.mixtapeState.isAnonymous,
        experiment_variant: window.mixtapeState.experimentVariant,
        trigger_reason: triggerReason
    });
}

function trackPaywallDismissed() {
    trackEvent("Paywall Dismissed", {
        experiment_variant: window.mixtapeState.experimentVariant
    });
}

// Registration
function trackSignUpStarted(trigger) {
    trackEvent("Sign Up Started", {
        trigger: trigger
    });
}

function trackAccountCreated(trigger) {
    trackEvent("Account Created", {
        trigger: trigger
    });
}

// Onboarding
function trackTasteProfileStarted() {
    trackEvent("Taste Profile Started");
}

function trackOnboardingStepCompleted(stepName, artistsAddedCount) {
    var props = { step_name: stepName };
    if (stepName === "artist_preferences") {
        props.artists_added_count = artistsAddedCount || 0;
    }
    trackEvent("Onboarding Step Completed", props);
}

function trackTasteProfileAbandoned(lastStepReached) {
    trackEvent("Taste Profile Abandoned", {
        last_step_reached: lastStepReached
    });
}

function trackTasteProfileCompleted() {
    trackEvent("Taste Profile Completed");
}

function trackFirstPersonalizedFeedLoaded() {
    trackEvent("First Personalized Feed Loaded");
}

// Core Engagement
function trackTrackSaved(track) {
    trackEvent("Track Saved", {
        content_genre: track.genre
    });
}

function trackPlaylistCreated() {
    trackEvent("Playlist Created");
}

// Playback
function trackPlaybackPaused(track) {
    trackEvent("Playback Paused", {
        content_genre: track.genre
    });
}

function trackPlaybackResumed(track) {
    trackEvent("Playback Resumed", {
        content_genre: track.genre
    });
}

// Subscription
function trackSubscriptionStarted(plan, trigger) {
    var price = plan === "annual" ? 79.99 : 9.99;
    trackEvent("Subscription Started", {
        subscription_plan: plan,
        plan_price_usd: price,
        trigger: trigger,
        experiment_variant: window.mixtapeState.experimentVariant
    });
    mixpanel.people.track_charge(price);
    mixpanel.people.set({
        subscription_plan: plan,
        subscription_price_usd: price
    });
}

function trackSubscriptionCancelled() {
    trackEvent("Subscription Cancelled");
}

// Hook 1 — Playback Error Events
function trackPlaybackError() {
    trackEvent("Playback Error", {
        playback_error_code: "DRM_INIT_FAILED"
    });
}

function trackRageClick() {
    trackEvent("Rage Click", {
        element: "play_button"
    });
}

function trackPlayerExited(timeOnPlayerSeconds) {
    trackEvent("Player Exited", {
        time_on_player_seconds: timeOnPlayerSeconds
    });
}
