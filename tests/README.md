# FixPanel Browser Testing

This directory contains the comprehensive browser testing suite for the FixPanel demo platform.

## Quick Start

### Install Dependencies
```bash
# Install Playwright and its dependencies
npm install
npm run test:install
```

### Run Tests

```bash
# Run all tests
npm run test

# Run smoke tests only
npm run test:smoke

# Run tests for specific vertical
npm run test:financial

# Run tests with UI mode (interactive)
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed

# Debug a specific test
npm run test:debug
```

### View Test Reports
```bash
# After tests run, view HTML report
npm run test:report
```

## Test Structure

```
tests/
├── e2e/
│   ├── smoke.spec.ts           # Core functionality smoke tests
│   ├── verticals/              # Tests for each vertical
│   │   ├── financial.spec.ts   # Financial services tests
│   │   └── ...                 # Other verticals (add as needed)
│   └── utils/                  # Test utilities and helpers
│       ├── mixpanel-helper.ts  # Mixpanel event validation
│       └── test-helpers.ts     # Common test utilities
└── README.md                   # This file
```

## Testing Philosophy: Console Log Assertions

**FixPanel uses a unique testing approach based on console log assertions.** Since the app extensively logs Mixpanel events and tracking to the console for demo purposes, our tests assert on these console logs rather than trying to intercept network requests or check DOM state.

### Why This Works
- ✅ **Reliable**: Console logs are deterministic and always present
- ✅ **Fast**: No need to wait for network requests
- ✅ **Resilient**: Works in headless browsers where Mixpanel might not fully load
- ✅ **Demo-Friendly**: Tests validate the same output users see when debugging
- ✅ **Simple**: Easy to understand and maintain

### Example Pattern
```typescript
test('Event tracking works', async ({ page }) => {
  const consoleTracker = new ConsoleLogTracker(page);

  await page.goto('/financial');
  await page.click('button');

  // Assert on console logs instead of network calls
  expect(consoleTracker.hasLog('[MIXPANEL]: EVENT Button Clicked')).toBeTruthy();
});
```

## What We Test

### 1. Core Functionality (Smoke Tests)
- ✅ Pages load and render content
- ✅ Mixpanel initializes (via console logs)
- ✅ Navigation between verticals works
- ✅ Session reset functionality logs correctly
- ✅ Auto-capture events logged to console
- ✅ User identification via URL parameters

### 2. Vertical-Specific Tests
- ✅ Page-specific features render
- ✅ Forms and interactions log events
- ✅ Navigation tracking appears in logs
- ✅ Performance within acceptable limits
- ✅ No critical JavaScript errors

### 3. Mixpanel Integration (via Console Logs)
- ✅ "[MIXPANEL]: LOADED" appears
- ✅ "START [vertical]" events logged
- ✅ Click/input events appear in console
- ✅ Session recording starts
- ✅ Reset functionality logs correctly
- ✅ User identification logs appear

### 4. Cross-Browser Compatibility
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari/WebKit
- ✅ Mobile viewports

## Writing New Tests

### Recommended Test Structure (Console Log Pattern)
```typescript
import { test, expect } from '@playwright/test';
import { ConsoleLogTracker } from '../utils/test-helpers';

test.describe('Feature Name', () => {
  let consoleTracker: ConsoleLogTracker;

  test.beforeEach(async ({ page }) => {
    // Start tracking console logs
    consoleTracker = new ConsoleLogTracker(page);
  });

  test('specific test case', async ({ page }) => {
    await page.goto('/path');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Perform action
    await page.click('button');
    await page.waitForTimeout(500);

    // Assert on console logs
    expect(consoleTracker.hasLog('[MIXPANEL]: EVENT')).toBeTruthy();

    // Print logs for debugging
    consoleTracker.printLogs('[MIXPANEL]');
  });
});
```

### Using the ConsoleLogTracker
```typescript
// Check if a specific log exists
const hasLog = consoleTracker.hasLog('[MIXPANEL]: LOADED');

// Check with regex
const hasEvent = consoleTracker.hasLog(/EVENT|track/i);

// Get matching logs
const clickLogs = consoleTracker.getMatchingLogs(/click/i);

// Get only Mixpanel logs
const mixpanelLogs = consoleTracker.getMixpanelLogs();

// Clear logs (useful between actions)
consoleTracker.clearLogs();

// Print filtered logs for debugging
consoleTracker.printLogs('[MIXPANEL]');
```

### Test Pattern Examples

