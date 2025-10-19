import { Page, Request } from '@playwright/test';

/**
 * Helper class for intercepting and validating Mixpanel events during tests
 */
export class MixpanelHelper {
  private page: Page;
  private capturedEvents: any[] = [];
  private isIntercepting: boolean = false;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Start intercepting Mixpanel events
   */
  async startIntercepting() {
    if (this.isIntercepting) return;

    await this.page.route('**/track', async (route) => {
      const request = route.request();
      const postData = request.postData();

      if (postData) {
        try {
          // Parse the base64 encoded data parameter
          const params = new URLSearchParams(postData);
          const data = params.get('data');
          if (data) {
            const decoded = JSON.parse(Buffer.from(data, 'base64').toString());
            this.capturedEvents.push(decoded);
            console.log('Captured Mixpanel event:', decoded.event);
          }
        } catch (error) {
          console.error('Error parsing Mixpanel event:', error);
        }
      }

      await route.continue();
    });

    // Also intercept engage calls (profile updates)
    await this.page.route('**/engage', async (route) => {
      const request = route.request();
      const postData = request.postData();

      if (postData) {
        try {
          const params = new URLSearchParams(postData);
          const data = params.get('data');
          if (data) {
            const decoded = JSON.parse(Buffer.from(data, 'base64').toString());
            this.capturedEvents.push({ type: 'profile', ...decoded });
            console.log('Captured Mixpanel profile update');
          }
        } catch (error) {
          console.error('Error parsing Mixpanel profile:', error);
        }
      }

      await route.continue();
    });

    this.isIntercepting = true;
  }

  /**
   * Get all captured events
   */
  getCapturedEvents() {
    return this.capturedEvents;
  }

  /**
   * Get events by name
   */
  getEventsByName(eventName: string) {
    return this.capturedEvents.filter(e => e.event === eventName);
  }

  /**
   * Check if a specific event was fired
   */
  hasEvent(eventName: string): boolean {
    return this.capturedEvents.some(e => e.event === eventName);
  }

  /**
   * Check if an event was fired with specific properties
   */
  hasEventWithProperties(eventName: string, properties: Record<string, any>): boolean {
    return this.capturedEvents.some(e => {
      if (e.event !== eventName) return false;

      for (const [key, value] of Object.entries(properties)) {
        if (e.properties?.[key] !== value) return false;
      }

      return true;
    });
  }

  /**
   * Wait for a specific event to be fired
   */
  async waitForEvent(eventName: string, timeout: number = 5000): Promise<boolean> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      if (this.hasEvent(eventName)) {
        return true;
      }
      await this.page.waitForTimeout(100);
    }

    return false;
  }

  /**
   * Clear all captured events
   */
  clearEvents() {
    this.capturedEvents = [];
  }

  /**
   * Get a summary of all captured events
   */
  getEventSummary() {
    const summary: Record<string, number> = {};

    for (const event of this.capturedEvents) {
      const name = event.event || 'profile_update';
      summary[name] = (summary[name] || 0) + 1;
    }

    return summary;
  }

  /**
   * Validate that events were fired in a specific order
   */
  validateEventSequence(expectedSequence: string[]): boolean {
    const actualSequence = this.capturedEvents
      .filter(e => e.event)
      .map(e => e.event);

    let sequenceIndex = 0;
    for (const actualEvent of actualSequence) {
      if (actualEvent === expectedSequence[sequenceIndex]) {
        sequenceIndex++;
        if (sequenceIndex === expectedSequence.length) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Get auto-capture events (clicks, inputs, etc)
   */
  getAutoCaptureEvents() {
    return this.capturedEvents.filter(e =>
      e.event?.startsWith('$mp_') ||
      e.event === '$web_event' ||
      e.event === 'mp_page_view'
    );
  }

  /**
   * Get custom events (non auto-capture)
   */
  getCustomEvents() {
    const autoCapturePrefixes = ['$mp_', '$web_event', 'mp_page_view'];
    return this.capturedEvents.filter(e =>
      e.event && !autoCapturePrefixes.some(prefix => e.event.startsWith(prefix))
    );
  }
}