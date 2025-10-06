"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import {
  BookOpenIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MessageSquareIcon,
  TrendingUpIcon,
  BrainIcon,
  FilterIcon,
  PlusIcon,
} from "lucide-react";

// Extensive mock data for posts
const posts = [
  {
    id: 1,
    author: "Sisyphus_Reborn",
    title: "On the Absurdity of Daily Routines",
    content:
      "Every morning I wake up, make coffee, and repeat the same actions. Camus would say we must imagine ourselves happy in this repetition. But what if the coffee maker breaks?",
    upvotes: 847,
    downvotes: 23,
    comments: 156,
    tags: ["absurdism", "daily-life", "camus"],
    postedAt: "3 hours ago",
  },
  {
    id: 2,
    author: "VoidGazer_42",
    title: "The Paradox of Choice in Modern Streaming Services",
    content:
      "I spend more time choosing what to watch than actually watching. Sartre's freedom of choice has become a prison of infinite scrolling. Existence precedes essence, but what if essence is buried under 47 algorithmic recommendations?",
    upvotes: 1234,
    downvotes: 89,
    comments: 234,
    tags: ["existentialism", "modern-life", "sartre"],
    postedAt: "5 hours ago",
  },
  {
    id: 3,
    author: "NietzscheFan_1844",
    title: "Has Anyone Successfully Become the Übermensch?",
    content:
      "Asking for a friend. Also, does binge-watching philosophy videos on YouTube count as self-overcoming?",
    upvotes: 2156,
    downvotes: 234,
    comments: 445,
    tags: ["nietzsche", "humor", "self-improvement"],
    postedAt: "1 day ago",
  },
  {
    id: 4,
    author: "HeideggersHammer",
    title: "Dasein and the Question of Being: A Thread",
    content:
      "Being-in-the-world is not just about existing, it's about authentically engaging with our thrownness. But also, have you ever thought about how weird it is that we exist at all?",
    upvotes: 956,
    downvotes: 67,
    comments: 178,
    tags: ["heidegger", "ontology", "existentialism"],
    postedAt: "2 days ago",
  },
  {
    id: 5,
    author: "CamusTheAbsurdHero",
    title: "Is Sisyphus Happy or Just Coping?",
    content:
      "We're told to imagine Sisyphus happy, eternally pushing that boulder. But maybe he's just in denial. Maybe he needs therapy, not philosophical reframing.",
    upvotes: 1789,
    downvotes: 123,
    comments: 367,
    tags: ["camus", "absurdism", "mental-health"],
    postedAt: "3 days ago",
  },
  {
    id: 6,
    author: "Kierkegaard_Anxiety",
    title: "The Dizzying Freedom of Ordering Food Delivery",
    content:
      "The paradox: I have absolute freedom to choose any cuisine, yet this very freedom paralyzes me. I am anxious before my possibilities. Also, should I get Thai or Mexican?",
    upvotes: 1456,
    downvotes: 45,
    comments: 289,
    tags: ["kierkegaard", "anxiety", "modern-dilemmas"],
    postedAt: "4 days ago",
  },
  {
    id: 7,
    author: "Sartre_In_The_Cafe",
    title: "Hell is Other People's Zoom Meetings",
    content:
      "Sartre said hell is other people. He clearly never had to sit through a meeting that could have been an email. Forced togetherness in digital space is a new level of existential torment.",
    upvotes: 3421,
    downvotes: 67,
    comments: 512,
    tags: ["sartre", "remote-work", "modern-existence"],
    postedAt: "5 days ago",
  },
  {
    id: 8,
    author: "DeBeauvoir_Simone",
    title: "One is Not Born, But Rather Becomes, Burnt Out",
    content:
      "De Beauvoir said one is not born a woman, but becomes one. Similarly, burnout is not innate—it's constructed by late capitalism and the cult of productivity. Discuss.",
    upvotes: 2134,
    downvotes: 198,
    comments: 423,
    tags: ["de-beauvoir", "feminism", "capitalism", "burnout"],
    postedAt: "6 days ago",
  },
];

