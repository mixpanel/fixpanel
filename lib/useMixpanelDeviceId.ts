"use client";

import { useState, useEffect } from "react";
import { whenMixpanelLoaded } from "./analytics";

/**
 * Custom hook that reads the Mixpanel device ID.
 * It waits for the library's own `loaded` callback, so it never touches the
 * snippet stub. The stub has no get_property() and would throw.
 *
 * This is a read-only observer: it must NOT initialize Mixpanel. The Header
 * and Footer use it on the landing page, where we deliberately do not track.
 *
 * Returns the device ID once available, or null if Mixpanel never initializes.
 */
export function useMixpanelDeviceId() {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(true);

  useEffect(() => {
    let cancelled = false;

    // 5s matches the old poll budget, so the badge spinner does not linger.
    whenMixpanelLoaded(5000)
      .then((mp) => {
        if (cancelled) return;
        const id = mp.get_property("$device_id");
        if (id) {
          console.log(`[DEVICE ID]: Found device ID: ${id}`);
          setDeviceId(id);
        } else {
          console.log("[DEVICE ID]: Mixpanel loaded but no $device_id present");
        }
        setIsPolling(false);
      })
      .catch(() => {
        if (cancelled) return;
        // Expected on the landing page, which never initializes Mixpanel.
        console.log("[DEVICE ID]: Mixpanel not initialized, no device ID to show");
        setIsPolling(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { deviceId, isPolling };
}
