# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FixPanel is a modern React + Next.js + Tailwind multi-vertical demo platform that showcases Mixpanel's JavaScript SDK capabilities across different industries. The project demonstrates:

- **Auto-capture**: Automatic tracking of clicks, page views, and form interactions
- **Feature flagging**: Real-time content variants using Mixpanel experiments
- **Session replay**: User session recording and playback
- **Custom event tracking**: Manual events, profile updates, and A/B testing
- **Console debugging**: Browser console prompts to guide users through Mixpanel features

### Available Demo Verticals

The platform includes multiple industry-specific microsites:

#### Fully Implemented Verticals
- **Financial Services - iBank** (`/financial/*`) - Banking, investments, and personal finance demo with complete user flows
- **Healthcare & Wellness - ourHeart** (`/wellness/*`) - Medical consultation and symptom tracking demo with chat, voting, and case submission features

#### Scaffolded Verticals (Basic UI, minimal functionality)
- **Ecommerce - weBuy** (`/checkout/*`) - Product discovery, cart optimization, and checkout analytics
- **Media & Streaming - meTube** (`/streaming/*`) - Content engagement and subscription optimization
- **SaaS B2B - youAdmin** (`/admin/*`) - Feature adoption and user journey optimization
- **Subscription B2C - theyRead** (`/lifestyle/*`) - Consumer engagement and retention

## Development Commands

### Core Commands
- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build for production (includes copying oneoffs folder to output)
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

### Testing & Serving Commands
- `npm run sanity` - Serve development build locally from ./dev/
- `npm run sanity:prod` - Serve production build locally from ./out/
- `npm run oneoffs` - Serve oneoffs directory standalone
- `npm run prune` - Clean the output directory
- `npm run test` - Run all Playwright browser tests
- `npm run test:smoke` - Run smoke tests only
- `npm run test:ui` - Run tests in interactive UI mode

### Build Process
The build command (`npm run build`) uses Next.js static export and includes a post-build step (`postbuild` script) that automatically copies all oneoff microsites from `./oneoffs/` to `./out/` for deployment alongside the main app. The script excludes build artifacts like `node_modules/`, `package.json`, and `package-lock.json`. `copy-oneoffs.js` also copies `./deliverables/` (including subdirectories, e.g. `deliverables/gartner/` and its images) to `out/`. Pages serves the uploaded artifact directly (no Jekyll), so subfolders/images/fonts ship as-is.

## Deliverables (large self-contained HTML decks)

`./deliverables/*.html` are big, standalone client decks (often **300KB–500KB**) with brand fonts embedded as base64 `data:` URIs. Treat them carefully:

- **Don't read/echo the whole file** — the base64 blobs will blow up context. Inspect with targeted greps and truncate base64, e.g. `grep -oE "@font-face[^}]*\}" f.html | sed -E 's/(base64,)[A-Za-z0-9+/=]+/\1.../g'`, or just count (`grep -o "local(" f | wc -l`). Note `@font-face` may be multi-line (use `node`/`grep -z` if so).
- **Fonts must be embedded + fallback-safe.** Garnett and Apercu Mono Pro are **proprietary Mixpanel brand fonts — not on any public CDN**, so inline woff2 `data:` URIs are the delivery mechanism. Each `@font-face` should be `src: url('data:font/woff2;base64,…') format('woff2')` **only**.
  - **No `local()`** in `src`: a viewer's broken/mismatched locally-installed font silently overrides the embed and renders garbled glyphs — with **no console error** (this caused a real "broken fonts" report). `local()` also gives nothing here since the font is already inline.
  - **No external refs** like `url('./assets/fonts/…woff2')` — those files aren't in the repo and 404.
  - Keep generic fallbacks in the family stacks/vars: `'Garnett',…,Arial,sans-serif` and `'Apercu Mono Pro',…,monospace`.
