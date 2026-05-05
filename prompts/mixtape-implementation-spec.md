# Mixtape One-Off Implementation Spec

**Target directory:** `oneoffs/mixtape/`
**Deploy URL:** `https://mixpanel.github.io/fixpanel/mixtape/`

---

## 1. Project Overview

Build a vanilla HTML/CSS/JS one-off microsite simulating **Mixtape**, a web-based music streaming app. The site is a workshop demo for Mixpanel's AI agent capabilities. No real audio playback. No backend. No frameworks. Every user action fires a precision-tracked Mixpanel event. Session replay captures the full experience.

The site must look and feel like a finished streaming product — dark mode, polished UI, realistic content. Workshop attendees will use it to generate real Mixpanel data that an AI agent can then analyze.

---

## 2. File Structure

```
oneoffs/mixtape/
├── index.html      # HTML structure, inline Mixpanel stub loader
├── styles.css      # All styling
├── script.js       # App logic, UI interactions, screen navigation
└── mixpanel.js     # Mixpanel init, event tracking helpers, RESET function
```

### Load Order (bottom of `<body>` in index.html)

```html
<!-- Mixpanel Stub Loader -->
<script>
    // ... inline stub loader (VERBATIM from section 4A)
</script>
<script src="mixpanel.js"></script>
<script src="script.js"></script>
</body>
```

---

## 3. Mixpanel Configuration

| Setting | Value |
|---------|-------|
| **Token** | `c91e9cc4412731bcd3fe576bc2233272` |
| **Proxy** | `https://express-proxy-lmozz6xkha-uc.a.run.app` |
| **Custom lib URL** | `${PROXY}/lib.min.js` |
| **Autocapture** | `false` (all autocapture disabled) |
| **Session replay** | 100% capture, everything visible (no masking/blocking) |
| **Feature flags** | `flags: true` (for experiment) |
| **Debug** | `true` |
| **Persistence** | `localStorage` |
| **Batch flush** | `0` (immediate) |
| **API payload** | `json` |
| **API transport** | `XHR` |

### Session Replay Config (nothing masked)

```javascript
record_sessions_percent: 100,
record_heatmap_data: true,
record_inline_images: true,
record_collect_fonts: true,
record_mask_text_selector: "nope",
record_block_selector: "nope",
record_block_class: "nope",
```

### Super Properties (registered on init)

```javascript
mixpanel.register({ platform: "web" });
```

Browser and browser version: rely on Mixpanel SDK defaults (`$browser`, `$browser_version`). Do NOT register these manually except when `?bug=true` is active (see Hook 1).

---

## 4. Mandatory Boilerplate

### A. Trailing Slash Redirect (in `<head>`)

```html
<script>
    if (!window.location.pathname.endsWith('/') && !window.location.pathname.endsWith('.html')) {
        window.location.replace(window.location.pathname + '/' + window.location.search);
    }
</script>
```

### B. Inline Stub Loader (bottom of `<body>`)

```html
<script>
    const MIXPANEL_TOKEN = "c91e9cc4412731bcd3fe576bc2233272";
    const MIXPANEL_PROXY = "https://express-proxy-lmozz6xkha-uc.a.run.app";
    const MIXPANEL_CUSTOM_LIB_URL = `${MIXPANEL_PROXY}/lib.min.js`;

    (function (f, b) { if (!b.__SV) { var e, g, i, h; window.mixpanel = b; b._i = []; b.init = function (e, f, c) { function g(a, d) { var b = d.split("."); 2 == b.length && ((a = a[b[0]]), (d = b[1])); a[d] = function () { a.push([d].concat(Array.prototype.slice.call(arguments, 0))); }; } var a = b; "undefined" !== typeof c ? (a = b[c] = []) : (c = "mixpanel"); a.people = a.people || []; a.toString = function (a) { var d = "mixpanel"; "mixpanel" !== c && (d += "." + c); a || (d += " (stub)"); return d; }; a.people.toString = function () { return a.toString(1) + ".people (stub)"; }; i = "disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset init opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove start_session_recording stop_session_recording".split(" "); for (h = 0; h < i.length; h++) g(a, i[h]); var j = "set set_once union unset remove delete".split(" "); a.get_group = function () { function b(c) { d[c] = function () { call2_args = arguments; call2 = [c].concat(Array.prototype.slice.call(call2_args, 0)); a.push([e, call2]); }; } for (var d = {}, e = ["get_group"].concat(Array.prototype.slice.call(arguments, 0)), c = 0; c < j.length; c++) b(j[c]); return d; }; b._i.push([e, f, c]); }; b.__SV = 1.2; e = f.createElement("script"); e.type = "text/javascript"; e.async = !0; e.src = "undefined" !== typeof MIXPANEL_CUSTOM_LIB_URL ? MIXPANEL_CUSTOM_LIB_URL : "//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js"; g = f.getElementsByTagName("script")[0]; g.parentNode.insertBefore(e, g); } })(document, window.mixpanel || []);
</script>
```

**CRITICAL: Do NOT modify the stub loader function. Copy it exactly as shown.**

### C. mixpanel.js Init Template

