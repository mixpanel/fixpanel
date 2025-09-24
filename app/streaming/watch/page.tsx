"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import {
  ThumbsUpIcon,
  ThumbsDownIcon,
  ShareIcon,
  UserPlusIcon,
  ArrowLeftIcon,
  EyeIcon,
  ClockIcon
} from "lucide-react";

export default function VideoWatchPage() {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [views] = useState("1,337,420");
  const [likes] = useState("42,069");
  const [dislikes] = useState("1,234");

  // Get video info from URL params (in a real app)
  const videoTitle = "You clicked on a video!";
  const channelName = "meTube Channel";
  const uploadDate = "April 1, 2024";

  const handleLike = () => {
    if (isDisliked) setIsDisliked(false);
    setIsLiked(!isLiked);

    // Track like action
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track(isLiked ? 'Video Unliked' : 'Video Liked', {
        video_title: videoTitle,
        channel: channelName
      });
    }
  };

  const handleDislike = () => {
    if (isLiked) setIsLiked(false);
    setIsDisliked(!isDisliked);

    // Track dislike action
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track(isDisliked ? 'Video Undisliked' : 'Video Disliked', {
        video_title: videoTitle,
        channel: channelName
      });
    }
  };

  const handleSubscribe = () => {
    // THE BROKEN SUBSCRIBE BUTTON! 🐛
    // Only works 10% of the time
    const shouldWork = Math.random() < 0.1;

    // Track subscription attempt
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('Subscribe Attempted', {
        channel: channelName,
        was_subscribed: isSubscribed,
        source: 'video_page'
      });
    }

    if (!shouldWork) {
      // Track failed subscription
      if (typeof window !== 'undefined' && window.mixpanel) {
        window.mixpanel.track('Subscribe Failed', {
          channel: channelName,
          failure_reason: 'button_malfunction',
          source: 'video_page'
        });
      }
      return; // Button doesn't work!
    }

    setIsSubscribed(!isSubscribed);

    // Track successful subscription
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track(isSubscribed ? 'Unsubscribed' : 'Subscribed', {
        channel: channelName,
        source: 'video_page'
      });
    }
  };

  // Track video start
  useEffect(() => {
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('Video Started', {
        video_title: videoTitle,
        channel: channelName,
        source: 'video_page'
      });
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-4">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto">
          <div className="mb-4">
            <Link href="/streaming" className="flex items-center text-[#CC332B] hover:underline">
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to meTube
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Video Area */}
            <div className="lg:col-span-2">
              {/* Video Player */}
              <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
                <video
                  className="w-full h-full"
                  controls
                  autoPlay
                  onPlay={() => {
                    // Track video play
                    if (typeof window !== 'undefined' && window.mixpanel) {
                      window.mixpanel.track('Video Play', {
                        video_title: videoTitle,
                        channel: channelName
                      });
                    }
                  }}
                  onPause={() => {
                    // Track video pause
                    if (typeof window !== 'undefined' && window.mixpanel) {
                      window.mixpanel.track('Video Pause', {
                        video_title: videoTitle,
                        channel: channelName
                      });
                    }
                  }}
                >
                  <source src="https://storage.googleapis.com/mp-customer-upload/RickRoll.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Video Info */}
              <div className="space-y-4">
                <h1 className="text-2xl font-bold">{videoTitle}</h1>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <EyeIcon className="h-4 w-4" />
                      {views} views
                    </div>
                    <div className="flex items-center gap-1">
                      <ClockIcon className="h-4 w-4" />
                      {uploadDate}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLike}
                      className={isLiked ? "bg-[#CC332B] text-white" : ""}
                    >
                      <ThumbsUpIcon className="h-4 w-4 mr-1" />
                      {likes}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDislike}
                      className={isDisliked ? "bg-gray-600 text-white" : ""}
                    >
                      <ThumbsDownIcon className="h-4 w-4 mr-1" />
                      {dislikes}
                    </Button>
                    <Button variant="outline" size="sm">
                      <ShareIcon className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>

                {/* Channel Info */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#CC332B] rounded-full flex items-center justify-center text-white font-bold text-xl">
                      m
                    </div>
                    <div>
                      <h3 className="font-semibold">{channelName}</h3>
                      <p className="text-sm text-gray-600">1.2M subscribers</p>
                    </div>
                  </div>

                  {/* THE PROBLEMATIC SUBSCRIBE BUTTON */}
                  <Button
                    onClick={handleSubscribe}
                    variant={isSubscribed ? "default" : "outline"}
                    className={`transition-all ${
                      isSubscribed
                        ? "bg-[#CC332B] hover:bg-[#CC332B]/90"
                        : "hover:bg-[#CC332B] hover:text-white"
                    }`}
                    style={{
                      // THE DRIFTING EFFECT! Button sometimes moves slightly
                      transform: Math.random() > 0.8 ? `translateX(${Math.random() * 6 - 3}px)` : 'none'
                    }}
                  >
                    <UserPlusIcon className="h-4 w-4 mr-2" />
                    {isSubscribed ? "Subscribed" : "Subscribe"}
                  </Button>
                </div>

                {/* Video Description */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">About this video</h4>
                  <p className="text-sm text-gray-700">
                    Welcome to meTube! You thought you were going to watch a different video, but surprise!
                    This is a demo showing how all video clicks can be tracked with Mixpanel, regardless of
                    what the thumbnail showed. Perfect for A/B testing video content and measuring engagement!
                  </p>
                  <br />
                  <p className="text-xs text-yellow-700 bg-yellow-100 p-2 rounded">
                    💡 <strong>Demo Note:</strong> Notice how the subscribe button sometimes drifts and often doesn't work?
                    This demonstrates subscription conversion issues that can be identified through analytics!
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar - Suggested Videos */}
            <div className="lg:col-span-1">
              <h3 className="font-semibold mb-4">Up Next</h3>
              <div className="space-y-3">
                {[
                  { title: "Another Video", thumbnail: "🎵", duration: "3:45" },
                  { title: "More Content", thumbnail: "🎮", duration: "12:30" },
                  { title: "Even More Videos", thumbnail: "🍕", duration: "8:15" },
                  { title: "Endless Content", thumbnail: "🚀", duration: "15:20" }
                ].map((video, index) => (
                  <Link key={index} href="/streaming/watch" className="flex gap-3 hover:bg-gray-50 p-2 rounded">
                    <div className="w-24 h-16 bg-gray-200 rounded flex items-center justify-center text-2xl">
                      {video.thumbnail}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm line-clamp-2">{video.title}</h4>
                      <p className="text-xs text-gray-600">meTube Channel</p>
                      <p className="text-xs text-gray-600">{video.duration}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}