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
  SmartphoneIcon,
  HeartIcon
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-6 md:py-10 lg:py-12 bg-[#7856FF] text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Demo Scenarios
                </h1>
                <p className="mx-auto max-w-[700px] text-lg md:text-xl">
                  try autocapture, session replay, feature flags, and other fantastic tools across different industries and use cases!
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
                  Each demo showcases Mixpanel's capabilities in a realistic industry context
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-6xl items-stretch gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {/* Financial Services */}
              <div className="flex flex-col items-center space-y-3 border border-[#7856FF] p-6 rounded-lg hover:shadow-lg transition-shadow">
                <CreditCardIcon className="h-16 w-16 text-[#7856FF]" />
                <h3 className="text-2xl font-bold">Financial Services</h3>
                <p className="text-sm text-gray-500 text-center flex-1">
                  traditional marketing landing for fintech with an experiment on customer testimonials!
                </p>
                <Link href="/financial" className="w-full">
                  <Button className="w-full bg-[#7856FF] text-white hover:bg-[#7856FF]/90">
                    Explore FixPanel
                  </Button>
                </Link>
              </div>

              {/* Ecommerce */}
              <div className="flex flex-col items-center space-y-3 border border-[#07B096] p-6 rounded-lg hover:shadow-lg transition-shadow">
                <ShoppingCartIcon className="h-16 w-16 text-[#07B096]" />
                <h3 className="text-2xl font-bold">Ecommerce + Checkout</h3>
                <p className="text-sm text-gray-500 text-center flex-1">
                  classic e-commerce checkout flow with coupon friction!
                </p>
                <Link href="/checkout" className="w-full">
                  <Button className="w-full bg-[#07B096] text-white hover:bg-[#07B096]/90">
                    Explore CheapStuff
                  </Button>
                </Link>
              </div>

              {/* Media & Streaming */}
              <div className="flex flex-col items-center space-y-3 border border-[#CC332B] p-6 rounded-lg hover:shadow-lg transition-shadow">
                <PlayIcon className="h-16 w-16 text-[#CC332B]" />
                <h3 className="text-2xl font-bold">Media + Streaming</h3>
                <p className="text-sm text-gray-500 text-center flex-1">
                  video streaming with dynamic content and personalized recommendations with issues in the subscription flow!
                </p>
                <Link href="/streaming" className="w-full">
                  <Button className="w-full bg-[#CC332B] text-white hover:bg-[#CC332B]/90">
                    Explore meTube
                  </Button>
                </Link>
              </div>

              {/* SaaS B2B - INACTIVE */}
              <div className="flex flex-col items-center space-y-3 border border-gray-300 p-6 rounded-lg opacity-60">
                <BuildingIcon className="h-16 w-16 text-gray-400" />
                <h3 className="text-2xl font-bold text-gray-600">SaaS + Admin Apps</h3>
                <p className="text-sm text-gray-400 text-center flex-1">
                  B2B admin dashboards, feature adoption, and user journey optimization for business tools
                </p>
                <Button disabled className="w-full bg-gray-300 text-gray-500 cursor-not-allowed">
                  Coming Soon
                </Button>
              </div>

              {/* Healthcare & Wellness - INACTIVE */}
              <div className="flex flex-col items-center space-y-3 border border-gray-300 p-6 rounded-lg opacity-60">
                <HeartIcon className="h-16 w-16 text-gray-400" />
                <h3 className="text-2xl font-bold text-gray-600">Healthcare + Wellness</h3>
                <p className="text-sm text-gray-400 text-center flex-1">
                  Patient engagement, health tracking, and wellness program optimization with privacy-first analytics
                </p>
                <Button disabled className="w-full bg-gray-300 text-gray-500 cursor-not-allowed">
                  Coming Soon
                </Button>
              </div>

              {/* Subscription B2C - INACTIVE */}
              <div className="flex flex-col items-center space-y-3 border border-gray-300 p-6 rounded-lg opacity-60">
                <SmartphoneIcon className="h-16 w-16 text-gray-400" />
                <h3 className="text-2xl font-bold text-gray-600">Subscription + Lifestyle</h3>
                <p className="text-sm text-gray-400 text-center flex-1">
                  Consumer apps, subscription management, and lifestyle product engagement tracking
                </p>
                <Button disabled className="w-full bg-gray-300 text-gray-500 cursor-not-allowed">
                  Coming Soon
                </Button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-8 text-center">
              <div className="max-w-3xl mx-auto">
                <h3 className="text-lg font-semibold text-[#7856FF] mb-3">What You'll Experience</h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
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