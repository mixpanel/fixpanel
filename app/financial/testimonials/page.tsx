"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import fooImage from "../images/foo.png";
import barImage from "../images/bar.png";
import bazImage from "../images/baz.png";
import heroImage from "../images/hero.png";
import themImage from "../images/them.png";

export default function TestimonialsPage() {
  const testimonials = [
    {
      img: fooImage.src,
      name: "Dr. Penny Stocks",
      quote:
        "I turned my pocket lint into a private island with FixPanel’s micro-investing magic—my butler thanks you!",
      border: "border-[#7856FF]",
    },
    {
      img: barImage.src,
      name: "Captain Compound Interest",
      quote:
        "My $5 seed investment grew into a space station! Zero gravity returns never felt so good.",
      border: "border-[#CC332B]",
    },
    {
      img: bazImage.src,
      name: "Ms. Crypto Queen",
      quote:
        "I bought one satoshi and woke up the next day owning half of Bitcoin—and a unicorn ranch!",
      border: "border-[#07B096]",
    },
    {
      img: themImage.src,
      name: "The Invisible Investor",
      quote:
        "FixPanel’s ghost-mode trading made my portfolio invisible to taxes—and visible to glory!",
      border: "border-[#DA6B16]",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-24 bg-[#7856FF] text-white">
          <div className="container px-4 md:px-6 text-center">
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
              Ridiculously Outlandish Testimonials
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl">
              They said it couldn’t be done… until FixPanel made the impossible laughable!
            </p>
          </div>
        </section>

        {/* Testimonials Grid */}
        <section className="w-full py-16 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {testimonials.map((t, idx) => (
                <div
                  key={idx}
                  className={`${t.border} border-2 p-6 rounded-lg flex flex-col items-center space-y-4`}
                >
                  <img
                    src={t.img}
                    alt={t.name}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                  <h3 className="text-lg font-bold">{t.name}</h3>
                  <p className="text-center text-sm text-gray-600 italic">
                    “{t.quote}”
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="w-full py-20 bg-[#07B096] text-white">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Join the Ranks of Legend?
            </h2>
            <p className="mt-3 max-w-xl mx-auto text-lg">
              Sign up now and craft your own epic financial fairytale!
            </p>
            <div className="mt-8">
              <Link href="/signup">
                <Button size="lg" className="bg-white text-[#07B096] hover:bg-white/90">
                  Start Your Saga
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