export default function LifestyleLanding() {
  const [sortBy, setSortBy] = useState<"popular" | "agree" | "disagree">("popular");

  useEffect(() => {
    if (typeof window !== "undefined" && window.mixpanel) {
      window.mixpanel.track("Lifestyle Landing Viewed");
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-zinc-900 text-zinc-100">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-16 md:py-24 bg-gradient-to-b from-zinc-950 to-zinc-900 border-b border-zinc-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="space-y-4">
                <div className="flex justify-center">
                  <BookOpenIcon className="h-16 w-16 text-amber-500" />
                </div>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none text-amber-400">
                  weRead
                </h1>
                <p className="mx-auto max-w-[800px] text-xl md:text-2xl text-zinc-300">
                  A Forum for Existential Inquiry
                </p>
                <p className="mx-auto max-w-[600px] text-lg text-zinc-400 italic">
                  Where philosophy meets the void of modern existence
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/lifestyle/submit">
                  <Button
                    size="lg"
                    className="bg-amber-600 text-zinc-900 hover:bg-amber-500 font-semibold"
                    onClick={() => {
                      if (typeof window !== "undefined" && window.mixpanel) {
                        window.mixpanel.track("Lifestyle CTA Clicked", {
                          cta: "Create Post",
                          location: "hero",
                        });
                      }
                    }}
                  >
                    <PlusIcon className="mr-2 h-5 w-5" />
                    Create Post
                  </Button>
                </Link>
                <Link href="/lifestyle/feed">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-2 border-zinc-700 text-zinc-200 hover:bg-zinc-800"
                  >
                    <BookOpenIcon className="mr-2 h-5 w-5" />
                    Browse Feed
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Sorting Options - The Unique Feature */}
        <section className="w-full py-6 bg-zinc-900 border-b border-zinc-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div>
                <h2 className="text-lg font-semibold text-zinc-200">Sort by Algorithm:</h2>
                <p className="text-sm text-zinc-500">Choose your philosophical filter</p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant={sortBy === "popular" ? "default" : "outline"}
                  className={
                    sortBy === "popular"
                      ? "bg-amber-600 text-zinc-900 hover:bg-amber-500"
                      : "bg-transparent border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                  }
                  onClick={() => {
                    setSortBy("popular");
                    if (typeof window !== "undefined" && window.mixpanel) {
                      window.mixpanel.track("Lifestyle Sort Changed", { sort_type: "popular" });
                    }
                  }}
                >
                  <TrendingUpIcon className="mr-2 h-4 w-4" />
                  Popular
                </Button>
                <Button
                  variant={sortBy === "agree" ? "default" : "outline"}
                  className={
                    sortBy === "agree"
                      ? "bg-green-600 text-white hover:bg-green-500"
                      : "bg-transparent border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                  }
                  onClick={() => {
                    setSortBy("agree");
                    if (typeof window !== "undefined" && window.mixpanel) {
                      window.mixpanel.track("Lifestyle Sort Changed", { sort_type: "agree" });
                    }
                  }}
                >
                  <ArrowUpIcon className="mr-2 h-4 w-4" />
                  Likely to Agree
                </Button>
                <Button
                  variant={sortBy === "disagree" ? "default" : "outline"}
                  className={
                    sortBy === "disagree"
                      ? "bg-red-600 text-white hover:bg-red-500"
                      : "bg-transparent border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                  }
                  onClick={() => {
                    setSortBy("disagree");
                    if (typeof window !== "undefined" && window.mixpanel) {
                      window.mixpanel.track("Lifestyle Sort Changed", { sort_type: "disagree" });
                    }
                  }}
                >
                  <ArrowDownIcon className="mr-2 h-4 w-4" />
                  Likely to Disagree
                </Button>
              </div>
            </div>
            <div className="mt-4 p-4 bg-zinc-800 border border-zinc-700 rounded-lg">
              <p className="text-sm text-zinc-400 italic">
                {sortBy === "popular" && "Showing posts by popularity. The masses have spoken."}
                {sortBy === "agree" &&
                  "Showing posts you're likely to agree with. Stay comfortable in your echo chamber."}
                {sortBy === "disagree" &&
                  "Showing posts you'll probably hate. Broaden your horizons, or at least argue productively."}
              </p>
            </div>
          </div>
        </section>

        {/* Posts Feed */}
        <section className="w-full py-8 bg-zinc-900">
          <div className="container px-4 md:px-6 max-w-5xl">
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 hover:border-amber-600 transition-colors"
                >
                  <div className="flex gap-4">
                    {/* Vote Section */}
                    <div className="flex flex-col items-center space-y-2 pt-1">
                      <button
                        onClick={() => {
                          if (typeof window !== "undefined" && window.mixpanel) {
                            window.mixpanel.track("Lifestyle Post Upvoted", { post_id: post.id, post_title: post.title });
                          }
                        }}
                        className="text-zinc-500 hover:text-amber-500 transition-colors"
                      >
                        <ArrowUpIcon className="h-6 w-6" />
                      </button>
                      <span className="text-lg font-bold text-zinc-300">
                        {(post.upvotes - post.downvotes).toLocaleString()}
                      </span>
                      <button
                        onClick={() => {
                          if (typeof window !== "undefined" && window.mixpanel) {
                            window.mixpanel.track("Lifestyle Post Downvoted", {
                              post_id: post.id,
                              post_title: post.title,
                            });
                          }
                        }}
                        className="text-zinc-500 hover:text-blue-500 transition-colors"
                      >
                        <ArrowDownIcon className="h-6 w-6" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 text-sm text-zinc-500 mb-2">
                        <span className="text-zinc-400 font-medium">{post.author}</span>
                        <span>•</span>
                        <span>{post.postedAt}</span>
                      </div>
                      <h3 className="text-xl font-bold text-zinc-100 mb-3">{post.title}</h3>
                      <p className="text-zinc-300 mb-4 leading-relaxed">{post.content}</p>
                      <div className="flex items-center space-x-4">
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-zinc-700 text-zinc-300 text-xs rounded-full border border-zinc-600"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center text-zinc-500 text-sm ml-auto">
                          <MessageSquareIcon className="h-4 w-4 mr-1" />
                          {post.comments} comments
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-16 bg-zinc-950 border-t border-zinc-800">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-amber-400 mb-4">Become a Well-Rounded Thinker</h2>
              <p className="text-zinc-400 max-w-2xl mx-auto">
                weRead's unique algorithms help you explore diverse perspectives and challenge your own beliefs
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
              <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg text-center">
                <TrendingUpIcon className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-zinc-100 mb-2">Popularity Algorithm</h3>
                <p className="text-zinc-400 text-sm">See what the hivemind thinks is important</p>
              </div>
              <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg text-center">
                <ArrowUpIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-zinc-100 mb-2">Agreement Feed</h3>
                <p className="text-zinc-400 text-sm">Reinforce your existing worldview (comfort mode)</p>
              </div>
              <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg text-center">
                <ArrowDownIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-zinc-100 mb-2">Disagreement Feed</h3>
                <p className="text-zinc-400 text-sm">Challenge yourself with opposing views (growth mode)</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="w-full py-16 bg-gradient-to-b from-zinc-900 to-zinc-950 border-t border-zinc-800">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold text-amber-400 mb-4">Ready to Question Everything?</h2>
            <p className="text-zinc-400 mb-8 max-w-2xl mx-auto">
              Join a community of thinkers exploring life's biggest questions, one existential crisis at a time.
            </p>
            <Link href="/lifestyle/submit">
              <Button
                size="lg"
                className="bg-amber-600 text-zinc-900 hover:bg-amber-500 font-semibold"
                onClick={() => {
                  if (typeof window !== "undefined" && window.mixpanel) {
                    window.mixpanel.track("Lifestyle CTA Clicked", { cta: "Start Posting", location: "bottom_cta" });
                  }
                }}
              >
                Start Posting
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
