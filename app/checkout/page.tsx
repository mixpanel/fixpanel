"use client";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import {
  ShoppingCartIcon,
  CreditCardIcon,
  TruckIcon,
  StarIcon
} from "lucide-react";

export default function CheckoutHomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-[#07B096] text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                  ShopFlow
                </h1>
                <p className="mx-auto max-w-[700px] text-xl md:text-2xl">
                  Ecommerce Demo - Product Discovery, Cart Optimization & Checkout Analytics
                </p>
              </div>
              <div className="space-y-2">
                <Button size="lg" className="bg-white text-[#07B096] hover:bg-white/90">
                  <ShoppingCartIcon className="mr-2 h-4 w-4" />
                  Start Shopping
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
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#07B096]">
                  Coming Soon
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  This ecommerce demo will showcase Mixpanel's capabilities in product analytics, conversion optimization, and customer journey tracking.
                </p>
              </div>

              <div className="grid max-w-5xl items-center gap-6 lg:grid-cols-3">
                <div className="flex flex-col items-center space-y-2 border border-[#07B096] p-6 rounded-lg">
                  <ShoppingCartIcon className="h-12 w-12 text-[#07B096]" />
                  <h3 className="text-xl font-bold">Cart Analytics</h3>
                  <p className="text-sm text-gray-500 text-center">
                    Track cart abandonment, optimize checkout flow, and increase conversion rates
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 border border-[#07B096] p-6 rounded-lg">
                  <CreditCardIcon className="h-12 w-12 text-[#07B096]" />
                  <h3 className="text-xl font-bold">Payment Optimization</h3>
                  <p className="text-sm text-gray-500 text-center">
                    A/B test payment methods and reduce checkout friction
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 border border-[#07B096] p-6 rounded-lg">
                  <StarIcon className="h-12 w-12 text-[#07B096]" />
                  <h3 className="text-xl font-bold">Product Recommendations</h3>
                  <p className="text-sm text-gray-500 text-center">
                    Personalized product suggestions based on user behavior
                  </p>
                </div>
              </div>

              <div className="text-sm text-gray-500">
                <p>This demo will include:</p>
                <ul className="mt-2 space-y-1">
                  <li>• Product catalog with search and filtering</li>
                  <li>• Shopping cart with real-time updates</li>
                  <li>• Multi-step checkout process</li>
                  <li>• Payment method selection</li>
                  <li>• Order confirmation and tracking</li>
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