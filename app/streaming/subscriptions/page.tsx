"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  BellIcon,
  SearchIcon,
  UserIcon,
  PlayIcon,
  ClockIcon,
  EyeIcon,
  SettingsIcon
} from "lucide-react";

// Mock subscribed channels
const subscribedChannels = [
  {
    id: 1,
    name: "TechChannel",
    avatar: "🤖",
    subscribers: "2.1M",
    description: "Latest tech reviews and tutorials",
    lastVideo: "The Future of AI in 2025",
    lastVideoTime: "2 hours ago",
    notifications: true
  },
  {
    id: 2,
    name: "ChefMaster",
    avatar: "👨‍🍳",
    subscribers: "1.8M",
    description: "Delicious recipes from around the world",
    lastVideo: "Perfect Pasta Techniques",
    lastVideoTime: "1 day ago",
    notifications: false
  },
  {
    id: 3,
    name: "FitnessGuru",
    avatar: "💪",
    subscribers: "3.2M",
    description: "Get fit and stay healthy",
    lastVideo: "10-Minute Morning Workout",
    lastVideoTime: "3 days ago",
    notifications: true
  },
  {
    id: 4,
    name: "GameReviews",
    avatar: "🎮",
    subscribers: "5.1M",
    description: "Honest game reviews and gameplay",
    lastVideo: "Top 10 Games This Month",
    lastVideoTime: "5 days ago",
    notifications: true
  },
  {
    id: 5,
    name: "ComedyCentral",
    avatar: "😂",
    subscribers: "8.7M",
    description: "Stand-up comedy and funny sketches",
    lastVideo: "Best Comedy Moments 2024",
    lastVideoTime: "1 week ago",
    notifications: false
  }
];

export default function SubscriptionsPage() {
  const [notifications, setNotifications] = useState<{[key: number]: boolean}>({
    1: true,
    2: false,
    3: true,
    4: true,
    5: false
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [bellAnimations, setBellAnimations] = useState<{[key: number]: boolean}>({});

  const toggleNotifications = (channelId: number) => {
    setNotifications(prev => ({
      ...prev,
      [channelId]: !prev[channelId]
    }));

    // Trigger bell animation
    setBellAnimations(prev => ({
      ...prev,
      [channelId]: true
    }));

    // Track notification toggle
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('Notification Toggle', {
        channel_id: channelId,
        channel_name: subscribedChannels.find(c => c.id === channelId)?.name,
        enabled: !notifications[channelId]
      });
    }

    // Reset animation after delay
    setTimeout(() => {
      setBellAnimations(prev => ({
        ...prev,
        [channelId]: false
      }));
    }, 300);
  };

  const handleChannelClick = (channelId: number) => {
    // Track channel click
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('Subscription Channel Click', {
        channel_id: channelId,
        channel_name: subscribedChannels.find(c => c.id === channelId)?.name
      });
    }
  };

  const filteredChannels = subscribedChannels.filter(channel =>
    channel.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Track page view
  useEffect(() => {
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('View Subscriptions Page', {
        total_subscriptions: subscribedChannels.length,
        notifications_enabled: Object.values(notifications).filter(Boolean).length
      });
    }
  }, [notifications]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 bg-gradient-to-r from-purple-600 to-blue-600">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center text-white">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Your Subscriptions
                </h1>
                <p className="mx-auto max-w-[700px] text-xl">
                  Stay updated with your favorite creators
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Search and Stats */}
        <section className="w-full py-6 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold">
                  {subscribedChannels.length} Subscriptions
                </h2>
                <div className="text-sm text-gray-600">
                  {Object.values(notifications).filter(Boolean).length} with notifications
                </div>
              </div>

              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search subscriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Subscriptions Grid */}
        <section className="w-full py-8 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChannels.map(channel => (
                <div
                  key={channel.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all border p-6 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  onClick={() => handleChannelClick(channel.id)}
                >
                  {/* Channel Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{channel.avatar}</div>
                      <div>
                        <h3 className="font-semibold text-lg">{channel.name}</h3>
                        <p className="text-sm text-gray-600">{channel.subscribers} subscribers</p>
                      </div>
                    </div>

                    {/* Notification Bell */}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleNotifications(channel.id);
                      }}
                      className={`p-2 ${bellAnimations[channel.id] ? 'animate-bounce' : ''} hover:bg-opacity-90 active:scale-95 transition-all`}
                    >
                      <BellIcon
                        className={`h-5 w-5 ${
                          notifications[channel.id]
                            ? 'text-blue-500 fill-current'
                            : 'text-gray-400'
                        }`}
                      />
                    </Button>
                  </div>

                  {/* Channel Description */}
                  <p className="text-sm text-gray-700 mb-4">
                    {channel.description}
                  </p>

                  {/* Latest Video Info */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <PlayIcon className="h-4 w-4 text-[#CC332B]" />
                      <span className="text-sm font-medium">Latest:</span>
                    </div>
                    <p className="text-sm text-gray-800 mb-1">{channel.lastVideo}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <ClockIcon className="h-3 w-3" />
                      <span>{channel.lastVideoTime}</span>
                    </div>
                  </div>

                  {/* Notification Status */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      notifications[channel.id]
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {notifications[channel.id] ? '🔔 Notifications ON' : '🔕 Notifications OFF'}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs hover:bg-[#CC332B] hover:text-white hover:border-[#CC332B] transition-all active:scale-95"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (typeof window !== 'undefined' && window.mixpanel) {
                          window.mixpanel.track('View Channel Button Click', {
                            channel_id: channel.id,
                            channel_name: channel.name
                          });
                        }
                      }}
                    >
                      View Channel
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Widget */}
            <div className="mt-12 p-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">🔔 Notification Center</h3>
                <p className="text-gray-700">
                  Click the bell icons to toggle notifications and watch them bounce!
                </p>
              </div>

              {/* Notification Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {subscribedChannels.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Subscriptions</div>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {Object.values(notifications).filter(Boolean).length}
                  </div>
                  <div className="text-sm text-gray-600">Notifications Enabled</div>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {Math.round((Object.values(notifications).filter(Boolean).length / subscribedChannels.length) * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Notification Rate</div>
                </div>
              </div>

              {/* Fun Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>Notification Engagement</span>
                  <span>{Object.values(notifications).filter(Boolean).length}/{subscribedChannels.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${(Object.values(notifications).filter(Boolean).length / subscribedChannels.length) * 100}%`
                    }}
                  ></div>
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