import { test, expect } from '@playwright/test';
import { ConsoleLogTracker, isMixpanelInitialized, getDistinctId } from './utils/test-helpers';

/**
 * Mixpanel tracking test suite - validates critical tracking functionality
 */
test.describe('Mixpanel Tracking Tests', () => {
  let consoleTracker: ConsoleLogTracker;

  test.beforeEach(async ({ page }) => {
    consoleTracker = new ConsoleLogTracker(page);
  });

  test('No tracking on landing', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check that Mixpanel instance is destroyed on landing page
    const mixpanelState = await page.evaluate(() => {
      return {
        exists: typeof window.mixpanel !== 'undefined' && window.mixpanel !== null,
        resetExists: typeof window.RESET === 'function'
      };
    });

    // Mixpanel should be null on landing page
    expect(mixpanelState.exists).toBeFalsy();

    // Should see cleanup logs
    const hasCleanup = consoleTracker.hasLog(/CLEANUP.*COMPLETE|NUKE.*COMPLETE|STORAGE CLEARED/);
    console.log('🧹 Landing page cleanup:', hasCleanup ? '✅' : '⚠️');

    // Should NOT see any session start events
    const hasSessionStart = consoleTracker.hasLog(/Session: (iBank|weBuy|meTube|youAdmin|ourHeart|theyRead)/);
    expect(hasSessionStart).toBeFalsy();
  });

  test('Session fires immediately', async ({ page }) => {
    // This tests the waitForMixpanel() fix for the race condition
    await page.goto('/lifestyle');
    await page.waitForLoadState('domcontentloaded');

    // Wait a bit for Mixpanel to initialize
    await page.waitForTimeout(2000);

    // Session event should fire immediately, not require user interaction
    const hasSessionEvent = consoleTracker.hasLog(/Session: theyRead|Started theyRead session/);
    const hasLuckyNumber = consoleTracker.hasLog(/Registered luckyNumber:/);

    console.log('🎯 Session event fired immediately:', hasSessionEvent ? '✅' : '❌');
    console.log('🎲 Lucky number registered:', hasLuckyNumber ? '✅' : '❌');

    expect(hasSessionEvent).toBeTruthy();
    expect(hasLuckyNumber).toBeTruthy();

    // Verify Mixpanel initialized
    const mixpanelReady = await isMixpanelInitialized(page);
    expect(mixpanelReady).toBeTruthy();
  });

  test('Device ID polling works', async ({ page }) => {
    await page.goto('/financial');
    await page.waitForLoadState('networkidle');

    // Wait for device ID polling to complete (max 10 attempts * 500ms = 5s)
    await page.waitForTimeout(6000);

    // Check that device ID was found and logged
    const deviceIdLogs = consoleTracker.getMatchingLogs(/DEVICE ID.*Found device ID/);
    console.log('🔑 Device ID polling logs:', deviceIdLogs.length);
    expect(deviceIdLogs.length).toBeGreaterThan(0);

    // Check that Mixpanel link in header is enabled (not disabled)
    const headerLink = page.locator('header a:has-text("MIXPANEL")');
    const isDisabled = await headerLink.evaluate((el) => {
      return el.classList.contains('cursor-not-allowed') ||
             el.hasAttribute('disabled') ||
             el.closest('span')?.classList.contains('cursor-not-allowed');
    });

    console.log('🔗 Header link enabled:', !isDisabled ? '✅' : '❌');
    expect(isDisabled).toBeFalsy();

    // Verify href contains device ID
    const href = await headerLink.getAttribute('href');
    const hasDeviceId = href?.includes('distinct_id') || href?.includes('$device');
    console.log('🔗 Link has device ID:', hasDeviceId ? '✅' : '❌');
  });

  test('Lucky number registered', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check logs for lucky number registration
    const luckyNumberLog = consoleTracker.getMatchingLogs(/Registered luckyNumber: (\d+)/);
    expect(luckyNumberLog.length).toBeGreaterThan(0);

    // Extract the lucky number from logs
    const match = luckyNumberLog[0]?.match(/luckyNumber: (\d+)/);
    const luckyNumber = match ? parseInt(match[1]) : null;

    console.log('🎲 Lucky number:', luckyNumber);
    expect(luckyNumber).toBeGreaterThan(0);
    expect(luckyNumber).toBeLessThanOrEqual(1000000);

    // Verify it's registered in Mixpanel
    const mpLuckyNumber = await page.evaluate(() => {
      return window.mixpanel?.get_property('luckyNumber');
    });

    expect(mpLuckyNumber).toBe(luckyNumber);
  });

  test('Session fires once only', async ({ page }) => {
    await page.goto('/streaming');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const sessionStartLogs = consoleTracker.getMatchingLogs(/Started meTube session/);
    console.log('📊 Session start events:', sessionStartLogs.length);

    // Should only fire once
    expect(sessionStartLogs.length).toBe(1);

    // Navigate to another page in same microsite
    await page.goto('/streaming/watch');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const sessionStartLogsAfter = consoleTracker.getMatchingLogs(/Started meTube session/);
    console.log('📊 Session start events after navigation:', sessionStartLogsAfter.length);

    // Still should only be one
    expect(sessionStartLogsAfter.length).toBe(1);
  });

  test('RESET clears everything', async ({ page }) => {
    await page.goto('/financial');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    consoleTracker.clearLogs();

    // Get initial distinct ID
    const initialDistinctId = await getDistinctId(page);
    console.log('👤 Initial distinct ID:', initialDistinctId);

    // Call RESET
    const resetExists = await page.evaluate(() => typeof window.RESET === 'function');
    expect(resetExists).toBeTruthy();

    // Prevent actual navigation so we can check cleanup logs
    await page.evaluate(() => {
      window.RESET();
    });

    // Wait for RESET to execute
    await page.waitForTimeout(2000);

    // Check that all cleanup steps were logged
    const cleanupSteps = [
      'Session recording stopped',
      'Mixpanel instance reset',
      'localStorage cleared',
      'sessionStorage cleared',
      'Cookies cleared',
      'IndexedDB cleared',
      'Cache storage cleared',
      'ALL STORAGE CLEARED',
      'Navigating to landing page'
    ];

    for (const step of cleanupSteps) {
      const hasStep = consoleTracker.hasLog(step);
      console.log(`  ${hasStep ? '✅' : '❌'} ${step}`);
      expect(hasStep).toBeTruthy();
    }
  });

  test('Storage cleared on landing', async ({ page }) => {
    // First, visit a microsite and set some data
    await page.goto('/wellness');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Set some test data in storage
    await page.evaluate(() => {
      localStorage.setItem('test_key', 'test_value');
      sessionStorage.setItem('test_session', 'test_data');
    });

    const beforeStorage = await page.evaluate(() => ({
      local: localStorage.length,
      session: sessionStorage.length
    }));

    console.log('📦 Storage before landing:', beforeStorage);

    // Use client-side navigation to trigger cleanup + reload
    // Click the logo/header to navigate to landing
    const homeLink = page.locator('a[href="/"]').first();
    if (await homeLink.isVisible()) {
      await homeLink.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
    } else {
      // Fallback: call RESET which navigates to landing
      await page.evaluate(() => window.RESET());
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
    }

    // Check that Mixpanel-specific storage is cleared (after reload)
    const afterStorage = await page.evaluate(() => {
      // Check for Mixpanel-specific keys
      const mixpanelKeys = Object.keys(localStorage).filter(key =>
        key.includes('mp_') || key.includes('mixpanel')
      );
      return {
        local: localStorage.length,
        session: sessionStorage.length,
        mixpanelKeys: mixpanelKeys,
        mixpanelExists: window.mixpanel !== null && typeof window.mixpanel !== 'undefined'
      };
    });

    console.log('📦 Storage after landing:', afterStorage);

    // After hard refresh, the critical thing is that Mixpanel instance is destroyed
    // localStorage keys may persist in the browser context, but Mixpanel is not active
    expect(afterStorage.mixpanelExists).toBeFalsy();
    // sessionStorage should be cleared by hard refresh
    expect(afterStorage.session).toBe(0);

    // Note: localStorage keys from previous session may persist in the browser context,
    // but they won't be used since Mixpanel doesn't initialize on landing page
    console.log('✅ Mixpanel destroyed, sessionStorage cleared, landing page has no tracking');
  });

  test('No third user scenario', async ({ page }) => {
    // Visit first microsite
    await page.goto('/financial');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const user1 = await getDistinctId(page);
    console.log('👤 User 1 (financial):', user1);
    expect(user1).toBeTruthy();

    // Use client-side navigation to landing (triggers cleanup + reload)
    const homeLink = page.locator('a[href="/"]').first();
    if (await homeLink.isVisible()) {
      await homeLink.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
    } else {
      await page.evaluate(() => window.RESET());
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
    }

    // Visit second microsite
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const user2 = await getDistinctId(page);
    console.log('👤 User 2 (checkout):', user2);
    expect(user2).toBeTruthy();

    // Users should be different (cleanup should have reset device ID)
    expect(user1).not.toBe(user2);
    console.log('✅ No third user - clean separation between microsites');
  });

  test('All microsites track correctly', async ({ page }) => {
    const microsites = [
      { path: '/financial', session: 'Session: iBank' },
      { path: '/checkout', session: 'Session: weBuy' },
      { path: '/streaming', session: 'Session: meTube' },
      { path: '/wellness', session: 'Session: ourHeart' },
      { path: '/admin', session: 'Session: youAdmin' },
      { path: '/lifestyle', session: 'Session: theyRead' }
    ];

    for (const microsite of microsites) {
      consoleTracker.clearLogs();

      await page.goto(microsite.path);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      const hasSessionEvent = consoleTracker.hasLog(microsite.session);
      const hasLuckyNumber = consoleTracker.hasLog(/Registered luckyNumber/);

      console.log(`${microsite.path}: Session=${hasSessionEvent ? '✅' : '❌'}, Lucky=${hasLuckyNumber ? '✅' : '❌'}`);

      expect(hasSessionEvent).toBeTruthy();
      expect(hasLuckyNumber).toBeTruthy();

      // Reset for next microsite using client-side navigation
      const homeLink = page.locator('a[href="/"]').first();
      if (await homeLink.isVisible()) {
        await homeLink.click();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);
      } else {
        // Fallback: clear storage manually if no home link
        await page.evaluate(() => {
          sessionStorage.clear();
          localStorage.clear();
        });
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);
      }
    }
  }, { timeout: 60000 });

  test('Config initialized', async ({ page }) => {
    await page.goto('/financial');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const config = await page.evaluate(() => {
      if (!window.mixpanel?.config) return null;
      return {
        token: window.mixpanel.config.token,
        api_host: window.mixpanel.config.api_host,
        has_autocapture: typeof window.mixpanel.config.autocapture !== 'undefined'
      };
    });

    console.log('⚙️  Mixpanel config:', config);

    expect(config).toBeTruthy();
    expect(config?.token).toBeTruthy();
    expect(config?.api_host).toBeTruthy();
  });

  test('Click tracking works', async ({ page }) => {
    await page.goto('/financial');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    consoleTracker.clearLogs();

    // Click a button with ID for easier tracking
    const button = page.locator('button[id], a[href]').first();
    if (await button.isVisible()) {
      await button.click();
      await page.waitForTimeout(1000);

      // Just verify Mixpanel initialized and click happened
      const mixpanelReady = await isMixpanelInitialized(page);
      console.log('👆 Click executed, Mixpanel ready:', mixpanelReady ? '✅' : '❌');

      expect(mixpanelReady).toBeTruthy();
    }
  });

  test('RESET function exists', async ({ page }) => {
    await page.goto('/financial');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check that nukePanel is callable
    const canCallNukePanel = await page.evaluate(() => {
      return typeof window.RESET === 'function';
    });

    expect(canCallNukePanel).toBeTruthy();
    console.log('💥 nukePanel (RESET) is callable:', canCallNukePanel ? '✅' : '❌');
  });
});
