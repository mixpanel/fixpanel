"use client";

import { useState, useEffect, useMemo } from "react";
// import { btnTrack, pageTrack } from "../components/Track";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Modal } from "@/components/Modal";
// import mixpanel from "mixpanel-browser";
type Variant = "A" | "B" | "C" | "Control";
import mixpanel from "mixpanel-browser";
import { initMixpanel } from "../lib/utils";

import {
  ChartBarIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  RocketIcon,
  TrophyIcon,
  SparklesIcon,
  CookieIcon,
  GemIcon,
  WalletIcon,
  FlagIcon,
} from "lucide-react";

import fooImage from "./images/foo.png";
import barImage from "./images/bar.png";
import bazImage from "./images/baz.png";
import heroImage from "./images/hero.png";
import themImage from "./images/them.png";
import React from "react";

export default function HomePage() {
  const [fortune, setFortune] = useState("");
  const [tagline, setTagline] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [variant, setVariant] = useState<Variant | null>(null);

  const fortunes = [
    "Smart budgeting today leads to a wealthier tomorrow.",
    "Your financial insight will unlock unexpected prosperity.",
    "A well-placed investment is on the horizon—stay sharp!",
    "New financial opportunities will bring long-term rewards.",
    "Your careful analysis will soon lead to significant savings.",
  ];

  //   FEATURE FLAGS ORCHESTRATOR
  useEffect(() => {
    initMixpanel()
      .then(() => mixpanel.flags.get_feature_data("rice_food"))
      .then((flagData) => {
        console.log("Mixpanel flags data:", flagData);
        setVariant(flagData as Variant);
      })
      .catch((err) => {
        console.error("Mixpanel flags error:", err);
        setVariant("Control");
      });
  }, []);

  //   FEATURE FLAG DATA
  const modalConfig = useMemo(() => {
    switch (variant) {
      case "A":
        return {
          headline: "“FixPanel Supercharged My Savings!”",
          tagline: "— Sarah L., Small Business Owner",
          copy: "“Thanks to FixPanel’s automated insights, I uncovered $15K in wasted fees last quarter. My bottom line has never looked better.”",
          color: "#1C782D", // deep green border
          bgColor: "#E6F9F0", // very light mint
          copyColor: "#0F2D13", // dark forest text
          cancelText: "Not Now",
          confirmText: "Read Sarah’s Story",
          imgUrl: "/testimonials/sarah.jpg",
        };

      case "B":
        return {
          headline: "“Investment ROI: 3× in 90 Days”",
          tagline: "— Marco P., Freelance Designer",
          copy: "“I was skeptical, but FixPanel’s data-driven portfolio suggestions tripled my returns in under three months.”",
          color: "#7856FF", // purple
          bgColor: "#F3E8FF", // lavender wash
          copyColor: "#2E004E", // deep purple text
          cancelText: "Maybe Later",
          confirmText: "See Marco’s Portfolio",
          imgUrl: "/testimonials/marco.jpg",
        };

      case "C":
        return {
          headline: "“Zero Debt in 6 Months”",
          tagline: "— Priya S., Marketing Manager",
          copy: "“With FixPanel’s budgeting wizard, I paid off $23K in credit-card debt faster than I ever thought possible.”",
          color: "#CC332B", // red
          bgColor: "#FFEFEF", // blush pink
          copyColor: "#3C0F0A", // dark burgundy text
          cancelText: "Decline",
          confirmText: "Learn Priya’s Plan",
          imgUrl: "/testimonials/priya.jpg",
        };

      default:
        // Control
        return {
          headline: "“Join Thousands of Success Stories”",
          tagline: "— Our Community",
          copy: "“From debt payoff to wealth building, FixPanel’s users are achieving their financial goals at record speed.”",
          color: "#07B096", // teal
          bgColor: "#E8FBF7", // seafoam
          copyColor: "#00332E", // dark teal text
          cancelText: "Dismiss",
          confirmText: "Explore Testimonials",
          imgUrl: "/testimonials/group.jpg",
        };
    }
  }, [variant]);

  useEffect(() => {
    const taglines = [
      "Fix Your Finances with Data-Driven Insights.",
      "Track Every Dollar, Analyze Every Decision",
      "Your Money, Our Insights, Joint control of Financial Flows.",
      "Credit Lines as a financial Retention Strategy",
      "Convert your Savings into Investments",
    ];

    const getTagline = () => {
      const randomTagline = taglines[Math.floor(Math.random() * taglines.length)];
      setTagline(randomTagline);
    };
    getTagline();
  }, []);

  const getFinancialFortune = () => {
    const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    setFortune(randomFortune);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-[#7856FF] text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                  Welcome to FixPanel
                </h1>
                <p className="mx-auto max-w-[700px] text-xl md:text-2xl">{tagline}</p>
              </div>
              <div className="space-y-2">
                <Link href="/signup" className="pr-10">
                  <Button
                    size="lg"
                    className="bg-white text-[#7856FF]  hover:bg-white/20 hover:text-black"
                    // onClick={btnTrack}
                    id="getStarted"
                  >
                    <GemIcon className="pr-2" />
                    Get Started
                  </Button>
                </Link>
                <Link href="/login" className="">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white text-[#1c782d] hover:bg-white/20"
                    // onClick={btnTrack}
                    id="memberLogin"
                  >
                    <WalletIcon className="pr-2" />
                    Member Login
                  </Button>
                </Link>
              </div>
              <div>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white text-[#CC332B] hover:bg-white/20"                 
                  onClick={() => setIsModalOpen(true)}
                >
                  <FlagIcon className="pr-2" />
                  Customer Stories
                </Button>

                {/* Modal */}
                {isModalOpen && (
                  <Modal
				  	{...modalConfig}                    
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={() => {
                      window.location.href = "/products";
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#7856FF]">
                  Our Signature Features
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Prepare to have your mind blown by our totally real and not-at-all exaggerated capabilities!
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border border-[#7856FF] p-6 rounded-lg">
                <ChartBarIcon className="h-12 w-12 text-[#7856FF]" />
                <h3 className="text-xl font-bold">Money Multiplication</h3>
                <p className="text-sm text-gray-500 text-center">
                  Our patented technology turns cents into dollars. It's like magic, but with more spreadsheets.
                </p>
                <Link href="/products">
                  <Button id="explore" variant="outline" className="mt-4">
                    Explore Products
                  </Button>
                </Link>
              </div>
              <div className="flex flex-col items-center space-y-2 border border-[#CC332B] p-6 rounded-lg">
                <ShieldCheckIcon className="h-12 w-12 text-[#CC332B]" />
                <h3 className="text-xl font-bold">Enterprise Security</h3>
                <p className="text-sm text-gray-500 text-center">
                  We guard your money like it's ours. You'll always be able to see it... and we're not giving it back!
                </p>
                <Link href="/features">
                  <Button id="learnMore" variant="outline" className="mt-4">
                    Learn More
                  </Button>
                </Link>
              </div>
              <div className="flex flex-col items-center space-y-2 border border-[#07B096] p-6 rounded-lg">
                <CreditCardIcon className="h-12 w-12 text-[#07B096]" />
                <h3 className="text-xl font-bold">Magical Credit Cards</h3>
                <p className="text-sm text-gray-500 text-center">
                  Swipe right to make purchases, swipe left to make debt disappear! It's that easy... or is it?
                </p>
                <Link href="/signup">
                  <Button id="findOut" variant="outline" className="mt-4">
                    Find Out
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-[#07B096] text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Why FixPanel? Why Not FixPanel!</h2>
                <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  You don't need to take our word for it; here are some completely unbiased and totally real customer
                  testimonials!
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 bg-white text-gray-800 p-6 rounded-lg">
                <img src={fooImage.src} alt="Happy Customer" className="rounded-full" />
                <h3 className="text-xl font-bold">My Aunt Sue</h3>
                <p className="text-sm text-gray-500 text-center italic">
                  "FixPanel is so good, I'm considering using it because my nephew worked really hard on it and I'd like
                  to support him, but honestly I'm not sure."
                </p>
                <Link href="/signup">
                  <Button id="joinSue" className="mt-4 bg-[#07B096] text-white hover:bg-[#07B096]/90">
                    Join Sue
                  </Button>
                </Link>
              </div>
              <div className="flex flex-col items-center space-y-2 bg-white text-gray-800 p-6 rounded-lg">
                <img src={barImage.src} alt="Satisfied Customer" className="rounded-full" />
                <h3 className="text-xl font-bold">My Neighbor's Cat</h3>
                <p className="text-sm text-gray-500 text-center italic">
                  "Meow meow meow. Hiss. Hiss. (Translation: My returns are purrfect thanks to FixPanel! I wish I'd
                  invested sooner.)"
                </p>
                <Link href="/products">
                  <Button id="purrfectReturns" className="mt-4 bg-[#07B096] text-white hover:bg-[#07B096]/90">
                    Get Purrfect Returns
                  </Button>
                </Link>
              </div>
              <div className="flex flex-col items-center space-y-2 bg-white text-gray-800 p-6 rounded-lg">
                <img src={bazImage.src} alt="Ecstatic Customer" className="rounded-full" />
                <h3 className="text-xl font-bold">Your Future Self</h3>
                <p className="text-sm text-gray-500 text-center italic">
                  "Thank you, past me, for choosing FixPanel! I'm now writing this from my private island! You made some
                  good choices,"
                </p>
                <Link href="/signup">
                  <Button id="secureIsland" className="mt-4 bg-[#07B096] text-white hover:bg-[#07B096]/90">
                    Secure Your Island
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-[#DA6B16] text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Our Totally Legit Achievements</h2>
                <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We've won so many awards, we had to buy a bigger trophy cabinet!
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-4">
              <div className="flex flex-col items-center space-y-2 p-4 rounded-lg">
                <RocketIcon className="h-12 w-12" />
                <h3 className="text-xl font-bold">#1 Fastest Growing</h3>
                <p className="text-sm text-center">Imagine if Usain Bolt was a finance company. That's us!</p>
              </div>
              <div className="flex flex-col items-center space-y-2 p-4 rounded-lg">
                <TrophyIcon className="h-12 w-12" />
                <h3 className="text-xl font-bold">Best in Show</h3>
                <p className="text-sm text-center">We even beat out that really cute poodle!</p>
              </div>
              <div className="flex flex-col items-center space-y-2 p-4 rounded-lg">
                <SparklesIcon className="h-12 w-12" />
                <h3 className="text-xl font-bold">Most Dazzling</h3>
                <p className="text-sm text-center">Our financial reports are so bright, they come with sunglasses!</p>
              </div>
              <div className="flex flex-col items-center space-y-2 p-4 rounded-lg">
                <CreditCardIcon className="h-12 w-12" />
                <h3 className="text-xl font-bold">Coolest Credit Cards</h3>
                <p className="text-sm text-center">They're made of solid gold... or at least gold-colored plastic!</p>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <Link href="/about">
                <Button id="greatness" size="lg" className="bg-white text-[#DA6B16] hover:bg-gray-100">
                  Discover Our Greatness
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-[#CC332B] text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Your Financial Fortune Awaits!</h2>
                <p className="max-w-[600px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Crack open a virtual fortune cookie and glimpse your prosperous future!
                </p>
              </div>
              <img src={heroImage.src} alt="busy working" height="100" className="rounded-none" />
              <div className="w-full max-w-sm space-y-2">
                <Button
                  id="financialFortune"
                  onClick={(e) => {
                    getFinancialFortune();
                    // btnTrack(e);
                  }}
                  className="w-full bg-white text-[#CC332B] hover:bg-gray-100"
                >
                  <CookieIcon className="mr-2 h-4 w-4" />
                  Get Your Financial Fortune
                </Button>
                {fortune && (
                  <div className="p-4 bg-white text-[#CC332B] rounded-lg mt-4">
                    <p className="italic text-4xl">{fortune}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-[#7856FF]">
                  Ready to Join the Financial Elite?
                </h2>
                <div className="flex justify-center mt-8 relative w-full" style={{ height: "400px" }}>
                  <img
                    src={themImage.src}
                    alt="interesting things"
                    style={{ height: "100%" }}
                    className="rounded-none"
                  />
                </div>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Don't let your money sit there like a couch potato. It's time to make it work harder than a
                  caffeinated squirrel!
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2 p-5">
                <form className="flex space-x-2">
                  <Input className="max-w-lg flex-1" placeholder="" type="email" />
                  <Button id="subscribe" type="submit" className="bg-[#7856FF] text-white hover:bg-[#7856FF]/90">
                    Subscribe
                  </Button>
                </form>
                <p className="text-xs text-gray-500 p-5">
                  Sign up now and get a free financial fortune cookie!
                  <Link className="underline underline-offset-2 ml-1" href="#">
                    Terms & Conditions apply
                  </Link>
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link href="/signup">
                  <Button id="journey" size="lg" className="bg-[#07B096] text-white hover:bg-[#07B096]/90">
                    Start Your Journey
                  </Button>
                </Link>
                <Link href="/products">
                  <Button
                    // onClick={btnTrack}
                    id="exploreProducts"
                    size="lg"
                    variant="outline"
                    className="border-[#07B096] text-[#07B096] hover:bg-[#07B096]/10"
                  >
                    Explore Our Products
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </div>
  );
}
