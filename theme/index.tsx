import { createContext, ReactNode, useContext, useMemo } from "react";
import { tokens, ThemeTokens } from "./tokens";

type TokenPath = string;

export type ThemeApi = {
  tokens: ThemeTokens;
  color: (path: TokenPath) => string;
  typography: (path: TokenPath) => unknown;
  spacing: (path: TokenPath) => number;
  radius: (path: TokenPath) => number;
  shadow: (path: TokenPath) => ThemeTokens["shadow"]["card"];
  motion: (path: TokenPath) => ThemeTokens["motion"]["quick"];
};

const ThemeContext = createContext<ThemeApi | null>(null);

export function getToken(tokenSource: unknown, path: TokenPath) {
  const value = path.split(".").reduce<unknown>((current, segment) => {
    if (
      current !== null &&
      typeof current === "object" &&
      segment in current
    ) {
      return (current as Record<string, unknown>)[segment];
    }

    throw new Error(`Missing theme token "${path}"`);
  }, tokenSource);

  return value;
}

function createThemeApi(tokenSource: ThemeTokens): ThemeApi {
  return {
    tokens: tokenSource,
    color: (path) => getToken(tokenSource.color, path) as string,
    typography: (path) => getToken(tokenSource.typography, path),
    spacing: (path) => getToken(tokenSource.spacing, path) as number,
    radius: (path) => getToken(tokenSource.radius, path) as number,
    shadow: (path) => getToken(tokenSource.shadow, path) as ThemeApi["shadow"] extends (
      path: string
    ) => infer Return
      ? Return
      : never,
    motion: (path) => getToken(tokenSource.motion, path) as ThemeApi["motion"] extends (
      path: string
    ) => infer Return
      ? Return
      : never,
  };
}

export function ThemeProvider({
  children,
  value = tokens,
}: {
  children: ReactNode;
  value?: ThemeTokens;
}) {
  const theme = useMemo(() => createThemeApi(value), [value]);

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const theme = useContext(ThemeContext);

  if (theme === null) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return theme;
}

export { tokens };
export type { ThemeTokens };
