function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  const value = Number.parseInt(normalized, 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function relativeLuminance(channel: number) {
  const value = channel / 255;
  return value <= 0.03928
    ? value / 12.92
    : Math.pow((value + 0.055) / 1.055, 2.4);
}

export function getContrastRatio(foreground: string, background: string) {
  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);
  const fgLuminance =
    0.2126 * relativeLuminance(fg.r) +
    0.7152 * relativeLuminance(fg.g) +
    0.0722 * relativeLuminance(fg.b);
  const bgLuminance =
    0.2126 * relativeLuminance(bg.r) +
    0.7152 * relativeLuminance(bg.g) +
    0.0722 * relativeLuminance(bg.b);
  const lighter = Math.max(fgLuminance, bgLuminance);
  const darker = Math.min(fgLuminance, bgLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}
