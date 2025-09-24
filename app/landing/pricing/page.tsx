"use client";
import { useEffect } from "react";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CreditCardIcon, CheckIcon } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function PricingPage() {
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
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Simple, Translucent Pricing</h1>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Choose the plan that's right for you and start taking control of your finances today.
                </p>
              </div>
            </div>
            <div className="grid max-w-sm items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3 mx-auto mt-8">
              <div className="flex flex-col justify-between p-6 bg-white shadow-lg rounded-lg dark:bg-gray-800">
                <div>
                  <h3 className="text-2xl font-bold text-center">Basic</h3>
                  <div className="mt-4 text-center text-gray-500 dark:text-gray-400">
                    <span className="text-4xl font-bold">$0</span>/ month
                  </div>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <CheckIcon className="text-green-500 mr-2 h-5 w-5" />
                      Basic budgeting tools
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="text-green-500 mr-2 h-5 w-5" />
                      Expense tracking
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="text-green-500 mr-2 h-5 w-5" />
                      Limited transaction history
                    </li>
                  </ul>
                </div>
                <Button id="getStarted" className="mt-6">Get Started</Button>
              </div>
              <div className="flex flex-col justify-between p-6 bg-white shadow-lg rounded-lg dark:bg-gray-800 border-2 border-primary">
                <div>
                  <h3 className="text-2xl font-bold text-center">Pro</h3>
                  <div className="mt-4 text-center text-gray-500 dark:text-gray-400">
                    <span className="text-4xl font-bold">$9.99</span>/ month
                  </div>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <CheckIcon className="text-green-500 mr-2 h-5 w-5" />
                      Advanced budgeting tools
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="text-green-500 mr-2 h-5 w-5" />
                      Bill management
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="text-green-500 mr-2 h-5 w-5" />
                      Investment tracking
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="text-green-500 mr-2 h-5 w-5" />
                      Unlimited transaction history
                    </li>
                  </ul>
                </div>
                <Button id="trial" className="mt-6">Start Free Trial</Button>
              </div>
              <div className="flex flex-col justify-between p-6 bg-white shadow-lg rounded-lg dark:bg-gray-800">
                <div>
                  <h3 className="text-2xl font-bold text-center">Enterprise</h3>
                  <div className="mt-4 text-center text-gray-500 dark:text-gray-400">
                    <span className="text-4xl font-bold">Custom</span> pricing
                  </div>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <CheckIcon className="text-green-500 mr-2 h-5 w-5" />
                      All Pro features
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="text-green-500 mr-2 h-5 w-5" />
                      Dedicated account manager
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="text-green-500 mr-2 h-5 w-5" />
                      Custom integrations
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="text-green-500 mr-2 h-5 w-5" />
                      Priority support
                    </li>
                  </ul>
                </div>
                <Button id="contactSales" className="mt-6">Contact Sales</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
