import { Page, expect } from '@playwright/test';

/**
 * Common test utilities and helpers
 */

/**
 * Console log tracker for asserting on console output
 */
export class ConsoleLogTracker {
  private logs: string[] = [];
  private page: Page;

  constructor(page: Page) {
    this.page = page;
    page.on('console', msg => {
      this.logs.push(msg.text());
    });
  }

  getLogs() {
    return this.logs;
  }

  getMixpanelLogs() {
    return this.logs.filter(log => log.includes('[MIXPANEL]'));
  }

  hasLog(searchText: string | RegExp): boolean {
    if (typeof searchText === 'string') {
      return this.logs.some(log => log.includes(searchText));
    }
    return this.logs.some(log => searchText.test(log));
  }

  getMatchingLogs(searchText: string | RegExp): string[] {
    if (typeof searchText === 'string') {
      return this.logs.filter(log => log.includes(searchText));
    }
    return this.logs.filter(log => searchText.test(log));
  }

  clearLogs() {
    this.logs = [];
  }

  printLogs(filter?: string) {
    const logsToShow = filter ? this.logs.filter(l => l.includes(filter)) : this.logs;
    console.log('Console logs:', logsToShow);
  }
}

/**
 * Navigate to a page and wait for it to fully load
 */
export async function navigateAndWaitForLoad(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState('networkidle');

  // Wait for Mixpanel to initialize (optional - don't fail if it doesn't)
  try {
    await page.waitForFunction(() => typeof window.mixpanel !== 'undefined', { timeout: 10000 });
  } catch (error) {
    console.warn('Warning: Mixpanel did not initialize within 10 seconds');
    // Check if there were any errors
    const pageErrors = await page.evaluate(() => {
      return {
        mixpanelExists: typeof window.mixpanel !== 'undefined',
        errors: (window as any)._pageErrors || []
      };
    });
    console.log('Page state:', pageErrors);
  }
}

/**
 * Reset the user session
 */
export async function resetSession(page: Page) {
  await page.evaluate(() => {
    if (typeof window.RESET === 'function') {
      window.RESET();
    }
  });
  // Give Mixpanel time to process the reset
  await page.waitForTimeout(500);
}

/**
 * Set a feature flag value for testing
 */
export async function setFeatureFlag(page: Page, flagName: string, variant: string) {
  await page.evaluate(({ flagName, variant }) => {
    // Mock the feature flag response
    if (window.mixpanel?.flags) {
      window.mixpanel.flags._flags = {
        ...window.mixpanel.flags._flags,
        [flagName]: variant
      };
    }
  }, { flagName, variant });
}

/**
 * Get the current user's distinct ID
 */
export async function getDistinctId(page: Page): Promise<string> {
  return await page.evaluate(() => {
    return window.mixpanel?.get_distinct_id() || '';
  });
}

/**
 * Identify a user with Mixpanel
 */
export async function identifyUser(page: Page, userId: string, properties?: Record<string, any>) {
  await page.evaluate(({ userId, properties }) => {
    if (window.mixpanel) {
      window.mixpanel.identify(userId);
      if (properties) {
        window.mixpanel.people.set(properties);
      }
    }
  }, { userId, properties });
}

/**
 * Wait for a specific element to be visible
 */
export async function waitForElement(page: Page, selector: string, timeout: number = 5000) {
  await page.locator(selector).waitFor({ state: 'visible', timeout });
}

/**
 * Click an element and wait for navigation
 */
export async function clickAndNavigate(page: Page, selector: string) {
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    page.click(selector)
  ]);
}

/**
 * Fill out a form field
 */
export async function fillForm(page: Page, formData: Record<string, string>) {
  for (const [selector, value] of Object.entries(formData)) {
    await page.fill(selector, value);
  }
}

/**
 * Take a screenshot with a descriptive name
 */
export async function takeScreenshot(page: Page, name: string) {
  await page.screenshot({
    path: `tests/test-results/screenshots/${name}.png`,
    fullPage: true
  });
}

/**
 * Check if an element contains expected text
 */
export async function expectText(page: Page, selector: string, expectedText: string) {
  const element = page.locator(selector);
  await expect(element).toContainText(expectedText);
}

/**
 * Check if the page title matches expected value
 */
export async function expectTitle(page: Page, expectedTitle: string) {
  await expect(page).toHaveTitle(expectedTitle);
}

/**
 * Check if the URL matches expected pattern
 */
export async function expectURL(page: Page, expectedURL: string | RegExp) {
  await expect(page).toHaveURL(expectedURL);
}

/**
 * Simulate different viewport sizes
 */
export async function setViewport(page: Page, device: 'desktop' | 'tablet' | 'mobile') {
  const viewports = {
    desktop: { width: 1920, height: 1080 },
    tablet: { width: 768, height: 1024 },
    mobile: { width: 375, height: 667 }
  };

  await page.setViewportSize(viewports[device]);
}

/**
 * Get all console messages from the page
 */
export async function getConsoleMessages(page: Page): Promise<string[]> {
  const messages: string[] = [];

  page.on('console', msg => {
    messages.push(msg.text());
  });

  return messages;
}

/**
 * Check if Mixpanel is properly initialized
 */
export async function isMixpanelInitialized(page: Page): Promise<boolean> {
  return await page.evaluate(() => {
    return typeof window.mixpanel !== 'undefined' &&
           typeof window.mixpanel.track === 'function' &&
           typeof window.mixpanel.get_distinct_id === 'function';
  });
}

/**
 * Get the current Mixpanel configuration
 */
export async function getMixpanelConfig(page: Page): Promise<any> {
  return await page.evaluate(() => {
    if (window.mixpanel?.config) {
      return {
        token: window.mixpanel.config.token,
        api_host: window.mixpanel.config.api_host,
        autocapture: window.mixpanel.config.autocapture,
        session_recording: window.mixpanel.config.session_recording
      };
    }
    return null;
  });
}

/**
 * Wait for page animations to complete
 */
export async function waitForAnimations(page: Page) {
  await page.evaluate(() => {
    return new Promise(resolve => {
      // Wait for any CSS animations to complete
      setTimeout(resolve, 500);
    });
  });
}

/**
 * Test data generators
 */
export const testData = {
  randomEmail: () => `test-${Date.now()}@example.com`,
  randomName: () => `Test User ${Date.now()}`,
  randomPhone: () => `555-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
  randomAmount: (min = 100, max = 10000) => Math.floor(Math.random() * (max - min + 1)) + min
};