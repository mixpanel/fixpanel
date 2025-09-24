"use client";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import {
  PlayIcon,
  TvIcon,
  HeadphonesIcon,
  TrendingUpIcon
} from "lucide-react";

export default function StreamingHomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-[#CC332B] text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                  StreamVibe
                </h1>
                <p className="mx-auto max-w-[700px] text-xl md:text-2xl">
                  Media & Streaming Demo - Content Engagement, Viewing Patterns & Subscription Analytics
                </p>
              </div>
              <div className="space-y-2">
                <Button size="lg" className="bg-white text-[#CC332B] hover:bg-white/90">
                  <PlayIcon className="mr-2 h-4 w-4" />
                  Start Watching
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Coming Soon Content */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-8 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#CC332B]">
                  Coming Soon
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  This streaming media demo will showcase Mixpanel's capabilities in content analytics, viewer engagement, and subscription optimization.
                </p>
              </div>

              <div className="grid max-w-5xl items-center gap-6 lg:grid-cols-3">
                <div className="flex flex-col items-center space-y-2 border border-[#CC332B] p-6 rounded-lg">
                  <PlayIcon className="h-12 w-12 text-[#CC332B]" />
                  <h3 className="text-xl font-bold">Video Analytics</h3>
                  <p className="text-sm text-gray-500 text-center">
                    Track viewing duration, drop-off points, and engagement metrics
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 border border-[#CC332B] p-6 rounded-lg">
                  <TvIcon className="h-12 w-12 text-[#CC332B]" />
                  <h3 className="text-xl font-bold">Content Recommendations</h3>
                  <p className="text-sm text-gray-500 text-center">
                    Personalized content suggestions based on viewing history
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 border border-[#CC332B] p-6 rounded-lg">
                  <TrendingUpIcon className="h-12 w-12 text-[#CC332B]" />
                  <h3 className="text-xl font-bold">Subscription Insights</h3>
                  <p className="text-sm text-gray-500 text-center">
                    Optimize pricing tiers and reduce churn with behavioral data
                  </p>
                </div>
              </div>

              <div className="text-sm text-gray-500">
                <p>This demo will include:</p>
                <ul className="mt-2 space-y-1">
                  <li>• Video player with engagement tracking</li>
                  <li>• Content library with search and categories</li>
                  <li>• Subscription management interface</li>
                  <li>• User profile and viewing history</li>
                  <li>• Content recommendation engine</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}