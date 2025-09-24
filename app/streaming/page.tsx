"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import {
  PlayIcon,
  SearchIcon,
  ThumbsUpIcon,
  ShareIcon,
  UserPlusIcon,
  ClockIcon,
  EyeIcon
} from "lucide-react";

// Mock video data - Expanded catalog for better demo
const featuredVideos = [
  // Technology
  {
    id: 1,
    title: "The Future of AI in 2025",
    channel: "TechChannel",
    views: "2.1M",
    duration: "15:32",
    thumbnail: "🤖",
    category: "Technology",
    uploadTime: "2 days ago"
  },
  {
    id: 2,
    title: "Web Development Crash Course",
    channel: "CodeAcademy",
    views: "3.2M",
    duration: "45:20",
    thumbnail: "💻",
    category: "Technology",
    uploadTime: "1 day ago"
  },
  {
    id: 3,
    title: "CSS Mastery Course",
    channel: "DesignPro",
    views: "1.1M",
    duration: "25:10",
    thumbnail: "🎨",
    category: "Technology",
    uploadTime: "1 week ago"
  },
  {
    id: 4,
    title: "Building Mobile Apps with React Native",
    channel: "MobileDev",
    views: "856K",
    duration: "38:45",
    thumbnail: "📱",
    category: "Technology",
    uploadTime: "4 days ago"
  },
  {
    id: 5,
    title: "Cybersecurity Basics Everyone Should Know",
    channel: "SecureCode",
    views: "1.8M",
    duration: "22:15",
    thumbnail: "🔒",
    category: "Technology",
    uploadTime: "6 days ago"
  },
  {
    id: 6,
    title: "Cloud Computing Explained",
    channel: "CloudGuru",
    views: "987K",
    duration: "19:30",
    thumbnail: "☁️",
    category: "Technology",
    uploadTime: "3 days ago"
  },

  // Cooking
  {
    id: 7,
    title: "Cooking the Perfect Pasta",
    channel: "ChefMaster",
    views: "890K",
    duration: "12:15",
    thumbnail: "🍝",
    category: "Cooking",
    uploadTime: "1 week ago"
  },
  {
    id: 8,
    title: "Homemade Pizza from Scratch",
    channel: "ItalianKitchen",
    views: "1.4M",
    duration: "28:40",
    thumbnail: "🍕",
    category: "Cooking",
    uploadTime: "2 days ago"
  },
  {
    id: 9,
    title: "Japanese Sushi Masterclass",
    channel: "SushiSensei",
    views: "2.3M",
    duration: "52:20",
    thumbnail: "🍣",
    category: "Cooking",
    uploadTime: "5 days ago"
  },
  {
    id: 10,
    title: "Baking Chocolate Chip Cookies",
    channel: "BakeWithMe",
    views: "678K",
    duration: "16:45",
    thumbnail: "🍪",
    category: "Cooking",
    uploadTime: "3 days ago"
  },
  {
    id: 11,
    title: "Korean BBQ at Home",
    channel: "KFood",
    views: "1.2M",
    duration: "24:30",
    thumbnail: "🥩",
    category: "Cooking",
    uploadTime: "1 week ago"
  },
  {
    id: 12,
    title: "Healthy Smoothie Recipes",
    channel: "HealthyEats",
    views: "543K",
    duration: "14:20",
    thumbnail: "🥤",
    category: "Cooking",
    uploadTime: "4 days ago"
  },

  // Fitness
  {
    id: 13,
    title: "Workout for Beginners",
    channel: "FitnessGuru",
    views: "1.5M",
    duration: "20:45",
    thumbnail: "💪",
    category: "Fitness",
    uploadTime: "3 days ago"
  },
  {
    id: 14,
    title: "Morning Yoga Flow",
    channel: "YogaLife",
    views: "892K",
    duration: "35:15",
    thumbnail: "🧘",
    category: "Fitness",
    uploadTime: "2 days ago"
  },
  {
    id: 15,
    title: "HIIT Workout - No Equipment",
    channel: "HomeWorkout",
    views: "1.8M",
    duration: "18:30",
    thumbnail: "🏃",
    category: "Fitness",
    uploadTime: "1 week ago"
  },
  {
    id: 16,
    title: "Building Muscle at Home",
    channel: "StrengthCoach",
    views: "2.1M",
    duration: "42:10",
    thumbnail: "🏋️",
    category: "Fitness",
    uploadTime: "5 days ago"
  },
  {
    id: 17,
    title: "Running Tips for Beginners",
    channel: "RunnerWorld",
    views: "756K",
    duration: "26:40",
    thumbnail: "🏃‍♀️",
    category: "Fitness",
    uploadTime: "6 days ago"
  },

  // Music
  {
    id: 18,
    title: "Guitar Lessons for Beginners",
    channel: "MusicMaster",
    views: "1.1M",
    duration: "25:10",
    thumbnail: "🎸",
    category: "Music",
    uploadTime: "1 week ago"
  },
  {
    id: 19,
    title: "Piano Basics - Your First Song",
    channel: "PianoAcademy",
    views: "2.4M",
    duration: "31:45",
    thumbnail: "🎹",
    category: "Music",
    uploadTime: "3 days ago"
  },
  {
    id: 20,
    title: "Drumming Fundamentals",
    channel: "BeatMaker",
    views: "967K",
    duration: "22:30",
    thumbnail: "🥁",
    category: "Music",
    uploadTime: "4 days ago"
  },
  {
    id: 21,
    title: "Singing Techniques & Vocal Warm-ups",
    channel: "VocalCoach",
    views: "1.3M",
    duration: "19:15",
    thumbnail: "🎤",
    category: "Music",
    uploadTime: "2 days ago"
  },
  {
    id: 22,
    title: "Music Production with FL Studio",
    channel: "ProducerLife",
    views: "1.7M",
    duration: "48:20",
    thumbnail: "🎧",
    category: "Music",
    uploadTime: "1 week ago"
  },

  // Travel
  {
    id: 23,
    title: "Travel Guide: Japan",
    channel: "Wanderlust",
    views: "760K",
    duration: "18:30",
    thumbnail: "🗾",
    category: "Travel",
    uploadTime: "5 days ago"
  },
  {
    id: 24,
    title: "Backpacking Through Europe",
    channel: "BackpackAdventure",
    views: "1.9M",
    duration: "35:45",
    thumbnail: "🎒",
    category: "Travel",
    uploadTime: "1 week ago"
  },
  {
    id: 25,
    title: "Street Food Tour: Thailand",
    channel: "FoodieTravel",
    views: "2.2M",
    duration: "27:20",
    thumbnail: "🍜",
    category: "Travel",
    uploadTime: "3 days ago"
  },
  {
    id: 26,
    title: "Solo Travel Safety Tips",
    channel: "SafeTraveler",
    views: "843K",
    duration: "21:10",
    thumbnail: "🧳",
    category: "Travel",
    uploadTime: "6 days ago"
  },
  {
    id: 27,
    title: "Best Beaches in the Caribbean",
    channel: "BeachLife",
    views: "1.1M",
    duration: "24:35",
    thumbnail: "🏖️",
    category: "Travel",
    uploadTime: "4 days ago"
  },

  // Gaming
  {
    id: 28,
    title: "Gaming Setup Tour 2024",
    channel: "ProGamer",
    views: "3.5M",
    duration: "16:45",
    thumbnail: "🎮",
    category: "Gaming",
    uploadTime: "2 days ago"
  },
  {
    id: 29,
    title: "Best Strategy Games This Year",
    channel: "GameReviews",
    views: "1.8M",
    duration: "29:15",
    thumbnail: "🕹️",
    category: "Gaming",
    uploadTime: "1 week ago"
  },
  {
    id: 30,
    title: "Minecraft Building Tips",
    channel: "BlockBuilder",
    views: "2.7M",
    duration: "33:20",
    thumbnail: "⛏️",
    category: "Gaming",
    uploadTime: "3 days ago"
  },
  {
    id: 31,
    title: "Speedrun World Record Attempt",
    channel: "SpeedRunner",
    views: "4.1M",
    duration: "1:02:30",
    thumbnail: "⚡",
    category: "Gaming",
    uploadTime: "5 days ago"
  },

  // Education
  {
    id: 32,
    title: "Physics Explained Simply",
    channel: "ScienceSimple",
    views: "1.6M",
    duration: "22:45",
    thumbnail: "⚛️",
    category: "Education",
    uploadTime: "4 days ago"
  },
  {
    id: 33,
    title: "World History in 30 Minutes",
    channel: "HistoryBuff",
    views: "2.8M",
    duration: "31:40",
    thumbnail: "📚",
    category: "Education",
    uploadTime: "1 week ago"
  },
  {
    id: 34,
    title: "Learn Spanish in 10 Days",
    channel: "LanguageExpress",
    views: "3.1M",
    duration: "45:15",
    thumbnail: "🇪🇸",
    category: "Education",
    uploadTime: "6 days ago"
  },
  {
    id: 35,
    title: "Mathematical Thinking",
    channel: "MathGenius",
    views: "987K",
    duration: "38:20",
    thumbnail: "🔢",
    category: "Education",
    uploadTime: "2 days ago"
  },

  // Entertainment
  {
    id: 36,
    title: "Stand-up Comedy Special",
    channel: "ComedyCentral",
    views: "5.2M",
    duration: "1:15:30",
    thumbnail: "😂",
    category: "Entertainment",
    uploadTime: "3 days ago"
  },
  {
    id: 37,
    title: "Magic Tricks Revealed",
    channel: "MagicSecrets",
    views: "2.9M",
    duration: "26:45",
    thumbnail: "🎩",
    category: "Entertainment",
    uploadTime: "1 week ago"
  },
  {
    id: 38,
    title: "Movie Review: Latest Blockbuster",
    channel: "FilmCritic",
    views: "1.7M",
    duration: "18:25",
    thumbnail: "🎬",
    category: "Entertainment",
    uploadTime: "5 days ago"
  },
  {
    id: 39,
    title: "Celebrity Interview Special",
    channel: "TalkShow",
    views: "4.6M",
    duration: "42:10",
    thumbnail: "⭐",
    category: "Entertainment",
    uploadTime: "2 days ago"
  },

  // Lifestyle
  {
    id: 40,
    title: "Morning Routine for Success",
    channel: "ProductivityHacks",
    views: "1.9M",
    duration: "14:30",
    thumbnail: "☀️",
    category: "Lifestyle",
    uploadTime: "4 days ago"
  },
  {
    id: 41,
    title: "Home Organization Ideas",
    channel: "OrganizedLife",
    views: "1.4M",
    duration: "23:15",
    thumbnail: "🏠",
    category: "Lifestyle",
    uploadTime: "1 week ago"
  },
  {
    id: 42,
    title: "Fashion Trends 2024",
    channel: "StyleGuru",
    views: "2.1M",
    duration: "19:40",
    thumbnail: "👗",
    category: "Lifestyle",
    uploadTime: "3 days ago"
  },
  {
    id: 43,
    title: "Mindfulness Meditation Guide",
    channel: "ZenMaster",
    views: "1.2M",
    duration: "35:25",
    thumbnail: "🧘‍♀️",
    category: "Lifestyle",
    uploadTime: "6 days ago"
  },
  {
    id: 44,
    title: "DIY Home Decor Projects",
    channel: "CraftyHome",
    views: "1.7M",
    duration: "28:50",
    thumbnail: "🎨",
    category: "Lifestyle",
    uploadTime: "5 days ago"
  }
];

