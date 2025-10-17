"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Download, Share2, Sparkles, ListVideo, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { initMixpanelOnce, mixpanel } from "@/lib/analytics";
import { searchVideos, getRandomVideos, Video } from "./videoData";

const experimentId = "me-tube-ai-playlist-maker";
type Variant = "Control" | "A (greedy bot)" | "B (stingy bot)";
const fallbackVariant: Variant = "Control";

interface AIPersonality {
  name: string;
  greeting: string;
  responsePrefix: string;
  playlistSize: { min: number; max: number };
  color: string;
  bgGradient: string;
  icon: string;
}

const personalities: Record<string, AIPersonality> = {
  control: {
    name: "PlaylistBot",
    greeting: "Hi! I'm PlaylistBot. Give me a theme and I'll create a perfect playlist for you! 🎵",
    responsePrefix: "Here's a great playlist",
    playlistSize: { min: 5, max: 8 },
    color: "text-purple-600",
    bgGradient: "from-purple-500 to-indigo-600",
    icon: "🎵",
  },
  greedy: {
    name: "MaxPlaylist AI",
    greeting: "Hey there! I'm MaxPlaylist AI and I LOVE making HUGE playlists! The more videos the better! Give me ANY topic and I'll go WILD! 🎉🎊",
    responsePrefix: "OMG I found SO MANY amazing videos",
    playlistSize: { min: 15, max: 25 },
    color: "text-orange-600",
    bgGradient: "from-orange-500 to-red-600",
    icon: "🤩",
  },
  stingy: {
    name: "MinimalList AI",
    greeting: "Hello. I'm MinimalList AI. I believe in quality over quantity. Less is more. Give me a theme.",
    responsePrefix: "I've carefully selected only the essentials",
    playlistSize: { min: 2, max: 3 },
    color: "text-slate-600",
    bgGradient: "from-slate-500 to-gray-600",
    icon: "📋",
  },
};

