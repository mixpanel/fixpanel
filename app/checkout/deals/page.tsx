"use client";

import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ShoppingCartIcon,
  StarIcon,
  ClockIcon,
  TagIcon,
  ZapIcon,
  FlameIcon,
  TimerIcon,
  GiftIcon
} from "lucide-react";

// Daily deals with flash sale mechanics
const dailyDeals = [
  {
    id: 101,
    name: "Gaming Keyboard RGB",
    originalPrice: 149.99,
    salePrice: 49.99,
    discount: 67,
    image: "⌨️",
    description: "Mechanical gaming keyboard with rainbow RGB lighting",
    rating: 4.7,
    reviews: 892,
    timeLeft: 3600, // 1 hour in seconds
    claimed: 47,
    totalAvailable: 100,
    category: "Electronics"
  },
  {
    id: 102,
    name: "Wireless Earbuds Pro",
    originalPrice: 199.99,
    salePrice: 79.99,
    discount: 60,
    image: "🎧",
    description: "Premium noise-canceling wireless earbuds",
    rating: 4.5,
    reviews: 1243,
    timeLeft: 7200, // 2 hours
    claimed: 156,
    totalAvailable: 200,
    category: "Electronics"
  },
  {
    id: 103,
    name: "Smart Fitness Tracker",
    originalPrice: 129.99,
    salePrice: 39.99,
    discount: 69,
    image: "⌚",
    description: "Track your health and fitness goals",
    rating: 4.3,
    reviews: 567,
    timeLeft: 1800, // 30 minutes
    claimed: 78,
    totalAvailable: 150,
    category: "Fitness"
  },
  {
    id: 104,
    name: "Electric Coffee Grinder",
    originalPrice: 89.99,
    salePrice: 29.99,
    discount: 67,
    image: "☕",
    description: "Burr grinder for the perfect coffee experience",
    rating: 4.6,
    reviews: 324,
    timeLeft: 10800, // 3 hours
    claimed: 23,
    totalAvailable: 80,
    category: "Kitchen"
  },
  {
    id: 105,
    name: "Yoga Mat Premium",
    originalPrice: 59.99,
    salePrice: 19.99,
    discount: 67,
    image: "🧘",
    description: "Extra thick non-slip yoga mat",
    rating: 4.8,
    reviews: 1891,
    timeLeft: 5400, // 1.5 hours
    claimed: 134,
    totalAvailable: 300,
    category: "Fitness"
  },
  {
    id: 106,
    name: "LED Desk Lamp Smart",
    originalPrice: 79.99,
    salePrice: 24.99,
    discount: 69,
    image: "💡",
    description: "App-controlled desk lamp with wireless charging",
    rating: 4.4,
    reviews: 445,
    timeLeft: 900, // 15 minutes - almost sold out!
    claimed: 89,
    totalAvailable: 100,
    category: "Home & Garden"
  }
];