```javascript
mixpanel.init(MIXPANEL_TOKEN, {
    api_host: MIXPANEL_PROXY,
    debug: true,
    ignore_dnt: true,
    flags: true,

    autocapture: false,

    record_sessions_percent: 100,
    record_heatmap_data: true,
    record_inline_images: true,
    record_collect_fonts: true,
    record_mask_text_selector: "nope",
    record_block_selector: "nope",
    record_block_class: "nope",

    batch_flush_interval_ms: 0,
    api_payload_format: "json",
    api_transport: "XHR",
    persistence: "localStorage",

    loaded: async function (mp) {
        mp.start_session_recording();
        mixpanel.register({ platform: "web" });

        // Load experiment variant
        await loadExperiment();

        // Handle ?bug=true mode
        if (window.mixtapeState.bugMode) {
            mixpanel.register({
                $browser: "Chrome",
                $browser_version: 124
            });
        }

        // Console branding
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
    },
});
```

### D. Utility Bar (bottom of index.html)

```html
<div class="utility-bar">
    <button class="util-btn util-reset" id="btnReset">Reset Demo</button>
    <a href="https://mixpanel.com/project/4021104/view/4517235/app/events" target="_blank" class="util-btn util-project">Open Mixpanel Project &rarr;</a>
</div>
```

Wire up in script.js:
```javascript
document.getElementById("btnReset").addEventListener("click", function () {
    if (typeof window.RESET === "function") window.RESET();
});
```

### E. Utility Bar CSS

```css
.utility-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    gap: 8px;
    padding: 8px 16px;
    background: #1a1a2e;
    border-top: 1px solid #333;
    z-index: 10000;
    justify-content: center;
}

.util-btn {
    padding: 6px 16px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    border: none;
    transition: opacity 0.2s;
}

.util-btn:hover { opacity: 0.85; }
.util-reset { background: #ef4444; color: white; }
.util-project { background: #7856FF; color: white; }
```

### F. RESET Function (in mixpanel.js)

```javascript
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
```

---

## 5. URL Parameters

| Param | Values | Effect |
|-------|--------|--------|
| `variant` | `a`, `b`, `c` | Force experiment variant. `a` = Treatment A, `b` = Treatment B, `c` = Control. Overrides Mixpanel flags API. |
| `bug` | `true` | Activate Chrome 124 playback regression simulation. Overrides `$browser` and `$browser_version`. |
| `user` | any email string | Pre-identify user on load (for returning user scenarios). Calls `mixpanel.identify(email)`. |

Parse in mixpanel.js before init, store in `window.mixtapeState`.

---

## 6. Application State

```javascript
window.mixtapeState = {
    // User state
    isAnonymous: true,
    isSubscriber: false,
    userEmail: null,
    subscriptionPlan: null,

    // Session state
    sessionTrackCount: 0,
    sessionNumber: 1,
    trackLimit: 5,          // 5 anonymous, 8 registered, Infinity subscribed

    // Experiment
    experimentVariant: "c", // c=control, a=treatment_a, b=treatment_b

    // Bug simulation
    bugMode: false,         // Set from ?bug=true

    // Navigation
    currentScreen: "browse",

    // Onboarding
    tasteProfileStep: null,
    selectedGenres: [],
    selectedArtists: [],

    // Playback
    currentTrack: null,
    isPlaying: false,
    playbackTimer: null,
};
```

---

## 7. Layout — Desktop Web App

### Visual Structure

```
+----------------------------------------------------------+
|  [♪ Mixtape]    Browse   Genres     [Log In]  [Sign Up]   |  ← Header (anonymous)
|  [♪ Mixtape]    Home     Library    [user@email.com ▼]    |  ← Header (authenticated)
+----------------------------------------------------------+
|                                                          |
|                   Main Content Area                      |
|              (screens swap via JS, not routes)           |
|                                                          |
+----------------------------------------------------------+
|   advancement bar:  ▶ Track Name - Artist    ━━━━━━━━━━━  |  ← Player Bar (when track loaded)
+----------------------------------------------------------+
|  [Reset Demo]              [Open Mixpanel Project →]     |  ← Utility Bar
+----------------------------------------------------------+
```

### CSS Foundation

```css
:root {
    --bg-primary: #0D1117;
    --bg-card: #161B22;
    --bg-elevated: #1C2128;
    --bg-hover: #21262D;
    --accent: #8B5CF6;
    --accent-hover: #7C3AED;
    --accent-glow: rgba(139, 92, 246, 0.15);
    --text-primary: #F0F6FC;
    --text-secondary: #8B949E;
    --text-muted: #484F58;
    --success: #22C55E;
    --warning: #F59E0B;
    --error: #EF4444;
    --border: #30363D;
    --player-height: 64px;
    --header-height: 56px;
    --utility-height: 42px;
}

body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: var(--bg-primary);
    color: var(--text-primary);
    padding-bottom: calc(var(--player-height) + var(--utility-height));
}
```

Use Google Fonts only if needed (prefer system fonts for fewer dependencies).

---

## 8. Screens

All screens exist as `<div class="screen" id="screen-{name}">` elements in index.html. Only one is visible at a time (`.screen.active { display: block }`). The player bar and utility bar are always visible.

### Screen Inventory

