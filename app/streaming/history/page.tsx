"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  ClockIcon,
  SearchIcon,
  PlayIcon,
  EyeIcon,
  TrashIcon,
  CalendarIcon,
  FilterIcon,
  HistoryIcon
} from "lucide-react";

// Mock watch history with realistic data
const watchHistory = [
  {
    id: 1,
    title: "The Future of AI in 2025",
    channel: "TechChannel",
    thumbnail: "🤖",
    duration: "15:32",
    watchTime: "12:45",
    percentage: 82,
    watchedAt: "2 hours ago",
    date: "Today"
  },
  {
    id: 2,
    title: "Cooking the Perfect Pasta",
    channel: "ChefMaster",
    thumbnail: "🍝",
    duration: "12:15",
    watchTime: "12:15",
    percentage: 100,
    watchedAt: "4 hours ago",
    date: "Today"
  },
  {
    id: 3,
    title: "Workout for Beginners",
    channel: "FitnessGuru",
    thumbnail: "💪",
    duration: "20:45",
    watchTime: "5:32",
    percentage: 27,
    watchedAt: "6 hours ago",
    date: "Today"
  },
  {
    id: 4,
    title: "Guitar Lessons for Beginners",
    channel: "MusicMaster",
    thumbnail: "🎸",
    duration: "25:10",
    watchTime: "18:22",
    percentage: 73,
    watchedAt: "Yesterday 8:30 PM",
    date: "Yesterday"
  },
  {
    id: 5,
    title: "Travel Guide: Japan",
    channel: "Wanderlust",
    thumbnail: "🗾",
    duration: "18:30",
    watchTime: "2:15",
    percentage: 12,
    watchedAt: "Yesterday 3:15 PM",
    date: "Yesterday"
  },
  {
    id: 6,
    title: "CSS Mastery Course",
    channel: "DesignPro",
    thumbnail: "🎨",
    duration: "25:10",
    watchTime: "25:10",
    percentage: 100,
    watchedAt: "2 days ago",
    date: "2 days ago"
  },
  {
    id: 7,
    title: "Stand-up Comedy Special",
    channel: "ComedyCentral",
    thumbnail: "😂",
    duration: "75:30",
    watchTime: "45:12",
    percentage: 60,
    watchedAt: "3 days ago",
    date: "3 days ago"
  }
];

