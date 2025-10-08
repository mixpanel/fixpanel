"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { VideoRecommenderModal } from "./VideoRecommenderModal";
import Link from "next/link";
import {
  PlayIcon,
  SearchIcon,
  ThumbsUpIcon,
  ShareIcon,
  UserPlusIcon,
  ClockIcon,
  EyeIcon,
  HomeIcon,
  TrendingUpIcon,
  HistoryIcon,
  PlaySquareIcon,
  ListMusicIcon,
  VideoIcon,
  MenuIcon,
  SparklesIcon,
  FlagIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

export default function MeTubeHomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [likedVideos, setLikedVideos] = useState<Set<number>>(new Set());
  const [subscribedChannels, setSubscribedChannels] = useState<Set<string>>(new Set());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showRecommender, setShowRecommender] = useState(false);

  useEffect(() => {
    document.title = "meTube";
  }, []);

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
      setLikedVideos(prev => {
        const newSet = new Set(prev);
        newSet.delete(videoId);
        return newSet;
      });
    } else {
      setLikedVideos(prev => {
        const newSet = new Set(prev);
        newSet.add(videoId);
        return newSet;
      });
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
      setSubscribedChannels(prev => {
        const newSet = new Set(prev);
        newSet.delete(channel);
        return newSet;
      });
    } else {
      setSubscribedChannels(prev => {
        const newSet = new Set(prev);
        newSet.add(channel);
        return newSet;
      });
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
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      {/* YouTube-style Top Navigation */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2"
            >
              <MenuIcon className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <VideoIcon className="h-6 w-6 text-[#CC332B]" />
              <span className="text-xl font-bold">meTube</span>
            </div>
          </div>

          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <Input
                placeholder="Search videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-12 border-gray-300 focus:border-[#CC332B] rounded-full"
              />
              <Button
                size="sm"
                className="absolute right-0 top-0 h-full px-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-r-full border-l"
              >
                <SearchIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            {filteredVideos.length} videos
          </div>
        </div>
      </div>

      <div className="flex flex-1">

        {/* YouTube-style Sidebar */}
        <motion.aside
          className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 transition-all duration-300 sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto`}
          initial={false}
          animate={{ width: sidebarCollapsed ? 64 : 256 }}
        >
          <div className="p-3 space-y-1">
            {/* Main Navigation */}
            <div className="space-y-1">
              <motion.div
                className="flex items-center gap-6 px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                whileHover={{ backgroundColor: "#f3f4f6" }}
              >
                <HomeIcon className="h-5 w-5" />
                {!sidebarCollapsed && <span className="text-sm font-medium">Home</span>}
              </motion.div>
              <motion.div
                className="flex items-center gap-6 px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                whileHover={{ backgroundColor: "#f3f4f6" }}
              >
                <TrendingUpIcon className="h-5 w-5" />
                {!sidebarCollapsed && <span className="text-sm font-medium">Trending</span>}
              </motion.div>
              <motion.div
                className="flex items-center gap-6 px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                whileHover={{ backgroundColor: "#f3f4f6" }}
              >
                <HistoryIcon className="h-5 w-5" />
                {!sidebarCollapsed && <span className="text-sm font-medium">History</span>}
              </motion.div>
            </div>

            {!sidebarCollapsed && (
              <>
                <hr className="my-3" />

                {/* Categories */}
                <div className="space-y-1">
                  <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Categories
                  </h3>
                  {categories.slice(1).map(category => (
                    <motion.div
                      key={category}
                      className={`flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer ${
                        selectedCategory === category ? 'bg-red-50 text-[#CC332B]' : ''
                      }`}
                      onClick={() => setSelectedCategory(category)}
                      whileHover={{ backgroundColor: selectedCategory === category ? "#fef2f2" : "#f3f4f6" }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-lg">
                        {category === 'Technology' && '💻'}
                        {category === 'Cooking' && '🍳'}
                        {category === 'Fitness' && '💪'}
                        {category === 'Music' && '🎵'}
                        {category === 'Travel' && '✈️'}
                        {category === 'Gaming' && '🎮'}
                        {category === 'Education' && '📚'}
                        {category === 'Entertainment' && '🎭'}
                        {category === 'Lifestyle' && '🌟'}
                      </div>
                      <span className="text-sm">{category}</span>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>
        </motion.aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-gray-50">
          {/* Category Chips */}
          <div className="sticky top-[73px] bg-white border-b border-gray-200 z-30">
            <div className="flex gap-2 overflow-x-auto px-6 py-3">
              <motion.button
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === 'All'
                    ? 'bg-black text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
                onClick={() => setSelectedCategory('All')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                All
              </motion.button>
              {categories.slice(1).map(category => (
                <motion.button
                  key={category}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? 'bg-black text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                  onClick={() => setSelectedCategory(category)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category}
                </motion.button>
              ))}
              {/* Just For You Button */}
              <motion.button
                className="ml-auto px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all bg-[#CC332B] text-white hover:bg-[#CC332B]/90 relative"
                onClick={() => {
                  setShowRecommender(true);
                  if (typeof window !== 'undefined' && window.mixpanel) {
                    window.mixpanel.track('Video Recommender Opened');
                  }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SparklesIcon className="inline h-4 w-4 mr-1" />
                Just For You
                <FlagIcon className="absolute -top-1 -right-1 h-3 w-3" />
              </motion.button>
            </div>
          </div>

          {/* Videos Grid */}
          <div className="p-6">
            <div className={`grid gap-4 ${
              sidebarCollapsed
                ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            }`}>
              {filteredVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ y: -2 }}
                  onClick={() => handleVideoClick(video.id)}
                >
                  {/* Video Thumbnail */}
                  <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    <div className="flex items-center justify-center h-full text-6xl">
                      {video.thumbnail}
                    </div>
                    <motion.div
                      className="absolute inset-0 bg-black/0 flex items-center justify-center"
                      whileHover={{ backgroundColor: "rgba(0,0,0,0.1)" }}
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <PlayIcon className="h-12 w-12 text-white drop-shadow-lg" />
                      </motion.div>
                    </motion.div>
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium">
                      {video.duration}
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="p-3">
                    <h3 className="font-medium text-sm mb-2 line-clamp-2 leading-tight">{video.title}</h3>

                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-600 text-xs mb-1 truncate">{video.channel}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{video.views} views</span>
                          <span>•</span>
                          <span>{video.uploadTime}</span>
                        </div>
                      </div>

                      {/* Compact Subscribe Button */}
                      <motion.button
                        className={`text-xs px-2 py-1 rounded-full font-medium transition-all ${
                          subscribedChannels.has(video.channel)
                            ? 'bg-gray-200 text-gray-700'
                            : 'bg-[#CC332B] text-white hover:bg-[#CC332B]/90'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSubscribe(video.channel);
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          // THE DRIFTING EFFECT! Button sometimes moves slightly
                          transform: Math.random() > 0.7 ? `translateX(${Math.random() * 4 - 2}px)` : 'none'
                        }}
                      >
                        {subscribedChannels.has(video.channel) ? '✓' : '+'}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredVideos.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No videos found matching your search.</p>
              </div>
            )}
          </div>

          {/* UX Issue Explanation */}
          <div className="mx-6 mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              💡 <strong>Demo Note:</strong> The subscribe buttons only work 10% of the time and sometimes drift position - this demonstrates subscription conversion issues that can be tracked with Mixpanel!
            </p>
          </div>
        </main>
      </div>
      <Footer />

      {/* Video Recommender Modal */}
      {showRecommender && <VideoRecommenderModal onClose={() => setShowRecommender(false)} />}
    </div>
  );
}