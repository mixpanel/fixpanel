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
  ClockIcon,
  XIcon,
  CopyIcon,
  CheckIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function VideoWatchPage() {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [views] = useState("1,337,420");
  const [likes] = useState("42,069");
  const [dislikes] = useState("1,234");

  // Animation states for visual feedback
  const [likeButtonState, setLikeButtonState] = useState<'idle' | 'failed' | 'success'>('idle');
  const [dislikeButtonState, setDislikeButtonState] = useState<'idle' | 'failed' | 'success'>('idle');
  const [subscribeButtonState, setSubscribeButtonState] = useState<'idle' | 'failed' | 'success'>('idle');

  // Share modal state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copyLinkSuccess, setCopyLinkSuccess] = useState(false);

  // Get video info from URL params (in a real app)
  const videoTitle = "You clicked on a video!";
  const channelName = "meTube Channel";
  const uploadDate = "April 1, 2024";
  const videoUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleLike = () => {
    // THE BROKEN LIKE BUTTON! 🐛
    // Only works 20% of the time
    const shouldWork = Math.random() < 0.2;

    // Track like attempt
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('Like Attempted', {
        video_title: videoTitle,
        channel: channelName,
        was_liked: isLiked
      });
    }

    if (!shouldWork) {
      // Track failed like
      if (typeof window !== 'undefined' && window.mixpanel) {
        window.mixpanel.track('Like Failed', {
          video_title: videoTitle,
          channel: channelName,
          failure_reason: 'button_malfunction'
        });
      }

      // Show failure animation
      setLikeButtonState('failed');
      setTimeout(() => setLikeButtonState('idle'), 600);
      return; // Button doesn't work!
    }

    // If it works, proceed with like
    setLikeButtonState('success');
    setTimeout(() => setLikeButtonState('idle'), 600);

    if (isDisliked) setIsDisliked(false);
    setIsLiked(!isLiked);

    // Track successful like action
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track(isLiked ? 'Video Unliked' : 'Video Liked', {
        video_title: videoTitle,
        channel: channelName
      });
    }
  };

  const handleDislike = () => {
    // THE BROKEN DISLIKE BUTTON! 🐛
    // Only works 20% of the time
    const shouldWork = Math.random() < 0.2;

    // Track dislike attempt
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('Dislike Attempted', {
        video_title: videoTitle,
        channel: channelName,
        was_disliked: isDisliked
      });
    }

    if (!shouldWork) {
      // Track failed dislike
      if (typeof window !== 'undefined' && window.mixpanel) {
        window.mixpanel.track('Dislike Failed', {
          video_title: videoTitle,
          channel: channelName,
          failure_reason: 'button_malfunction'
        });
      }

      // Show failure animation
      setDislikeButtonState('failed');
      setTimeout(() => setDislikeButtonState('idle'), 600);
      return; // Button doesn't work!
    }

    // If it works, proceed with dislike
    setDislikeButtonState('success');
    setTimeout(() => setDislikeButtonState('idle'), 600);

    if (isLiked) setIsLiked(false);
    setIsDisliked(!isDisliked);

    // Track successful dislike action
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

      // Show failure animation
      setSubscribeButtonState('failed');
      setTimeout(() => setSubscribeButtonState('idle'), 600);
      return; // Button doesn't work!
    }

    // If it works, show success animation
    setSubscribeButtonState('success');
    setTimeout(() => setSubscribeButtonState('idle'), 600);

    setIsSubscribed(!isSubscribed);

    // Track successful subscription
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track(isSubscribed ? 'Unsubscribed' : 'Subscribed', {
        channel: channelName,
        source: 'video_page'
      });
    }
  };

  const handleShare = () => {
    setIsShareModalOpen(true);

    // Track share modal opened
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('Share Modal Opened', {
        video_title: videoTitle,
        channel: channelName
      });
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(videoUrl);
      setCopyLinkSuccess(true);
      setTimeout(() => setCopyLinkSuccess(false), 2000);

      // Track copy link
      if (typeof window !== 'undefined' && window.mixpanel) {
        window.mixpanel.track('Video Link Copied', {
          video_title: videoTitle,
          channel: channelName
        });
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSocialShare = (platform: string) => {
    // Track social share
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('Social Share Clicked', {
        video_title: videoTitle,
        channel: channelName,
        platform: platform
      });
    }

    // Open share URLs
    const shareUrls: { [key: string]: string } = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(videoTitle)}&url=${encodeURIComponent(videoUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(videoUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(videoUrl)}`,
      reddit: `https://reddit.com/submit?url=${encodeURIComponent(videoUrl)}&title=${encodeURIComponent(videoTitle)}`
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
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
                    <motion.div
                      animate={
                        likeButtonState === 'failed'
                          ? { x: [-2, 2, -2, 2, 0], rotate: [-2, 2, -2, 2, 0] }
                          : likeButtonState === 'success'
                          ? { scale: [1, 1.2, 1], rotate: [0, 10, 0] }
                          : {}
                      }
                      transition={{ duration: 0.5 }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLike}
                        className={`${isLiked ? "bg-[#CC332B] text-white" : ""} ${
                          likeButtonState === 'failed' ? 'border-red-500 border-2' : ''
                        } ${likeButtonState === 'success' ? 'border-green-500 border-2' : ''}`}
                      >
                        <ThumbsUpIcon className="h-4 w-4 mr-1" />
                        {likes}
                      </Button>
                    </motion.div>

                    <motion.div
                      animate={
                        dislikeButtonState === 'failed'
                          ? { x: [-2, 2, -2, 2, 0], rotate: [-2, 2, -2, 2, 0] }
                          : dislikeButtonState === 'success'
                          ? { scale: [1, 1.2, 1], rotate: [0, -10, 0] }
                          : {}
                      }
                      transition={{ duration: 0.5 }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDislike}
                        className={`${isDisliked ? "bg-gray-600 text-white" : ""} ${
                          dislikeButtonState === 'failed' ? 'border-red-500 border-2' : ''
                        } ${dislikeButtonState === 'success' ? 'border-green-500 border-2' : ''}`}
                      >
                        <ThumbsDownIcon className="h-4 w-4 mr-1" />
                        {dislikes}
                      </Button>
                    </motion.div>

                    <Button variant="outline" size="sm" onClick={handleShare}>
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
                  <motion.div
                    animate={
                      subscribeButtonState === 'failed'
                        ? { x: [-3, 3, -3, 3, 0], y: [-1, 1, -1, 1, 0] }
                        : subscribeButtonState === 'success'
                        ? { scale: [1, 1.15, 1], y: [0, -5, 0] }
                        : {}
                    }
                    transition={{ duration: 0.5 }}
                  >
                    <Button
                      onClick={handleSubscribe}
                      variant={isSubscribed ? "default" : "outline"}
                      className={`transition-all ${
                        isSubscribed
                          ? "bg-[#CC332B] hover:bg-[#CC332B]/90"
                          : "hover:bg-[#CC332B] hover:text-white"
                      } ${subscribeButtonState === 'failed' ? 'border-red-500 border-2' : ''} ${
                        subscribeButtonState === 'success' ? 'border-green-500 border-2 bg-green-500 text-white' : ''
                      }`}
                    >
                      <UserPlusIcon className="h-4 w-4 mr-2" />
                      {isSubscribed ? "Subscribed" : "Subscribe"}
                    </Button>
                  </motion.div>
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
                    💡 <strong>Demo Note:</strong> The Like and Dislike buttons only work 20% of the time, and the Subscribe button only works 10% of the time (plus it sometimes drifts).
                    This demonstrates engagement issues that can be identified through analytics!
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

      {/* Share Modal */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsShareModalOpen(false)}
            />

            {/* Modal */}
            <motion.div
              className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md z-10"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <XIcon className="h-5 w-5" />
              </button>

              {/* Modal Header */}
              <h2 className="text-2xl font-bold mb-2">Share Video</h2>
              <p className="text-sm text-gray-600 mb-6">Share this video with your friends!</p>

              {/* Copy Link */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Video Link</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={videoUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                  />
                  <Button
                    onClick={handleCopyLink}
                    className={`${
                      copyLinkSuccess
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-[#CC332B] hover:bg-[#CC332B]/90'
                    }`}
                  >
                    {copyLinkSuccess ? (
                      <>
                        <CheckIcon className="h-4 w-4 mr-1" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <CopyIcon className="h-4 w-4 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Social Share Buttons */}
              <div>
                <label className="block text-sm font-medium mb-3">Share on Social Media</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleSocialShare('twitter')}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1a8cd8] transition-colors"
                  >
                    <span className="text-xl">𝕏</span>
                    <span className="font-medium">Twitter</span>
                  </button>
                  <button
                    onClick={() => handleSocialShare('facebook')}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1877F2] text-white rounded-lg hover:bg-[#166fe5] transition-colors"
                  >
                    <span className="text-xl">f</span>
                    <span className="font-medium">Facebook</span>
                  </button>
                  <button
                    onClick={() => handleSocialShare('linkedin')}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-[#0A66C2] text-white rounded-lg hover:bg-[#095196] transition-colors"
                  >
                    <span className="text-xl">in</span>
                    <span className="font-medium">LinkedIn</span>
                  </button>
                  <button
                    onClick={() => handleSocialShare('reddit')}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-[#FF4500] text-white rounded-lg hover:bg-[#e03d00] transition-colors"
                  >
                    <span className="text-xl">󠀠󠀠</span>
                    <span className="font-medium">Reddit</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}