- **Porting embedded fonts between decks:** the `data:` URI contains `;base64`, so a naive non-greedy regex stopping at the first `;` truncates it. Capture the full token (`url\('[^']*'\)\s*format\([^)]*\)`); the single-quoted data URI has no `'` inside, so `[^']*` is safe.
- **Verify rendering** before shipping: serve `./deliverables` and load in a browser (use a non-blocked port — Chromium rejects 5060/6000); check `document.fonts` shows each face `loaded` and a heading's computed `font-family` resolves to the brand font, not Times.

## Code Architecture

### Key Architecture Patterns

**Client-Side Only App**: This is a Next.js app configured for static export (`output: "export"`) with all components marked as `"use client"`. Server-side rendering is minimal - only the root layout runs on server. The app is configured for GitHub Pages deployment with appropriate basePath and assetPrefix settings.

**Mixpanel Integration**:
- Initialization happens in `app/ClientLayout.tsx` via `initMixpanel()` from `lib/analytics.ts`
- Mixpanel is configured with comprehensive auto-capture settings:
  - Page views, clicks, form inputs, scrolling, and form submissions
  - Session recording enabled at 100% capture rate
  - Feature flags and experiments support
- Console logging is patched to show Mixpanel events for demo purposes
- Global `window.mixpanel` and `window.RESET()` function exposed for debugging
- Dynamic user identification via URL parameters (`?user=`)

**Feature Flag Architecture**: The `components/Modal.tsx` demonstrates feature flagging:
- Fetches experiment variant via `mixpanel.flags.get_variant_value()`
- Displays different modal content based on flag value
- Supports 4 variants: "sarah story (A)", "marco portfolio (B)", "priya debt (C)", "no story (D)"

### Directory Structure
- `app/` - Next.js app router with microsite structure:
  - `page.tsx` - Main landing page with vertical selection
  - `financial/` - iBank financial services demo (fully implemented)
  - `wellness/` - ourHeart healthcare & wellness demo (fully implemented)
    - `chat/` - Medical consultation chat interface
    - `vote/` - Symptom voting feature
    - `submit/` - Case submission flow
    - `case/` - Case details view
    - `results/` - Test results display
  - `checkout/` - weBuy ecommerce demo
  - `streaming/` - meTube media & streaming demo
  - `admin/` - youAdmin SaaS B2B demo
  - `lifestyle/` - theyRead subscription B2C demo 
- `components/` - Reusable React components, including shadcn/ui components
- `lib/` - Utility functions, primarily Mixpanel setup and class merging utilities
- `public/` - Static assets
- `oneoffs/` - Standalone one-off demo microsites (copied to build output during postbuild):
  - `payments/` - PayFlow payment demo (vanilla HTML/CSS/JS)
  - `dev/` - Developer demo microsite
  - `hud/` - HUD demo microsite
  - `metube/` - MeTube YouTube-like demo (Note: separate from meTube lifestyle vertical)
  - `mixstake/` - iGaming casino & sportsbook demo (`index.html` = demo site, `admin.html` = browser-SDK event generator + demo-URL builder)
  - (and others: `allchat/`, `dunkin/`, `feature-flags-console/`, `mixtape/`) — the listing at `oneoffs/index.html` is auto-generated at build, so this list may lag
- `scripts/` - Build and automation scripts:
  - `copy-oneoffs.js` - Postbuild script that copies oneoffs to output
  - `generate-oneoffs-index.js` - Generates `oneoffs/index.html` by scanning subdirectories (run during postbuild)
- `out/` - Production build output directory (includes Next.js build + oneoffs)
- `dev/` - Development assets for local testing

### Component Patterns
- Uses shadcn/ui component library with Radix UI primitives
- Tailwind CSS for styling with custom color palette
- Framer Motion for animations (v11.3.30)
- Lucide React for icons
- Components follow the pattern of importing from `@/components/ui/`
- TypeScript with strict configuration and path aliasing

### Styling System
- Custom Tailwind configuration with brand colors:
  - Primary purple: `#7856FF`
  - Green: `#07B096` and `#1C782D`
  - Red: `#CC332B`
  - Orange: `#DA6B16`
