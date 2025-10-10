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
  background: "#111827", // gray-900 - DARK background
  text: "#f9fafb", // gray-50 - LIGHT text
  cardBg: "#1f2937", // gray-800 - darker cards
  border: "#374151", // gray-700
  buttonBg: "#10b981", // emerald-500
  buttonText: "#ffffff", // white text on buttons
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
        console.log("[DEBUG]: Variant type:", typeof v, "| Variant value:", JSON.stringify(v));
        setVariant(v);

        // Set colors based on variant - use includes() for more flexible matching
        const variantStr = String(v).toLowerCase();
        if (variantStr.includes("dark")) {
          console.log("[COLOR SCHEME]: Setting dark mode colors", darkModeColors);
          setColors(darkModeColors);
        } else if (variantStr.includes("chaos")) {
          const chaosColors = generateChaosColors();
          console.log("[COLOR SCHEME]: Setting chaos mode colors", chaosColors);
          setColors(chaosColors);
        } else {
          console.log("[COLOR SCHEME]: Setting light mode colors (control)", lightModeColors);
          setColors(lightModeColors); // control
        }

        mixpanel.track("Checkout Color Scheme Loaded", { variant: v });

        // Show flag link after a delay
        setTimeout(() => setShowFlagLink(true), 2000);
      });
  }, []);

  // Apply colors to CSS variables and body
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

      // Apply background and text colors to body
      document.body.style.backgroundColor = colors.background;
      document.body.style.color = colors.text;
    }
  }, [variant, colors]);

  return (
    <ColorSchemeContext.Provider value={{ variant, colors }}>
      {children}
    </ColorSchemeContext.Provider>
  );
}
