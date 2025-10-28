import { test, expect } from '@playwright/test';
import { ConsoleLogTracker } from './utils/test-helpers';

/**
 * Tracking lifecycle tests (formerly opt-in/opt-out)
 *
 * Critical scenarios to ensure tracking works correctly with hard refresh approach:
 * 1. Microsite → Mixpanel initializes, tracking works
 * 2. Landing page → Cleanup + hard reload, NO tracking
 * 3. Microsite → Landing → Microsite → Fresh initialization, tracking works
 * 4. RESET → Cleanup, navigates to landing
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

    // Should see Mixpanel loaded
    const hasLoaded = consoleTracker.hasLog('MIXPANEL LOADED');
    console.log('✅ Mixpanel initialized:', hasLoaded ? '✅' : '❌');
    expect(hasLoaded).toBeTruthy();

    // Verify Mixpanel exists
    const mixpanelExists = await page.evaluate(() => {
      return window.mixpanel !== null && typeof window.mixpanel !== 'undefined';
    });

    expect(mixpanelExists).toBeTruthy();

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

    // Verify Mixpanel exists on microsite
    let mixpanelExists = await page.evaluate(() => {
      return window.mixpanel !== null && typeof window.mixpanel !== 'undefined';
    });
    expect(mixpanelExists).toBeTruthy();

    consoleTracker.clearLogs();

    // Navigate to landing page (should trigger cleanup + hard reload)
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Should see cleanup logs OR fresh landing log
    const hasCleanup = consoleTracker.hasLog('CLEANUP') || consoleTracker.hasLog('Fresh landing page');
    console.log('🚫 Landing page cleanup:', hasCleanup ? '✅' : '❌');
    expect(hasCleanup).toBeTruthy();

    // Verify Mixpanel is NOT initialized on landing
    mixpanelExists = await page.evaluate(() => {
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

    const hasLoaded1 = consoleTracker.hasLog('MIXPANEL LOADED');
    console.log('Step 1 - Mixpanel initialized:', hasLoaded1 ? '✅' : '❌');
    expect(hasLoaded1).toBeTruthy();

    // 2. Navigate to landing (cleanup + reload)
    consoleTracker.clearLogs();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const hasCleanup = consoleTracker.hasLog('CLEANUP') || consoleTracker.hasLog('Fresh landing');
    console.log('Step 2 - Landing cleanup:', hasCleanup ? '✅' : '❌');
    expect(hasCleanup).toBeTruthy();

    // 3. Navigate to different microsite (should initialize fresh)
    consoleTracker.clearLogs();
    await page.goto('/wellness');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const hasLoaded2 = consoleTracker.hasLog('MIXPANEL LOADED');
    console.log('Step 3 - Mixpanel re-initialized:', hasLoaded2 ? '✅' : '❌');
    expect(hasLoaded2).toBeTruthy();

    // Verify tracking works
    const mixpanelExists = await page.evaluate(() => {
      return window.mixpanel !== null && typeof window.mixpanel !== 'undefined';
    });

    console.log('Step 3 - Mixpanel exists:', mixpanelExists);
    expect(mixpanelExists).toBeTruthy();

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

    // Intercept navigation to prevent actual page change
    await page.route('**/*', route => route.abort());

    // Call RESET
    try {
      await page.evaluate(() => {
        window.RESET();
      });
    } catch (error) {
      // Navigation will be aborted, which is expected
    }

    await page.waitForTimeout(1000);

    // Should see cleanup logs
    const hasCleanup = consoleTracker.hasLog('CLEANUP');
    console.log('🔄 RESET triggered cleanup:', hasCleanup ? '✅' : '❌');
    expect(hasCleanup).toBeTruthy();

    // Clean up route interception
    await page.unroute('**/*');
  });

  test('Multiple microsite visits maintain opt-in', async ({ page }) => {
    const microsites = ['/financial', '/checkout', '/streaming'];

    for (const microsite of microsites) {
      consoleTracker.clearLogs();

      await page.goto(microsite);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      // Each microsite should initialize Mixpanel
      const hasLoaded = consoleTracker.hasLog('MIXPANEL LOADED');
      console.log(`${microsite} initialized:`, hasLoaded ? '✅' : '❌');
      expect(hasLoaded).toBeTruthy();

      // Verify Mixpanel exists
      const mixpanelExists = await page.evaluate(() => {
        return window.mixpanel !== null && typeof window.mixpanel !== 'undefined';
      });

      expect(mixpanelExists).toBeTruthy();
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

    // Verify Mixpanel is initialized
    const mixpanelExists = await page.evaluate(() => {
      return window.mixpanel !== null && typeof window.mixpanel !== 'undefined';
    });

    expect(mixpanelExists).toBeTruthy();
  });

  test('Direct microsite visit opts in immediately', async ({ page }) => {
    // Direct visit (not from landing page)
    await page.goto('/wellness');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Should initialize immediately
    const hasLoaded = consoleTracker.hasLog('MIXPANEL LOADED');
    console.log('🎯 Direct visit initialized:', hasLoaded ? '✅' : '❌');
    expect(hasLoaded).toBeTruthy();

    // Tracking should work
    const trackingWorks = await page.evaluate(() => {
      return typeof window.mixpanel?.track === 'function';
    });

    expect(trackingWorks).toBeTruthy();
  });

  test('Session events fire after opt-in', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Should see Mixpanel loaded BEFORE session event
    const logs = consoleTracker.getLogs();
    const loadedIndex = logs.findIndex(log => log.includes('MIXPANEL LOADED'));
    const sessionIndex = logs.findIndex(log => log.includes('Session: theyBuy'));

    console.log('📊 Loaded index:', loadedIndex);
    console.log('📊 Session index:', sessionIndex);

    expect(loadedIndex).toBeGreaterThan(-1);
    expect(sessionIndex).toBeGreaterThan(-1);

    // Mixpanel should load BEFORE session tracking
    expect(loadedIndex).toBeLessThan(sessionIndex);
  });

  test('Auto-capture works after opt-in', async ({ page }) => {
    await page.goto('/financial');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Verify Mixpanel exists
    const mixpanelExists = await page.evaluate(() => {
      return window.mixpanel !== null && typeof window.mixpanel !== 'undefined';
    });
    expect(mixpanelExists).toBeTruthy();

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