| Screen ID | Name | When Visible |
|-----------|------|--------------|
| `screen-browse` | Browse / Home | Default landing. Grid of tracks organized by genre. |
| `screen-genre` | Genre View | Filtered tracks for a specific genre. |
| `screen-login` | Login | Email-only login form. |
| `screen-signup` | Sign Up | Email + display name registration form. No password. |
| `screen-onboarding-1` | Genre Selection | Step 1 of taste profile. Grid of genre cards to select. |
| `screen-onboarding-2` | Artist Preferences | Step 2. Search field + filterable artist list. |
| `screen-onboarding-3` | Profile Complete | Step 3. Confirmation with summary of selections. |
| `screen-feed` | Personalized Feed | Post-onboarding home. Curated track suggestions based on taste profile. |

### Navigation Function

```javascript
var screenHistory = [];

function navigateTo(screenId) {
    var current = document.querySelector(".screen.active");
    if (current) {
        screenHistory.push(current.id);
        current.classList.remove("active");
    }
    document.getElementById(screenId).classList.add("active");
    window.mixtapeState.currentScreen = screenId.replace("screen-", "");

    // Fire Page Viewed
    trackPageViewed(screenId.replace("screen-", ""));
}

function navigateBack() {
    if (screenHistory.length === 0) return;
    var current = document.querySelector(".screen.active");
    if (current) current.classList.remove("active");
    var prevId = screenHistory.pop();
    document.getElementById(prevId).classList.add("active");
    window.mixtapeState.currentScreen = prevId.replace("screen-", "");
}
```

---

## 9. Screen Specifications

### 9A. Browse Screen (screen-browse)

The default landing page. Shows tracks organized by genre sections.