**Testing Button Clicks:**
```typescript
test('Button click is tracked', async ({ page }) => {
  const consoleTracker = new ConsoleLogTracker(page);

  await page.goto('/financial');
  consoleTracker.clearLogs(); // Clear initial page load logs

  await page.click('button.cta');
  await page.waitForTimeout(500);

  expect(consoleTracker.hasLog(/click|EVENT/i)).toBeTruthy();
  console.log('Click logs:', consoleTracker.getMatchingLogs(/click/i));
});
```

**Testing Page Navigation:**
```typescript
test('Navigation logs events', async ({ page }) => {
  const consoleTracker = new ConsoleLogTracker(page);

  await page.goto('/financial');
  await page.waitForTimeout(2000);

  const hasStartEvent = consoleTracker.hasLog('START financial');
  expect(hasStartEvent).toBeTruthy();

  console.log('📋 Session logs:', consoleTracker.getMatchingLogs(/START|session/i));
});
```

### Validating Mixpanel Events
```typescript
test('validate event tracking', async ({ page }) => {
  const mixpanelHelper = new MixpanelHelper(page);
  await mixpanelHelper.startIntercepting();

  // Perform action
  await page.click('button.cta');

  // Wait for event
  await mixpanelHelper.waitForEvent('Button Clicked');

  // Check event properties
  expect(mixpanelHelper.hasEventWithProperties('Button Clicked', {
    button_text: 'Get Started',
    page: '/home'
  })).toBeTruthy();

  // Get event summary
  const summary = mixpanelHelper.getEventSummary();
  console.log('Events tracked:', summary);
});
```

## Running Tests Locally

All tests are designed to run locally during development. There is no CI/CD integration - tests are for local validation only.

### Recommended Workflow
1. Start dev server: `npm run dev`
2. Run tests in another terminal: `npm run test`
3. Fix any failures and iterate
4. Use `npm run test:ui` for interactive debugging

## Troubleshooting

### Tests Failing Locally
```bash
# Update Playwright browsers
npx playwright install

# Note: Playwright automatically clears these before each run
# But if you want to manually clear:
rm -rf tests/test-results/ tests/playwright-report/

# Run with debug mode
npm run test:debug
```

### Mixpanel Events Not Captured
- Check if Mixpanel is initialized: `window.mixpanel` should exist
- Verify proxy URL is accessible
- Check browser console for errors
- Ensure events have time to fire (use `waitForTimeout`)

### Flaky Tests
- Add explicit waits: `await page.waitForLoadState('networkidle')`
- Use more specific selectors
- Increase timeout values
- Check for race conditions

## Best Practices

1. **Keep Tests Independent**: Each test should be able to run in isolation
2. **Use Data Attributes**: Add `data-testid` attributes for reliable selectors
3. **Validate Events**: Always verify Mixpanel events are tracked correctly
4. **Handle Async Operations**: Use proper waits and timeouts
5. **Clean Up State**: Reset sessions between tests when needed
6. **Write Descriptive Names**: Test names should clearly describe what's being tested
7. **Use Page Objects**: For complex pages, create page object models
8. **Screenshot on Failure**: Capture screenshots for debugging
9. **Mock External Dependencies**: Mock third-party services when possible
10. **Run Tests in Parallel**: Use Playwright's parallel execution for speed

## Debugging

### Enable Debug Mode
```bash
# Run with Playwright Inspector
PWDEBUG=1 npm run test

# Run specific test file in debug
npx playwright test financial.spec.ts --debug

# Generate trace files
npx playwright test --trace on
```

### View Test Traces
```bash
# After test failure with trace enabled
npx playwright show-trace trace.zip
```

### Check Mixpanel Events
```javascript
// In browser console during test
console.log(window.mixpanel.get_distinct_id());
console.log(window.mixpanel.get_property('$browser'));
```

## Performance Benchmarks

Target metrics for acceptable performance:
- Page Load: < 3 seconds
- Time to Interactive: < 3 seconds
- Mixpanel Initialization: < 1 second
- Event Tracking Latency: < 100ms

## Maintenance

### Weekly Tasks
- Review and fix flaky tests
- Update selectors if UI changed
- Add tests for new features

### Monthly Tasks
- Review test coverage metrics
- Update browser versions
- Optimize slow tests
- Archive old test results

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Mixpanel JavaScript SDK](https://developer.mixpanel.com/docs/javascript)
- [Testing Best Practices](https://testingjavascript.com)
- [FixPanel Documentation](../CLAUDE.md)