export default function HistoryPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [history, setHistory] = useState(watchHistory);
  const [clearAnimations, setClearAnimations] = useState<{[key: number]: boolean}>({});

  const filters = ["All", "Completed", "In Progress", "Barely Watched"];

  const handleVideoClick = (videoId: number) => {
    // Track video click from history
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('History Video Click', {
        video_id: videoId,
        video_title: history.find(v => v.id === videoId)?.title,
        watch_percentage: history.find(v => v.id === videoId)?.percentage
      });
    }

    // Redirect to watch page
    router.push(`/streaming/watch?v=${videoId}`);
  };

  const handleRemoveFromHistory = (videoId: number, event: React.MouseEvent) => {
    event.stopPropagation();

    // Trigger animation
    setClearAnimations(prev => ({ ...prev, [videoId]: true }));

    // Track removal
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('Remove from History', {
        video_id: videoId,
        video_title: history.find(v => v.id === videoId)?.title
      });
    }

    // Remove after animation
    setTimeout(() => {
      setHistory(prev => prev.filter(v => v.id !== videoId));
      setClearAnimations(prev => ({ ...prev, [videoId]: false }));
    }, 300);
  };

  const clearAllHistory = () => {
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('Clear All History', {
        items_cleared: history.length
      });
    }

    // Animate all items out
    const allIds = history.map(v => v.id);
    const animations = Object.fromEntries(allIds.map(id => [id, true]));
    setClearAnimations(animations);

    // Clear after animation
    setTimeout(() => {
      setHistory([]);
      setClearAnimations({});
    }, 300);
  };

  const filteredHistory = history.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.channel.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = selectedFilter === "All" ||
                         (selectedFilter === "Completed" && video.percentage === 100) ||
                         (selectedFilter === "In Progress" && video.percentage > 10 && video.percentage < 100) ||
                         (selectedFilter === "Barely Watched" && video.percentage <= 10);

    return matchesSearch && matchesFilter;
  });

  // Group by date
  const groupedHistory = filteredHistory.reduce((groups, video) => {
    const date = video.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(video);
    return groups;
  }, {} as {[key: string]: typeof watchHistory});

  // Track page view
  useEffect(() => {
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('View History Page', {
        total_videos: history.length,
        completed_videos: history.filter(v => v.percentage === 100).length
      });
    }
  }, [history]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 bg-gradient-to-r from-indigo-600 to-purple-600">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center text-white">
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <HistoryIcon className="h-8 w-8" />
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Watch History
                  </h1>
                </div>
                <p className="mx-auto max-w-[700px] text-xl">
                  Pick up where you left off or rewatch your favorites
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Controls */}
        <section className="w-full py-6 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold">
                  {history.length} videos watched
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllHistory}
                  className="text-red-600 border-red-600 hover:bg-red-50 hover:bg-opacity-90 active:scale-95 transition-all"
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Clear All History
                </Button>
              </div>

              <div className="flex items-center gap-4">
                {/* Filter Dropdown */}
                <div className="flex items-center gap-2">
                  <FilterIcon className="h-4 w-4 text-gray-600" />
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="px-3 py-2 border rounded-md text-sm"
                  >
                    {filters.map(filter => (
                      <option key={filter} value={filter}>{filter}</option>
                    ))}
                  </select>
                </div>

                {/* Search */}
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search history..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* History Content */}
        <section className="w-full py-8 bg-white">
          <div className="container px-4 md:px-6">
            {Object.keys(groupedHistory).length === 0 ? (
              <div className="text-center py-12">
                <HistoryIcon className="h-24 w-24 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No watch history found</h3>
                <p className="text-gray-600 mb-6">
                  {history.length === 0 ? "Your watch history has been cleared." : "No videos match your search."}
                </p>
                <Link href="/streaming">
                  <Button
                    className="bg-[#CC332B] hover:bg-[#CC332B]/90 active:scale-95 transition-all"
                    onClick={() => {
                      if (typeof window !== 'undefined' && window.mixpanel) {
                        window.mixpanel.track('Button Clicked', {
                          button_name: 'discover_videos',
                          page: 'history'
                        });
                      }
                    }}
                  >
                    Discover Videos
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(groupedHistory).map(([date, videos]) => (
                  <div key={date}>
                    <div className="flex items-center gap-2 mb-4">
                      <CalendarIcon className="h-5 w-5 text-gray-600" />
                      <h3 className="text-lg font-semibold text-gray-800">{date}</h3>
                      <div className="text-sm text-gray-500">({videos.length} videos)</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {videos.map(video => (
                        <div
                          key={video.id}
                          className={`bg-white rounded-lg shadow-sm hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all border cursor-pointer ${
                            clearAnimations[video.id] ? 'transform scale-95 opacity-50' : ''
                          }`}
                          onClick={() => handleVideoClick(video.id)}
                        >
                          {/* Thumbnail with Progress */}
                          <div className="relative">
                            <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg overflow-hidden">
                              <div className="flex items-center justify-center h-full text-6xl">
                                {video.thumbnail}
                              </div>
                              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
                                <PlayIcon className="h-8 w-8 text-white/80 opacity-0 hover:opacity-100 transition-opacity" />
                              </div>
                              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                                {video.duration}
                              </div>

                              {/* Progress Bar */}
                              <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20">
                                <div
                                  className="h-full bg-[#CC332B] transition-all"
                                  style={{ width: `${video.percentage}%` }}
                                ></div>
                              </div>
                            </div>

                            {/* Remove Button */}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => handleRemoveFromHistory(video.id, e)}
                              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 active:scale-95 text-white p-1 h-auto transition-all"
                            >
                              <TrashIcon className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Video Info */}
                          <div className="p-4">
                            <h4 className="font-semibold text-sm mb-2 line-clamp-2">{video.title}</h4>
                            <p className="text-xs text-gray-600 mb-2">{video.channel}</p>

                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <ClockIcon className="h-3 w-3" />
                                <span>{video.watchTime} watched</span>
                              </div>
                              <span>{video.watchedAt}</span>
                            </div>

                            {/* Progress Indicator */}
                            <div className="mt-2 flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-1">
                                <div
                                  className={`h-1 rounded-full transition-all ${
                                    video.percentage === 100 ? 'bg-green-500' :
                                    video.percentage > 50 ? 'bg-yellow-500' :
                                    'bg-[#CC332B]'
                                  }`}
                                  style={{ width: `${video.percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-500">{video.percentage}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Stats Widget */}
            <div className="mt-12 p-6 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-center">📊 Your Viewing Stats</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-indigo-600">
                    {history.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Videos</div>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {history.filter(v => v.percentage === 100).length}
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {history.filter(v => v.percentage > 10 && v.percentage < 100).length}
                  </div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(history.reduce((sum, v) => sum + v.percentage, 0) / history.length) || 0}%
                  </div>
                  <div className="text-sm text-gray-600">Avg. Completion</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}