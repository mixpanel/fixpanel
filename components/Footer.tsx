"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { ExternalLinkIcon } from "lucide-react";
import { useMixpanelDeviceId } from "@/lib/useMixpanelDeviceId";

export function Footer() {
  const pathname = usePathname();
  const { deviceId, isPolling } = useMixpanelDeviceId();

  // Get vertical-specific Mixpanel data view ID
  const getViewId = () => {
    if (pathname.startsWith('/checkout')) return '4354009';   // weBuy
    if (pathname.startsWith('/financial')) return '4354010';  // iBank
    if (pathname.startsWith('/streaming')) return '4354011';  // meTube
    if (pathname.startsWith('/admin')) return '4354012';      // youAdmin
    if (pathname.startsWith('/wellness')) return '4354013';   // ourHeart
    if (pathname.startsWith('/lifestyle')) return '4354015';  // theyRead
    return '3782804'; // Default to global view for root/other pages
  };

  // Determine Mixpanel URL based on device ID availability
  const getMixpanelProjectUrl = () => {
    const viewId = getViewId();

    // On root page, always link to generic events page
    if (pathname === '/') {
      return "https://mixpanel.com/project/3276012/view/3782804/app/events";
    }

    // If we have a device ID, link to the profile in the vertical-specific view
    if (deviceId) {
      return `https://mixpanel.com/project/3276012/view/${viewId}/app/profile#distinct_id=${deviceId}`;
    }

    // No device ID yet - return null to disable link
    return null;
  };

  const mixpanelUrl = getMixpanelProjectUrl();
  const isButtonDisabled = !mixpanelUrl;

  return (
    <footer className="flex flex-col sm:flex-row py-6 w-full items-center justify-between px-4 md:px-6 border-t">
      <div className="w-1/3">
        <p className="text-xs text-gray-500">© Fixpanel since 2025. All hail the thief.</p>
      </div>

      <div className="w-1/3 flex justify-center gap-2">
        <Button
          id="theResetButton"
          onClick={() => {
            if (window.RESET && typeof window.RESET === "function") {
              window.RESET();
            }
          }}
        >
          reset mixpanel
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            if (mixpanelUrl) {
              window.open(mixpanelUrl, '_blank');
            }
          }}
          disabled={isButtonDisabled}
          className="flex items-center gap-1"
          title={isButtonDisabled ? (isPolling ? "Loading device ID..." : "Device ID not available") : "Open Mixpanel profile"}
        >
          <ExternalLinkIcon className="h-3 w-3" />
          mixpanel project
        </Button>
      </div>

      <nav className="w-1/3 flex justify-end gap-4">
        <Link className="text-xs hover:underline underline-offset-4" href="https://www.youtube.com/watch?v=2qBlE2-WL60">
          Terms of Service
        </Link>
        <Link className="text-xs hover:underline underline-offset-4" href="https://www.youtube.com/watch?v=2qBlE2-WL60">
          Privacy
        </Link>
      </nav>
    </footer>
  );
}
