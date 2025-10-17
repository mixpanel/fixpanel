"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useColorScheme } from "./ColorSchemeProvider";
import { MoonIcon, SunIcon, SparklesIcon } from "lucide-react";

export function ThemeSlider() {
  const { variant, themeProgress, setThemeProgress } = useColorScheme();
  const [isHovering, setIsHovering] = React.useState(false);

  // Only show slider for variants A and B
  if (!variant || variant.toLowerCase().includes("control")) {
    return null;
  }

  const variantStr = String(variant).toLowerCase();
  const isDarkMode = variantStr.includes("dark");
  const isChaosMode = variantStr.includes("chaos");

  const label = isDarkMode ? "Dark Mode" : isChaosMode ? "Chaos Mode" : "";
  const Icon = isDarkMode ? MoonIcon : isChaosMode ? SparklesIcon : SunIcon;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setThemeProgress(value);

    // Track slider interaction
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('Theme Slider Adjusted', {
        variant,
        progress: value,
        mode: label,
      });
    }
  };

  return (
    <motion.div
      className="fixed top-20 right-6 z-50"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <motion.div
        className="backdrop-blur-md rounded-full px-6 py-3 shadow-lg border"
        style={{
          backgroundColor: `rgba(255, 255, 255, ${0.1 + themeProgress * 0.05})`,
          borderColor: `rgba(100, 100, 100, ${0.2 + themeProgress * 0.3})`,
        }}
        whileHover={{ scale: 1.05 }}
        animate={{
          boxShadow: isHovering
            ? "0 10px 40px rgba(0, 0, 0, 0.3)"
            : "0 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="flex items-center gap-3">
          {/* Light icon */}
          <motion.div
            animate={{
              opacity: 1 - themeProgress,
              scale: 1 - themeProgress * 0.3,
            }}
          >
            <SunIcon className="h-5 w-5 text-yellow-500" />
          </motion.div>

          {/* Slider */}
          <div className="relative">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={themeProgress}
              onChange={handleSliderChange}
              className="w-32 h-2 rounded-full appearance-none cursor-pointer slider-thumb"
              style={{
                background: `linear-gradient(to right,
                  #fbbf24 0%,
                  #fbbf24 ${themeProgress * 100}%,
                  rgba(200, 200, 200, 0.3) ${themeProgress * 100}%,
                  rgba(200, 200, 200, 0.3) 100%)`,
              }}
            />
          </div>

          {/* Target mode icon */}
          <motion.div
            animate={{
              opacity: themeProgress,
              scale: 0.7 + themeProgress * 0.3,
              rotate: isChaosMode ? themeProgress * 360 : 0,
            }}
          >
            <Icon
              className={`h-5 w-5 ${
                isDarkMode ? "text-indigo-400" : "text-purple-500"
              }`}
            />
          </motion.div>
        </div>

        {/* Label that appears on hover */}
        <motion.div
          className="text-center mt-2 text-xs font-medium"
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: isHovering ? "auto" : 0,
            opacity: isHovering ? 1 : 0,
          }}
          style={{
            color: `rgba(100, 100, 100, ${0.7 + themeProgress * 0.3})`,
          }}
        >
          {themeProgress === 0 && "Light Mode"}
          {themeProgress > 0 && themeProgress < 1 && `${label} (${Math.round(themeProgress * 100)}%)`}
          {themeProgress === 1 && label}
        </motion.div>
      </motion.div>

      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
        }

        .slider-thumb::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .slider-thumb::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
        }

        .slider-thumb::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </motion.div>
  );
}
