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
const initialPosts = [
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
  {
    id: 9,
    author: "Dialectical_Dave",
    title: "Work is Just Performative Existence",
    content:
      "I show up, I perform tasks, I get paid. But what am I actually doing? Creating value? For whom? The whole structure feels like an elaborate performance where we pretend our labor has inherent meaning. Maybe Baudrillard was right—it's all simulation now.",
    upvotes: 892,
    downvotes: 203,
    comments: 156,
    tags: ["work", "capitalism", "baudrillard", "simulation"],
    postedAt: "7 days ago",
  },
  {
    id: 10,
    author: "Eternal_Return",
    title: "What If This Moment Has Happened Before?",
    content:
      "Nietzsche's eternal recurrence haunts me. What if you had to live this exact life, this exact moment, infinite times? Would you change anything? I think about this every time I'm stuck in traffic or scrolling mindlessly. Is this really how I want to spend eternity?",
    upvotes: 1247,
    downvotes: 89,
    comments: 234,
    tags: ["nietzsche", "eternal-recurrence", "existentialism"],
    postedAt: "1 week ago",
  },
  {
    id: 11,
    author: "Phenomenological_Phil",
    title: "On the Violence of Normalcy",
    content:
      "Society enforces 'normal' with surgical precision. Wake at 7, work 9-5, marry by 30, retire at 65. But who decided this? Foucault showed us how power operates through norms, not force. Every time someone asks 'what do you do?' they're really asking 'have you conformed yet?'",
    upvotes: 723,
    downvotes: 441,
    comments: 189,
    tags: ["foucault", "power", "society", "conformity"],
    postedAt: "1 week ago",
  },
  {
    id: 12,
    author: "Becoming_Being",
    title: "You're Not Finding Yourself, You're Creating Yourself",
    content:
      "The idea that we need to 'find ourselves' implies there's a fixed self somewhere waiting to be discovered. But Sartre had it right—existence precedes essence. You're not finding anything. You're making choices, and those choices are making you. Stop searching. Start building.",
    upvotes: 2103,
    downvotes: 127,
    comments: 312,
    tags: ["sartre", "self", "identity", "choice"],
    postedAt: "1 week ago",
  },
  {
    id: 13,
    author: "Transcendent_Tara",
    title: "The Anxiety of Being Perceived",
    content:
      "Sartre's 'hell is other people' makes more sense every day. The moment someone looks at me, I become an object in their world. Their gaze fixes me, defines me, limits me. Social media has weaponized this—we're all objects now, curated and consumable. How do we reclaim our subjectivity?",
    upvotes: 1456,
    downvotes: 178,
    comments: 267,
    tags: ["sartre", "social-media", "authenticity", "the-gaze"],
    postedAt: "1 week ago",
  },
  {
    id: 14,
    author: "Hegelian_Hangover",
    title: "Every Conversation is a Power Struggle",
    content:
      "You ever notice how conversations are just people taking turns trying to assert dominance? Someone shares a story, you one-up them. Someone makes a point, you counter. Even agreement is strategic. We're all just fighting for recognition in an endless dialectic.",
    upvotes: 634,
    downvotes: 389,
    comments: 201,
    tags: ["hegel", "conversation", "power", "recognition"],
    postedAt: "1 week ago",
  },
  {
    id: 15,
    author: "Quantum_Kierkegaard",
    title: "The Dread of Infinite Possibility",
    content:
      "Kierkegaard called it anxiety—the vertigo of freedom. When everything is possible, nothing feels certain. I can be anyone, go anywhere, do anything. And that terrifies me. How do you choose when every choice forecloses infinite other lives? Maybe limitation is freedom.",
    upvotes: 1089,
    downvotes: 234,
    comments: 178,
    tags: ["kierkegaard", "anxiety", "freedom", "choice"],
    postedAt: "2 weeks ago",
  },
  {
    id: 16,
    author: "Simulated_Socrates",
    title: "Are We Just NPCs in Someone's Simulation?",
    content:
      "If we're in a simulation (Bostrom says 50/50 odds), then our choices might be predetermined. But does that even matter? If the experience feels real, if suffering feels real, doesn't that make it real? Descartes said 'I think therefore I am.' I'd add: 'I suffer therefore it matters.'",
    upvotes: 978,
    downvotes: 412,
    comments: 298,
    tags: ["simulation", "bostrom", "descartes", "reality"],
    postedAt: "2 weeks ago",
  },
  {
    id: 17,
    author: "Dasein_Dealer",
    title: "Authenticity is Exhausting",
    content:
      "Heidegger wants us to live authentically, but have you tried it? It's relentless. Every choice matters. Every moment demands presence. Sometimes I just want to scroll TikTok and exist inauthentically for a bit. Is that so wrong?",
    upvotes: 1834,
    downvotes: 156,
    comments: 289,
    tags: ["heidegger", "authenticity", "dasein", "burnout"],
    postedAt: "2 weeks ago",
  },
  {
    id: 18,
    author: "Absurdist_Alex",
    title: "Embrace the Meaninglessness",
    content:
      "Nothing matters. Your job doesn't matter. Your achievements don't matter. The heat death of the universe will erase it all. But here's the thing—that's liberating. If nothing matters, then you're free to create your own meaning. Camus was onto something with that whole Sisyphus thing.",
    upvotes: 2456,
    downvotes: 203,
    comments: 401,
    tags: ["camus", "absurdism", "meaning", "nihilism"],
    postedAt: "2 weeks ago",
  },
  {
    id: 19,
    author: "Liminal_Lauren",
    title: "We Live in the Gaps Between Certainties",
    content:
      "I used to think adulthood meant having answers. But I'm realizing life is just moving from one uncertainty to another. We exist in liminal spaces—between jobs, between relationships, between versions of ourselves. Maybe that's not a bug. Maybe that's the point.",
    upvotes: 1567,
    downvotes: 112,
    comments: 234,
    tags: ["liminal", "uncertainty", "adulthood", "identity"],
    postedAt: "3 weeks ago",
  },
  {
    id: 20,
    author: "Hermeneutic_Hank",
    title: "Language is a Cage We Built for Ourselves",
    content:
      "Wittgenstein said the limits of my language are the limits of my world. I think about this constantly. How many thoughts can't I think because I don't have words for them? How many realities are invisible because our language doesn't acknowledge them? We're trapped in a linguistic prison of our own making.",
    upvotes: 823,
    downvotes: 267,
    comments: 167,
    tags: ["wittgenstein", "language", "limits", "philosophy-of-language"],
    postedAt: "3 weeks ago",
  },
  {
    id: 21,
    author: "Stoic_Struggler",
    title: "Control What You Can, Release What You Can't",
    content:
      "Marcus Aurelius said you have power over your mind, not outside events. Realize this and you find strength. I spent years raging at things I couldn't change. Now I'm learning to let go. It's not apathy—it's wisdom. Focus on the radius of your agency and let the rest burn.",
    upvotes: 2789,
    downvotes: 134,
    comments: 423,
    tags: ["stoicism", "marcus-aurelius", "control", "acceptance"],
    postedAt: "3 weeks ago",
  },
  {
    id: 22,
    author: "Genealogical_Gwen",
    title: "Every Belief You Hold Was Given to You",
    content:
      "Nietzsche's genealogy is terrifying once you get it. Your morals, your values, your sense of right and wrong—none of it is yours. It's cultural inheritance. You're performing a script written centuries ago. The question is: do you have the courage to rewrite it?",
    upvotes: 1456,
    downvotes: 534,
    comments: 312,
    tags: ["nietzsche", "genealogy", "morality", "culture"],
    postedAt: "3 weeks ago",
  },
  {
    id: 23,
    author: "Panopticon_Pete",
    title: "We're All Surveilling Each Other Now",
    content:
      "Foucault's panopticon is real, but we built it ourselves. Ring doorbells, Instagram stories, Slack status indicators—we've normalized constant surveillance. And the worst part? We police ourselves. I catch myself performing for an imaginary audience even when I'm alone.",
    upvotes: 1678,
    downvotes: 289,
    comments: 267,
    tags: ["foucault", "surveillance", "panopticon", "technology"],
    postedAt: "4 weeks ago",
  },
  {
    id: 24,
    author: "Ontological_Olivia",
    title: "Being and Time and Being Out of Time",
    content:
      "Heidegger talks about Dasein's relationship to time, but I think we've broken that relationship. We're always late, always rushing, always 'running out of time.' But time isn't running. We are. What would it mean to simply... be... in time rather than against it?",
    upvotes: 934,
    downvotes: 156,
    comments: 198,
    tags: ["heidegger", "time", "dasein", "modernity"],
    postedAt: "4 weeks ago",
  },
];