const categories = ["All", "Technology", "Cooking", "Fitness", "Music", "Travel", "Gaming", "Education", "Entertainment", "Lifestyle"];

export default function meTubeHomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [likedVideos, setLikedVideos] = useState<Set<number>>(new Set());
  const [subscribedChannels, setSubscribedChannels] = useState<Set<string>>(new Set());

  const filteredVideos = featuredVideos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleVideoClick = (videoId: number) => {
    const video = featuredVideos.find(v => v.id === videoId);

    // Track video view
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('Video Clicked', {
        video_id: videoId,
        video_title: video?.title,
        channel: video?.channel,
        duration: video?.duration
      });
    }

    // Navigate to video player (all videos play the same Rick Roll!)
    window.location.href = '/streaming/watch';
  };

  const handleLike = (videoId: number) => {
    const video = featuredVideos.find(v => v.id === videoId);
    const isLiked = likedVideos.has(videoId);

    if (isLiked) {
      setLikedVideos(prev => new Set([...prev].filter(id => id !== videoId)));
    } else {
      setLikedVideos(prev => new Set([...prev, videoId]));
    }

    // Track like action
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track(isLiked ? 'Video Unliked' : 'Video Liked', {
        video_id: videoId,
        video_title: video?.title,
        channel: video?.channel
      });
    }
  };

  const handleSubscribe = (channel: string) => {
    const isSubscribed = subscribedChannels.has(channel);

    // THE BROKEN SUBSCRIBE BUTTON! 🐛
    // Only works 10% of the time to demonstrate subscription conversion issues
    const shouldWork = Math.random() < 0.1;

    // Track subscription attempt
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('Subscribe Attempted', {
        channel: channel,
        was_subscribed: isSubscribed
      });
    }

    if (!shouldWork) {
      // Track failed subscription
      if (typeof window !== 'undefined' && window.mixpanel) {
        window.mixpanel.track('Subscribe Failed', {
          channel: channel,
          failure_reason: 'button_malfunction'
        });
      }
      return; // Button doesn't work!
    }

    // If it works, proceed with subscription
    if (isSubscribed) {
      setSubscribedChannels(prev => new Set([...prev].filter(c => c !== channel)));
    } else {
      setSubscribedChannels(prev => new Set([...prev, channel]));
    }

    // Track successful subscription
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track(isSubscribed ? 'Unsubscribed' : 'Subscribed', {
        channel: channel
      });
    }
  };

  // Track page view
  useEffect(() => {
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('Browse Videos', {
        category: selectedCategory
      });
    }
  }, [selectedCategory]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-6 md:py-10 lg:py-12 bg-[#CC332B] text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  meTube
                </h1>
                <p className="mx-auto max-w-[700px] text-lg md:text-xl">
                  Discover amazing videos from creators around the world
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Search and Categories */}
        <section className="w-full py-6 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search videos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`transition-all ${selectedCategory === category ? "bg-[#CC332B] hover:bg-[#CC332B]/90 shadow-md" : "hover:bg-[#CC332B] hover:text-white"}`}
                >
                  {category}
                  {selectedCategory === category && (
                    <span className="ml-1 text-xs opacity-75">
                      ({filteredVideos.length})
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Videos Grid */}
        <section className="w-full py-8 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {selectedCategory === "All" ? "Featured Videos" : `${selectedCategory} Videos`}
              </h2>
              <p className="text-gray-600">
                {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''} found
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map(video => (
                <div key={video.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  {/* Video Thumbnail */}
                  <div
                    className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg cursor-pointer overflow-hidden"
                    onClick={() => handleVideoClick(video.id)}
                  >
                    <div className="flex items-center justify-center h-full text-8xl">
                      {video.thumbnail}
                    </div>
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
                      <PlayIcon className="h-12 w-12 text-white/80 opacity-0 hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{video.title}</h3>

                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[#CC332B] font-medium">{video.channel}</p>
                      {/* THE PROBLEMATIC SUBSCRIBE BUTTON */}
                      <Button
                        size="sm"
                        variant={subscribedChannels.has(video.channel) ? "default" : "outline"}
                        onClick={() => handleSubscribe(video.channel)}
                        className={`transition-all ${
                          subscribedChannels.has(video.channel)
                            ? "bg-[#CC332B] hover:bg-[#CC332B]/90"
                            : "hover:bg-[#CC332B] hover:text-white"
                        }`}
                        style={{
                          // THE DRIFTING EFFECT! Button sometimes moves slightly
                          transform: Math.random() > 0.7 ? `translateX(${Math.random() * 4 - 2}px)` : 'none'
                        }}
                      >
                        <UserPlusIcon className="h-4 w-4 mr-1" />
                        {subscribedChannels.has(video.channel) ? "Subscribed" : "Subscribe"}
                      </Button>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <EyeIcon className="h-4 w-4" />
                        {video.views} views
                      </div>
                      <div className="flex items-center gap-1">
                        <ClockIcon className="h-4 w-4" />
                        {video.uploadTime}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleLike(video.id)}
                        className={likedVideos.has(video.id) ? "text-[#CC332B]" : ""}
                      >
                        <ThumbsUpIcon className="h-4 w-4 mr-1" />
                        Like
                      </Button>
                      <Button size="sm" variant="ghost">
                        <ShareIcon className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredVideos.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No videos found matching your search.</p>
              </div>
            )}

            {/* UX Issue Explanation */}
            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                💡 <strong>Demo Note:</strong> The subscribe buttons on this page only work 10% of the time and sometimes drift position - this demonstrates subscription conversion issues that can be tracked with Mixpanel!
              </p>
            </div>
          </div>
        </section>

        {/* Trending Section */}
        <section className="w-full py-12 bg-gray-50">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold mb-6">Trending Topics</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-3xl mb-2">🎮</div>
                <h3 className="font-semibold">Gaming</h3>
                <p className="text-sm text-gray-600">1.2M videos</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-3xl mb-2">🎵</div>
                <h3 className="font-semibold">Music</h3>
                <p className="text-sm text-gray-600">890K videos</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-3xl mb-2">📚</div>
                <h3 className="font-semibold">Education</h3>
                <p className="text-sm text-gray-600">650K videos</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-3xl mb-2">🎭</div>
                <h3 className="font-semibold">Entertainment</h3>
                <p className="text-sm text-gray-600">2.1M videos</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}