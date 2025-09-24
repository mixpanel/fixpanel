"use client";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import {
  CreditCardIcon,
  ShoppingCartIcon,
  PlayIcon,
  BuildingIcon,
  SmartphoneIcon
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-[#7856FF] text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                  FixPanel Demo Scenarios
                </h1>
                <p className="mx-auto max-w-[700px] text-xl md:text-2xl">
                  Explore real-world Mixpanel implementations across different industries and use cases
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Scenarios Grid */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#7856FF]">
                  Choose Your Industry
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Each demo showcases Mixpanel's capabilities in a realistic industry context
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-6xl items-stretch gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {/* Financial Services */}
              <div className="flex flex-col items-center space-y-4 border border-[#7856FF] p-8 rounded-lg hover:shadow-lg transition-shadow">
                <CreditCardIcon className="h-16 w-16 text-[#7856FF]" />
                <h3 className="text-2xl font-bold">Financial Services</h3>
                <p className="text-sm text-gray-500 text-center flex-1">
                  Banking, investments, and personal finance management with feature flags, session replay, and conversion tracking
                </p>
                <Link href="/landing" className="w-full">
                  <Button className="w-full bg-[#7856FF] text-white hover:bg-[#7856FF]/90">
                    Explore FixPanel
                  </Button>
                </Link>
              </div>

              {/* Ecommerce */}
              <div className="flex flex-col items-center space-y-4 border border-[#07B096] p-8 rounded-lg hover:shadow-lg transition-shadow">
                <ShoppingCartIcon className="h-16 w-16 text-[#07B096]" />
                <h3 className="text-2xl font-bold">Ecommerce + Checkout</h3>
                <p className="text-sm text-gray-500 text-center flex-1">
                  Product discovery, cart optimization, and checkout funnel analysis with real-time personalization
                </p>
                <Link href="/checkout" className="w-full">
                  <Button className="w-full bg-[#07B096] text-white hover:bg-[#07B096]/90">
                    Coming Soon
                  </Button>
                </Link>
              </div>

              {/* Media & Streaming */}
              <div className="flex flex-col items-center space-y-4 border border-[#CC332B] p-8 rounded-lg hover:shadow-lg transition-shadow">
                <PlayIcon className="h-16 w-16 text-[#CC332B]" />
                <h3 className="text-2xl font-bold">Media + Streaming</h3>
                <p className="text-sm text-gray-500 text-center flex-1">
                  Content engagement, viewing patterns, and subscription optimization for video platforms
                </p>
                <Link href="/streaming" className="w-full">
                  <Button className="w-full bg-[#CC332B] text-white hover:bg-[#CC332B]/90">
                    Coming Soon
                  </Button>
                </Link>
              </div>

              {/* SaaS B2B */}
              <div className="flex flex-col items-center space-y-4 border border-[#DA6B16] p-8 rounded-lg hover:shadow-lg transition-shadow">
                <BuildingIcon className="h-16 w-16 text-[#DA6B16]" />
                <h3 className="text-2xl font-bold">SaaS + Admin Apps</h3>
                <p className="text-sm text-gray-500 text-center flex-1">
                  B2B admin dashboards, feature adoption, and user journey optimization for business tools
                </p>
                <Link href="/admin" className="w-full">
                  <Button className="w-full bg-[#DA6B16] text-white hover:bg-[#DA6B16]/90">
                    Coming Soon
                  </Button>
                </Link>
              </div>

              {/* Subscription B2C */}
              <div className="flex flex-col items-center space-y-4 border border-[#1C782D] p-8 rounded-lg hover:shadow-lg transition-shadow lg:col-span-2 xl:col-span-1">
                <SmartphoneIcon className="h-16 w-16 text-[#1C782D]" />
                <h3 className="text-2xl font-bold">Subscription + Lifestyle</h3>
                <p className="text-sm text-gray-500 text-center flex-1">
                  Consumer apps, subscription management, and lifestyle product engagement tracking
                </p>
                <Link href="/lifestyle" className="w-full">
                  <Button className="w-full bg-[#1C782D] text-white hover:bg-[#1C782D]/90">
                    Coming Soon
                  </Button>
                </Link>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-16 text-center">
              <div className="max-w-3xl mx-auto">
                <h3 className="text-xl font-semibold text-[#7856FF] mb-4">What You'll Experience</h3>
                <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-600">
                  <div>
                    <h4 className="font-semibold mb-2">Real-time Analytics</h4>
                    <p>See events tracked live in your browser console and Mixpanel project</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Feature Flags</h4>
                    <p>Experience dynamic content and A/B testing in action</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Session Replay</h4>
                    <p>Watch recorded user sessions to understand behavior patterns</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}