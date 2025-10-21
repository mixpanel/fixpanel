"use client";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CreditCardIcon,
  ShoppingCartIcon,
  PlayIcon,
  BuildingIcon,
  SmartphoneIcon,
  HeartIcon,
  MessageSquarePlusIcon,
  ActivityIcon,
  FlagIcon,
  BugIcon
} from "lucide-react";

export default function LandingPage() {
  const [showSuggestionButton, setShowSuggestionButton] = useState(false);
  const [unlockedMode, setUnlockedMode] = useState(false);

  useEffect(() => {
    document.title = "Demo Sites";

    // Check for unlock/preview parameter
    const params = new URLSearchParams(window.location.search);
    const unlockParam = params.get("preview") || params.get("unlock");
    if (unlockParam) {
      setUnlockedMode(true);
      console.log("[LANDING PAGE]: UNLOCKED MODE ENABLED - ALL DEMOS ACCESSIBLE");
    }

    // Show suggestion button after a delay
    const timer = setTimeout(() => {
      setShowSuggestionButton(true);
    }, 53500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-6 bg-[#7856FF] text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Demo Scenarios
                </h1>
                <p className="mx-auto max-w-[700px] text-lg md:text-xl">
                  try autocapture, session replay, feature flags, and other fantastic tools across different industries and use cases!<br/><br/>
				  don't miss the 'mixpanel' and 'reset' links in the top right / bottom center.<br/>come back to this page anytime to "reset" your experience
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Scenarios Grid */}
        <section className="w-full py-4 md:py-6 lg:py-8 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-2 text-center mb-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl text-[#7856FF]">
                  Choose Your Industry
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-lg/relaxed">
                  Each demo showcases Mixpanel's capabilities in a realistic industry context; also each app has some UX "problems" to find and fix using Mixpanel!
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-6xl items-stretch gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {/* Financial Services */}
              <div className="flex flex-col items-center space-y-3 border border-[#7856FF] p-6 rounded-lg hover:shadow-lg transition-shadow">
                <CreditCardIcon className="h-16 w-16 text-[#7856FF]" />
                <h3 className="text-2xl font-bold">Financial Services</h3>
                <p className="text-sm text-gray-500 text-center flex-1">
                  Fintech marketing/landing with customer testimonials and signup flows
                </p>
                <div className="w-full p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-800 flex items-center justify-between">
                  <span><strong>🔥 Friction:</strong> Lengthy KYC form on signup page</span>
                  <BugIcon className="h-4 w-4 text-orange-600" />
                </div>
                <div className="w-full p-2 bg-purple-50 border border-purple-200 rounded text-xs text-purple-800 flex items-center justify-between">
                  <span><strong>🚩 Flags:</strong> Customer stories modal (homepage), KYC auto-fill (signup)</span>
                  <a
                    href="https://mixpanel.com/project/3276012/view/3782804/app/feature-flags/7a8e2371-37ab-4e57-9f34-6f5ea0f9ad9b"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-800 transition-colors ml-2"
                    title="View flag in Mixpanel"
                  >
                    ⚙️
                  </a>
                </div>
                <Link href="/financial" className="w-full">
                  <Button className="w-full bg-[#7856FF] text-white hover:bg-[#7856FF]/90">
                    Explore iBank
                  </Button>
                </Link>
              </div>

              {/* Ecommerce */}
              <div className="flex flex-col items-center space-y-3 border border-[#07B096] p-6 rounded-lg hover:shadow-lg transition-shadow">
                <ShoppingCartIcon className="h-16 w-16 text-[#07B096]" />
                <h3 className="text-2xl font-bold">Ecommerce + Checkout</h3>
                <p className="text-sm text-gray-500 text-center flex-1">
                  Product discovery, cart management, and checkout flows
                </p>
                <div className="w-full p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-800 flex items-center justify-between">
                  <span><strong>🔥 Friction:</strong> Broken coupon code field in cart</span>
                  <BugIcon className="h-4 w-4 text-orange-600" />
                </div>
                <div className="w-full p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800 flex items-center justify-between">
                  <span><strong>🚩 Flags:</strong> Color theme slider (right side), Coupon drawer (left side)</span>
                  <a
                    href="https://mixpanel.com/project/3276012/view/3782804/app/feature-flags/2318d3c5-497a-43d7-adec-67cc000b7f8d#HHn6n2M9ujQu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-800 transition-colors ml-2"
                    title="View flag in Mixpanel"
                  >
                    ⚙️
                  </a>
                </div>
                <Link href="/checkout" className="w-full">
                  <Button className="w-full bg-[#07B096] text-white hover:bg-[#07B096]/90">
                    Explore theyBuy
                  </Button>
                </Link>
              </div>

              {/* Media & Streaming */}
              <div className="flex flex-col items-center space-y-3 border border-[#CC332B] p-6 rounded-lg hover:shadow-lg transition-shadow">
                <PlayIcon className="h-16 w-16 text-[#CC332B]" />
                <h3 className="text-2xl font-bold">Media + Streaming</h3>
                <p className="text-sm text-gray-500 text-center flex-1">
                  Video streaming with dynamic content and personalized recommendations
                </p>
                <div className="w-full p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-800 flex items-center justify-between">
                  <span><strong>🔥 Friction:</strong> Broken 'like' and 'subscribe' buttons</span>
                  <BugIcon className="h-4 w-4 text-orange-600" />
                </div>
                <div className="w-full p-2 bg-red-50 border border-red-200 rounded text-xs text-red-800 flex items-center justify-between">
                  <span><strong>🚩 Flags:</strong> Video recommender, AI Playlist Builder (lower right)</span>
                  <a
                    href="https://mixpanel.com/project/3276012/view/3782804/app/feature-flags/41387f87-eb9e-4e01-b22a-c51411995e01"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-600 hover:text-red-800 transition-colors ml-2"
                    title="View flag in Mixpanel"
                  >
                    ⚙️
                  </a>
                </div>
                <Link href="/streaming" className="w-full">
                  <Button className="w-full bg-[#CC332B] text-white hover:bg-[#CC332B]/90">
                    Explore meTube
                  </Button>
                </Link>
              </div>

              {/* SaaS B2B */}
              <div className={`flex flex-col items-center space-y-3 border p-6 rounded-lg hover:shadow-lg transition-shadow ${unlockedMode ? 'border-[#3B82F6]' : 'border-gray-300 opacity-60'}`}>
                <BuildingIcon className={`h-16 w-16 ${unlockedMode ? 'text-[#3B82F6]' : 'text-gray-400'}`} />
                <h3 className={`text-2xl font-bold ${unlockedMode ? 'text-gray-900' : 'text-gray-600'}`}>SaaS + Admin Apps</h3>
                <p className="text-sm text-gray-500 text-center flex-1">
                  Admin dashboard for people ops, IT management, and access control
                </p>
                <div className="w-full p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-800 flex items-center justify-between">
                  <span><strong>🔥 Friction:</strong> Broken CSV export, permission errors (25%)</span>
                  <BugIcon className="h-4 w-4 text-orange-600" />
                </div>
                <div className="w-full p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800 flex items-center justify-between">
                  <span><strong>🚩 Flag:</strong> Integration chatbot helper (lower right button)</span>
                  <a
                    href="https://mixpanel.com/project/3276012/view/3782804/app/feature-flags/1c4fa66b-c9d4-4f22-aba4-a4563e0c1328"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition-colors ml-2"
                    title="View flag in Mixpanel"
                  >
                    ⚙️
                  </a>
                </div>
                {unlockedMode ? (
                  <Link href="/admin" className="w-full">
                    <Button className="w-full bg-[#3B82F6] text-white hover:bg-[#3B82F6]/90">
                      Explore youAdmin
                    </Button>
                  </Link>
                ) : (
                  <Button disabled className="w-full bg-gray-300 text-gray-500 cursor-not-allowed">
                    youAdmin - Coming Soon
                  </Button>
                )}
              </div>

              {/* Healthcare & Wellness */}
              <div className={`flex flex-col items-center space-y-3 border p-6 rounded-lg hover:shadow-lg transition-shadow ${unlockedMode ? 'border-[#14B8A6]' : 'border-gray-300 opacity-60'}`}>
                <HeartIcon className={`h-16 w-16 ${unlockedMode ? 'text-[#14B8A6]' : 'text-gray-400'}`} />
                <h3 className={`text-2xl font-bold ${unlockedMode ? 'text-gray-900' : 'text-gray-600'}`}>Healthcare + Wellness</h3>
                <p className="text-sm text-gray-500 text-center flex-1">
                  Crowdsourced medical advice with AI chat and community voting
                </p>
                <div className="w-full p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-800 flex items-center justify-between">
                  <span><strong>🔥 Friction:</strong> Form validation too strict (submit page)</span>
                  <BugIcon className="h-4 w-4 text-orange-600" />
                </div>
                <div className="w-full p-2 bg-teal-50 border border-teal-200 rounded text-xs text-teal-800 flex items-center justify-between">
                  <span><strong>🚩 Flag:</strong> Wheel of Symptoms spinner (lower left button)</span>
                  <a
                    href="https://mixpanel.com/project/3276012/view/3782804/app/feature-flags/293d35aa-b171-41a9-b64e-1dfb7d4eb6b6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-600 hover:text-teal-800 transition-colors ml-2"
                    title="View flag in Mixpanel"
                  >
                    ⚙️
                  </a>
                </div>
                {unlockedMode ? (
                  <Link href="/wellness" className="w-full">
                    <Button className="w-full bg-[#14B8A6] text-white hover:bg-[#14B8A6]/90">
                      Explore ourHeart
                    </Button>
                  </Link>
                ) : (
                  <Button disabled className="w-full bg-gray-300 text-gray-500 cursor-not-allowed">
                    ourHeart - Coming Soon
                  </Button>
                )}
              </div>

              {/* Subscription B2C */}
              <div className={`flex flex-col items-center space-y-3 border p-6 rounded-lg hover:shadow-lg transition-shadow ${unlockedMode ? 'border-[#F59E0B]' : 'border-gray-300 opacity-60'}`}>
                <SmartphoneIcon className={`h-16 w-16 ${unlockedMode ? 'text-[#F59E0B]' : 'text-gray-400'}`} />
                <h3 className={`text-2xl font-bold ${unlockedMode ? 'text-gray-900' : 'text-gray-600'}`}>Subscription + Lifestyle</h3>
                <p className="text-sm text-gray-500 text-center flex-1">
                  Reddit-style forum with "likely to agree/disagree" sorting
                </p>
                <div className="w-full p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-800 flex items-center justify-between">
                  <span><strong>🔥 Friction:</strong> Comment count mismatch (0 shown vs displayed)</span>
                  <BugIcon className="h-4 w-4 text-orange-600" />
                </div>
                <div className="w-full p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800 flex items-center justify-between">
                  <span><strong>🚩 Flag:</strong> Post analyzer for bias/AI detection (hero button)</span>
                  <a
                    href="https://mixpanel.com/project/3276012/view/3782804/app/feature-flags/a759f0e5-cd4e-4458-b24c-a786a045cf12"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-600 hover:text-amber-800 transition-colors ml-2"
                    title="View flag in Mixpanel"
                  >
                    ⚙️
                  </a>
                </div>
                {unlockedMode ? (
                  <Link href="/lifestyle" className="w-full">
                    <Button className="w-full bg-[#F59E0B] text-white hover:bg-[#F59E0B]/90">
                      Explore weRead
                    </Button>
                  </Link>
                ) : (
                  <Button disabled className="w-full bg-gray-300 text-gray-500 cursor-not-allowed">
                    weRead - Coming Soon
                  </Button>
                )}
              </div>
            </div>

            {/* Oneoff Microsites */}
            <div className="mt-12 mb-8">
              <div className="max-w-4xl mx-auto text-center">
                <p className="text-sm text-gray-500 mb-3">Additional standalone demos:</p>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <Link href="/payments" className="text-blue-600 hover:underline">
                    PayFlow (payments)
                  </Link>
                  <span className="text-gray-300">•</span>
                  <Link href="/dev" className="text-blue-600 hover:underline">
                    Developer Demo
                  </Link>
                  <span className="text-gray-300">•</span>
                  <Link href="/hud" className="text-blue-600 hover:underline">
                    HUD Interface
                  </Link>
                  <span className="text-gray-300">•</span>
                  <Link href="/metube" className="text-blue-600 hover:underline">
                    MeTube Video
                  </Link>
                </div>
              </div>
            </div>

            {/* What You'll Experience - Enhanced */}
            <div className="mt-16 mb-8">
              <div className="max-w-6xl mx-auto">
                <h3 className="text-3xl md:text-4xl font-bold text-center text-[#7856FF] mb-12">
                  What You'll Experience
                </h3>
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Real-time Analytics */}
                  <div className="flex flex-col items-center text-center space-y-4 p-8 rounded-xl bg-gradient-to-br from-purple-50 to-white border-2 border-purple-100 hover:border-purple-300 transition-all hover:shadow-xl">
                    <div className="p-4 bg-purple-100 rounded-full">
                      <ActivityIcon className="h-12 w-12 text-[#7856FF]" />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900">Real-time Analytics</h4>
                    <p className="text-base text-gray-600 leading-relaxed">
                      See events tracked live in your browser console and Mixpanel project as you interact with the demos
                    </p>
                  </div>

                  {/* Feature Flags */}
                  <div className="flex flex-col items-center text-center space-y-4 p-8 rounded-xl bg-gradient-to-br from-green-50 to-white border-2 border-green-100 hover:border-green-300 transition-all hover:shadow-xl">
                    <div className="p-4 bg-green-100 rounded-full">
                      <FlagIcon className="h-12 w-12 text-[#07B096]" />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900">Feature Flags</h4>
                    <p className="text-base text-gray-600 leading-relaxed">
                      Experience dynamic content and A/B testing in action—toggle flags and watch the UI update instantly
                    </p>
                  </div>

                  {/* Busted Broken Pages */}
                  <div className="flex flex-col items-center text-center space-y-4 p-8 rounded-xl bg-gradient-to-br from-red-50 to-white border-2 border-red-100 hover:border-red-300 transition-all hover:shadow-xl">
                    <div className="p-4 bg-red-100 rounded-full">
                      <BugIcon className="h-12 w-12 text-[#CC332B]" />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900">Busted Broken Pages</h4>
                    <p className="text-base text-gray-600 leading-relaxed">
                      These apps are riddled with problems and frustrating UX patterns—can you catch them all?
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {/* Floating Suggestion Button */}
      {showSuggestionButton && (
        <a
          href="https://forms.gle/DZCMVsmNC2XMxt8y8"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50"
        >
          <Button
            size="lg"
            className="bg-[#7856FF] text-white hover:bg-[#7856FF]/90 shadow-lg animate-bounce"
            style={{
              animation: "bounce 1s infinite",
            }}
          >
            <MessageSquarePlusIcon className="mr-2 h-5 w-5" />
            Suggestions?
          </Button>
        </a>
      )}
    </div>
  );
}