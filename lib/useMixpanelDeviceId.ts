"use client";

import { useState, useEffect } from "react";

/**
 * Custom hook to poll for Mixpanel device ID with retry logic
 * Polls up to 10 times with 500ms intervals
 * Returns device ID once found, or null if not available after max attempts
 */
export function useMixpanelDeviceId() {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(true);

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 10;
    const pollInterval = 500; // 500ms between attempts

    const checkDeviceId = () => {
      attempts++;

      if (typeof window !== "undefined" && window.mixpanel) {
        try {
          // Try to get device ID from Mixpanel
          const id = window.mixpanel.get_property("$device_id");

          if (id && id !== "undefined" && id !== "null") {
            console.log(`[DEVICE ID]: Found device ID on attempt ${attempts}: ${id}`);
            setDeviceId(id);
            setIsPolling(false);
            return true;
          }
        } catch (e) {
          console.log(`[DEVICE ID]: Error getting device ID on attempt ${attempts}:`, e);
        }
      }

      // Stop polling after max attempts
      if (attempts >= maxAttempts) {
        console.log(`[DEVICE ID]: Max attempts (${maxAttempts}) reached, no device ID found`);
        setIsPolling(false);
        return true;
      }

      return false;
    };

    // Check immediately
    const foundImmediately = checkDeviceId();

    if (!foundImmediately) {
      // Set up polling interval
      const intervalId = setInterval(() => {
        const found = checkDeviceId();
        if (found) {
          clearInterval(intervalId);
        }
      }, pollInterval);

      // Cleanup
      return () => clearInterval(intervalId);
    }
  }, []);

  return { deviceId, isPolling };
}
