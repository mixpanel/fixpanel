import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/**
 * Permissive smoke test for every oneoff microsite.
 *
 * Auto-discovers every HTML page under oneoffs/<dir>/ (mirroring
 * scripts/generate-oneoffs-index.js) so a new oneoff is covered automatically.
 *
 * This is intentionally lenient — it only asserts the page loads and has no
 * UNCAUGHT JavaScript errors. It does NOT assert Mixpanel event payloads, so a
 * contributor's own oneoff won't be blocked by analytics/network noise. The
 * strict core-app assertions live in smoke.spec.ts.
 *
 * Served by the `oneoffs` Playwright project (see playwright.config.ts), which
 * points baseURL at a static server for ./oneoffs.
 */

const ONEOFFS_DIR = path.join(__dirname, '../../oneoffs');

// Errors we deliberately ignore — analytics, fonts, favicons and any network
// failure (oneoffs talk to Mixpanel / CDNs that may be blocked in CI).
const IGNORED_ERROR = /favicon|mixpanel|mxpnl|google|gstatic|fonts|Failed to fetch|NetworkError|net::ERR|404|Load failed/i;

function discoverPages(): string[] {
  if (!fs.existsSync(ONEOFFS_DIR)) return [];
  const pages: string[] = [];
  for (const entry of fs.readdirSync(ONEOFFS_DIR)) {
    const dir = path.join(ONEOFFS_DIR, entry);
    if (!fs.statSync(dir).isDirectory()) continue; // skip the generated root index.html
    if (entry === 'node_modules' || entry.startsWith('.')) continue;
    for (const file of fs.readdirSync(dir)) {
      if (file.endsWith('.html')) pages.push(`${entry}/${file}`);
    }
  }
  return pages.sort();
}

const pages = discoverPages();

test.describe('Oneoff microsites load (advisory)', () => {
  test('at least one oneoff is present', () => {
    expect(pages.length).toBeGreaterThan(0);
  });

  for (const rel of pages) {
    test(`loads: ${rel}`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));

      const resp = await page.goto(`/${rel}`, { waitUntil: 'domcontentloaded' });
      expect(resp, `no response for /${rel}`).not.toBeNull();
      expect(resp!.status(), `bad status for /${rel}`).toBeLessThan(400);

      // Something actually rendered.
      expect(await page.locator('body').count()).toBe(1);

      // No uncaught JS errors (ignoring analytics/network noise).
      const fatal = errors.filter((e) => !IGNORED_ERROR.test(e));
      expect(fatal, `uncaught errors on /${rel}:\n${fatal.join('\n')}`).toHaveLength(0);
    });
  }
});
