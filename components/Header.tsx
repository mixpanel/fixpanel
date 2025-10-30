"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CreditCardIcon,
  TrendingUpDownIcon,
  HomeIcon,
  ShoppingBagIcon,
  PlayCircleIcon,
  LayoutDashboardIcon,
  BookOpenIcon,
  HeartPulseIcon
} from "lucide-react";
import { useMixpanelDeviceId } from "@/lib/useMixpanelDeviceId";

export function Header() {
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
  const getMixpanelUrl = () => {
    const viewId = getViewId();

    // On root page, always link to generic events page
    if (pathname === '/') {
      return "https://mixpanel.com/project/3276012/view/3782804/app/events";
    }

    // If we have a device ID, link to the profile in the vertical-specific view
    if (deviceId) {
      return `https://mixpanel.com/project/3276012/view/${viewId}/app/profile#distinct_id=%24device%3A${deviceId}`;
    }

    // No device ID yet - return null to disable link
    return null;
  };

  const mixpanelUrl = getMixpanelUrl();
  const isLinkDisabled = !mixpanelUrl;

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
  const siteName = isFinancial ? 'iBank' :
                   isCheckout ? 'weBuy' :
                   isStreaming ? 'meTube' :
                   isAdmin ? 'youAdmin' :
                   isLifestyle ? 'theyRead' :
                   isWellness ? 'ourHeart' : 'Mixpanel Demos';

  // Get the appropriate icon component for each site
  const SiteIcon = isFinancial ? CreditCardIcon :
                   isCheckout ? ShoppingBagIcon :
                   isStreaming ? PlayCircleIcon :
                   isAdmin ? LayoutDashboardIcon :
                   isLifestyle ? BookOpenIcon :
                   isWellness ? HeartPulseIcon : TrendingUpDownIcon;

  // Get color for each site
  const iconColor = isFinancial ? 'text-[#7856FF]' :
                    isCheckout ? 'text-[#07B096]' :
                    isStreaming ? 'text-[#CC332B]' :
                    isAdmin ? 'text-[#1E3A8A]' :
                    isLifestyle ? 'text-[#F59E0B]' :
                    isWellness ? 'text-[#14B8A6]' : 'text-gray-900';

  return (
    <header className="px-4 lg:px-6 h-14 flex items-center opacity-75 hover:opacity-100">
      <div className="flex items-center gap-1">
        <Link className="flex items-center justify-center" href={isRoot ? "/" : basePath}>
          <SiteIcon className={`h-10 w-10 ${iconColor}`} />
          <span className="ml-2 text-lg font-semibold">
            {siteName} <span className="invisible">logo</span>
          </span>
        </Link>

        {/* All Demos button moved to left next to logo */}
        {!isRoot && (
          <Link className="text-sm font-medium hover:underline underline-offset-4 text-blue-600" href="/">
            <HomeIcon className="h-4 w-4 inline mr-1" />
            All Demos
          </Link>
        )}
      </div>

      <nav className="ml-auto flex gap-4 sm:gap-6">

        {/* Show microsite-specific navigation */}
        {!isRoot && (
          <>
            <Link className="text-sm font-medium hover:underline underline-offset-4" href={basePath}>
              Home
            </Link>
            {isFinancial && (
              <>
                <Link id="features-nav-link" className="text-sm font-medium hover:underline underline-offset-4" href="/financial/features">
                  Features
                </Link>
                <Link id="products-nav-link" className="text-sm font-medium hover:underline underline-offset-4" href="/financial/product">
                  Products
                </Link>
                <Link id="pricing-nav-link" className="text-sm font-medium hover:underline underline-offset-4" href="/financial/pricing">
                  Pricing
                </Link>
                <Link id="signin-nav-link" className="text-sm font-medium hover:underline underline-offset-4" href="/financial/login">
                  Sign In
                </Link>
                <Link id="about-nav-link" className="text-sm font-medium hover:underline underline-offset-4" href="/financial/about">
                  About
                </Link>
              </>
            )}
            {isStreaming && (
              <>
                <Link className="text-sm font-medium hover:underline underline-offset-4" href="/streaming/trending">
                  Trending
                </Link>
                <Link className="text-sm font-medium hover:underline underline-offset-4" href="/streaming/subscriptions">
                  Subscriptions
                </Link>
                <Link className="text-sm font-medium hover:underline underline-offset-4" href="/streaming/history">
                  History
                </Link>
              </>
            )}
            {isCheckout && (
              <>
                <Link className="text-sm font-medium hover:underline underline-offset-4" href="/checkout/deals">
                  Daily Deals
                </Link>
                <Link className="text-sm font-medium hover:underline underline-offset-4" href="/checkout/support">
                  Support
                </Link>
                <Link className="text-sm font-medium hover:underline underline-offset-4" href="/checkout/account">
                  My Account
                </Link>
              </>
            )}
            {isAdmin && (
              <>
                <Link className="text-sm font-medium hover:underline underline-offset-4" href="/admin/dashboard">
                  Dashboard
                </Link>
                <Link className="text-sm font-medium hover:underline underline-offset-4" href="/admin/employees">
                  Employees
                </Link>
                <Link className="text-sm font-medium hover:underline underline-offset-4" href="/admin/access">
                  Access Control
                </Link>
                <Link className="text-sm font-medium hover:underline underline-offset-4" href="/admin/analytics">
                  Analytics
                </Link>
              </>
            )}
            {isWellness && (
              <>
                <Link className="text-sm font-medium hover:underline underline-offset-4" href="/wellness/vote">
                  Vote
                </Link>
                <Link className="text-sm font-medium hover:underline underline-offset-4" href="/wellness/chat">
                  AI Doctor
                </Link>
                <Link className="text-sm font-medium hover:underline underline-offset-4" href="/wellness/submit">
                  Submit Case
                </Link>
              </>
            )}
            {isLifestyle && (
              <>
                <Link className="text-sm font-medium hover:underline underline-offset-4" href="/lifestyle/feed">
                  Feed
                </Link>
                <Link className="text-sm font-medium hover:underline underline-offset-4" href="/lifestyle/submit">
                  Submit Post
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

        {isLinkDisabled ? (
          <span
            className="text-sm font-medium text-gray-400 cursor-not-allowed"
            title={isPolling ? "Loading device ID..." : "Device ID not available"}
          >
            MIXPANEL
          </span>
        ) : (
          <Link
            className="text-sm font-medium hover:underline underline-offset-4 text-purple-500"
            href={mixpanelUrl!}
            target="_blank"
          >
            MIXPANEL
          </Link>
        )}
      </nav>
    </header>
  );
}
