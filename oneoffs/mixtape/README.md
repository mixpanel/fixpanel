# Mixtape — Music Streaming Demo

A vanilla HTML/CSS/JS microsite simulating a web-based music streaming app. Built as a workshop demo for Mixpanel's AI agent capabilities. No real audio playback, no backend, no frameworks — every user action fires a precision-tracked Mixpanel event while session replay captures the full experience.

**Live site:** https://mixpanel.github.io/fixpanel/mixtape/

## Mixpanel Links

- **Project:** https://mixpanel.com/project/4021104/view/4517235/app/events
- **Experiment (Paywall Social Proof):** https://mixpanel.com/project/4021104/view/4517235/app/experiments/2ea5e4ad-be34-47b4-b5ea-b81035f737e7

## Running Locally

```bash
cd oneoffs/mixtape
python3 -m http.server 8888
# Open http://localhost:8888/
```

## URL Parameters

| Parameter | Values | Effect |
|-----------|--------|--------|
| `variant` | `a`, `b`, `c` | Force paywall experiment variant. Overrides Mixpanel flags API. |
| `bug` | `true` | Simulate Chrome 124 playback regression — spinner, error state, rage clicks. |
| `user` | any email | Pre-identify a user on load. Skips anonymous state, goes straight to authenticated feed. |

### Examples

```
?variant=b                    → Paywall with social proof + testimonial + progress bar
?bug=true                     → Playback always fails after 3s spinner
?user=maya@example.com        → Load as returning user "maya@example.com"
?variant=a&bug=true           → Combine: forced variant A + bug mode
```

## Screens & Navigation

All screens live in a single `index.html` — shown/hidden via JS, not routes.

| Screen | Description |
|--------|-------------|
| **Browse** | Default landing. Hero banner, genre filter pills, track rows by genre. |
| **Genre View** | Filtered tracks for a single genre. Click any genre pill to get here. |
| **Login** | Email-only form. Submitting goes directly to Feed (skips onboarding). |
| **Sign Up** | Display name + email. Submitting starts 3-step onboarding. |
| **Onboarding 1** | Genre selection grid (select 1+, then Continue). |
| **Onboarding 2** | Artist search/filter. Type to filter ~50 artists. Select as chips. |
| **Onboarding 3** | Summary of selections. "Start Listening" goes to Feed. |
| **Feed** | Personalized home — Daily Mix, Recommended, New Releases, + New Playlist button. |

## Controls

### Header
- **Anonymous:** Browse, Genres, Log In, Sign Up
- **Authenticated:** Home, Browse, user dropdown (My Library, Manage Subscription, Cancel Subscription, Log Out)

### Player Bar
- Appears at bottom when any track is clicked
- Play/pause button, track info, animated progress bar (8–10s per track)
- Heart icon to save track
- In bug mode: shows spinner → error state → rage click tracking on repeated play attempts

### Paywall Modal
Triggers after hitting the track limit. Three variants controlled by the `paywall_social_proof_v1` experiment:

| Variant | Content |
|---------|---------|
| **C (Control)** | "Go Premium" — monthly/annual buttons only |
| **A (Treatment A)** | Control + social proof: "Join 4 million listeners..." |
| **B (Treatment B)** | Treatment A + testimonial quote + progress bar showing proximity to limit |

Subscribe buttons show a brief "Processing..." animation then "Welcome to Premium!" confirmation.

### Track Limits
| User State | Limit |
|------------|-------|
| Anonymous | 5 tracks |
| Registered (free) | 8 tracks |
| Subscriber | Unlimited |

### Utility Bar
Fixed at the very bottom:
- **Reset Demo** — Clears Mixpanel user data, stops session recording, reloads clean
- **Open Mixpanel Project →** — Direct link to the events view

You can also type `RESET()` in the browser console.

## Bug Mode (`?bug=true`)

Simulates a playback regression on Chrome 124:

1. Click any track → player shows spinner (loading state)
2. After 3 seconds → switches to error state: "Playback failed. Try again."
3. `Playback Error` event fires with `playback_error_code: "DRM_INIT_FAILED"`
4. Each additional click on the play button fires a `Rage Click` event
5. Navigating away fires `Player Exited` with `time_on_player_seconds`
6. `Track Played` does NOT fire — but `session_track_count` still increments (the attempt counts toward the limit)

Overrides `$browser` to "Chrome" and `$browser_version` to 124 as super properties.

## Event Taxonomy (20 events)

| Event | Key Properties |
|-------|---------------|
| Page Viewed | page_name, referrer_domain, utm_source/medium/campaign |
| Track Played | content_genre, is_anonymous, session_track_count |
| Track Completed | content_genre, is_anonymous, listen_depth |
| Listen Limit Reached | is_anonymous, session_track_count |
| Paywall Viewed | is_anonymous, experiment_variant, trigger_reason |
| Paywall Dismissed | experiment_variant |
| Sign Up Started | trigger (paywall_cta / organic) |
| Account Created | trigger |
| Taste Profile Started | — |
| Onboarding Step Completed | step_name, artists_added_count (conditional) |
| Taste Profile Abandoned | last_step_reached |
| Taste Profile Completed | — |
| First Personalized Feed Loaded | — |
| Track Saved | content_genre |
| Playlist Created | — |
| Subscription Started | subscription_plan, plan_price_usd, trigger, experiment_variant |
| Subscription Cancelled | — |
| Playback Error | playback_error_code |
| Rage Click | element |
| Player Exited | time_on_player_seconds |

## File Structure

```
oneoffs/mixtape/
├── index.html      # All screens, Mixpanel stub loader, utility bar
├── styles.css      # Dark theme, all component styles
├── script.js       # App logic, navigation, playback, data
├── mixpanel.js     # Mixpanel init, event tracking helpers, RESET
└── README.md       # This file
```

## Workshop User Journeys

**A — Full Happy Path:** Browse → Play 5 tracks → Paywall → Subscribe Annual → Unlimited listening

**B — Registration Path:** Browse → Hit limit → Dismiss paywall → Sign Up → Onboarding → Feed → Hit limit again → Subscribe

**C — Lo-Fi Anonymous:** Browse → Filter to Lo-Fi → Play lo-fi tracks → Repeat across sessions

**D — Bug Mode:** Visit `?bug=true` → Click play → Spinner → Rage click → Navigate away

**E — Onboarding Abandonment:** Sign Up → Genre Selection → Artist Search → Leave → Taste Profile Abandoned fires

**F — Returning User:** Log In with email → Feed (skips onboarding)
