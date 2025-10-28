import { test, expect } from '@playwright/test';
import { ConsoleLogTracker } from './utils/test-helpers';

test.describe('Smoke Tests', () => {
  let consoleTracker: ConsoleLogTracker;

  test.beforeEach(async ({ page }) => {
    consoleTracker = new ConsoleLogTracker(page);
  });

  test('Landing page loads', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Quick sanity check
    const hasContent = await page.locator('body').count();
    expect(hasContent).toBe(1);

    const title = await page.title();
    expect(title).toBeTruthy();

    console.log('✅ Landing page loaded:', title);
  });

  test('No tracking on landing page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Should NOT see session start events on landing
    const hasSessionEvent = consoleTracker.hasLog(/Session: (iBank|ourHeart|theyBuy|youAdmin|weRead|meTube)/);
    const hasResetLog = consoleTracker.hasLog('FRESH LANDING');

    console.log('🏠 Landing - Session events:', hasSessionEvent ? '❌ BAD' : '✅ None');
    console.log('🏠 Landing - RESET log:', hasResetLog ? '❌ BAD' : '✅ None');

    expect(hasSessionEvent).toBeFalsy();
    expect(hasResetLog).toBeFalsy();
  });

  test('Tracking starts when entering vertical', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    consoleTracker.clearLogs();

    const financialLink = await page.locator('a[href*="financial"]').first();
    if (await financialLink.isVisible()) {
      await financialLink.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1500);

      const hasStart = consoleTracker.hasLog(/Session: iBank|MIXPANEL LOADED/);
      console.log('🎯 Session started on vertical:', hasStart ? '✅' : '❌');

      expect(hasStart).toBeTruthy();
    } else {
      console.log('⚠️  Financial link not found');
    }
  });

  test('Each vertical starts unique session', async ({ page }) => {
    const verticals = [
      { path: '/financial', name: 'financial' },
      { path: '/wellness', name: 'wellness' }
    ];

    for (const v of verticals) {
      await page.goto(v.path);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1500);

      // Check for Session events (iBank, ourHeart, etc.)
      const hasSession = consoleTracker.hasLog(/Session: (iBank|ourHeart)/);
      console.log(`🎯 ${v.name}:`, hasSession ? '✅' : '❌');

      consoleTracker.clearLogs();
    }
  });

  test('Vertical links exist on landing', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const links = await page.locator('a').evaluateAll(elements =>
      elements
        .map(el => el.getAttribute('href'))
        .filter(href => href?.includes('financial') || href?.includes('wellness'))
    );

    console.log('🔗 Vertical links:', links.length);
    expect(links.length).toBeGreaterThan(0);
  });

  test('Session reset works', async ({ page }) => {
    await page.goto('/financial');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    consoleTracker.clearLogs();

    const resetExists = await page.evaluate(() => typeof window.RESET === 'function');

    if (resetExists) {
      await page.evaluate(() => {
        const orig = window.location.reload;
        window.location.reload = (() => console.log('[TEST]: Prevented reload')) as any;
        window.RESET();
        setTimeout(() => { window.location.reload = orig; }, 100);
      });

      await page.waitForTimeout(1200);

      const hasReset = consoleTracker.hasLog(/END OF USER|STOP SESSION|RESET|CLEARED/);
      console.log('🔄 Reset triggered:', hasReset ? '✅' : '❌');

      expect(hasReset).toBeTruthy();
    }
  });

  test('All verticals load', async ({ page }) => {
    const verticals = ['/financial', '/wellness', '/checkout', '/streaming', '/admin', '/lifestyle'];

    for (const path of verticals) {
      const errors: string[] = [];
      page.on('pageerror', err => errors.push(err.message));

      await page.goto(path);
      await page.waitForLoadState('domcontentloaded'); // Faster than networkidle

      const hasContent = await page.locator('h1, h2, main').count();
      const criticalErrors = errors.filter(e => !e.includes('favicon') && !e.includes('404'));

      console.log(`${path}: ${hasContent > 0 ? '✅' : '❌'} (errors: ${criticalErrors.length})`);

      expect(hasContent).toBeGreaterThan(0);
      expect(criticalErrors).toHaveLength(0);
    }
  });

  test('User identification works', async ({ page }) => {
    await page.goto('/financial?user=test-user-123');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    const hasIdentify = consoleTracker.hasLog(/IDENTIFY test-user-123|FOUND USER test-user-123/);
    console.log('👤 User identified:', hasIdentify ? '✅' : '❌');

    if (consoleTracker.hasLog('[MIXPANEL]: LOADED')) {
      expect(hasIdentify).toBeTruthy();
    }
  });

  test('Session recording starts', async ({ page }) => {
    await page.goto('/financial');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const hasRecording = consoleTracker.hasLog(/START SESSION RECORDING|DISTINCT_ID/);
    console.log('🎥 Recording started:', hasRecording ? '✅' : '❌');

    if (consoleTracker.hasLog('[MIXPANEL]: LOADED')) {
      expect(hasRecording).toBeTruthy();
    }
  });

  test('Click tracking works', async ({ page }) => {
    await page.goto('/financial');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    consoleTracker.clearLogs();

    const clickable = await page.locator('a, button').first();
    if (await clickable.isVisible()) {
      await clickable.click();
      await page.waitForTimeout(500);

      const logs = consoleTracker.getLogs();
      console.log('👆 Logs after click:', logs.length);

      expect(logs.length).toBeGreaterThan(0);
    }
  });
});
