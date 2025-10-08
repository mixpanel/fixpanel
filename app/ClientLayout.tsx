"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initMixpanelOnce } from '../lib/analytics';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Don't initialize Mixpanel on the landing page
    if (pathname !== '/') {
      initMixpanelOnce();
    }
  }, [pathname]);

  return <>{children}</>;
}