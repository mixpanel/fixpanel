# FixPanel

Welcome to [FixPanel](https://mixpanel.github.io/fixpanel/), a modern, React + Next.js + Tailwind series of demo sites for [6 different industry use cases](https://mixpanel.github.io/fixpanel/). It showcases the power of [Mixpanel's SDKs](https://docs.mixpanel.com/docs/tracking-methods/sdks/javascript) and how its core capabilities might be implemented in a modern web app.

## Running Locally

### Prerequisites
- Node.js (v16 or later)
- npm

### Quick Start

```bash
git clone https://github.com/mixpanel/fixpanel.git
cd fixpanel
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the landing page.

### Available Commands

```bash
npm run dev              # Start development server
npm run build            # Build for production (includes copying oneoffs)
npm start                # Start production server
npm run lint             # Run ESLint

npm run hello-world      # Serve standalone hello-world demo
npm run sanity           # Serve dev build locally
npm run sanity:prod      # Serve production build locally
npm run oneoffs          # Serve oneoffs directory standalone
```

### Configuration

The app is pre-configured to send data to the [demo Mixpanel project](https://mixpanel.com/project/3276012/view/3782804/app/home).

**Data Architecture**: All microsites send data to the same Mixpanel project (ID: `3276012`), but each vertical has its own dedicated data view for filtering and analysis:

- **weBuy** (Ecommerce): [View 4354009](https://mixpanel.com/report/3276012/view/4354009)
- **iBank** (Financial): [View 4354010](https://mixpanel.com/report/3276012/view/4354010)
- **meTube** (Media): [View 4354011](https://mixpanel.com/report/3276012/view/4354011)
- **youAdmin** (SaaS): [View 4354012](https://mixpanel.com/report/3276012/view/4354012)
- **ourHeart** (Healthcare): [View 4354013](https://mixpanel.com/report/3276012/view/4354013)
- **theyRead** (Social): [View 4354015](https://mixpanel.com/report/3276012/view/4354015)

The Header and Footer Mixpanel links automatically route users to the appropriate vertical-specific view based on which microsite they're viewing.

To use your own Mixpanel project, create a `.env` file:

```bash
REACT_APP_MIXPANEL_TOKEN=your_token_here
```

## Codebase Layout

### Directory Structure

```
fixpanel/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Landing page (vertical selector)
│   ├── financial/         # Financial services demo (fully built)
│   ├── checkout/          # Ecommerce demo (scaffolded)
│   ├── streaming/         # Media & streaming demo (scaffolded)
│   ├── admin/             # SaaS B2B demo (scaffolded)
│   ├── lifestyle/         # Subscription B2C demo (scaffolded)
│   └── wellness/          # Healthcare demo (scaffolded)
│
├── components/            # React components
│   ├── ui/               # shadcn/ui components (Button, Card, etc.)
│   ├── Header.tsx        # Context-aware navigation header
│   ├── Modal.tsx         # Feature flag demo (exp_customerStory)
│   └── ...
│
├── lib/                   # Utilities
│   ├── analytics.ts      # Mixpanel initialization and config
│   └── utils.ts          # Tailwind class merging utilities
│
├── oneoffs/               # Standalone microsites (copied to build)
│   ├── payments/         # PayFlow payment demo (vanilla HTML/CSS/JS)
│   ├── dev/              # Developer demo microsite
│   ├── hud/              # HUD demo microsite
│   └── metube/           # YouTube-like demo
│
├── scripts/              # Build and automation
│   ├── copy-oneoffs.js   # Postbuild script (copies oneoffs to out/)
│   └── headless.js       # Headless automation script
│
├── public/               # Static assets
├── out/                  # Production build output (Next.js + oneoffs)
└── dev/                  # Development assets
```

### Key Files

- `app/ClientLayout.tsx` - Mixpanel initialization via `initMixpanel()`
- `lib/analytics.ts` - Mixpanel SDK setup (auto-capture, session replay, feature flags)
- `components/Modal.tsx` - Feature flagging example using `mixpanel.flags.get_variant_value()`
- `tailwind.config.js` - Custom color palette and theme configuration
- `scripts/copy-oneoffs.js` - Copies standalone demos from `./oneoffs/` to `./out/` during build

### Architecture Notes

- **Client-side only**: Next.js configured for static export (`output: "export"`), all components use `"use client"`
- **Mixpanel integration**: Initialized in `ClientLayout.tsx`, exposes `window.mixpanel` and `window.RESET()` globally
- **Feature flags**: Demo experiment `exp_customerStory` controls homepage modal variants
- **Styling**: Tailwind CSS with custom brand colors (primary purple: `#7856FF`)
- **Components**: shadcn/ui library with Radix UI primitives

## Demo Structure

### Main Microsites (Next.js)
- `/` - Landing page with industry vertical selection
- `/financial/*` - Complete FixPanel financial services demo
- `/checkout/*` - Ecommerce demo (scaffolded)
- `/streaming/*` - Media & streaming demo (scaffolded)
- `/admin/*` - SaaS B2B demo (scaffolded)
- `/lifestyle/*` - Subscription B2C demo (scaffolded)

### Oneoff Microsites (Standalone)
- `/payments/` - PayFlow payment demo
- `/dev/` - Developer demo
- `/hud/` - HUD interface demo
- `/metube/` - Video platform demo

Oneoffs are automatically copied to the build output during `npm run build` via the postbuild script.

## Contributing

### Adding a New Vertical

1. Create a new directory under `app/` (e.g., `app/travel/`)
2. Add a `page.tsx` with `"use client"` directive
3. Import and use Mixpanel tracking from `lib/analytics.ts`
4. Update the landing page (`app/page.tsx`) to include your new vertical

### Adding a New Oneoff Microsite

1. Create a new directory in `./oneoffs/` (e.g., `./oneoffs/mynewdemo/`)
2. Add an `index.html` file with your demo
3. Run `npm run build` - the postbuild script automatically copies it to `./out/mynewdemo/`
4. Access at `/mynewdemo/` in production

### Tracking Custom Events

```typescript
import mixpanel from 'mixpanel-browser';

// Track event
mixpanel.track('Button Clicked', { button_name: 'Submit' });

// Set user properties
mixpanel.people.set({ plan_type: 'Premium' });

// Identify user
mixpanel.identify('user_123');
```

### Using Feature Flags

```typescript
const variant = mixpanel.flags.get_variant_value('exp_flag_name');

if (variant === 'control') {
  // Show control experience
} else if (variant === 'test') {
  // Show test experience
}
```

### Style Guidelines

- Use Tailwind utility classes
- Follow existing component patterns from `components/ui/`
- Brand colors defined in `tailwind.config.js`
- Prettier configured for 120 character line width

## Resources

- [Live Site](https://mixpanel.github.io/fixpanel/)
- [Mixpanel Project](https://mixpanel.com/project/3276012/view/3782804/app/events)
- [Internal Docs](https://www.notion.so/mxpnl/Fixpanel-1ece0ba9256280b9b10ad1ad09b80bca)
- [Mixpanel JavaScript SDK Docs](https://docs.mixpanel.com/docs/tracking-methods/sdks/javascript)

### Vertical-Specific Mixpanel Data Views

Each microsite has its own data view for focused analysis:

- [weBuy (Ecommerce)](https://mixpanel.com/report/3276012/view/4354009)
- [iBank (Financial)](https://mixpanel.com/report/3276012/view/4354010)
- [meTube (Media)](https://mixpanel.com/report/3276012/view/4354011)
- [youAdmin (SaaS)](https://mixpanel.com/report/3276012/view/4354012)
- [ourHeart (Healthcare)](https://mixpanel.com/report/3276012/view/4354013)
- [theyRead (Social)](https://mixpanel.com/report/3276012/view/4354015)