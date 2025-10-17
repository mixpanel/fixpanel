"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  PlayIcon,
  TrendingUpIcon,
  ClockIcon,
  EyeIcon,
  HeartIcon,
  ShareIcon,
  ThumbsUpIcon,
  FlameIcon
} from "lucide-react";

// Trending videos with more realistic data
const trendingVideos = [
  {
    id: 1,
    title: "This Video Will Change Your Life",
    channel: "LifeHacker",
    views: "8.2M",
    duration: "10:33",
    thumbnail: "🤯",
    trend: "+2847%",
    uploadTime: "2 hours ago",
    description: "The secret technique that billionaires don't want you to know!"
  },
  {
    id: 2,
    title: "Cat Accidentally Starts Zoom Meeting",
    channel: "FunnyPets",
    views: "12.1M",
    duration: "3:42",
    thumbnail: "😸",
    trend: "+1592%",
    uploadTime: "4 hours ago",
    description: "Mr. Whiskers becomes CEO for a day"
  },
  {
    id: 3,
    title: "Speed Running McDonald's Drive-Thru",
    channel: "CrazyGamer",
    views: "5.8M",
    duration: "8:15",
    thumbnail: "🍟",
    trend: "+987%",
    uploadTime: "6 hours ago",
    description: "World record attempt - can I order 50 burgers in under 2 minutes?"
  },
  {
    id: 4,
    title: "Building a House with ONLY Duct Tape",
    channel: "DIYExtreme",
    views: "4.3M",
    duration: "25:18",
    thumbnail: "🏠",
    trend: "+742%",
    uploadTime: "8 hours ago",
    description: "Architectural marvel or disaster? You decide!"
  },
  {
    id: 5,
    title: "Teaching My Goldfish to Do Taxes",
    channel: "PetEducation",
    views: "3.9M",
    duration: "15:22",
    thumbnail: "🐠",
    trend: "+631%",
    uploadTime: "12 hours ago",
    description: "Financial literacy for aquatic pets"
  }
];

export default function TrendingPage() {
  const router = useRouter();
  const [likedVideos, setLikedVideos] = useState<Set<number>>(new Set());
  const [subscribedChannels, setSubscribedChannels] = useState<Set<string>>(new Set());
  const [clickCount, setClickCount] = useState(0);

  const handleVideoClick = (videoId: number) => {
    // Track video click
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('Video Click', {
        video_id: videoId,
        page: 'trending',
        video_title: trendingVideos.find(v => v.id === videoId)?.title
      });
    }

    // Redirect to watch page (they'll all be Rick Roll!)
    router.push(`/streaming/watch?v=${videoId}`);
  };

  const handleLike = (videoId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    const newLikedVideos = new Set(likedVideos);
    if (likedVideos.has(videoId)) {
      newLikedVideos.delete(videoId);
    } else {
      newLikedVideos.add(videoId);
    }
    setLikedVideos(newLikedVideos);

    // Track like action
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('Video Like', {
        video_id: videoId,
        action: likedVideos.has(videoId) ? 'unlike' : 'like',
        page: 'trending'
      });
    }
  };

  // THE BROKEN SUBSCRIBE BUTTON! (10% success rate + drift)
  const handleSubscribe = (channel: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setClickCount(prev => prev + 1);

    // Track subscribe attempt
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('Subscribe Attempt', {
        channel: channel,
        page: 'trending',
        attempt_number: clickCount + 1
      });
    }

    // 90% failure rate - the UX issue we're demonstrating!
    const shouldWork = Math.random() < 0.1;

    if (shouldWork) {
      const newSubscribed = new Set(subscribedChannels);
      if (subscribedChannels.has(channel)) {
        newSubscribed.delete(channel);
      } else {
        newSubscribed.add(channel);
      }
      setSubscribedChannels(newSubscribed);

      // Track successful subscription
      if (typeof window !== 'undefined' && window.mixpanel) {
        window.mixpanel.track('Subscribe Success', {
          channel: channel,
          page: 'trending',
          attempt_number: clickCount + 1
        });
      }
    } else {
      // Track failed subscription
      if (typeof window !== 'undefined' && window.mixpanel) {
        window.mixpanel.track('Subscribe Failed', {
          channel: channel,
          page: 'trending',
          attempt_number: clickCount + 1,
          failure_reason: 'button_malfunction'
        });
      }
    }
  };

  // Track page view
  useEffect(() => {
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('View Trending Page');
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 bg-gradient-to-r from-[#CC332B] to-[#DA6B16]">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center text-white">
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <FlameIcon className="h-8 w-8" />
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Trending Now
                  </h1>
                  <FlameIcon className="h-8 w-8" />
                </div>
                <p className="mx-auto max-w-[700px] text-xl">
                  The hottest videos everyone's watching right now! 🔥
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trending Videos */}
        <section className="w-full py-8 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingVideos.map((video, index) => (
                <div key={video.id} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all border-2 border-orange-200 hover:border-orange-300 hover:scale-[1.01] active:scale-[0.99]">
                  {/* Trending Badge */}
                  <div className="relative">
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-bold z-10">
                      #{index + 1} TRENDING
                    </div>
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded font-bold z-10">
                      {video.trend}
                    </div>

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
                  </div>

                  {/* Video Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{video.title}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[#CC332B] font-medium">{video.channel}</span>
                      <Button
                        size="sm"
                        variant={subscribedChannels.has(video.channel) ? "default" : "outline"}
                        onClick={(e) => handleSubscribe(video.channel, e)}
                        className={`text-xs ${subscribedChannels.has(video.channel) ? "bg-gray-500" : "border-[#CC332B] text-[#CC332B] hover:bg-[#CC332B] hover:text-white"} active:scale-95 transition-all`}
                        style={{
                          // DRIFT EFFECT: Button position shifts slightly with each click!
                          transform: `translate(${Math.sin(clickCount * 0.5) * 2}px, ${Math.cos(clickCount * 0.3) * 1}px)`
                        }}
                      >
                        {subscribedChannels.has(video.channel) ? "Subscribed" : "Subscribe"}
                      </Button>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <EyeIcon className="h-4 w-4" />
                        <span>{video.views} views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ClockIcon className="h-4 w-4" />
                        <span>{video.uploadTime}</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-3">{video.description}</p>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => handleLike(video.id, e)}
                        className={`flex items-center gap-1 ${likedVideos.has(video.id) ? "text-red-500" : ""} hover:bg-opacity-90 active:scale-95 transition-all`}
                      >
                        <HeartIcon className={`h-4 w-4 ${likedVideos.has(video.id) ? "fill-current" : ""}`} />
                        <span className="text-xs">{likedVideos.has(video.id) ? "Liked" : "Like"}</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="flex items-center gap-1 hover:bg-gray-100 active:scale-95 transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (typeof window !== 'undefined' && window.mixpanel) {
                            window.mixpanel.track('Video Share', {
                              video_id: video.id,
                              page: 'trending'
                            });
                          }
                        }}
                      >
                        <ShareIcon className="h-4 w-4" />
                        <span className="text-xs">Share</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}