"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { initMixpanelOnce, mixpanel } from "@/lib/analytics";
import { XIcon, FlagIcon, PlayIcon, SparklesIcon, TrendingUpIcon, ClockIcon } from "lucide-react";

const experimentId = "me-tube-video-recommender";
type Variant = "A (meme engine)" | "B (demographics)" | "C (control)";
const fallbackVariant: Variant = "C (control)";

// Meme Engine - silly/zany videos
const memeRecommendations = [
  { id: 28, thumbnail: "🎮", title: "Gaming Setup Tour 2024", reason: "Because you seem like the type who appreciates RGB lights and Mountain Dew" },
  { id: 36, thumbnail: "😂", title: "Stand-up Comedy Special", reason: "Your viewing history suggests you need a good laugh (or therapy)" },
  { id: 31, thumbnail: "⚡", title: "Speedrun World Record Attempt", reason: "You've been watching too many 'productivity hacks' - here's the ultimate hack" },
  { id: 30, thumbnail: "⛏️", title: "Minecraft Building Tips", reason: "Touch grass? Nah, here's how to build virtual grass instead" },
  { id: 37, thumbnail: "🎩", title: "Magic Tricks Revealed", reason: "Spoiler alert: It's not actual magic, just like your productivity isn't actual productivity" },
  { id: 39, thumbnail: "⭐", title: "Celebrity Interview Special", reason: "Because parasocial relationships are the new normal" },
  { id: 2, thumbnail: "💻", title: "Web Development Crash Course", reason: "Why touch grass when you can write 'console.log(grass)'?" },
  { id: 10, thumbnail: "🍪", title: "Baking Chocolate Chip Cookies", reason: "Emotional support cookies for when the code won't compile" },
];

// Demographics - based on made-up user profile
const demographicsProfiles = [
  {
    age: "25-34",
    gender: "Male",
    location: "San Francisco",
    recommendations: [
      { id: 1, thumbnail: "🤖", title: "The Future of AI in 2025", reason: "Tech enthusiast in SF - this is literally made for you" },
      { id: 3, thumbnail: "🎨", title: "CSS Mastery Course", reason: "Based on your age/location demographic, you're probably a developer" },
      { id: 16, thumbnail: "🍟", title: "Air Fryer", reason: "Single male, 25-34 - we know you can't cook" },
    ],
  },
  {
    age: "35-44",
    gender: "Female",
    location: "Austin",
    recommendations: [
      { id: 14, thumbnail: "🧘", title: "Morning Yoga Flow", reason: "Women 35-44 in Austin statistically love yoga and wellness" },
      { id: 42, thumbnail: "👗", title: "Fashion Trends 2024", reason: "Demographic data says you care about staying trendy" },
      { id: 24, thumbnail: "🌸", title: "Essential Oil Diffuser", reason: "Based on your age/gender/location profile" },
    ],
  },
  {
    age: "18-24",
    gender: "Non-binary",
    location: "Portland",
    recommendations: [
      { id: 13, thumbnail: "💪", title: "Workout for Beginners", reason: "Gen Z in Portland - health-conscious and climate-anxious" },
      { id: 34, thumbnail: "🇪🇸", title: "Learn Spanish in 10 Days", reason: "Your demographic is 3x more likely to be learning languages" },
      { id: 43, thumbnail: "🧘‍♀️", title: "Mindfulness Meditation Guide", reason: "Portland + your age group = peak mindfulness engagement" },
    ],
  },
  {
    age: "45-60",
    gender: "Male",
    location: "Denver",
    recommendations: [
      { id: 23, thumbnail: "🗾", title: "Travel Guide: Japan", reason: "Men 45-60 in Denver: peak travel age with disposable income" },
      { id: 18, thumbnail: "🔪", title: "Knife Set", reason: "Your demographic is upgrading kitchen equipment right now" },
      { id: 21, thumbnail: "🎹", title: "Piano Basics - Your First Song", reason: "Mid-life hobby acquisition phase detected" },
    ],
  },
];

// Control - latest videos only
const controlRecommendations = [
  { id: 1, thumbnail: "🤖", title: "The Future of AI in 2025", reason: "This was uploaded recently" },
  { id: 2, thumbnail: "💻", title: "Web Development Crash Course", reason: "Latest in the Technology category" },
  { id: 8, thumbnail: "🍕", title: "Homemade Pizza from Scratch", reason: "Recent upload in Cooking" },
  { id: 14, thumbnail: "🧘", title: "Morning Yoga Flow", reason: "Just posted in Fitness" },
  { id: 21, thumbnail: "🎤", title: "Singing Techniques & Vocal Warm-ups", reason: "Recent addition to Music" },
  { id: 28, thumbnail: "🎮", title: "Gaming Setup Tour 2024", reason: "Newest in Gaming category" },
];