- Uses CSS custom properties for theme system
- Tailwind CSS Animate for animation utilities
- Prettier configured with 120 character line width

### Environment Configuration
- Uses environment variable `REACT_APP_MIXPANEL_TOKEN` (defaults to demo project token)
- Mixpanel proxy configured: `https://express-proxy-lmozz6xkha-uc.a.run.app`
- URL parameters can include `?user=` for identification
- Production deployment configured for GitHub Pages with proper paths

## Demo-Specific Features

### Multiple Demo Modes

**Core FixPanel Microsites** (Next.js-based):
- **Main Landing Page** (`/`) - Industry vertical selection with animated cards
- **Financial Services - iBank** (`/financial/*`) - Complete banking and finance demo with multiple user journeys
- **Healthcare & Wellness - ourHeart** (`/wellness/*`) - Medical consultation platform with symptom wheel, chat, and case management
- **Ecommerce - weBuy** (`/checkout/*`) - Product discovery and checkout demo
- **Media & Streaming - meTube** (`/streaming/*`) - Content platform and reading demo
- **SaaS B2B - youAdmin** (`/admin/*`) - Business tools and admin platform demo
- **Subscription B2C - theyRead** (`/lifestyle/*`) - Consumer video subscription app demo

**Oneoff Microsites** (standalone HTML/CSS/JS demos in `./oneoffs/`):
- **PayFlow** (`/payments/`) - Payment flow with friction analysis demo
- **Dev Demo** (`/dev/`) - Developer-focused demo microsite
- **HUD Demo** (`/hud/`) - HUD interface demo
- **MeTube** (`/metube/`) - YouTube-like video platform demo (Note: separate from meTube lifestyle vertical)
- **MixStake** (`/mixstake/`) - iGaming casino & sportsbook demo (iGaming events, UTM attribution, experiments). `index.html` is the demo site; `admin.html` fires batches of events from the browser SDK and builds variant/UTM demo URLs.

These oneoff microsites are automatically copied to the build output during the postbuild step and deployed alongside the main app.

**Oneoff convention** (follow this when adding one):
- Self-contained, **client-side only** — vanilla HTML/CSS/JS, no build step, no server. Entry point is `index.html`; extra pages (e.g. `admin.html`) are allowed.
- Initialize Mixpanel with the oneoff's **own project token** and the shared proxy `api_host: 'https://express-proxy-lmozz6xkha-uc.a.run.app'` (matches all other oneoffs). Do **not** set `remote_settings_mode` — the proxy has no `/settings/` route and it will 404 in the console.
- No registration needed: `generate-oneoffs-index.js` auto-lists it and `copy-oneoffs.js` copies it to `out/` at build. Optionally add a link in `app/page.tsx` (the "Additional standalone demos" row).

### Shared Infrastructure
- **Header Component**: Context-aware navigation that adapts to each microsite
- **Reset Functionality**: Global user reset available on all pages via `window.RESET()`
- **Mixpanel Integration**: Consistent tracking across all verticals
- **Styling System**: Shared Tailwind theme with vertical-specific color palettes
- **Static Export**: Configured for GitHub Pages deployment with Next.js static export

### Mixpanel Demo Configuration

