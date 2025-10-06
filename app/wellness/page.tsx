"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import {
  HeartIcon,
  ThumbsUpIcon,
  MessagesSquareIcon,
  BrainIcon,
  TrendingUpIcon,
  UsersIcon,
  SparklesIcon,
} from "lucide-react";

export default function WellnessLanding() {
  useEffect(() => {
    document.title = "ourHeart";
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-20 lg:py-28 bg-gradient-to-br from-teal-600 via-emerald-600 to-teal-700 text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="space-y-4">
                <div className="flex justify-center">
                  <HeartIcon className="h-20 w-20 mb-4" />
                </div>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                  ourHeart
                </h1>
                <p className="mx-auto max-w-[800px] text-xl md:text-2xl text-teal-50">
                  Crowdsourced Medical Wisdom + AI Doctor
                </p>
                <p className="mx-auto max-w-[600px] text-lg text-teal-100">
                  Because who needs medical school when you have the internet?
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/wellness/submit">
                  <Button
                    size="lg"
                    className="bg-white text-teal-700 hover:bg-teal-50"
                    onClick={() => {
                      if (typeof window !== "undefined" && window.mixpanel) {
                        window.mixpanel.track("Wellness CTA Clicked", { cta: "Post Symptoms", location: "hero" });
                      }
                    }}
                  >
                    <MessagesSquareIcon className="mr-2 h-5 w-5" />
                    Post Your Symptoms
                  </Button>
                </Link>
                <Link href="/wellness/chat">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-teal-700"
                    onClick={() => {
                      if (typeof window !== "undefined" && window.mixpanel) {
                        window.mixpanel.track("Wellness CTA Clicked", { cta: "AI Doctor", location: "hero" });
                      }
                    }}
                  >
                    <BrainIcon className="mr-2 h-5 w-5" />
                    Chat with AI Doctor
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="w-full py-16 md:py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-slate-900">
                  How ourHeart Works
                </h2>
                <p className="max-w-[900px] text-slate-600 md:text-xl/relaxed">
                  Democratizing medical diagnoses, one vote at a time
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3">
              {/* Post Symptoms */}
              <div className="flex flex-col items-center space-y-3 border-2 border-teal-200 p-8 rounded-lg hover:shadow-xl transition-shadow bg-teal-50">
                <div className="p-4 bg-teal-600 rounded-full">
                  <MessagesSquareIcon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">1. Post Symptoms</h3>
                <p className="text-slate-600 text-center">
                  Describe what's bothering you. Anonymously, of course. We don't judge... much.
                </p>
              </div>

              {/* Community Votes */}
              <div className="flex flex-col items-center space-y-3 border-2 border-emerald-200 p-8 rounded-lg hover:shadow-xl transition-shadow bg-emerald-50">
                <div className="p-4 bg-emerald-600 rounded-full">
                  <ThumbsUpIcon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">2. Community Votes</h3>
                <p className="text-slate-600 text-center">
                  Random internet strangers vote on what they think is wrong. Democracy in action!
                </p>
              </div>

              {/* Get Results */}
              <div className="flex flex-col items-center space-y-3 border-2 border-cyan-200 p-8 rounded-lg hover:shadow-xl transition-shadow bg-cyan-50">
                <div className="p-4 bg-cyan-600 rounded-full">
                  <SparklesIcon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">3. Get Results</h3>
                <p className="text-slate-600 text-center">
                  Receive your crowdsourced diagnosis! (Please still see a real doctor.)
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="w-full py-16 md:py-24 bg-gradient-to-b from-teal-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* AI Doctor Chat */}
              <div className="bg-white rounded-lg border-2 border-teal-200 p-8 hover:shadow-xl transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <BrainIcon className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">AI Medical Assistant</h3>
                    <p className="text-slate-600 mb-4">
                      Chat with our AI doctor that's been trained on... well, we're not quite sure, but it sounds convincing! Share your diagnosis with the community for peer review.
                    </p>
                    <Link href="/wellness/chat">
                      <Button className="bg-purple-600 text-white hover:bg-purple-700">
                        Start AI Chat
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Vote on Cases */}
              <div className="bg-white rounded-lg border-2 border-emerald-200 p-8 hover:shadow-xl transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <UsersIcon className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">Vote on Cases</h3>
                    <p className="text-slate-600 mb-4">
                      Think you know better? Vote on other people's symptoms and watch your accuracy score... probably go down. But hey, it's fun!
                    </p>
                    <Link href="/wellness/vote">
                      <Button className="bg-orange-600 text-white hover:bg-orange-700">
                        Start Voting
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-16 bg-slate-900 text-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-4 text-center">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-teal-400">12,847</div>
                <div className="text-slate-300">Cases Submitted</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-emerald-400">89,234</div>
                <div className="text-slate-300">Votes Cast</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-cyan-400">47%</div>
                <div className="text-slate-300">Accuracy Rate</div>
                <div className="text-xs text-slate-400">(Unverified)</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-purple-400">0</div>
                <div className="text-slate-300">Medical Degrees</div>
                <div className="text-xs text-slate-400">(But who's counting?)</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-16 md:py-24 bg-gradient-to-br from-teal-600 to-emerald-600 text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Get... Diagnosed?
                </h2>
                <p className="mx-auto max-w-[600px] text-lg text-teal-50">
                  Join thousands of people who definitely should have gone to a real doctor but came here instead!
                </p>
                <p className="text-sm text-teal-100 italic">
                  * ourHeart is for entertainment purposes only. Seriously, please see a real doctor.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/wellness/submit">
                  <Button
                    size="lg"
                    className="bg-white text-teal-700 hover:bg-teal-50"
                    onClick={() => {
                      if (typeof window !== "undefined" && window.mixpanel) {
                        window.mixpanel.track("Wellness CTA Clicked", {
                          cta: "Get Started",
                          location: "bottom_cta",
                        });
                      }
                    }}
                  >
                    Get Started
                  </Button>
                </Link>
                <Link href="/wellness/vote">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-teal-700"
                    onClick={() => {
                      if (typeof window !== "undefined" && window.mixpanel) {
                        window.mixpanel.track("Wellness CTA Clicked", {
                          cta: "Start Voting",
                          location: "bottom_cta",
                        });
                      }
                    }}
                  >
                    Start Voting
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
