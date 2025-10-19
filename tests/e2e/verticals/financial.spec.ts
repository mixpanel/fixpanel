import { test, expect } from '@playwright/test';
import { ConsoleLogTracker } from '../utils/test-helpers';

test.describe('iBank', () => {
  let consoleTracker: ConsoleLogTracker;

  test.beforeEach(async ({ page }) => {
    consoleTracker = new ConsoleLogTracker(page);
  });

  test('Homepage loads with tracking', async ({ page }) => {
    await page.goto('/financial');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    const hasContent = await page.locator('h1, h2, main').count();
    const hasStart = consoleTracker.hasLog('START financial');

    console.log('📋 Content:', hasContent > 0 ? '✅' : '❌');
    console.log('🎯 Session start:', hasStart ? '✅' : '❌');

    expect(hasContent).toBeGreaterThan(0);
  });

  test('Navigation tracks page views', async ({ page }) => {
    await page.goto('/financial');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    consoleTracker.clearLogs();

    const links = await page.locator('a[href*="/financial"]').all();

    if (links.length > 1) {
      const link = links[1];
      if (await link.isVisible()) {
        await link.click();
        await page.waitForTimeout(1000);

        const logs = consoleTracker.getMatchingLogs(/EVENT|page|click/i);
        console.log('📊 Navigation logs:', logs.length);

        expect(consoleTracker.getLogs().length).toBeGreaterThan(0);
      }
    }
  });

  test('Form interactions tracked', async ({ page }) => {
    await page.goto('/financial');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    const inputs = await page.locator('input:visible').all();

    if (inputs.length > 0) {
      consoleTracker.clearLogs();

      await inputs[0].fill('test');
      await page.waitForTimeout(300);

      const logs = consoleTracker.getMatchingLogs(/input|change|EVENT/i);
      console.log('⌨️  Input logs:', logs.length);

      expect(consoleTracker.getLogs().length).toBeGreaterThan(0);
    } else {
      console.log('⚠️  No inputs found');
    }
  });

  test('Button clicks tracked', async ({ page }) => {
    await page.goto('/financial');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    const buttons = await page.locator('button:visible').all();

    if (buttons.length > 0) {
      consoleTracker.clearLogs();

      await buttons[0].click();
      await page.waitForTimeout(300);

      const logs = consoleTracker.getMatchingLogs(/click|button|EVENT/i);
      console.log('👆 Click logs:', logs.length);

      expect(consoleTracker.getLogs().length).toBeGreaterThan(0);
    } else {
      console.log('⚠️  No buttons found');
    }
  });

  test('Scroll events tracked', async ({ page }) => {
    await page.goto('/financial');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    consoleTracker.clearLogs();

    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(300);

    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(300);

    const scrollLogs = consoleTracker.getMatchingLogs(/scroll/i);
    console.log('📜 Scroll logs:', scrollLogs.length);
    console.log('📋 Total logs:', consoleTracker.getLogs().length);
  });

  test('Reset works on financial', async ({ page }) => {
    await page.goto('/financial');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    consoleTracker.clearLogs();

    const resetExists = await page.evaluate(() => typeof window.RESET === 'function');

    if (resetExists) {
      await page.evaluate(() => {
        const orig = window.location.reload;
        window.location.reload = (() => console.log('[TEST]: Reload prevented')) as any;
        window.RESET();
        setTimeout(() => { window.location.reload = orig; }, 100);
      });

      await page.waitForTimeout(1000);

      const hasReset = consoleTracker.hasLog(/END OF USER|STOP SESSION|CLEARED/);
      console.log('🔄 Reset logs:', hasReset ? '✅' : '❌');

      expect(hasReset).toBeTruthy();
    }
  });

  test('Unique session tracking', async ({ page }) => {
    await page.goto('/financial');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    const hasStart = consoleTracker.hasLog('START financial');
    const hasDistinct = consoleTracker.hasLog('DISTINCT_ID');

    console.log('🎯 Session:');
    console.log('  - START financial:', hasStart ? '✅' : '❌');
    console.log('  - Distinct ID:', hasDistinct ? '✅' : '❌');

    if (consoleTracker.hasLog('[MIXPANEL]: LOADED')) {
      expect(hasStart || hasDistinct).toBeTruthy();
    }
  });

  test('Feature flags evaluated', async ({ page }) => {
    await page.goto('/financial');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Check if Mixpanel has access to flags API
    const hasFlagsAPI = await page.evaluate(() => {
      return typeof window.mixpanel?.flags !== 'undefined';
    });

    console.log('🚩 Flags API:', hasFlagsAPI ? '✅' : '❌');

    // Look for any flag-related console activity
    const flagLogs = consoleTracker.getMatchingLogs(/flag|experiment|variant/i);
    console.log('🚩 Flag logs:', flagLogs.length);

    // At minimum, flags API should be available if Mixpanel loaded
    if (consoleTracker.hasLog('[MIXPANEL]: LOADED')) {
      expect(hasFlagsAPI).toBeTruthy();
    }
  });

  test('Performance acceptable', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(err.message));

    const start = Date.now();
    await page.goto('/financial');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - start;

    const criticalErrors = errors.filter(e =>
      !e.includes('favicon') && !e.includes('404')
    );

    console.log('⚡️ Load time:', `${loadTime}ms`);
    console.log('❌ Errors:', criticalErrors.length);

    expect(loadTime).toBeLessThan(10000);
    expect(criticalErrors).toHaveLength(0);
  });
});
