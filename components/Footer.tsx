"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { initMixpanelOnce } from "@/lib/analytics";
import { ExternalLinkIcon } from "lucide-react";

export function Footer() {
  const getMixpanelProjectUrl = () => {
    if (typeof window !== 'undefined' && window.mixpanel) {
      const deviceId = window.mixpanel.get_distinct_id();
      return `https://mixpanel.com/project/3276012/view/3782804/app/profile#distinct_id=${deviceId}`;
    }
    return "https://mixpanel.com/project/3276012/view/3782804/app/profile";
  };

  const [mixpanelUrl, setMixpanelUrl] = useState(getMixpanelProjectUrl());

  const handleMixpanelHover = () => {
    setMixpanelUrl(getMixpanelProjectUrl());
  };

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
            window.open(mixpanelUrl, '_blank');
          }}
          onMouseEnter={handleMixpanelHover}
          className="flex items-center gap-1"
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
