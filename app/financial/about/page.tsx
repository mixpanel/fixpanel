"use client"

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CreditCardIcon, Users2Icon, TrendingUpIcon, ShieldCheckIcon } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function AboutPage() {
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
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">About FixPanel</h1>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Empowering individuals and businesses to achieve financial success through innovative technology.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <img
                alt="Team meeting"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                height="310"
                src="/skills.png?height=310&width=550"
                width="550"
              />
              <div className="flex flex-col justify-center space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Our Mission</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  At FixPanel, we believe that financial freedom should be accessible to everyone. Our mission is to
                  provide cutting-edge financial tools and insights that empower individuals and businesses to make
                  informed decisions, achieve their financial goals, and secure their financial future.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <Users2Icon className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">10,000+ Users</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Trusted by thousands of individuals and businesses worldwide.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <TrendingUpIcon className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">$1B+ Managed</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Helping our users manage and grow their wealth effectively.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <ShieldCheckIcon className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Bank-Grade Security</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Your financial data is protected with state-of-the-art encryption.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <Link href="/signup">
                <Button size="lg" id="join">Join FixPanel Today</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
