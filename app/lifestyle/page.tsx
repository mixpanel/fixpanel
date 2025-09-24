"use client";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import {
  SmartphoneIcon,
  HeartIcon,
  Calendar,
  TrendingUpIcon
} from "lucide-react";

export default function LifestyleHomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-[#1C782D] text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                  LifeStyle+
                </h1>
                <p className="mx-auto max-w-[700px] text-xl md:text-2xl">
                  Subscription & Lifestyle Demo - Consumer Engagement, Retention & Subscription Analytics
                </p>
              </div>
              <div className="space-y-2">
                <Button size="lg" className="bg-white text-[#1C782D] hover:bg-white/90">
                  <SmartphoneIcon className="mr-2 h-4 w-4" />
                  Get Started
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
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#1C782D]">
                  Coming Soon
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  This lifestyle subscription demo will showcase Mixpanel's capabilities in consumer app analytics, subscription management, and retention optimization.
                </p>
              </div>

              <div className="grid max-w-5xl items-center gap-6 lg:grid-cols-3">
                <div className="flex flex-col items-center space-y-2 border border-[#1C782D] p-6 rounded-lg">
                  <HeartIcon className="h-12 w-12 text-[#1C782D]" />
                  <h3 className="text-xl font-bold">Wellness Tracking</h3>
                  <p className="text-sm text-gray-500 text-center">
                    Monitor user engagement with health and wellness features
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 border border-[#1C782D] p-6 rounded-lg">
                  <Calendar className="h-12 w-12 text-[#1C782D]" />
                  <h3 className="text-xl font-bold">Subscription Management</h3>
                  <p className="text-sm text-gray-500 text-center">
                    Optimize pricing tiers and reduce subscription churn
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 border border-[#1C782D] p-6 rounded-lg">
                  <TrendingUpIcon className="h-12 w-12 text-[#1C782D]" />
                  <h3 className="text-xl font-bold">Personalization</h3>
                  <p className="text-sm text-gray-500 text-center">
                    Deliver personalized content and recommendations
                  </p>
                </div>
              </div>

              <div className="text-sm text-gray-500">
                <p>This demo will include:</p>
                <ul className="mt-2 space-y-1">
                  <li>• Personal dashboard with activity tracking</li>
                  <li>• Subscription plans and billing management</li>
                  <li>• Goal setting and progress tracking</li>
                  <li>• Social features and community engagement</li>
                  <li>• Personalized content recommendations</li>
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