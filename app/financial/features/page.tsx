"use client";

import { useEffect } from "react";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CreditCardIcon, PieChartIcon, BellIcon, LockIcon, TrendingUpIcon, HeadphonesIcon } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function FeaturesPage() {
  useEffect(() => {
  }, []);
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Powerful Features for Your Finances</h1>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Discover how FixPanel can revolutionize your financial management with our cutting-edge features.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <PieChartIcon className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Smart Budgeting</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Create custom budgets that adapt to your spending habits and financial goals.
                </p>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <BellIcon className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Real-time Alerts</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Stay on top of your finances with instant notifications for transactions and bill reminders.
                </p>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <LockIcon className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Bank-level Security</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Rest easy knowing your financial data is protected with state-of-the-art encryption.
                </p>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <TrendingUpIcon className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Investment Tracking</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Monitor your investments in real-time and get insights to optimize your portfolio.
                </p>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <CreditCardIcon className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Bill Management</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Never miss a payment with our automated bill tracking and payment system.
                </p>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <HeadphonesIcon className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">24/7 Support</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Get help whenever you need it with our round-the-clock customer support team.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <Link href="/signup">
                <Button size="lg" id="trial">Start Your Free Trial</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