**Project Architecture**:
- All microsites send data to the same Mixpanel project (ID: `3276012`)
- Each vertical has its own dedicated data view for filtering and analysis
- Vertical-specific Mixpanel data views:
  - **weBuy** (Ecommerce): [View 4354009](https://mixpanel.com/report/3276012/view/4354009)
  - **iBank** (Financial): [View 4354010](https://mixpanel.com/report/3276012/view/4354010)
  - **meTube** (Media): [View 4354011](https://mixpanel.com/report/3276012/view/4354011)
  - **youAdmin** (SaaS): [View 4354012](https://mixpanel.com/report/3276012/view/4354012)
  - **ourHeart** (Healthcare): [View 4354013](https://mixpanel.com/report/3276012/view/4354013)
  - **theyRead** (Social): [View 4354015](https://mixpanel.com/report/3276012/view/4354015)

**Technical Configuration**:
- Pre-configured with demo project token: `7c02ad22ae575ab4e15cdd052cd730fb`
- Header and Footer Mixpanel links automatically route to the appropriate vertical-specific view
- Session recording enabled with 100% capture rate
- Comprehensive auto-capture configured:
  - Page views (with scroll tracking)
  - Click events on all elements
  - Form inputs and changes
  - Form submissions
  - Scroll depth tracking
- Debug mode with console logging for all Mixpanel calls
- Feature flag experiment `exp_customerStory` controls homepage modal
- Custom session management with reset functionality

### Live Demo URLs
- Production site: https://mixpanel.github.io/fixpanel/
- GitHub repository: https://github.com/mixpanel/fixpanel
- Mixpanel project: https://mixpanel.com/project/3276012/view/3782804/app/events
- Internal docs: https://www.notion.so/mxpnl/Fixpanel-1ece0ba9256280b9b10ad1ad09b80bca

**Vertical-Specific Mixpanel Views**:
- weBuy (Ecommerce): https://mixpanel.com/report/3276012/view/4354009
- iBank (Financial): https://mixpanel.com/report/3276012/view/4354010
- meTube (Media): https://mixpanel.com/report/3276012/view/4354011
- youAdmin (SaaS): https://mixpanel.com/report/3276012/view/4354012
- ourHeart (Healthcare): https://mixpanel.com/report/3276012/view/4354013
- theyRead (Social): https://mixpanel.com/report/3276012/view/4354015

## TypeScript Configuration
- Uses strict TypeScript configuration
- Path aliasing: `@/*` maps to project root
- Includes type definitions for Mixpanel browser SDK
- Some Mixpanel integrations use `@ts-ignore` due to type limitations

## Testing Infrastructure
- Playwright for browser testing. Two project tiers in `playwright.config.ts`:
  - **`chromium`** (core app) — runs against `npm run dev` on `:3000`. Strict tests in `tests/e2e/` (e.g. `smoke.spec.ts`) asserting Mixpanel tracking behavior.
  - **`oneoffs`** (advisory) — runs `tests/e2e/oneoffs.spec.ts` against a static server (`npx serve ./oneoffs -l 5050`). Permissive: auto-discovers every `oneoffs/*/**.html` and only asserts the page loads with no uncaught JS errors (analytics/network noise ignored). New oneoffs are covered automatically.
- Commands: `npm run test:app` (core, required gate) · `npm run test:oneoffs` (advisory) · `npm run test:smoke` · `npm run typecheck` · `npm run lint`.

## CI & Branch Protection
- CI: `.github/workflows/nextjs.yml` runs on every PR/push: jobs `verify` (lint), `build` (Next.js build + `typecheck` — typecheck runs here because it needs the build-generated `next-env.d.ts` for asset module types), `test-app` (`test:smoke`), and `test-oneoffs`. `deploy` runs only on push to `main`.
- `main` is protected (`enforce_admins: true` — **no one pushes directly, incl. admins**). All work lands via PR.
- Required status checks (block merge): **`verify`, `build`, `test-app`**. `test-oneoffs` is **advisory** (runs but does not block) — intentionally permissive so a contributor's own oneoff can't block their merge.
- 0 required approvals → contributors **squash-merge their own PRs**.
- When changing CI job names or adding required checks, keep the branch-protection `contexts` list in sync (set via `gh api repos/mixpanel/fixpanel/branches/main/protection`).

## Dependencies Overview
- **Core**: Next.js 14.2.7, React 18, TypeScript 5
- **UI**: Radix UI components, shadcn/ui, Tailwind CSS
- **Analytics**: Mixpanel Browser SDK 2.71.0
- **Animation**: Framer Motion 11.3.30
- **Icons**: Lucide React
- **Testing**: Playwright 1.40+
- **Utilities**: clsx, tailwind-merge, class-variance-authority