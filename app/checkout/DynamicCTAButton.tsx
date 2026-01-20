"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Gift, Zap, Rocket, AlertCircle } from "lucide-react";
import { initMixpanelOnce } from "@/lib/analytics";

// @ts-ignore
declare global {
  interface Window {
    mixpanel: any;
  }
}

interface CTAConfig {
  cta: string;         // Button text
  description: string; // Tooltip text
  color: string;       // Button background color
}

// Default configs for testing (these should come from Mixpanel in production)
const defaultConfigs: { [key: string]: CTAConfig } = {
  snag: {
    cta: "Snag It! ⚡️",
    description: "Flash Sale: 20% off for the next hour only",
    color: "#FF4500"
  },
  treat: {
    cta: "Treat Yourself 💅",
    description: "Free mystery gift with every purchase",
    color: "#9B59B6"
  },
  yeet: {
    cta: "Yeet 2 Cart 🛒",
    description: "Free shipping because we vibe with you",
    color: "#32CD32"
  },
  click: {
    cta: "Don't Click 🚫",
    description: "Just kidding, click for a secret discount code",
    color: "#111111"
  }
};

export function DynamicCTAButton() {
  const [config, setConfig] = useState<CTAConfig | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [variantKey, setVariantKey] = useState<string>("");

  useEffect(() => {
    initMixpanelOnce();

    // Fetch feature flag configuration
    if (window.mixpanel?.flags) {
      window.mixpanel.flags
        .get_variant_value('we_buy_custom_cta', null)
        .then((value: any) => {
          console.log('[MIXPANEL]: Got CTA config:', value);

          if (value && typeof value === 'object' && 'cta' in value) {
            setConfig(value as CTAConfig);
            // Try to determine variant key for tracking
            Object.entries(defaultConfigs).forEach(([key, cfg]) => {
              if (cfg.cta === value.cta) {
                setVariantKey(key);
              }
            });

            window.mixpanel.track('Dynamic CTA Loaded', {
              variant: variantKey || 'custom',
              cta_text: value.cta,
              color: value.color
            });
          } else {
            // Fallback to a random default for demo purposes
            const keys = Object.keys(defaultConfigs);
            const randomKey = keys[Math.floor(Math.random() * keys.length)];
            setConfig(defaultConfigs[randomKey]);
            setVariantKey(randomKey);

            console.log('[MIXPANEL]: Using fallback CTA config:', randomKey);
            window.mixpanel.track('Dynamic CTA Loaded', {
              variant: randomKey,
              cta_text: defaultConfigs[randomKey].cta,
              color: defaultConfigs[randomKey].color,
              is_fallback: true
            });
          }
          setIsLoading(false);
        })
        .catch((error: any) => {
          console.error('[MIXPANEL]: Error fetching CTA config:', error);
          // Use fallback on error
          const fallbackKey = 'snag';
          setConfig(defaultConfigs[fallbackKey]);
          setVariantKey(fallbackKey);
          setIsLoading(false);
        });
    } else {
      // No Mixpanel, use fallback
      const fallbackKey = 'snag';
      setConfig(defaultConfigs[fallbackKey]);
      setVariantKey(fallbackKey);
      setIsLoading(false);
    }
  }, []);

  const handleClick = () => {
    if (window.mixpanel) {
      window.mixpanel.track('Dynamic CTA Clicked', {
        variant: variantKey,
        cta_text: config?.cta,
        color: config?.color
      });
    }

    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (window.mixpanel) {
      window.mixpanel.track('Dynamic CTA Modal Closed', {
        variant: variantKey
      });
    }
  };

  const getModalContent = () => {
    if (variantKey === 'click' || config?.cta.includes("Don't Click")) {
      return {
        icon: <AlertCircle className="h-12 w-12 text-purple-500" />,
        title: "You Did It! 🎉",
        subtitle: "You absolute madlad!",
        code: "REBEL10",
        description: "Use this code for 10% off your entire order",
        color: "#9B59B6"
      };
    } else if (variantKey === 'snag') {
      return {
        icon: <Zap className="h-12 w-12 text-orange-500" />,
        title: "Flash Sale Activated! ⚡",
        subtitle: "Limited time only!",
        code: "FLASH20",
        description: "20% off for the next hour - hurry!",
        color: "#FF4500"
      };
    } else if (variantKey === 'treat') {
      return {
        icon: <Gift className="h-12 w-12 text-purple-500" />,
        title: "Mystery Gift Unlocked! 💝",
        subtitle: "You deserve it!",
        code: null,
        description: "A surprise gift will be added to your next order automatically",
        color: "#9B59B6"
      };
    } else if (variantKey === 'yeet') {
      return {
        icon: <Rocket className="h-12 w-12 text-green-500" />,
        title: "Free Shipping Unlocked! 🚀",
        subtitle: "We see you, fam!",
        code: null,
        description: "Free shipping has been applied to your cart",
        color: "#32CD32"
      };
    } else {
      return {
        icon: <Sparkles className="h-12 w-12 text-yellow-500" />,
        title: "Special Offer Activated! 🎯",
        subtitle: "Just for you!",
        code: "SPECIAL15",
        description: "Check your cart for exclusive surprises",
        color: "#FFD700"
      };
    }
  };

  // Don't render anything while loading or if no config
  if (isLoading || !config) {
    return null;
  }

  // Determine text color based on background brightness
  const getTextColor = (bgColor: string) => {
    // Simple check: dark backgrounds get white text
    const isDark = bgColor === '#111111' || bgColor.toLowerCase().includes('000');
    return isDark ? '#ffffff' : '#ffffff'; // Keep white for all our variants
  };

  const modalContent = getModalContent();

  return (
    <>
      <div className="relative inline-block">
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.1
          }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 10px 40px rgba(0,0,0,0.2)"
          }}
          whileTap={{ scale: 0.95 }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={handleClick}
          className="px-6 py-3 font-bold text-lg rounded-lg transition-all duration-200 relative overflow-hidden"
          style={{
            backgroundColor: config.color,
            color: getTextColor(config.color),
            border: config.color === '#111111' ? '2px solid #333' : 'none'
          }}
        >
          {/* Animated background effect */}
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{
              background: [
                `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)`,
                `radial-gradient(circle at 80% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)`,
                `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)`
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />

          {/* Pulse effect for urgency */}
          {(variantKey === 'snag' || config.cta.includes('⚡')) && (
            <motion.div
              className="absolute inset-0 rounded-lg"
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(255,69,0,0.4)",
                  "0 0 0 10px rgba(255,69,0,0)",
                  "0 0 0 0 rgba(255,69,0,0)"
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            />
          )}

          {/* Button text */}
          <span className="relative z-10">{config.cta}</span>
        </motion.button>

        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-full left-0 mb-2 z-50 pointer-events-none"
            >
              <div className="bg-gray-900 text-white text-base rounded-lg py-3 px-4 whitespace-nowrap shadow-xl">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-400" />
                  <span className="font-medium">{config.description}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={handleCloseModal}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              {/* Gradient header */}
              <div
                className="h-2"
                style={{
                  background: `linear-gradient(90deg, ${modalContent.color}, ${modalContent.color}dd)`
                }}
              />

              {/* Close button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>

              {/* Content */}
              <div className="p-8 text-center">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  transition={{ type: "spring", duration: 0.6, delay: 0.1 }}
                  className="mx-auto mb-4"
                >
                  {modalContent.icon}
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold text-gray-900 mb-2"
                >
                  {modalContent.title}
                </motion.h2>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-600 mb-6"
                >
                  {modalContent.subtitle}
                </motion.p>

                {/* Code Box */}
                {modalContent.code && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gray-100 rounded-lg p-4 mb-4"
                  >
                    <div className="text-sm text-gray-600 mb-1">Discount Code:</div>
                    <div className="text-2xl font-mono font-bold text-gray-900">{modalContent.code}</div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(modalContent.code);
                        if (window.mixpanel) {
                          window.mixpanel.track('Dynamic CTA Code Copied', {
                            variant: variantKey,
                            code: modalContent.code
                          });
                        }
                      }}
                      className="mt-2 text-sm text-purple-600 hover:text-purple-800 transition-colors"
                    >
                      Copy to clipboard
                    </button>
                  </motion.div>
                )}

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-sm text-gray-500 mb-6"
                >
                  {modalContent.description}
                </motion.p>

                {/* Action button */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCloseModal}
                  className="w-full py-3 px-6 rounded-lg font-semibold text-white transition-all"
                  style={{
                    backgroundColor: modalContent.color
                  }}
                >
                  Continue Shopping
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}