export default function DealsPage() {
  const [cart, setCart] = useState<Array<{id: number, quantity: number}>>([]);
  const [timers, setTimers] = useState<{[key: number]: number}>({});
  const [flashingDeals, setFlashingDeals] = useState<{[key: number]: boolean}>({});

  // Initialize timers
  useEffect(() => {
    const initialTimers = Object.fromEntries(
      dailyDeals.map(deal => [deal.id, deal.timeLeft])
    );
    setTimers(initialTimers);
  }, []);

  // Countdown timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prev => {
        const newTimers = { ...prev };
        Object.keys(newTimers).forEach(key => {
          const id = parseInt(key);
          if (newTimers[id] > 0) {
            newTimers[id] -= 1;

            // Flash the deal when time is running out (< 5 minutes)
            if (newTimers[id] <= 300 && newTimers[id] % 2 === 0) {
              setFlashingDeals(prev => ({ ...prev, [id]: !prev[id] }));
            }
          }
        });
        return newTimers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Load cart from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('theybuy_cart');
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (e) {
          console.error('Error loading cart:', e);
        }
      }
    }
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const addToCart = (dealId: number) => {
    const existingItem = cart.find(item => item.id === dealId);
    let newCart;

    if (existingItem) {
      newCart = cart.map(item =>
        item.id === dealId ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      newCart = [...cart, { id: dealId, quantity: 1 }];
    }

    setCart(newCart);

    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('theybuy_cart', JSON.stringify(newCart));
    }

    // Track add to cart from deals
    if (typeof window !== 'undefined' && window.mixpanel) {
      const deal = dailyDeals.find(d => d.id === dealId);
      window.mixpanel.track('Add to Cart', {
        product_id: dealId,
        product_name: deal?.name,
        price: deal?.salePrice,
        original_price: deal?.originalPrice,
        discount_percentage: deal?.discount,
        source: 'daily_deals',
        time_remaining: timers[dealId]
      });
    }
  };

  const getCartItemCount = useCallback(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  // Track page view
  useEffect(() => {
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('View Daily Deals Page', {
        total_deals: dailyDeals.length,
        cart_items: getCartItemCount()
      });
    }
  }, [getCartItemCount]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 bg-gradient-to-r from-red-600 to-orange-600">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center text-white">
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <FlameIcon className="h-8 w-8 animate-pulse" />
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Daily Flash Deals
                  </h1>
                  <FlameIcon className="h-8 w-8 animate-pulse" />
                </div>
                <p className="mx-auto max-w-[700px] text-xl">
                  ⚡ Limited Time Only! Up to 70% OFF ⚡
                </p>
                <div className="text-lg font-medium">
                  🔥 Deals refresh every 24 hours - Don't miss out! 🔥
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Cart Access */}
        <section className="w-full py-4 bg-gray-100">
          <div className="container px-4 md:px-6">
            <div className="flex justify-between items-center">
              <div className="text-lg font-semibold">
                ⏰ Flash Deals End Soon!
              </div>
              <Link href="/checkout/cart">
                <Button className="bg-[#07B096] hover:bg-[#07B096]/90">
                  <ShoppingCartIcon className="h-4 w-4 mr-2" />
                  Cart ({getCartItemCount()})
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Deals Grid */}
        <section className="w-full py-8 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dailyDeals.map(deal => {
                const timeRemaining = timers[deal.id] || 0;
                const isUrgent = timeRemaining <= 900; // Less than 15 minutes
                const percentageClaimed = (deal.claimed / deal.totalAvailable) * 100;

                return (
                  <div
                    key={deal.id}
                    className={`border-2 rounded-lg p-6 transition-all duration-300 ${
                      flashingDeals[deal.id] && isUrgent
                        ? 'border-red-500 bg-red-50 shadow-lg'
                        : 'border-orange-200 hover:shadow-lg'
                    }`}
                  >
                    {/* Deal Badge */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                        {deal.discount}% OFF
                      </div>
                      {isUrgent && (
                        <div className="bg-red-600 text-white text-xs px-2 py-1 rounded font-bold animate-pulse">
                          ⚡ URGENT
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="text-center mb-4">
                      <div className="text-6xl mb-4">{deal.image}</div>
                      <h3 className="text-xl font-semibold mb-2">{deal.name}</h3>
                      <p className="text-gray-600 text-sm mb-4">{deal.description}</p>

                      {/* Ratings */}
                      <div className="flex items-center justify-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(deal.rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                          {deal.rating} ({deal.reviews} reviews)
                        </span>
                      </div>

                      {/* Pricing */}
                      <div className="mb-4">
                        <div className="text-3xl font-bold text-[#07B096] mb-2">
                          ${deal.salePrice}
                        </div>
                        <div className="text-lg text-gray-500 line-through">
                          ${deal.originalPrice}
                        </div>
                        <div className="text-sm text-green-600 font-medium">
                          You save ${(deal.originalPrice - deal.salePrice).toFixed(2)}!
                        </div>
                      </div>
                    </div>

                    {/* Timer */}
                    <div className={`text-center mb-4 p-3 rounded-lg ${
                      isUrgent ? 'bg-red-100 border border-red-300' : 'bg-orange-100'
                    }`}>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <TimerIcon className={`h-5 w-5 ${isUrgent ? 'text-red-600' : 'text-orange-600'}`} />
                        <span className="font-bold text-lg">
                          {timeRemaining > 0 ? formatTime(timeRemaining) : "EXPIRED"}
                        </span>
                      </div>
                      <div className={`text-xs ${isUrgent ? 'text-red-600' : 'text-orange-600'}`}>
                        {timeRemaining > 0 ? 'Time Remaining' : 'Deal Ended'}
                      </div>
                    </div>

                    {/* Stock Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Claimed: {deal.claimed}/{deal.totalAvailable}</span>
                        <span className="font-bold">{Math.round(percentageClaimed)}% sold</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-300 ${
                            percentageClaimed > 80 ? 'bg-red-500' :
                            percentageClaimed > 50 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${percentageClaimed}%` }}
                        ></div>
                      </div>
                      {percentageClaimed > 80 && (
                        <div className="text-center text-red-600 text-sm font-bold mt-2">
                          🔥 Almost Sold Out! 🔥
                        </div>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <Button
                      onClick={() => addToCart(deal.id)}
                      disabled={timeRemaining <= 0}
                      className={`w-full ${
                        timeRemaining <= 0
                          ? 'bg-gray-400 cursor-not-allowed'
                          : isUrgent
                          ? 'bg-red-600 hover:bg-red-700 animate-pulse'
                          : 'bg-[#07B096] hover:bg-[#07B096]/90'
                      }`}
                    >
                      {timeRemaining <= 0 ? (
                        "Deal Expired"
                      ) : (
                        <>
                          <ZapIcon className="h-4 w-4 mr-2" />
                          Grab This Deal!
                        </>
                      )}
                    </Button>

                    {isUrgent && timeRemaining > 0 && (
                      <div className="text-center mt-2 text-red-600 text-sm font-bold animate-bounce">
                        ⏰ HURRY! Only {Math.floor(timeRemaining / 60)} minutes left!
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Interactive Stats Widget */}
            <div className="mt-12 p-6 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg">
              <h3 className="text-xl font-bold text-center mb-6">⚡ Deal Rush Statistics ⚡</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {dailyDeals.length}
                  </div>
                  <div className="text-sm text-gray-600">Active Deals</div>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {dailyDeals.filter(d => (timers[d.id] || 0) <= 900).length}
                  </div>
                  <div className="text-sm text-gray-600">Ending Soon</div>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(dailyDeals.reduce((avg, deal) => avg + deal.discount, 0) / dailyDeals.length)}%
                  </div>
                  <div className="text-sm text-gray-600">Avg. Discount</div>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {dailyDeals.reduce((total, deal) => total + deal.claimed, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Items Sold Today</div>
                </div>
              </div>

              {/* Urgency Meter */}
              <div className="mt-6">
                <div className="text-center mb-4">
                  <h4 className="font-bold">🔥 Deal Urgency Meter 🔥</h4>
                  <p className="text-sm text-gray-600">Based on time remaining and stock levels</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {dailyDeals.filter(d => (timers[d.id] || 0) <= 1800).map(deal => (
                    <div key={deal.id} className="bg-white p-3 rounded border">
                      <div className="text-lg font-bold text-red-600">{deal.name}</div>
                      <div className="text-sm">⏰ {formatTime(timers[deal.id] || 0)} left</div>
                      <div className="text-sm">📦 {deal.totalAvailable - deal.claimed} remaining</div>
                    </div>
                  ))}
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