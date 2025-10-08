"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
import { initMixpanel } from "@/lib/analytics";

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
  const [mixpanelUrl, setMixpanelUrl] = useState(getMixpanelUrl());

  const handleMixpanelHover = () => {
    setMixpanelUrl(getMixpanelUrl());
  };

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
                   isCheckout ? 'theyBuy' :
                   isStreaming ? 'meTube' :
                   isAdmin ? 'youAdmin' :
                   isLifestyle ? 'weRead' :
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
                <Link className="text-sm font-medium hover:underline underline-offset-4" href="/streaming/account">
                  Account
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

        <Link
          className="text-sm font-medium hover:underline underline-offset-4 text-purple-500"
          href={mixpanelUrl}
          target="_blank"
          onMouseEnter={handleMixpanelHover}
        >
          MIXPANEL
        </Link>
      </nav>
    </header>
  );
}
