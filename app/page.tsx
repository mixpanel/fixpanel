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
  MessageSquarePlusIcon
} from "lucide-react";

export default function LandingPage() {
  const [showSuggestionButton, setShowSuggestionButton] = useState(false);

  useEffect(() => {
    document.title = "Demo Sites";

    // Show suggestion button after a delay
    const timer = setTimeout(() => {
      setShowSuggestionButton(true);
    }, 1500);

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
				  don't miss the 'mixpanel' and 'reset' links in the top right / bottom center
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
                  marketing/landing for fintech; experiment on customer testimonials; friction with KYC flow!
                </p>
                <div className="w-full p-2 bg-purple-50 border border-purple-200 rounded text-xs text-purple-800">
                  <strong>🚩 Flags:</strong> Customer stories modal (homepage), KYC auto-fill (signup)
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
                  e-commerce  app for product discovery, cart management and checkout flows; friction with the coupon code!
                </p>
                <div className="w-full p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800">
                  <strong>🚩 Flag:</strong> Color scheme switcher (dark/chaos/light modes)
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
                  video streaming with dynamic content and personalized recommendations; friction with the 'like' and 'subscribe' buttons.
                </p>
                <div className="w-full p-2 bg-red-50 border border-red-200 rounded text-xs text-red-800">
                  <strong>🚩 Flag:</strong> "Just For You" video recommender (category bar)
                </div>
                <Link href="/streaming" className="w-full">
                  <Button className="w-full bg-[#CC332B] text-white hover:bg-[#CC332B]/90">
                    Explore meTube
                  </Button>
                </Link>
              </div>

              {/* SaaS B2B */}
              <div className="flex flex-col items-center space-y-3 border border-[#1E3A8A] p-6 rounded-lg hover:shadow-lg transition-shadow">
                <BuildingIcon className="h-16 w-16 text-[#1E3A8A]" />
                <h3 className="text-2xl font-bold">SaaS + Admin Apps</h3>
                <p className="text-sm text-gray-500 text-center flex-1">
                  ERP-style admin dashboard for people ops, IT management, identity access control, and analytics
                </p>
                <div className="w-full p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                  <strong>🚩 Flag:</strong> Integration chatbot helper (lower right button)
                </div>
                <Link href="/admin" className="w-full">
                  <Button className="w-full bg-[#1E3A8A] text-white hover:bg-[#1E3A8A]/90">
                    Explore youAdmin
                  </Button>
                </Link>
              </div>

              {/* Healthcare & Wellness */}
              <div className="flex flex-col items-center space-y-3 border border-[#14B8A6] p-6 rounded-lg hover:shadow-lg transition-shadow">
                <HeartIcon className="h-16 w-16 text-[#14B8A6]" />
                <h3 className="text-2xl font-bold">Healthcare + Wellness</h3>
                <p className="text-sm text-gray-500 text-center flex-1">
                  crowdsourced medical advice platform with AI doctor chat and community voting on diagnoses
                </p>
                <div className="w-full p-2 bg-teal-50 border border-teal-200 rounded text-xs text-teal-800">
                  <strong>🚩 Flag:</strong> Wheel of Symptoms spinner (lower left button)
                </div>
                <Link href="/wellness" className="w-full">
                  <Button className="w-full bg-[#14B8A6] text-white hover:bg-[#14B8A6]/90">
                    Explore ourHeart
                  </Button>
                </Link>
              </div>

              {/* Subscription B2C */}
              <div className="flex flex-col items-center space-y-3 border border-[#F59E0B] p-6 rounded-lg hover:shadow-lg transition-shadow">
                <SmartphoneIcon className="h-16 w-16 text-[#F59E0B]" />
                <h3 className="text-2xl font-bold">Subscription + Lifestyle</h3>
                <p className="text-sm text-gray-500 text-center flex-1">
                  existentialist reddit-style forum with unique sorting by "likely to agree" or "likely to disagree"
                </p>
                <div className="w-full p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
                  <strong>🚩 Flag:</strong> Post analyzer for bias/AI detection (hero button)
                </div>
                <Link href="/lifestyle" className="w-full">
                  <Button className="w-full bg-[#F59E0B] text-white hover:bg-[#F59E0B]/90">
                    Explore weRead
                  </Button>
                </Link>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-8 text-center">
              <div className="max-w-3xl mx-auto">
                <h3 className="text-lg font-semibold text-[#7856FF] mb-3">What You'll Experience</h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>
                    <h4 className="font-semibold mb-2">Real-time Analytics</h4>
                    <p>see events tracked live in your browser console and Mixpanel project...</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Feature Flags</h4>
                    <p>experience dynamic content and A/B testing in action... </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Busted Broken Pages</h4>
                    <p>these apps are absolutely riddled with problems and frustration UX patterns; can you catch them all?</p>
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