export interface VideoRecommenderModalProps {
  onClose?: () => void;
}

export function VideoRecommenderModal(props: VideoRecommenderModalProps) {
  const { onClose } = props;
  const router = useRouter();
  const [variant, setVariant] = React.useState<Variant | null>(null);
  const [recommendation, setRecommendation] = React.useState<any>(null);
  const [demographicProfile, setDemographicProfile] = React.useState<any>(null);

  React.useEffect(() => {
    initMixpanelOnce();

    // Add error handling for feature flag fetch
    mixpanel.flags
      .get_variant_value(experimentId, fallbackVariant)
      .then((returnedVariant: unknown) => {
        let v = returnedVariant as Variant;
        if (!v || typeof v !== "string") v = fallbackVariant;
        console.log("[MIXPANEL]: GOT FLAG (Video Recommender)", v);
        setVariant(v);

        // Generate recommendation based on variant
        if (v === "A (meme engine)") {
          const randomRec = memeRecommendations[Math.floor(Math.random() * memeRecommendations.length)];
          setRecommendation(randomRec);
        } else if (v === "B (demographics)") {
          const randomProfile = demographicsProfiles[Math.floor(Math.random() * demographicsProfiles.length)];
          const randomRec = randomProfile.recommendations[Math.floor(Math.random() * randomProfile.recommendations.length)];
          setDemographicProfile(randomProfile);
          setRecommendation(randomRec);
        } else {
          const randomRec = controlRecommendations[Math.floor(Math.random() * controlRecommendations.length)];
          setRecommendation(randomRec);
        }

        mixpanel.track("Video Recommender Opened", { variant: v });
      })
      .catch((error: Error) => {
        console.error("[MIXPANEL]: Error fetching feature flag:", error);
        // Fallback to control variant on error
        const v = fallbackVariant;
        setVariant(v);
        const randomRec = controlRecommendations[Math.floor(Math.random() * controlRecommendations.length)];
        setRecommendation(randomRec);
        mixpanel.track("Video Recommender Opened", { variant: v, error: "flag_fetch_failed" });
      });
  }, []);

  const handleWatchVideo = () => {
    if (!recommendation || !variant) return;

    mixpanel.track("Recommended Video Clicked", {
      variant,
      video_id: recommendation.id,
      video_title: recommendation.title,
    });

    // Navigate to video (all play Rick Roll)
    router.push('/streaming/watch');
  };

  const handleClose = () => {
    if (variant) {
      mixpanel.track("Video Recommender Closed", { variant });
    }
    onClose?.();
  };

  // Show loading state while fetching flag
  if (!variant || !recommendation) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black opacity-60" onClick={handleClose} />
        <div className="relative z-10 bg-white rounded-lg shadow-2xl w-11/12 max-w-lg p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CC332B]"></div>
          </div>
          <p className="text-center text-gray-600 text-sm">Loading recommendation...</p>
        </div>
      </div>
    );
  }

  // Different styles for each variant
  const variantStyles: Record<Variant, {
    modalBg: string;
    border: string;
    accentColor: string;
    badgeBg: string;
    buttonBg: string;
  }> = {
    "A (meme engine)": {
      modalBg: "bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50",
      border: "border-4 border-purple-500",
      accentColor: "#9333ea", // purple-600
      badgeBg: "bg-purple-500 text-white",
      buttonBg: "bg-purple-600 hover:bg-purple-700",
    },
    "B (demographics)": {
      modalBg: "bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50",
      border: "border-4 border-blue-500",
      accentColor: "#2563eb", // blue-600
      badgeBg: "bg-blue-500 text-white",
      buttonBg: "bg-blue-600 hover:bg-blue-700",
    },
    "C (control)": {
      modalBg: "bg-white",
      border: "border-2 border-gray-300",
      accentColor: "#CC332B",
      badgeBg: "bg-gray-500 text-white",
      buttonBg: "bg-[#CC332B] hover:bg-[#CC332B]/90",
    },
  };

  // At this point, variant is guaranteed to be non-null due to early return above
  const style = variantStyles[variant as Variant];

  // Double check that style exists (should never happen due to early return, but TypeScript safety)
  if (!style) {
    console.error("[VideoRecommenderModal]: style is undefined for variant:", variant);
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black opacity-60" onClick={handleClose} />

      {/* Modal */}
      <div className={`relative z-10 ${style.modalBg} rounded-lg shadow-2xl w-11/12 max-w-lg p-6 ${style.border}`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <FlagIcon className="h-5 w-5" style={{ color: style.accentColor }} />
            <SparklesIcon className="h-5 w-5" style={{ color: style.accentColor }} />
            <h2 className="text-2xl font-bold text-gray-900">Just For You</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <XIcon className="h-5 w-5" />
          </Button>
        </div>

        {/* Recommendation Type Badge with Variant Name */}
        <div className="mb-4">
          {variant === "A (meme engine)" && (
            <div className="space-y-2">
              <span className={`inline-block px-4 py-2 ${style.badgeBg} rounded-full text-sm font-bold shadow-lg`}>
                🎭 VARIANT A: Meme-Powered Engine
              </span>
              <p className="text-xs text-purple-700 font-semibold">Silly, zany, and probably not what you asked for!</p>
            </div>
          )}
          {variant === "B (demographics)" && (
            <div className="space-y-2">
              <span className={`inline-block px-4 py-2 ${style.badgeBg} rounded-full text-sm font-bold shadow-lg`}>
                📊 VARIANT B: Demographics-Based
              </span>
              <p className="text-xs text-blue-700 font-semibold">Recommendations based on your demographic profile</p>
            </div>
          )}
          {variant === "C (control)" && (
            <div className="space-y-2">
              <span className={`inline-block px-4 py-2 ${style.badgeBg} rounded-full text-sm font-bold shadow-lg`}>
                <ClockIcon className="inline h-3 w-3 mr-1" />
                CONTROL (C): Latest Uploads
              </span>
              <p className="text-xs text-gray-600 font-semibold">Simple chronological recommendations</p>
            </div>
          )}
        </div>

        {/* Demographic Profile (for variant B) */}
        {variant === "B (demographics)" && demographicProfile && (
          <div className="mb-4 p-4 bg-blue-100 rounded-lg border-2 border-blue-400">
            <p className="text-sm text-blue-900 font-semibold">
              👤 <strong>Your Profile:</strong> {demographicProfile.gender}, {demographicProfile.age} years old, {demographicProfile.location}
            </p>
          </div>
        )}

        {/* Video Thumbnail */}
        <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden mb-4">
          <div className="flex items-center justify-center h-full text-8xl">
            {recommendation.thumbnail}
          </div>
          <div className="absolute inset-0 bg-black/10 flex items-center justify-center hover:bg-black/20 transition-all cursor-pointer group" onClick={handleWatchVideo}>
            <PlayIcon className="h-16 w-16 text-white drop-shadow-lg group-hover:scale-110 transition-transform" />
          </div>
        </div>

        {/* Video Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3">{recommendation.title}</h3>

        {/* Recommendation Reason */}
        <div className="border-l-4 p-4 rounded mb-4" style={{
          backgroundColor: variant === "A (meme engine)" ? "#faf5ff" : variant === "B (demographics)" ? "#eff6ff" : "#FFF5F5",
          borderColor: style.accentColor
        }}>
          <p className="text-sm text-gray-700">
            <strong style={{ color: style.accentColor }}>Why we're recommending this:</strong><br/>
            {recommendation.reason}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleWatchVideo}
            className={`flex-1 ${style.buttonBg} text-white`}
          >
            <PlayIcon className="mr-2 h-5 w-5" />
            Watch Now
          </Button>
          <Button
            onClick={handleClose}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Not Interested
          </Button>
        </div>

        {variant === "A (meme engine)" && (
          <p className="text-xs text-purple-600 text-center mt-4 italic font-semibold">
            ⚠️ Meme-powered AI may or may not understand what you actually want to watch
          </p>
        )}

        {variant === "B (demographics)" && (
          <p className="text-xs text-blue-600 text-center mt-4 italic font-semibold">
            📊 Based on aggregated data from users similar to you
          </p>
        )}

        <a
          href="https://mixpanel.com/project/3276012/view/3782804/app/feature-flags/ddf7f839-1579-4e15-9dc2-a6f030a3770e"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs hover:opacity-80 mt-3 block text-center transition-colors"
          style={{ color: style.accentColor }}
        >
          ⚙️ View flag in Mixpanel
        </a>
      </div>
    </div>
  );
}
