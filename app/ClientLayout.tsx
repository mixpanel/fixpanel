"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initMixpanel } from '../lib/analytics';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Don't initialize Mixpanel on the landing page
    if (pathname !== '/') {
      initMixpanel();
    }
  }, [pathname]);

  return <>{children}</>;
}