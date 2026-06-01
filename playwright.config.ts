import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for FixPanel browser testing
 */
export default defineConfig({
  testDir: './tests/e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build if you accidentally left test.only in the source code */
  forbidOnly: false,
  /* Retry failed tests */
  retries: 0,
  /* Number of parallel workers */
  workers: undefined,
  /* Reporter to use */
  reporter: [
    ['html', { outputFolder: 'tests/playwright-report' }],
    ['json', { outputFile: 'tests/playwright-report/results.json' }],
    ['list'],
  ],
  /* Output folder for test artifacts */
  outputDir: 'tests/test-results',
  /* Shared settings for all the projects below */
  use: {
    /* Base URL to use in actions like `await page.goto('/')` */
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
    /* Video on failure */
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      // Core FixPanel app tests (Next.js dev server on :3000).
      testIgnore: /oneoffs\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      // Permissive load tests for the standalone oneoffs (static server on :5050).
      name: 'oneoffs',
      testMatch: /oneoffs\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], baseURL: process.env.ONEOFFS_URL || 'http://localhost:5050' },
    },
    // Disabled non-Chrome browsers for faster testing
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    // /* Test against mobile viewports */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  /* Run the app dev server (core tests) and a static server for oneoffs */
  webServer: [
    {
      command: 'npm run dev',
      url: 'http://localhost:3000',
      reuseExistingServer: true, // Use existing server if already running
      timeout: 120 * 1000,
    },
    {
      command: 'npx serve ./oneoffs -l 5050 --no-clipboard',
      url: 'http://localhost:5050',
      reuseExistingServer: true,
      timeout: 120 * 1000,
    },
  ],
});