**Layout:**
- **Hero banner** at top: large gradient area featuring a lo-fi track (e.g., "Midnight Rain" by Cloudset). Shows track title, artist, genre tag, and a large "▶ Play Now" button. Click starts playback.
- **Genre filter pills** below hero: clickable pills for each genre. Click navigates to `screen-genre`.
- **Genre sections**: horizontal row of 4-5 track cards per genre
- Track card: gradient album art (using track's color1/color2), track title, artist name, duration, heart icon
- Click track → starts playback in player bar

**Content data:** Hardcoded array of ~30 tracks (see Section 12).

### 9B. Genre View (screen-genre)

Filtered view showing all tracks for a single genre.

**Layout:**
- Back button (← Browse)
- Genre title + track count
- Grid of track cards (larger than browse view)

### 9C. Login Screen (screen-login)

**Layout:**
- Centered card on dark background
- "Welcome back to Mixtape" heading
- Email input field (no password)
- "Log In" button
- "Don't have an account? Sign up" link → navigates to screen-signup

**On submit:**
1. Call `mixpanel.identify(email)`
2. Call `mixpanel.people.set({ $email: email })`
3. Update `window.mixtapeState`: `isAnonymous = false`, `userEmail = email`, `trackLimit = 8`
4. Navigate to `screen-feed`
5. Update header to authenticated state

### 9D. Sign Up Screen (screen-signup)

**Layout:**
- Centered card
- "Join Mixtape" heading
- Display name input
- Email input
- "Create Account" button
- "Already have an account? Log in" link

**On submit:**
1. Fire `trackSignUpStarted(trigger)` — trigger is "paywall_cta" if came from paywall, "organic" otherwise
2. Call `mixpanel.identify(email)`
3. Call `mixpanel.people.set({ $name: displayName, $email: email })`
4. Fire `trackAccountCreated(trigger)`
5. Update state: `isAnonymous = false`, `userEmail = email`, `trackLimit = 8`
6. Navigate to `screen-onboarding-1`
7. Update header to authenticated state

### 9E. Onboarding Step 1 — Genre Selection (screen-onboarding-1)

**Layout:**
- Progress bar: Step 1 of 3
- "What do you like to listen to?" heading
- Grid of genre cards (6 genres, styled as large selectable tiles with icons/emoji)
- Each card toggleable (selected state = purple border + checkmark)
- Must select at least 1 genre
- "Continue" button (disabled until selection made)
- "Skip" link (small, at bottom)

**Genres to display:** Lo-Fi & Ambient, Pop, Rock, Hip-Hop, Electronic, Jazz

**On load:**
- Fire `trackTasteProfileStarted()`

**On continue:**
- Store selected genres in `mixtapeState.selectedGenres`
- Fire `trackOnboardingStepCompleted("genre_selection")`
- Navigate to `screen-onboarding-2`

**On skip/exit (navigate away):**
- Fire `trackTasteProfileAbandoned("genre_selection")`

### 9F. Onboarding Step 2 — Artist Preferences (screen-onboarding-2)

This is the critical cliff from Hook 4. The UI must make the search interaction visible in session replay.

**Layout:**
- Progress bar: Step 2 of 3
- "Pick some artists you love" heading
- Search input field with placeholder "Search artists..."
- Below search: filterable list of artist results
- Selected artists shown as removable chips/tags above the search field
- "Continue" button (enabled regardless of selection count — users can proceed with 0 artists)
- "Skip" link
- "← Back" link

**Artist data:** Hardcoded array of ~50 artists across all genres (see Section 13). Filter client-side as user types.

**Behavior:**
- As user types, filter artist list in real-time
- Click artist → adds to selected chips, increments count
- Click "x" on chip → removes artist
- The search should optionally be seeded/filtered by genres selected in Step 1, but show all artists if search query is typed

**On continue:**
- Store selected artists in `mixtapeState.selectedArtists`
- Fire `trackOnboardingStepCompleted("artist_preferences", mixtapeState.selectedArtists.length)`
- Navigate to `screen-onboarding-3`

**On skip/exit:**
- Fire `trackTasteProfileAbandoned("artist_preferences")`

### 9G. Onboarding Step 3 — Profile Complete (screen-onboarding-3)

**Layout:**
- Progress bar: Step 3 of 3
- "You're all set!" heading
- Summary: "Selected genres: X, Y, Z" and "Favorite artists: A, B, C"
- "Start Listening" button (large, prominent)

**On load:**
- Fire `trackOnboardingStepCompleted("profile_complete")`
- Fire `trackTasteProfileCompleted()`

**On "Start Listening" click:**
- Fire `trackFirstPersonalizedFeedLoaded()`
- Navigate to `screen-feed`

### 9H. Personalized Feed (screen-feed)

Post-onboarding home screen. Shows curated content.

**Layout:**
- "Your Daily Mix" section — row of tracks matching selected genres
- "Recommended for You" section — another row
- "New Releases" section — mixed genres
- Same track card format as browse, but content filtered/sorted by taste profile preferences

**This screen is also the landing for Login users** (who skip onboarding).

---

## 10. Persistent Components

### 10A. Header

**Anonymous state:**
```
[♪ Mixtape]    Browse   Genres                [Log In]  [Sign Up]
```

**Authenticated state:**
```
[♪ Mixtape]    Home     Library               [user@email.com ▼]
```

**Dropdown menu (authenticated):**
- My Library
- Manage Subscription → shows current plan + "Cancel Subscription" button (if subscribed)
- Log Out → calls `window.RESET()`

### 10B. Player Bar

Fixed at bottom, above utility bar. Hidden until a track is clicked.

**Layout:**
```
▶/⏸  Track Title - Artist Name          ━━━━━━━━━━━━━━━━━━━━━  3:42
```

**Normal playback flow (no bug mode):**
1. User clicks a track card anywhere in the app
2. Player bar slides up/appears
3. Shows: play/pause button, track info, progress bar, duration
4. `Track Played` fires immediately
5. `session_track_count` increments
6. Progress bar animates over 8-10 seconds
7. At completion: `Track Completed` fires with random `listen_depth` between 75-100
8. Player shows next track suggestion or stops

**Bug mode (`?bug=true`) flow:**
1. User clicks a track card
2. Player bar shows track info + spinning loader instead of progress
3. After 3 seconds: `Playback Error` fires with `playback_error_code: "DRM_INIT_FAILED"`
4. Player shows error state: "Playback failed. Try again."
5. Each additional click on play: `Rage Click` fires with `element: "play_button"`
6. When user navigates away from player/clicks another screen: `Player Exited` fires with `time_on_player_seconds`
7. `Track Played` does NOT fire in bug mode
8. `session_track_count` still increments (the attempt counts)

**Track limit enforcement:**
- After each track play, check `session_track_count >= trackLimit`
- If limit reached: fire `trackListenLimitReached()`, then show paywall modal
- Paywall appears as overlay modal, not a screen navigation

### 10C. Paywall Modal

Overlay modal triggered by listen limit or feature gate. Three visual variants controlled by experiment.

**Common elements (all variants):**
- Modal backdrop (semi-transparent dark overlay)
- Close button (X) → fires `trackPaywallDismissed(variant)`
- "Subscribe Monthly - $9.99/mo" button
- "Subscribe Annual - $79.99/yr" button (with "SAVE 33%" badge)

**Variant C (Control):**
```
┌─────────────────────────────────────┐
│                               [X]  │
│   Go Premium                       │
│   Unlimited music. No ads.         │
│                                    │
│   [━━ Monthly $9.99/mo ━━]        │
│   [━━ Annual $79.99/yr SAVE! ━━]  │
│                                    │
└─────────────────────────────────────┘
```

**Variant A (Treatment A):**
Same as control, plus:
- Social proof line below heading: "Join 4 million listeners who went ad-free this year"

**Variant B (Treatment B):**
Same as Treatment A, plus:
- Personal testimonial: _"I switched to annual and haven't looked back. The offline mode alone is worth it."_ — Maya, listener since 2023
- Progress bar: "You're 1 track away from your limit" (with visual progress indicator)

**On Paywall Viewed:**
- Fire `trackPaywallViewed(variant, triggerReason)` — triggerReason is `"listen_limit"` or `"feature_gate"`

**On Subscribe click:**
1. Show brief "Processing..." state (1.5s)
2. Show "✓ Welcome to Premium!" confirmation
3. Fire `trackSubscriptionStarted(plan, price, trigger)`
4. Update state: `isSubscriber = true`, `trackLimit = Infinity`, `subscriptionPlan = plan`
5. Close modal after 1s

**On dismiss (X or backdrop click):**
- Fire `trackPaywallDismissed(variant)`

---

## 11. Event Taxonomy — Complete Tracking Specification

Every event is fired via a named helper function in mixpanel.js called from script.js.

### Generic Tracker

```javascript
function trackEvent(eventName, properties) {
    properties = properties || {};
    mixpanel.track(eventName, properties);
}
```

### Event Helpers

#### Anonymous Phase

```javascript
function trackPageViewed(pageName) {
    var params = new URLSearchParams(window.location.search);
    trackEvent("Page Viewed", {
        page_name: pageName,
        referrer_domain: document.referrer ? new URL(document.referrer).hostname : "direct",
        utm_source: params.get("utm_source") || null,
        utm_medium: params.get("utm_medium") || null,
        utm_campaign: params.get("utm_campaign") || null
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
```

#### Registration

```javascript
function trackSignUpStarted(trigger) {
    trackEvent("Sign Up Started", {
        trigger: trigger  // "paywall_cta" or "organic"
    });
}

function trackAccountCreated(trigger) {
    trackEvent("Account Created", {
        trigger: trigger
    });
}
```

#### Onboarding

```javascript
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
```

#### Core Engagement

```javascript
function trackTrackSaved(track) {
    trackEvent("Track Saved", {
        content_genre: track.genre
    });
}

function trackPlaylistCreated() {
    trackEvent("Playlist Created");
}

// NOTE: Session Started is NOT fired from the frontend.
// It exists only in backfill data. Do not implement.
```

#### Subscription

```javascript
function trackSubscriptionStarted(plan, trigger) {
    var price = plan === "annual" ? 79.99 : 9.99;
    trackEvent("Subscription Started", {
        subscription_plan: plan,
        plan_price_usd: price,
        trigger: trigger,  // "paywall_cta" or "organic"
        experiment_variant: window.mixtapeState.experimentVariant
    });
}

function trackSubscriptionCancelled() {
    trackEvent("Subscription Cancelled");
}
```

#### Hook 1 — Playback Error Events

```javascript
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
```

### Event Summary Table

| # | Event Name | Properties | Hook |
|---|-----------|------------|------|
| 1 | Page Viewed | page_name, referrer_domain, utm_source, utm_medium, utm_campaign | — |
| 2 | Track Played | content_genre, is_anonymous, session_track_count | 3 |
| 3 | Track Completed | content_genre, is_anonymous, listen_depth | 1, 3 |
| 4 | Listen Limit Reached | is_anonymous, session_track_count | — |
| 5 | Paywall Viewed | is_anonymous, experiment_variant, trigger_reason | 2 |
| 6 | Paywall Dismissed | experiment_variant | 2 |
| 7 | Sign Up Started | trigger | — |
| 8 | Account Created | trigger | 3 |
| 9 | Taste Profile Started | — | 4 |
| 10 | Onboarding Step Completed | step_name, artists_added_count (conditional) | 4 |
| 11 | Taste Profile Abandoned | last_step_reached | 4 |
| 12 | Taste Profile Completed | — | 4 |
| 13 | First Personalized Feed Loaded | — | 4 |
| 14 | Track Saved | content_genre | 3 |
| 15 | Playlist Created | — | 3 |
| 16 | ~~Session Started~~ | ~~session_number~~ | ~~3~~ (backfill only — do NOT implement in frontend) |
| 17 | Subscription Started | subscription_plan, plan_price_usd, trigger, experiment_variant | 2, 3 |
| 18 | Subscription Cancelled | — | — |
| 19 | Playback Error | playback_error_code | 1 |
| 20 | Rage Click | element | 1 |
| 21 | Player Exited | time_on_player_seconds | 1 |

**Total: 20 precision-tracked events from frontend** (Session Started is backfill only).

---

## 12. Track Data

Hardcoded in script.js. ~30 tracks across 6 genres. Weight toward `lo_fi_ambient` (8 tracks) for Hook 3.

```javascript
var TRACKS = [
    // Lo-Fi & Ambient (8 tracks — weighted for Hook 3)
    { id: 1,  title: "Midnight Rain",        artist: "Cloudset",        genre: "lo_fi_ambient",  duration: "3:42", color1: "#1a1a2e", color2: "#4a3f8a" },
    { id: 2,  title: "Sunday Morning Haze",  artist: "Sleepy Waves",    genre: "lo_fi_ambient",  duration: "4:15", color1: "#2d3436", color2: "#636e72" },
    { id: 3,  title: "Quiet Hours",          artist: "Driftwood",       genre: "lo_fi_ambient",  duration: "3:58", color1: "#0c1445", color2: "#3c5186" },
    { id: 4,  title: "Paper Lanterns",       artist: "Yume",            genre: "lo_fi_ambient",  duration: "4:32", color1: "#1b1b3a", color2: "#6b5b95" },
    { id: 5,  title: "Fog and Moss",         artist: "Terrain",         genre: "lo_fi_ambient",  duration: "5:01", color1: "#1a332e", color2: "#4a8a6e" },
    { id: 6,  title: "Two AM Coffee",        artist: "Rooftop Sessions", genre: "lo_fi_ambient", duration: "3:27", color1: "#2c1810", color2: "#6b4423" },
    { id: 7,  title: "Static Lullaby",       artist: "Cloudset",        genre: "lo_fi_ambient",  duration: "4:48", color1: "#1a1a2e", color2: "#5a4f9a" },
    { id: 8,  title: "Windowsill",           artist: "Sleepy Waves",    genre: "lo_fi_ambient",  duration: "3:33", color1: "#2a2a3e", color2: "#7a6faa" },

    // Pop (5 tracks)
    { id: 9,  title: "Neon Lights",          artist: "Aria Cole",       genre: "pop",            duration: "3:18", color1: "#ff006e", color2: "#ff7eb3" },
    { id: 10, title: "Summer Drive",         artist: "Luna Park",       genre: "pop",            duration: "3:45", color1: "#ff9a00", color2: "#ffcd38" },
    { id: 11, title: "Heartbeat City",       artist: "The Echoes",      genre: "pop",            duration: "3:22", color1: "#e63946", color2: "#f4a261" },
    { id: 12, title: "Golden Hour",          artist: "Aria Cole",       genre: "pop",            duration: "4:01", color1: "#ffd700", color2: "#ffb347" },
    { id: 13, title: "Satellite",            artist: "Prism",           genre: "pop",            duration: "3:55", color1: "#00b4d8", color2: "#90e0ef" },

    // Rock (4 tracks)
    { id: 14, title: "Thunderstruck Road",   artist: "Iron Coast",      genre: "rock",           duration: "4:33", color1: "#8b0000", color2: "#dc143c" },
    { id: 15, title: "Burning Bridges",      artist: "Voltage",         genre: "rock",           duration: "3:49", color1: "#1a1a1a", color2: "#555555" },
    { id: 16, title: "Midnight Engine",      artist: "The Wrecks",      genre: "rock",           duration: "5:12", color1: "#333333", color2: "#888888" },
    { id: 17, title: "Wildfire",             artist: "Iron Coast",      genre: "rock",           duration: "4:07", color1: "#8b2500", color2: "#cd5c5c" },

    // Hip-Hop (4 tracks)
    { id: 18, title: "Block Party",          artist: "K.Nova",          genre: "hip_hop",        duration: "3:28", color1: "#2d132c", color2: "#801336" },
    { id: 19, title: "Crown",               artist: "DOT.",            genre: "hip_hop",        duration: "3:55", color1: "#0d0d0d", color2: "#4a0e4e" },
    { id: 20, title: "Late Night Metro",     artist: "SoundWave",       genre: "hip_hop",        duration: "4:12", color1: "#1a0533", color2: "#5b2c8e" },
    { id: 21, title: "No Signal",            artist: "K.Nova",          genre: "hip_hop",        duration: "3:41", color1: "#2d1b4e", color2: "#7b5ea7" },

    // Electronic (5 tracks)
    { id: 22, title: "Pulse",               artist: "Synthwave Dreams", genre: "electronic",     duration: "5:30", color1: "#0f0c29", color2: "#302b63" },
    { id: 23, title: "Circuit",             artist: "Neon Grid",       genre: "electronic",     duration: "4:45", color1: "#000428", color2: "#004e92" },
    { id: 24, title: "Binary Sunset",       artist: "CTRL+Z",          genre: "electronic",     duration: "6:12", color1: "#0f2027", color2: "#2c5364" },
    { id: 25, title: "Datastream",          artist: "Synthwave Dreams", genre: "electronic",     duration: "4:58", color1: "#1a0533", color2: "#3a1c71" },
    { id: 26, title: "Afterglow",           artist: "Photon",          genre: "electronic",     duration: "5:15", color1: "#11001c", color2: "#3d0066" },

    // Jazz (4 tracks)
    { id: 27, title: "Blue Note Evening",    artist: "Miles Apart",     genre: "jazz",           duration: "6:45", color1: "#1b2838", color2: "#2c5f7c" },
    { id: 28, title: "Smokey Room",          artist: "The Quintet",     genre: "jazz",           duration: "5:33", color1: "#3e2723", color2: "#795548" },
    { id: 29, title: "Velvet Keys",          artist: "Ivory",           genre: "jazz",           duration: "4:28", color1: "#1a1a2e", color2: "#544179" },
    { id: 30, title: "Harlem Sunrise",       artist: "Miles Apart",     genre: "jazz",           duration: "5:55", color1: "#2c1810", color2: "#a0522d" },
];
```

Each track has `color1` and `color2` for generating CSS gradient album art (no external images).

### Genre Display Names

```javascript
var GENRE_DISPLAY = {
    lo_fi_ambient: "Lo-Fi & Ambient",
    pop: "Pop",
    rock: "Rock",
    hip_hop: "Hip-Hop",
    electronic: "Electronic",
    jazz: "Jazz"
};
```

---

## 13. Artist Data (for Onboarding Step 2)

~50 artists tagged by genre. Used for the search/filter UI.

```javascript
var ARTISTS = [
    // Lo-Fi & Ambient
    { name: "Cloudset", genre: "lo_fi_ambient" },
    { name: "Sleepy Waves", genre: "lo_fi_ambient" },
    { name: "Driftwood", genre: "lo_fi_ambient" },
    { name: "Yume", genre: "lo_fi_ambient" },
    { name: "Terrain", genre: "lo_fi_ambient" },
    { name: "Rooftop Sessions", genre: "lo_fi_ambient" },
    { name: "Nujabes", genre: "lo_fi_ambient" },
    { name: "Tycho", genre: "lo_fi_ambient" },

    // Pop
    { name: "Aria Cole", genre: "pop" },
    { name: "Luna Park", genre: "pop" },
    { name: "The Echoes", genre: "pop" },
    { name: "Prism", genre: "pop" },
    { name: "Dua Lipa", genre: "pop" },
    { name: "Billie Eilish", genre: "pop" },
    { name: "Harry Styles", genre: "pop" },
    { name: "Olivia Rodrigo", genre: "pop" },

    // Rock
    { name: "Iron Coast", genre: "rock" },
    { name: "Voltage", genre: "rock" },
    { name: "The Wrecks", genre: "rock" },
    { name: "Arctic Monkeys", genre: "rock" },
    { name: "Foo Fighters", genre: "rock" },
    { name: "The Strokes", genre: "rock" },
    { name: "Tame Impala", genre: "rock" },
    { name: "Radiohead", genre: "rock" },

    // Hip-Hop
    { name: "K.Nova", genre: "hip_hop" },
    { name: "DOT.", genre: "hip_hop" },
    { name: "SoundWave", genre: "hip_hop" },
    { name: "Kendrick Lamar", genre: "hip_hop" },
    { name: "Tyler, The Creator", genre: "hip_hop" },
    { name: "J. Cole", genre: "hip_hop" },
    { name: "Mac Miller", genre: "hip_hop" },
    { name: "Anderson .Paak", genre: "hip_hop" },

    // Electronic
    { name: "Synthwave Dreams", genre: "electronic" },
    { name: "Neon Grid", genre: "electronic" },
    { name: "CTRL+Z", genre: "electronic" },
    { name: "Photon", genre: "electronic" },
    { name: "Bonobo", genre: "electronic" },
    { name: "ODESZA", genre: "electronic" },
    { name: "Flume", genre: "electronic" },
    { name: "Rufus Du Sol", genre: "electronic" },

    // Jazz
    { name: "Miles Apart", genre: "jazz" },
    { name: "The Quintet", genre: "jazz" },
    { name: "Ivory", genre: "jazz" },
    { name: "Kamasi Washington", genre: "jazz" },
    { name: "Robert Glasper", genre: "jazz" },
    { name: "Snarky Puppy", genre: "jazz" },
    { name: "Norah Jones", genre: "jazz" },
    { name: "Chet Baker", genre: "jazz" },
];
```

---

## 14. Experiment Loading

In mixpanel.js:

```javascript
async function loadExperiment() {
    var params = new URLSearchParams(window.location.search);
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
```

**Experiment name for Mixpanel setup:** `paywall_social_proof_v1`
**Variant values:** `a`, `b`, `c`
**Default:** `c` (control)

---

## 15. Interactive Features Beyond Core Flow

### 15A. Track Save Button

Heart/save icon on every track card AND in the player bar. Click fires `trackTrackSaved(track)`. Toggles visual state (empty heart → filled heart). Available for both anonymous and authenticated users (is_anonymous is already on the event implicitly via the track object's genre).

### 15B. Create Playlist Button

"+ New Playlist" button in the feed screen. Click fires `trackPlaylistCreated()`. Shows a brief toast notification: "Playlist created!" Available only for authenticated users.

### 15C. Genre Filter on Browse

Genre pills at top of browse screen. Click navigates to `screen-genre` filtered to that genre.

### 15D. Hero Banner

Top of browse screen: large gradient banner featuring a lo-fi track with "Play Now" CTA. Click starts playback of that track. Adds visual polish — makes the app feel like a real streaming product.

---

## 16. User Journey Summary

### Journey A: Full Happy Path
Browse → Play tracks → Hit limit → Paywall (variant B) → Subscribe Annual → Close paywall → Continue listening (unlimited)

### Journey B: Registration Path
Browse → Play tracks → Hit limit → Paywall → Dismiss → Click "Sign Up" in header → Register → Onboarding (3 steps) → Personalized Feed → Continue listening (8 track limit) → Hit limit again → Paywall → Subscribe

### Journey C: Lo-Fi Anonymous (Hook 3)
Browse → Filter to Lo-Fi genre → Play lo-fi tracks → Complete near limit → Manually navigate away (close tab or RESET) — repeat across sessions to build the lo-fi cohort pattern

### Journey D: Bug Mode (Hook 1)
Visit with `?bug=true` → Browse → Click play → Spinner forever → Rage click play button → Navigate away → Playback Error + Rage Click + Player Exited events all captured

### Journey E: Onboarding Abandonment (Hook 4)
Sign Up → Genre Selection (complete) → Artist Preferences → Type in search → Find nothing → Leave → Taste Profile Abandoned fires

### Journey F: Login (Returning User)
Click "Log In" → Enter email → Session Started → Personalized Feed

---

## 17. Edge Case Behaviors

### 17A. Bug Mode + Track Limit

When `?bug=true` is active, `session_track_count` still increments on each play attempt (even though Track Played doesn't fire). The user can hit the track limit after 5 failed attempts and see the paywall. This is intentional — it creates a realistic frustration scenario where a bugged user also hits the paywall.

### 17B. Onboarding Abandonment Detection

Abandonment fires in two scenarios:

1. **Skip link**: Each onboarding step has a "Skip" link. Clicking it fires `Taste Profile Abandoned` with `last_step_reached` set to the last *completed* step (or `null` if skipping from Step 1 without completing any step). User exits onboarding entirely and navigates to the browse/feed screen.

2. **Header nav during onboarding**: If the user clicks any header nav link (Browse, Home, etc.) while on an onboarding screen, fire `Taste Profile Abandoned` before navigating. The `last_step_reached` value follows the same rule — last completed step.

| Exit from | last_step_reached value |
|-----------|------------------------|
| Step 1 (before completing) | `null` |
| Step 2 (Step 1 completed) | `"genre_selection"` |
| Step 2 skip or nav-away | `"genre_selection"` |

Step 3 auto-fires `Taste Profile Completed` on load, so abandonment is not possible from Step 3.

### 17C. Login Flow

Login screen has email-only input (no password). On submit:
1. `mixpanel.identify(email)` — uses email as distinct_id
2. `mixpanel.people.set({ $email: email })`
3. Update state: `isAnonymous = false`, `userEmail = email`, `trackLimit = 8`
4. Navigate directly to `screen-feed` (skip onboarding)
5. Update header to authenticated state

This enables the "second device" scenario: type the same email on two browsers and Mixpanel merges the profiles.

### 17D. Track Saved Availability

Heart/save icon appears on track cards for both anonymous and authenticated users. The `content_genre` property on Track Saved is sufficient — no `is_anonymous` property needed on this event per the spec.

## 18. Implementation Constraints (unchanged section)

- **No frameworks**: No React, Vue, jQuery, Bootstrap, Tailwind CDN
- **No build tools**: No webpack, vite, npm
- **No server**: No Node.js, no real API calls
- **No import/export**: No ES modules
- **No external images**: Use CSS gradients for album art, Unicode/emoji for icons
- **External resources**: Google Fonts CDN only (optional — system fonts preferred)
- **Single page**: All screens in one index.html, shown/hidden with JS
- **Static hosting**: Must work on GitHub Pages via the copy-oneoffs.js postbuild step

---

## 19. Quality Checklist

Before considering implementation complete:

**Files & Boilerplate:**
1. [ ] All 4 files present: index.html, styles.css, script.js, mixpanel.js
2. [ ] Trailing slash redirect in `<head>`
3. [ ] Stub loader is inline in index.html (VERBATIM, not modified)

**Mixpanel Config:**
4. [ ] `mixpanel.init()` has `autocapture: false` and all session replay config
5. [ ] `flags: true` in init config
6. [ ] `loaded` callback is `async`, starts session recording, loads experiment, prints console branding
7. [ ] RESET function: fade overlay → stop recording → mp.reset() → reload without query params
8. [ ] Utility bar with Reset button and Mixpanel project link (project 4021104, view 4517235)
9. [ ] Reset button wired to `window.RESET()`
10. [ ] `platform: "web"` registered as super property

**Event Tracking:**
11. [ ] All 20 frontend events tracked with correct properties via named helper functions
12. [ ] Session Started is NOT implemented (backfill only)
13. [ ] `experiment_variant` only on Paywall Viewed, Paywall Dismissed, and Subscription Started
14. [ ] `is_anonymous` set at event fire time from `window.mixtapeState.isAnonymous` (not profile)
15. [ ] `plan_price_usd` on Subscription Started (9.99 for monthly, 79.99 for annual)
16. [ ] `artists_added_count` only on Onboarding Step Completed when `step_name = "artist_preferences"`

**URL Parameters:**
17. [ ] `?variant=a|b|c` overrides experiment variant (a=Treatment A, b=Treatment B, c=Control)
18. [ ] `?bug=true` activates playback failure simulation with `$browser: "Chrome"`, `$browser_version: 124` override
19. [ ] `?user=email` pre-identifies user via `mixpanel.identify(email)`

**Identity:**
20. [ ] Login form calls `mixpanel.identify(email)` with typed email as distinct_id
21. [ ] Sign up form calls `mixpanel.identify(email)` with typed email as distinct_id
22. [ ] No password fields on either form

**User Flows:**
23. [ ] Paywall shows correct variant (c=plain CTA, a=+social proof, b=+social proof+testimonial+progress bar)
24. [ ] Paywall subscribe buttons: Monthly $9.99/mo and Annual $79.99/yr with brief processing animation
25. [ ] Track limit enforced: 5 anonymous, 8 registered, Infinity subscriber
26. [ ] Bug mode: session_track_count still increments on failed attempts, limit still enforced
27. [ ] Player bar with simulated playback (8-10s progress animation, auto-fires Track Completed)
28. [ ] Bug mode player: spinner → 3s → Playback Error → rage clicks tracked → Player Exited on nav-away
29. [ ] Artist search with client-side filtering (~50 artists) in onboarding step 2
30. [ ] Skip link on onboarding steps exits onboarding entirely, fires Taste Profile Abandoned
31. [ ] Header nav click during onboarding fires Taste Profile Abandoned before navigating
32. [ ] Heart icon on track cards fires Track Saved
33. [ ] "+ New Playlist" button in feed fires Playlist Created with toast notification
34. [ ] Subscription cancel in account dropdown menu fires Subscription Cancelled

**Design:**
35. [ ] All screens navigable and styled — dark mode (#0D1117), purple accent (#8B5CF6)
36. [ ] Browse screen has hero banner + genre filter pills + genre sections with track rows
37. [ ] All interactive elements have click handlers and visual feedback (hover, active, transitions)
38. [ ] No `<img>` tags with external URLs — use CSS gradients for album art
39. [ ] No external dependencies beyond optional Google Fonts
