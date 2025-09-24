"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreditCardIcon, TrendingUpDownIcon, HomeIcon } from "lucide-react";
//@ts-ignore
import mixpanel from "mixpanel-browser";

const getMixpanelUrl = () => {
  try {
    const deviceId = mixpanel.get_property("$device_id");
    return `https://mixpanel.com/project/3276012/view/3782804/app/profile#distinct_id=%24device%3A${deviceId}`;
  } catch (e) {
    return "https://mixpanel.com/project/3276012/view/3782804/app/events";
  }
};

export function Header() {
  const pathname = usePathname();

  // Determine which microsite we're in
  const isFinancial = pathname.startsWith('/financial');
  const isCheckout = pathname.startsWith('/checkout');
  const isStreaming = pathname.startsWith('/streaming');
  const isAdmin = pathname.startsWith('/admin');
  const isLifestyle = pathname.startsWith('/lifestyle');
  const isWellness = pathname.startsWith('/wellness');
  const isRoot = pathname === '/';

  // Get the base path for navigation
  const basePath = isFinancial ? '/financial' :
                   isCheckout ? '/checkout' :
                   isStreaming ? '/streaming' :
                   isAdmin ? '/admin' :
                   isLifestyle ? '/lifestyle' :
                   isWellness ? '/wellness' : '';

  // Get site name and logo
  const siteName = isFinancial ? 'FixPanel' :
                   isCheckout ? 'ShopFlow' :
                   isStreaming ? 'StreamVibe' :
                   isAdmin ? 'AdminHub' :
                   isLifestyle ? 'LifeStyle+' :
                   isWellness ? 'WellCare+' : 'FixPanel Demo';

  return (
    <header className="px-4 lg:px-6 h-14 flex items-center opacity-75 hover:opacity-100">
      <Link className="flex items-center justify-center" href={isRoot ? "/" : basePath}>
        <TrendingUpDownIcon className="h-10 w-10" />
        <span className="ml-2 text-lg font-semibold">
          {siteName} <span className="invisible">logo</span>
        </span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        {/* Always show Home link to main landing page */}
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="/">
          <HomeIcon className="h-4 w-4 inline mr-1" />
          All Demos
        </Link>

        {/* Show microsite-specific navigation */}
        {!isRoot && (
          <>
            <Link className="text-sm font-medium hover:underline underline-offset-4" href={basePath}>
              Home
            </Link>
            {isFinancial && (
              <>
                <Link className="text-sm font-medium hover:underline underline-offset-4" href="/financial/features">
                  Features
                </Link>
                <Link className="text-sm font-medium hover:underline underline-offset-4" href="/financial/product">
                  Products
                </Link>
                <Link className="text-sm font-medium hover:underline underline-offset-4" href="/financial/pricing">
                  Pricing
                </Link>
                <Link className="text-sm font-medium hover:underline underline-offset-4" href="/financial/login">
                  Sign In
                </Link>
                <Link className="text-sm font-medium hover:underline underline-offset-4" href="/financial/about">
                  About
                </Link>
              </>
            )}
          </>
        )}

        {/* Always show Reset and Mixpanel links */}
        <Link
          className="text-sm font-medium hover:underline underline-offset-4 text-red-500"
          href="#"
          onClick={() => {
            if (typeof window !== 'undefined' && window.RESET && typeof window.RESET === "function") {
              window.RESET();
            }
          }}
        >
          Reset
        </Link>

        <Link
          className="text-sm font-medium hover:underline underline-offset-4 text-purple-500"
          href={getMixpanelUrl()}
          target="_blank"
        >
          MIXPANEL
        </Link>
      </nav>
    </header>
  );
}