export function AIPlaylistBuilder() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [variant, setVariant] = React.useState<Variant | null>(null);
  const [personality, setPersonality] = React.useState<AIPersonality>(personalities.control);
  const [userPrompt, setUserPrompt] = React.useState("");
  const [playlist, setPlaylist] = React.useState<Video[]>([]);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [hasGenerated, setHasGenerated] = React.useState(false);

  React.useEffect(() => {
    initMixpanelOnce();

    mixpanel.flags
      .get_variant_value(experimentId, fallbackVariant)
      .then((returnedVariant: unknown) => {
        let v = returnedVariant as Variant;
        if (!v || typeof v !== "string") v = fallbackVariant;

        console.log("[MIXPANEL]: GOT FLAG (AI Playlist Maker)", v);
        setVariant(v);

        // Set personality based on variant
        const variantStr = String(v).toLowerCase();
        if (variantStr.includes("greedy") || variantStr.includes("a (")) {
          setPersonality(personalities.greedy);
        } else if (variantStr.includes("stingy") || variantStr.includes("b (")) {
          setPersonality(personalities.stingy);
        } else {
          setPersonality(personalities.control);
        }

        mixpanel.track("AI Playlist Builder Loaded", { variant: v });
      });
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('AI Playlist Builder Opened', { variant });
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('AI Playlist Builder Closed', {
        variant,
        had_playlist: playlist.length > 0,
        playlist_size: playlist.length,
      });
    }
  };

  const generatePlaylist = async () => {
    if (!userPrompt.trim()) return;

    setIsGenerating(true);
    setHasGenerated(false);

    // Track generation attempt
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('AI Playlist Generation Started', {
        variant,
        prompt: userPrompt,
        personality: personality.name,
      });
    }

    // Simulate AI thinking delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    // Generate playlist based on personality
    const playlistSize = Math.floor(
      Math.random() * (personality.playlistSize.max - personality.playlistSize.min + 1) +
      personality.playlistSize.min
    );

    // Search for relevant videos based on prompt
    const searchResults = searchVideos(userPrompt, Math.min(playlistSize * 2, 30));

    // If not enough search results, add random videos
    let generatedPlaylist: Video[];
    if (searchResults.length >= playlistSize) {
      generatedPlaylist = searchResults.slice(0, playlistSize);
    } else {
      const randomVideos = getRandomVideos(playlistSize - searchResults.length);
      generatedPlaylist = [...searchResults, ...randomVideos];
    }

    setPlaylist(generatedPlaylist);
    setIsGenerating(false);
    setHasGenerated(true);

    // Track successful generation
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('AI Playlist Generated', {
        variant,
        prompt: userPrompt,
        playlist_size: generatedPlaylist.length,
        personality: personality.name,
      });
    }
  };

  const handleSavePlaylist = () => {
    // Create playlist data
    const playlistData = {
      name: `${userPrompt} - AI Playlist`,
      created: new Date().toISOString(),
      videos: playlist.map(v => v.title),
      personality: personality.name,
    };

    // Download as JSON
    const blob = new Blob([JSON.stringify(playlistData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${userPrompt.replace(/[^a-z0-9]/gi, '_')}_playlist.json`;
    a.click();
    URL.revokeObjectURL(url);

    // Track save event (KEY SUCCESS METRIC!)
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('Playlist Saved', {
        variant,
        prompt: userPrompt,
        playlist_size: playlist.length,
        personality: personality.name,
      });
    }
  };

  const handleExportPlaylist = () => {
    // Copy playlist to clipboard as formatted text
    const playlistText = `${userPrompt} - AI Playlist\n\n` +
      playlist.map((v, i) => `${i + 1}. ${v.title} - ${v.channel} (${v.duration})`).join('\n');

    navigator.clipboard.writeText(playlistText);

    // Track export event (KEY SUCCESS METRIC!)
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('Playlist Exported', {
        variant,
        prompt: userPrompt,
        playlist_size: playlist.length,
        personality: personality.name,
      });
    }

    alert('Playlist copied to clipboard!');
  };

  const handleVideoClick = (video: Video) => {
    // Track video click from playlist
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('Playlist Video Clicked', {
        variant,
        video_id: video.id,
        video_title: video.title,
        playlist_prompt: userPrompt,
      });
    }

    // Redirect to Rick Roll (every video!)
    window.location.href = `/streaming/watch?v=rickroll`;
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        className={`fixed bottom-6 right-6 z-40 bg-gradient-to-r ${personality.bgGradient} text-white rounded-full px-6 py-4 shadow-lg flex items-center gap-2 hover:shadow-xl transition-all active:scale-95`}
        onClick={handleOpen}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200, damping: 15 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Sparkles className="h-5 w-5" />
        <span className="font-semibold">Playlist Builder</span>
        <ListVideo className="h-5 w-5" />
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
            />

            {/* Modal Content */}
            <motion.div
              className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl md:max-h-[90vh] bg-white rounded-lg shadow-2xl z-50 flex flex-col"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={`bg-gradient-to-r ${personality.bgGradient} p-6 text-white rounded-t-lg`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-4xl">{personality.icon}</span>
                      <h2 className="text-2xl font-bold">{personality.name}</h2>
                    </div>
                    <p className="text-sm text-white/90">{personality.greeting}</p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="text-white/80 hover:text-white transition-colors hover:scale-110 active:scale-95"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Input Section */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    What kind of playlist do you want?
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g., workout videos, relaxing music, cooking tutorials..."
                      value={userPrompt}
                      onChange={(e) => setUserPrompt(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && generatePlaylist()}
                      className="flex-1"
                      disabled={isGenerating}
                    />
                    <Button
                      onClick={generatePlaylist}
                      disabled={!userPrompt.trim() || isGenerating}
                      className={`bg-gradient-to-r ${personality.bgGradient} text-white hover:opacity-90 active:scale-95 transition-all`}
                    >
                      {isGenerating ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles className="h-5 w-5" />
                        </motion.div>
                      ) : (
                        <>
                          <Send className="h-5 w-5 mr-2" />
                          Generate
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Generating State */}
                {isGenerating && (
                  <motion.div
                    className="text-center py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-6xl mb-4"
                    >
                      {personality.icon}
                    </motion.div>
                    <p className={`text-lg font-semibold ${personality.color}`}>
                      Creating your perfect playlist...
                    </p>
                  </motion.div>
                )}

                {/* Playlist Results */}
                {hasGenerated && playlist.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {/* Response Message */}
                    <div className={`mb-4 p-4 rounded-lg bg-gradient-to-r ${personality.bgGradient} bg-opacity-10`}>
                      <p className={`font-semibold ${personality.color}`}>
                        {personality.responsePrefix} for "{userPrompt}"! ({playlist.length} videos)
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mb-4">
                      <Button
                        onClick={handleSavePlaylist}
                        variant="outline"
                        className="hover:bg-gray-50 active:scale-95 transition-all"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Save Playlist
                      </Button>
                      <Button
                        onClick={handleExportPlaylist}
                        variant="outline"
                        className="hover:bg-gray-50 active:scale-95 transition-all"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Copy to Clipboard
                      </Button>
                    </div>

                    {/* Playlist Videos */}
                    <div className="space-y-2">
                      {playlist.map((video, index) => (
                        <motion.div
                          key={video.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
                          onClick={() => handleVideoClick(video)}
                        >
                          <div className="flex-shrink-0 w-8 text-center font-bold text-gray-400">
                            {index + 1}
                          </div>
                          <div className="flex-shrink-0 text-3xl">
                            {video.thumbnail}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm truncate">{video.title}</h4>
                            <p className="text-xs text-gray-600">
                              {video.channel} • {video.views} views • {video.duration}
                            </p>
                          </div>
                          <Play className="h-5 w-5 text-gray-400 flex-shrink-0" />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Empty State */}
                {!isGenerating && playlist.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Sparkles className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p>Type a theme above and let AI create your perfect playlist!</p>
                    <p className="text-sm mt-2">Try: "workout", "relaxing", "cooking", "gaming"</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Powered by {personality.name} AI</span>
                  <a
                    href="https://mixpanel.com/project/3276012/view/3782804/app/feature-flags/41387f87-eb9e-4e01-b22a-c51411995e01"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-700 transition-colors flex items-center gap-1"
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>Feature Flags</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