export default function LifestyleLanding() {
  const [sortBy, setSortBy] = useState<"popular" | "agree" | "disagree">("popular");
  const [posts, setPosts] = useState(initialPosts);
  const [votedPosts, setVotedPosts] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (typeof window !== "undefined" && window.mixpanel) {
      window.mixpanel.track("Lifestyle Landing Viewed");
    }
  }, []);

  const handleUpvote = (postId: number) => {
    if (votedPosts.has(postId)) return;

    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, upvotes: post.upvotes + 1 }
          : post
      )
    );
    setVotedPosts(prev => new Set([...prev, postId]));

    if (typeof window !== "undefined" && window.mixpanel) {
      window.mixpanel.track("Lifestyle Post Upvoted", {
        post_id: postId,
        post_title: posts.find(p => p.id === postId)?.title,
      });
    }
  };

  const handleDownvote = (postId: number) => {
    if (votedPosts.has(postId)) return;

    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, downvotes: post.downvotes + 1 }
          : post
      )
    );
    setVotedPosts(prev => new Set([...prev, postId]));

    if (typeof window !== "undefined" && window.mixpanel) {
      window.mixpanel.track("Lifestyle Post Downvoted", {
        post_id: postId,
        post_title: posts.find(p => p.id === postId)?.title,
      });
    }
  };

  const getSortedPosts = () => {
    const sorted = [...posts];
    if (sortBy === "popular") {
      return sorted.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
    } else if (sortBy === "agree") {
      // Shuffle for "likely to agree" - random order each time
      return sorted.sort(() => Math.random() - 0.5);
    } else if (sortBy === "disagree") {
      // Shuffle for "likely to disagree" - different random order
      return sorted.sort(() => 0.5 - Math.random());
    }
    return sorted;
  };

  const sortedPosts = getSortedPosts();

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
              {sortedPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 hover:border-amber-600 transition-colors"
                >
                  <div className="flex gap-4">
                    {/* Vote Section */}
                    <div className="flex flex-col items-center space-y-2 pt-1">
                      <button
                        onClick={() => handleUpvote(post.id)}
                        className={`transition-all ${
                          votedPosts.has(post.id)
                            ? "text-amber-500 cursor-not-allowed"
                            : "text-zinc-500 hover:text-amber-500 hover:scale-110"
                        }`}
                        disabled={votedPosts.has(post.id)}
                      >
                        <ArrowUpIcon className="h-6 w-6" />
                      </button>
                      <span className={`text-lg font-bold transition-colors ${
                        votedPosts.has(post.id) ? "text-amber-500" : "text-zinc-300"
                      }`}>
                        {(post.upvotes - post.downvotes).toLocaleString()}
                      </span>
                      <button
                        onClick={() => handleDownvote(post.id)}
                        className={`transition-all ${
                          votedPosts.has(post.id)
                            ? "text-blue-500 cursor-not-allowed"
                            : "text-zinc-500 hover:text-blue-500 hover:scale-110"
                        }`}
                        disabled={votedPosts.has(post.id)}
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
                            <button
                              key={tag}
                              onClick={() => {
                                if (typeof window !== "undefined" && window.mixpanel) {
                                  window.mixpanel.track("Lifestyle Tag Clicked", { tag });
                                }
                                window.open("https://storage.googleapis.com/mp-customer-upload/RickRoll.mp4", "_blank");
                              }}
                              className="px-2 py-1 bg-zinc-700 text-zinc-300 text-xs rounded-full border border-zinc-600 hover:bg-amber-600 hover:text-zinc-900 hover:border-amber-500 transition-colors cursor-pointer"
                            >
                              #{tag}
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => {
                            if (typeof window !== "undefined" && window.mixpanel) {
                              window.mixpanel.track("Lifestyle Comments Clicked", { post_id: post.id });
                            }
                            window.open("https://storage.googleapis.com/mp-customer-upload/RickRoll.mp4", "_blank");
                          }}
                          className="flex items-center text-zinc-500 text-sm ml-auto hover:text-amber-500 transition-colors cursor-pointer"
                        >
                          <MessageSquareIcon className="h-4 w-4 mr-1" />
                          {post.comments} comments
                        </button>
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
