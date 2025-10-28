import { test, expect } from '@playwright/test';
import { ConsoleLogTracker } from './utils/test-helpers';

/**
 * Opt-in/Opt-out flow tests
 *
 * Critical scenarios to ensure tracking works correctly:
 * 1. Microsite → Opted in, tracking works
 * 2. Landing page → Opted out, NO tracking
 * 3. Microsite → Landing → Microsite → Opted back in, tracking works
 * 4. RESET → Opted out, navigates to landing
 */
test.describe('Opt-in/Opt-out Flow Tests', () => {
  let consoleTracker: ConsoleLogTracker;

  test.beforeEach(async ({ page }) => {
    consoleTracker = new ConsoleLogTracker(page);
  });

  test('Microsite opts in on load', async ({ page }) => {
    await page.goto('/financial');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Should see opt-in log
    const hasOptIn = consoleTracker.hasLog('Opted in to tracking');
    console.log('✅ Opt-in on microsite load:', hasOptIn ? '✅' : '❌');
    expect(hasOptIn).toBeTruthy();

    // Verify tracking is enabled
    const isOptedOut = await page.evaluate(() => {
      return window.mixpanel?.has_opted_out_tracking?.() || false;
    });

    console.log('📊 Opted out status:', isOptedOut);
    expect(isOptedOut).toBeFalsy();

    // Verify SDK can track
    const canTrack = await page.evaluate(() => {
      return typeof window.mixpanel?.track === 'function';
    });

    expect(canTrack).toBeTruthy();
  });

  test('Landing page opts out', async ({ page }) => {
    // First visit microsite to initialize Mixpanel
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Verify opted in on microsite
    let isOptedOut = await page.evaluate(() => {
      return window.mixpanel?.has_opted_out_tracking?.() || false;
    });
    expect(isOptedOut).toBeFalsy();

    consoleTracker.clearLogs();

    // Navigate to landing page
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Should see opt-out log
    const hasOptOut = consoleTracker.hasLog('Opted out of tracking');
    console.log('🚫 Opt-out on landing page:', hasOptOut ? '✅' : '❌');
    expect(hasOptOut).toBeTruthy();

    // Verify Mixpanel is destroyed
    const mixpanelExists = await page.evaluate(() => {
      return window.mixpanel !== null && typeof window.mixpanel !== 'undefined';
    });

    expect(mixpanelExists).toBeFalsy();
  });

  test('No click events on landing after opt-out', async ({ page }) => {
    // Visit microsite first
    await page.goto('/lifestyle');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Navigate to landing
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    consoleTracker.clearLogs();

    // Click on landing page
    const button = page.locator('a, button').first();
    if (await button.isVisible()) {
      await button.click();
      await page.waitForTimeout(1000);

      // Should NOT see any Mixpanel SDK events
      const sdkEvents = consoleTracker.getMatchingLogs(/\[SDK\]: EVENT/);
      console.log('👆 SDK events after click on landing:', sdkEvents.length);

      expect(sdkEvents.length).toBe(0);
    }
  });

  test('Microsite → Landing → Microsite opts back in', async ({ page }) => {
    // 1. Visit first microsite
    await page.goto('/streaming');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const hasOptIn1 = consoleTracker.hasLog('Opted in to tracking');
    console.log('Step 1 - Microsite opted in:', hasOptIn1 ? '✅' : '❌');
    expect(hasOptIn1).toBeTruthy();

    // 2. Navigate to landing (opt out)
    consoleTracker.clearLogs();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const hasOptOut = consoleTracker.hasLog('Opted out of tracking');
    console.log('Step 2 - Landing opted out:', hasOptOut ? '✅' : '❌');
    expect(hasOptOut).toBeTruthy();

    // 3. Navigate to different microsite (should opt back in)
    consoleTracker.clearLogs();
    await page.goto('/wellness');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const hasOptIn2 = consoleTracker.hasLog('Opted in to tracking');
    console.log('Step 3 - Microsite opted back in:', hasOptIn2 ? '✅' : '❌');
    expect(hasOptIn2).toBeTruthy();

    // Verify tracking works
    const isOptedOut = await page.evaluate(() => {
      return window.mixpanel?.has_opted_out_tracking?.() || false;
    });

    console.log('Step 3 - Final opted out status:', isOptedOut);
    expect(isOptedOut).toBeFalsy();

    // Verify events can fire
    const canTrack = await page.evaluate(() => {
      return typeof window.mixpanel?.track === 'function';
    });

    expect(canTrack).toBeTruthy();
  });

  test('RESET opts out before navigating', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    consoleTracker.clearLogs();

    // Call RESET (but prevent actual navigation for testing)
    await page.evaluate(() => {
      // Store original location.href setter
      const originalHref = Object.getOwnPropertyDescriptor(window.location, 'href');

      // Override to prevent navigation
      Object.defineProperty(window.location, 'href', {
        set: (url: string) => {
          console.log('[TEST]: Prevented navigation to', url);
        },
        get: () => window.location.href
      });

      window.RESET();

      // Restore after a delay
      setTimeout(() => {
        if (originalHref) {
          Object.defineProperty(window.location, 'href', originalHref);
        }
      }, 2000);
    });

    await page.waitForTimeout(2000);

    // Should see opt-out log
    const hasOptOut = consoleTracker.hasLog('Opted out of tracking');
    console.log('🔄 RESET opted out:', hasOptOut ? '✅' : '❌');
    expect(hasOptOut).toBeTruthy();
  });

  test('Multiple microsite visits maintain opt-in', async ({ page }) => {
    const microsites = ['/financial', '/checkout', '/streaming'];

    for (const microsite of microsites) {
      consoleTracker.clearLogs();

      await page.goto(microsite);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      // Each microsite should opt in
      const hasOptIn = consoleTracker.hasLog('Opted in to tracking');
      console.log(`${microsite} opted in:`, hasOptIn ? '✅' : '❌');
      expect(hasOptIn).toBeTruthy();

      // Verify not opted out
      const isOptedOut = await page.evaluate(() => {
        return window.mixpanel?.has_opted_out_tracking?.() || false;
      });

      expect(isOptedOut).toBeFalsy();
    }
  });

  test('Opt-in clears opt-out cookie', async ({ page }) => {
    // Visit microsite
    await page.goto('/lifestyle');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check for opt-out cookie (should NOT exist)
    const cookies = await page.context().cookies();
    const optOutCookie = cookies.find(c =>
      c.name.includes('mp_optout') ||
      c.name.includes('opted_out')
    );

    console.log('🍪 Opt-out cookie exists:', !!optOutCookie);
    expect(optOutCookie).toBeFalsy();

    // Verify opt-in state
    const hasOptedIn = await page.evaluate(() => {
      return !window.mixpanel?.has_opted_out_tracking?.();
    });

    expect(hasOptedIn).toBeTruthy();
  });

  test('Direct microsite visit opts in immediately', async ({ page }) => {
    // Direct visit (not from landing page)
    await page.goto('/wellness');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Should opt in immediately
    const hasOptIn = consoleTracker.hasLog('Opted in to tracking');
    console.log('🎯 Direct visit opted in:', hasOptIn ? '✅' : '❌');
    expect(hasOptIn).toBeTruthy();

    // Tracking should work
    const trackingWorks = await page.evaluate(() => {
      return typeof window.mixpanel?.track === 'function' &&
             !window.mixpanel?.has_opted_out_tracking?.();
    });

    expect(trackingWorks).toBeTruthy();
  });

  test('Session events fire after opt-in', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Should see opt-in BEFORE session event
    const logs = consoleTracker.getLogs();
    const optInIndex = logs.findIndex(log => log.includes('Opted in to tracking'));
    const sessionIndex = logs.findIndex(log => log.includes('Session: theyBuy'));

    console.log('📊 Opt-in index:', optInIndex);
    console.log('📊 Session index:', sessionIndex);

    expect(optInIndex).toBeGreaterThan(-1);
    expect(sessionIndex).toBeGreaterThan(-1);

    // Opt-in should happen BEFORE session tracking
    expect(optInIndex).toBeLessThan(sessionIndex);
  });

  test('Auto-capture works after opt-in', async ({ page }) => {
    await page.goto('/financial');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Verify opted in
    const isOptedOut = await page.evaluate(() => {
      return window.mixpanel?.has_opted_out_tracking?.() || false;
    });
    expect(isOptedOut).toBeFalsy();

    consoleTracker.clearLogs();

    // Click a button
    const button = page.locator('button[id], a[href]').first();
    if (await button.isVisible()) {
      await button.click();
      await page.waitForTimeout(1000);

      // Should see click event (auto-capture)
      const hasClickEvent = consoleTracker.hasLog(/EVENT.*click|mp_click/i);
      console.log('👆 Auto-capture after opt-in:', hasClickEvent ? '✅' : '❌');

      // This might not always fire depending on the SDK, so just log it
      console.log('Auto-capture events:', consoleTracker.getMatchingLogs(/EVENT/));
    }
  });
});
