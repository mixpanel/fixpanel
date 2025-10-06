"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import {
  UsersIcon,
  ShieldCheckIcon,
  MailIcon,
  SmartphoneIcon,
  AwardIcon,
  TrendingUpIcon,
  LockIcon,
  BarChartIcon,
} from "lucide-react";

export default function AdminLanding() {
  useEffect(() => {
    document.title = "youAdmin";
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-20 lg:py-28 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                  youAdmin
                </h1>
                <p className="mx-auto max-w-[800px] text-xl md:text-2xl text-slate-200">
                  The unified platform for People Operations, IT Management, and Identity Access Control
                </p>
                <p className="mx-auto max-w-[600px] text-lg text-slate-300">
                  Manage your entire organization from one powerful dashboard
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/admin/login">
                  <Button
                    size="lg"
                    className="bg-blue-600 text-white hover:bg-blue-700"
                    id="adminSignIn"
                    onClick={() => {
                      if (typeof window !== "undefined" && window.mixpanel) {
                        window.mixpanel.track("Admin Landing CTA Clicked", {
                          cta: "Sign In",
                          location: "hero",
                        });
                      }
                    }}
                  >
                    <LockIcon className="mr-2 h-5 w-5" />
                    Admin Sign In
                  </Button>
                </Link>
                <Link href="/admin/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white text-blue-900 border-blue-200 hover:bg-slate-100"
                    id="requestDemo"
                    onClick={() => {
                      if (typeof window !== "undefined" && window.mixpanel) {
                        window.mixpanel.track("Admin Landing CTA Clicked", {
                          cta: "Request Demo",
                          location: "hero",
                        });
                      }
                    }}
                  >
                    Request Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="w-full py-16 md:py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-slate-900">
                  Everything You Need to Run Your Organization
                </h2>
                <p className="max-w-[900px] text-slate-600 md:text-xl/relaxed">
                  From onboarding to offboarding, and everything in between
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2 xl:grid-cols-3">
              {/* People Management */}
              <div className="flex flex-col items-start space-y-3 border border-slate-200 p-6 rounded-lg hover:shadow-lg transition-shadow bg-white">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <UsersIcon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">People Management</h3>
                <p className="text-sm text-slate-600">
                  Comprehensive employee profiles, org charts, and team structures. Track performance, growth, and engagement all in one place.
                </p>
              </div>

              {/* Identity Provider */}
              <div className="flex flex-col items-start space-y-3 border border-slate-200 p-6 rounded-lg hover:shadow-lg transition-shadow bg-white">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <ShieldCheckIcon className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Identity & Access Control</h3>
                <p className="text-sm text-slate-600">
                  Enterprise SSO, role-based access, and granular permissions. Provision and deprovision users across your entire tech stack instantly.
                </p>
              </div>

              {/* Mobile Device Management */}
              <div className="flex flex-col items-start space-y-3 border border-slate-200 p-6 rounded-lg hover:shadow-lg transition-shadow bg-white">
                <div className="p-3 bg-green-100 rounded-lg">
                  <SmartphoneIcon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Mobile Device Management</h3>
                <p className="text-sm text-slate-600">
                  Secure company devices, enforce policies, and remotely manage laptops, phones, and tablets across your organization.
                </p>
              </div>

              {/* Email & Collaboration */}
              <div className="flex flex-col items-start space-y-3 border border-slate-200 p-6 rounded-lg hover:shadow-lg transition-shadow bg-white">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <MailIcon className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Email & Collaboration Setup</h3>
                <p className="text-sm text-slate-600">
                  Automated email provisioning, shared calendars, distribution lists, and team collaboration spaces.
                </p>
              </div>

              {/* Performance & Recognition */}
              <div className="flex flex-col items-start space-y-3 border border-slate-200 p-6 rounded-lg hover:shadow-lg transition-shadow bg-white">
                <div className="p-3 bg-pink-100 rounded-lg">
                  <AwardIcon className="h-8 w-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Performance & Recognition</h3>
                <p className="text-sm text-slate-600">
                  360° reviews, goal tracking, peer recognition, and growth cycle management. Build a culture of continuous feedback.
                </p>
              </div>

              {/* Analytics & Insights */}
              <div className="flex flex-col items-start space-y-3 border border-slate-200 p-6 rounded-lg hover:shadow-lg transition-shadow bg-white">
                <div className="p-3 bg-cyan-100 rounded-lg">
                  <BarChartIcon className="h-8 w-8 text-cyan-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Analytics & Reporting</h3>
                <p className="text-sm text-slate-600">
                  Real-time dashboards showing service usage, access patterns, compliance status, and organizational health metrics.
                </p>
              </div>
            </div>

            <div className="flex justify-center mt-12">
              <Link href="/admin/login">
                <Button
                  size="lg"
                  className="bg-blue-600 text-white hover:bg-blue-700"
                  id="getStarted"
                  onClick={() => {
                    if (typeof window !== "undefined" && window.mixpanel) {
                      window.mixpanel.track("Admin Landing CTA Clicked", {
                        cta: "Get Started",
                        location: "features",
                      });
                    }
                  }}
                >
                  Get Started with youAdmin
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-16 bg-slate-900 text-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-4 text-center">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-blue-400">15,000+</div>
                <div className="text-slate-300">Companies Trust Us</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-green-400">99.99%</div>
                <div className="text-slate-300">Uptime SLA</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-purple-400">2.5M+</div>
                <div className="text-slate-300">Users Managed</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-orange-400">500+</div>
                <div className="text-slate-300">Integrations</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-16 md:py-24 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Transform Your Operations?
                </h2>
                <p className="mx-auto max-w-[600px] text-lg text-blue-100">
                  Join thousands of companies streamlining their people and IT management with youAdmin
                </p>
              </div>
              <Link href="/admin/login">
                <Button
                  size="lg"
                  className="bg-white text-blue-900 hover:bg-slate-100"
                  id="startTrial"
                  onClick={() => {
                    if (typeof window !== "undefined" && window.mixpanel) {
                      window.mixpanel.track("Admin Landing CTA Clicked", {
                        cta: "Start Free Trial",
                        location: "bottom_cta",
                      });
                    }
                  }}
                >
                  Start Your Free Trial
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
