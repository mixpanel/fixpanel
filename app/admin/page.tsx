"use client";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import {
  BuildingIcon,
  UsersIcon,
  BarChart3Icon,
  SettingsIcon
} from "lucide-react";

export default function AdminHomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-[#DA6B16] text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                  AdminHub
                </h1>
                <p className="mx-auto max-w-[700px] text-xl md:text-2xl">
                  SaaS B2B Demo - Feature Adoption, User Journeys & Dashboard Analytics
                </p>
              </div>
              <div className="space-y-2">
                <Button size="lg" className="bg-white text-[#DA6B16] hover:bg-white/90">
                  <BuildingIcon className="mr-2 h-4 w-4" />
                  Access Dashboard
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
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#DA6B16]">
                  Coming Soon
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  This SaaS admin demo will showcase Mixpanel's capabilities in B2B product analytics, feature adoption tracking, and user journey optimization.
                </p>
              </div>

              <div className="grid max-w-5xl items-center gap-6 lg:grid-cols-3">
                <div className="flex flex-col items-center space-y-2 border border-[#DA6B16] p-6 rounded-lg">
                  <UsersIcon className="h-12 w-12 text-[#DA6B16]" />
                  <h3 className="text-xl font-bold">User Management</h3>
                  <p className="text-sm text-gray-500 text-center">
                    Track team onboarding, role assignments, and collaboration patterns
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 border border-[#DA6B16] p-6 rounded-lg">
                  <BarChart3Icon className="h-12 w-12 text-[#DA6B16]" />
                  <h3 className="text-xl font-bold">Feature Adoption</h3>
                  <p className="text-sm text-gray-500 text-center">
                    Monitor which features drive engagement and business value
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 border border-[#DA6B16] p-6 rounded-lg">
                  <SettingsIcon className="h-12 w-12 text-[#DA6B16]" />
                  <h3 className="text-xl font-bold">Admin Workflows</h3>
                  <p className="text-sm text-gray-500 text-center">
                    Optimize administrative tasks and reduce time-to-value
                  </p>
                </div>
              </div>

              <div className="text-sm text-gray-500">
                <p>This demo will include:</p>
                <ul className="mt-2 space-y-1">
                  <li>• Organization dashboard with KPIs</li>
                  <li>• User management and permissions</li>
                  <li>• Feature usage analytics</li>
                  <li>• Team collaboration tools</li>
                  <li>• Settings and configuration panels</li>
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