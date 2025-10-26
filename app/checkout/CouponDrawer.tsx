"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Gift, Sparkles, Tag, Star, Zap, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { initMixpanelOnce, mixpanel } from "@/lib/analytics";

const experimentId = "they-buy-coupon-offer";
type Variant = "Control (10% off)" | "A (13% odd # letters)" | "B (15% items with q)" | "C (12% off plurals)" | "D (25% off rhymes)";
const fallbackVariant: Variant = "Control (10% off)";

interface OfferConfig {
  code: string;
  title: string;
  description: string;
  longDescription: string;
  discount: string;
  color: string;
  bgGradient: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

const offerConfigs: Record<string, OfferConfig> = {
  "control": {
    code: "SAVE10",
    title: "Welcome Offer!",
    description: "Get 10% off your entire order",
    longDescription: "Apply this coupon code at checkout to receive 10% off your entire purchase. No minimum order required. Valid on all items in your cart. This offer cannot be combined with other promotions.",
    discount: "10% OFF",
    color: "text-purple-600",
    bgGradient: "from-purple-500 to-indigo-600",
    icon: Gift,
    accentColor: "bg-purple-100 border-purple-300",
  },
  "a": {
    code: "ODD13",
    title: "Lucky Letters!",
    description: "13% off items with odd # of letters",
    longDescription: "Get 13% off any products whose names have an odd number of letters! For example: 'Hat' (3 letters), 'Shirt' (5 letters), or 'Jacket' (6 letters - wait, that's even, never mind!). The discount applies automatically to qualifying items at checkout.",
    discount: "13% OFF",
    color: "text-orange-600",
    bgGradient: "from-orange-500 to-red-600",
    icon: Sparkles,
    accentColor: "bg-orange-100 border-orange-300",
  },
  "b": {
    code: "QUEST15",
    title: "Quest for Q!",
    description: "15% off items containing the letter 'q'",
    longDescription: "Enjoy 15% off on any item that contains the letter 'Q' in its name! That means products like 'Quilted jacket', 'Turquoise scarf', or 'Boutique handbag' all qualify. The more Q's in your cart, the more you save!",
    discount: "15% OFF",
    color: "text-teal-600",
    bgGradient: "from-teal-500 to-cyan-600",
    icon: Tag,
    accentColor: "bg-teal-100 border-teal-300",
  },
  "c": {
    code: "PLURAL12",
    title: "Plural Power!",
    description: "12% off all plural items (socks, gloves, etc.)",
    longDescription: "Save 12% on items that come in pairs or sets! This includes socks, gloves, shoes, earrings, bookends, and any other products with plural names. Perfect for stocking up on essentials that you always need two (or more) of!",
    discount: "12% OFF",
    color: "text-blue-600",
    bgGradient: "from-blue-500 to-indigo-600",
    icon: Star,
    accentColor: "bg-blue-100 border-blue-300",
  },
  "d": {
    code: "RHYME25",
    title: "Rhyme Time!",
    description: "25% off items that rhyme with each other",
    longDescription: "Unlock a massive 25% discount when you buy items with names that rhyme! Mix and match products like 'Hat' & 'Mat', 'Sock' & 'Clock', or 'Shoes' & 'Blues'. The more rhyming items in your cart, the bigger your savings!",
    discount: "25% OFF",
    color: "text-pink-600",
    bgGradient: "from-pink-500 to-rose-600",
    icon: Zap,
    accentColor: "bg-pink-100 border-pink-300",
  },
};

export function CouponDrawer() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isDismissed, setIsDismissed] = React.useState(false);
  const [isRevealed, setIsRevealed] = React.useState(false);
  const [isCopied, setIsCopied] = React.useState(false);
  const [variant, setVariant] = React.useState<Variant | null>(null);
  const [offer, setOffer] = React.useState<OfferConfig>(offerConfigs.control);

  React.useEffect(() => {
    initMixpanelOnce();

    // Delay drawer open for dramatic effect
    const openTimer = setTimeout(() => setIsOpen(true), 2000);

    mixpanel.flags
      .get_variant_value(experimentId, fallbackVariant)
      .then((returnedVariant: unknown) => {
        let v = returnedVariant as Variant;
        if (!v || typeof v !== "string") v = fallbackVariant;

        console.log("[MIXPANEL]: GOT FLAG (Coupon Offer)", v);
        setVariant(v);

        // Map variant to offer config
        const variantStr = String(v).toLowerCase();
        if (variantStr.includes("13%") || variantStr.includes("odd")) {
          setOffer(offerConfigs.a);
        } else if (variantStr.includes("15%") || variantStr.includes("q")) {
          setOffer(offerConfigs.b);
        } else if (variantStr.includes("12%") || variantStr.includes("plural")) {
          setOffer(offerConfigs.c);
        } else if (variantStr.includes("25%") || variantStr.includes("rhyme")) {
          setOffer(offerConfigs.d);
        } else {
          setOffer(offerConfigs.control);
        }

        mixpanel.track("Coupon Offer Loaded", { variant: v });
      });

    return () => clearTimeout(openTimer);
  }, []);

  const handleReveal = () => {
    setIsRevealed(true);
    if (variant && typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('Coupon Revealed', {
        variant,
        offer_code: offer.code,
        discount: offer.discount,
      });
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(offer.code);
      setIsCopied(true);

      if (variant && typeof window !== 'undefined' && window.mixpanel) {
        window.mixpanel.track('Coupon Copied', {
          variant,
          offer_code: offer.code,
        });
      }

      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsDismissed(true);
    if (variant && typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('Coupon Drawer Closed', {
        variant,
        was_revealed: isRevealed,
      });
    }
  };

  const handleReopen = () => {
    setIsOpen(true);
    if (variant && typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('Coupon Drawer Reopened', {
        variant,
        was_revealed: isRevealed,
      });
    }
  };

  const Icon = offer.icon;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/20 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
            />

            {/* Drawer */}
            <motion.div
              className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
            {/* Header */}
            <div className={`bg-gradient-to-r ${offer.bgGradient} p-4 text-white relative overflow-hidden`}>
              <motion.div
                className="absolute inset-0 opacity-20"
                animate={{
                  backgroundImage: [
                    'radial-gradient(circle at 20% 50%, white 0%, transparent 50%)',
                    'radial-gradient(circle at 80% 50%, white 0%, transparent 50%)',
                    'radial-gradient(circle at 20% 50%, white 0%, transparent 50%)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <motion.div
                className="flex items-center gap-3 mb-2"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Icon className="h-8 w-8" />
                <div>
                  <h2 className="text-xl font-bold">{offer.title}</h2>
                  <p className="text-sm text-white/90">{offer.description}</p>
                </div>
              </motion.div>
            </div>

            {/* Body */}
            <div className="flex-1 p-6 flex flex-col items-center justify-center">
              {!isRevealed ? (
                <motion.div
                  className="text-center"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.div
                    className={`w-32 h-32 mx-auto mb-6 bg-gradient-to-br ${offer.bgGradient} rounded-full flex items-center justify-center shadow-lg`}
                    whileHover={{ scale: 1.05 }}
                    animate={{
                      boxShadow: [
                        '0 10px 30px rgba(0,0,0,0.2)',
                        '0 10px 40px rgba(0,0,0,0.3)',
                        '0 10px 30px rgba(0,0,0,0.2)',
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Gift className="h-16 w-16 text-white" />
                  </motion.div>

                  <h3 className="text-2xl font-bold mb-2">You've Got a Deal!</h3>

                  <div className="mb-6 px-4">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {offer.longDescription}
                    </p>
                  </div>

                  <Button
                    onClick={handleReveal}
                    className={`bg-gradient-to-r ${offer.bgGradient} text-white hover:opacity-90 text-lg px-8 py-6`}
                  >
                    Reveal My Coupon
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  className="text-center w-full"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <motion.div
                    initial={{ rotateY: 0 }}
                    animate={{ rotateY: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className={`text-5xl font-bold ${offer.color} mb-4`}>
                      {offer.discount}
                    </div>
                  </motion.div>

                  <div className="mb-4 px-2">
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {offer.longDescription}
                    </p>
                  </div>

                  <div className={`border-2 ${offer.accentColor} rounded-lg p-4 mb-4`}>
                    <div className="text-sm text-gray-600 mb-1">Your Code:</div>
                    <div className={`text-3xl font-mono font-bold ${offer.color} tracking-wider`}>
                      {offer.code}
                    </div>
                  </div>

                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    className={`w-full ${isCopied ? 'bg-green-50 border-green-300' : ''}`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-4 w-4 mr-2 text-green-600" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Code
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 mt-4">
                    Use this code at checkout to get your discount!
                  </p>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>Powered by feature flags</span>
                  <ExternalLink className="h-3 w-3" />
                </div>
                <div className="flex justify-center gap-3 text-xs">
                  <a
                    href="https://mixpanel.com/project/3276012/view/3782804/app/feature-flags/2318d3c5-497a-43d7-adec-67cc000b7f8d"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gray-700 underline transition-colors"
                  >
                    View Flag
                  </a>
                  <span className="text-gray-300">•</span>
                  <a
                    href="https://mixpanel.com/project/3276012/view/3782804/app/experiments/933490cb-7727-48a0-ae1d-ade673507b4c"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gray-700 underline transition-colors"
                  >
                    View Experiment
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>

    {/* Reopen Button - Shows when drawer is dismissed */}
    <AnimatePresence>
      {isDismissed && !isOpen && (
        <motion.button
          onClick={handleReopen}
          className={`fixed left-0 top-1/2 -translate-y-1/2 bg-gradient-to-r ${offer.bgGradient} text-white px-3 py-6 rounded-r-lg shadow-lg z-40 flex flex-col items-center gap-2 hover:px-4 transition-all`}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 200, delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Icon className="h-5 w-5" />
          <div className="text-xs font-semibold transform rotate-180" style={{ writingMode: 'vertical-rl' }}>
            {offer.discount}
          </div>
          <Tag className="h-4 w-4" />
        </motion.button>
      )}
    </AnimatePresence>
  </>
  );
}
