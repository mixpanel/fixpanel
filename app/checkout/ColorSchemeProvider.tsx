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
  themeProgress: number; // 0 = light, 1 = dark/chaos
  setThemeProgress: (progress: number) => void;
}

const ColorSchemeContext = React.createContext<ColorSchemeContextType>({
  variant: null,
  colors: lightModeColors,
  themeProgress: 0,
  setThemeProgress: () => {},
});

export const useColorScheme = () => React.useContext(ColorSchemeContext);

// Helper to interpolate between two colors
const interpolateColor = (color1: string, color2: string, progress: number): string => {
  const hex1 = color1.replace('#', '');
  const hex2 = color2.replace('#', '');

  const r1 = parseInt(hex1.substring(0, 2), 16);
  const g1 = parseInt(hex1.substring(2, 4), 16);
  const b1 = parseInt(hex1.substring(4, 6), 16);

  const r2 = parseInt(hex2.substring(0, 2), 16);
  const g2 = parseInt(hex2.substring(2, 4), 16);
  const b2 = parseInt(hex2.substring(4, 6), 16);

  const r = Math.round(r1 + (r2 - r1) * progress);
  const g = Math.round(g1 + (g2 - g1) * progress);
  const b = Math.round(b1 + (b2 - b1) * progress);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

// Helper to interpolate between two color schemes
const interpolateColorScheme = (scheme1: ColorScheme, scheme2: ColorScheme, progress: number): ColorScheme => {
  return {
    primary: interpolateColor(scheme1.primary, scheme2.primary, progress),
    secondary: interpolateColor(scheme1.secondary, scheme2.secondary, progress),
    accent: interpolateColor(scheme1.accent, scheme2.accent, progress),
    background: interpolateColor(scheme1.background, scheme2.background, progress),
    text: interpolateColor(scheme1.text, scheme2.text, progress),
    cardBg: interpolateColor(scheme1.cardBg, scheme2.cardBg, progress),
    border: interpolateColor(scheme1.border, scheme2.border, progress),
    buttonBg: interpolateColor(scheme1.buttonBg, scheme2.buttonBg, progress),
    buttonText: interpolateColor(scheme1.buttonText, scheme2.buttonText, progress),
  };
};

export function ColorSchemeProvider({ children }: { children: React.ReactNode }) {
  const [variant, setVariant] = React.useState<Variant | null>(null);
  const [themeProgress, setThemeProgress] = React.useState<number>(0); // 0 = light, 1 = dark/chaos
  const [targetColors, setTargetColors] = React.useState<ColorScheme | null>(null);
  const [colors, setColors] = React.useState<ColorScheme>(lightModeColors);

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

        // Always start with light mode
        setColors(lightModeColors);

        // Set target colors based on variant
        const variantStr = String(v).toLowerCase();
        if (variantStr.includes("dark")) {
          console.log("[COLOR SCHEME]: Dark mode variant - slider will allow transition to dark", darkModeColors);
          setTargetColors(darkModeColors);
        } else if (variantStr.includes("chaos")) {
          const chaosColors = generateChaosColors();
          console.log("[COLOR SCHEME]: Chaos mode variant - slider will allow transition to chaos", chaosColors);
          setTargetColors(chaosColors);
        } else {
          console.log("[COLOR SCHEME]: Control variant - no slider, staying light mode", lightModeColors);
          setTargetColors(null); // No slider for control
        }

        mixpanel.track("Checkout Color Scheme Loaded", { variant: v });
      });
  }, []);

  // Update colors when themeProgress changes
  React.useEffect(() => {
    if (targetColors) {
      const interpolated = interpolateColorScheme(lightModeColors, targetColors, themeProgress);
      setColors(interpolated);
    }
  }, [themeProgress, targetColors]);

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
    <ColorSchemeContext.Provider value={{ variant, colors, themeProgress, setThemeProgress }}>
      {children}
    </ColorSchemeContext.Provider>
  );
}
