import type { TextStyle } from "react-native";

type TypographyToken = {
  fontSize: number;
  lineHeight: number;
  fontWeight: TextStyle["fontWeight"];
};

type ShadowToken = {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
};

type MotionToken = {
  duration: number;
  easing: string;
};

export type ThemeTokens = {
  color: {
    brand: Record<"coral" | "sun" | "mint" | "sky" | "pink" | "violet", string>;
    neutral: Record<950 | 800 | 600 | 400 | 200 | 100 | 50, string>;
    surface: Record<"white" | "canvas" | "tint", string>;
    semantic: Record<"success" | "pending" | "error" | "info", string>;
  };
  typography: Record<
    "display" | "h1" | "h2" | "h3" | "body" | "bodySmall" | "caption",
    TypographyToken
  >;
  spacing: Record<"xs" | "sm" | "md" | "lg" | "xl" | "2xl", number>;
  radius: Record<"sm" | "md" | "card" | "pill", number>;
  shadow: Record<"card", ShadowToken>;
  motion: Record<"quick" | "standard" | "celebration", MotionToken>;
};

export const tokens: ThemeTokens = {
  color: {
    brand: {
      coral: "#FF6B5E",
      sun: "#FFD84D",
      mint: "#8ED9A5",
      sky: "#68B7F4",
      pink: "#F58FB2",
      violet: "#9B8AFB",
    },
    neutral: {
      950: "#1F2529",
      800: "#384047",
      600: "#687078",
      400: "#A6ADB3",
      200: "#E5E8EA",
      100: "#F3F4F2",
      50: "#FAFAF7",
    },
    surface: {
      white: "#FFFFFF",
      canvas: "#FAFAF7",
      tint: "#FFF4F2",
    },
    semantic: {
      success: "#2F8F5B",
      pending: "#8A6A00",
      error: "#D64F3F",
      info: "#2A78B8",
    },
  },
  typography: {
    display: { fontSize: 36, lineHeight: 42, fontWeight: "800" },
    h1: { fontSize: 30, lineHeight: 36, fontWeight: "800" },
    h2: { fontSize: 24, lineHeight: 30, fontWeight: "700" },
    h3: { fontSize: 19, lineHeight: 24, fontWeight: "700" },
    body: { fontSize: 16, lineHeight: 22, fontWeight: "400" },
    bodySmall: { fontSize: 14, lineHeight: 19, fontWeight: "400" },
    caption: { fontSize: 12, lineHeight: 16, fontWeight: "600" },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 20,
    xl: 24,
    "2xl": 32,
  },
  radius: {
    sm: 8,
    md: 12,
    card: 20,
    pill: 999,
  },
  shadow: {
    card: {
      shadowColor: "#1F2529",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 14,
      elevation: 3,
    },
  },
  motion: {
    quick: { duration: 160, easing: "easeOut" },
    standard: { duration: 240, easing: "easeOut" },
    celebration: { duration: 420, easing: "spring" },
  },
};
