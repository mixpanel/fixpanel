"use client";

import * as React from "react";
import { initMixpanelOnce, mixpanel } from "@/lib/analytics";

const experimentId = "they-buy-color-schemes";
type Variant = "dark mode (A)" | "chaos mode (B)" | "control (C)";
const fallbackVariant: Variant = "control (C)";

// Generate random chaotic colors
const generateChaosColors = () => {
  const randomColor = () => `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
  return {
    primary: randomColor(),
    secondary: randomColor(),
    accent: randomColor(),
    background: randomColor(),
    text: randomColor(),
    cardBg: randomColor(),
    border: randomColor(),
    buttonBg: randomColor(),
    buttonText: randomColor(),
  };
};

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  cardBg: string;
  border: string;
  buttonBg: string;
  buttonText: string;
}

const darkModeColors: ColorScheme = {
  primary: "#10b981", // emerald-500
  secondary: "#6366f1", // indigo-500
  accent: "#f59e0b", // amber-500
  background: "#111827", // gray-900
  text: "#f9fafb", // gray-50
  cardBg: "#1f2937", // gray-800
  border: "#374151", // gray-700
  buttonBg: "#10b981", // emerald-500
  buttonText: "#111827", // gray-900
};

const lightModeColors: ColorScheme = {
  primary: "#07B096",
  secondary: "#059669",
  accent: "#0d9488",
  background: "#ffffff",
  text: "#111827",
  cardBg: "#ffffff",
  border: "#e5e7eb",
  buttonBg: "#07B096",
  buttonText: "#ffffff",
};

interface ColorSchemeContextType {
  variant: Variant | null;
  colors: ColorScheme;
}

const ColorSchemeContext = React.createContext<ColorSchemeContextType>({
  variant: null,
  colors: lightModeColors,
});

export const useColorScheme = () => React.useContext(ColorSchemeContext);

export function ColorSchemeProvider({ children }: { children: React.ReactNode }) {
  const [variant, setVariant] = React.useState<Variant | null>(null);
  const [colors, setColors] = React.useState<ColorScheme>(lightModeColors);
  const [showFlagLink, setShowFlagLink] = React.useState(false);

  React.useEffect(() => {
    initMixpanelOnce();
    mixpanel.flags
      .get_variant_value(experimentId, fallbackVariant)
      .then((returnedVariant: unknown) => {
        let v = returnedVariant as Variant;
        if (!v || typeof v !== "string") v = fallbackVariant;
        console.log("[MIXPANEL]: GOT FLAG (Color Scheme)", v);
        setVariant(v);

        // Set colors based on variant
        if (v === "dark mode (A)") {
          setColors(darkModeColors);
        } else if (v === "chaos mode (B)") {
          setColors(generateChaosColors());
        } else {
          setColors(lightModeColors); // control
        }

        mixpanel.track("Checkout Color Scheme Loaded", { variant: v });

        // Show flag link after a delay
        setTimeout(() => setShowFlagLink(true), 2000);
      });
  }, []);

  // Apply colors to CSS variables
  React.useEffect(() => {
    if (variant && typeof document !== "undefined") {
      const root = document.documentElement;
      root.style.setProperty("--color-primary", colors.primary);
      root.style.setProperty("--color-secondary", colors.secondary);
      root.style.setProperty("--color-accent", colors.accent);
      root.style.setProperty("--color-background", colors.background);
      root.style.setProperty("--color-text", colors.text);
      root.style.setProperty("--color-card-bg", colors.cardBg);
      root.style.setProperty("--color-border", colors.border);
      root.style.setProperty("--color-button-bg", colors.buttonBg);
      root.style.setProperty("--color-button-text", colors.buttonText);
    }
  }, [variant, colors]);

  return (
    <ColorSchemeContext.Provider value={{ variant, colors }}>
      {children}
      {showFlagLink && variant && variant !== "control (C)" && (
        <a
          href="https://mixpanel.com/project/3276012/view/3782804/app/feature-flags/1c4fa66b-c9d4-4f22-aba4-a4563e0c1328"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed top-20 right-4 z-50 text-xs bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-lg hover:shadow-xl transition-all opacity-70 hover:opacity-100"
          style={{ color: colors.primary }}
        >
          ⚙️ View flag config
        </a>
      )}
    </ColorSchemeContext.Provider>
  );
}
