# MixStake — iGaming oneoff

Fake casino & sportsbook wired to Mixpanel. Pure HTML/JS, client-side only, no
dependencies or server. Demonstrates iGaming event tracking, UTM attribution,
session replay, and experiments / feature flags.

## Pages

- **`index.html`** — the customer-facing casino site. This is the demo page you
  show. Reads experiment variants from URL params (see below).
- **`admin.html`** — demo-prep control panel (open in a separate tab). Fires
  batches of realistic events straight from the browser SDK, has an auto
  scheduler, and builds variant / UTM demo URLs you can copy and open before a
  demo. No server — everything runs through the Mixpanel browser SDK.

## URL parameters (on `index.html`)

Override the experiment a visitor sees — handy for live demos:

```
index.html?hero=variant_b&bonus=variant_a&vip=variant_a
```

| Param   | Experiment        | Values                                |
| ------- | ----------------- | ------------------------------------- |
| `hero`  | `hero_banner_test`| `control`, `variant_a`, `variant_b`   |
| `bonus` | `bonus_offer_test`| `control`, `variant_a`                |
| `vip`   | `vip_lobby_test`  | `control`, `variant_a`                |

If no params are present the site resolves variants via
`mixpanel.flags.getVariantValue()` and falls back to `control`.

UTM params (`utm_source`, `utm_medium`, `utm_campaign`, …) are auto-captured by
the SDK and stored as `initial_utm_*` on the user profile. Use the admin panel's
"UTM Demo Links" to generate attributed sessions.

## Key events

`Session Started` · `Game Opened` · `Game Round Completed` · `Deposit Initiated`
/ `Completed` / `Failed` · `Bet Placed` · `Withdrawal Requested` / `Approved` ·
`Promo Viewed` / `Claimed` · `Registration Completed` · `Page Viewed` ·
`$experiment_started`.

## Mixpanel config

- Token: `5d00750a9ec9cec303dc27e371033fa8`
- Proxy: `https://express-proxy-lmozz6xkha-uc.a.run.app` (shared FixPanel proxy)
- Session replay at 100%, feature flags enabled.

## Run locally

```
npm run oneoffs        # serves ./oneoffs/, then open /mixstake/
```
