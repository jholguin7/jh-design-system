// ── Gradient preset definitions ──────────────────────────────────────────────
// Each gradient is an array of hex colors from lightest (left) to darkest (right).
// The LAST color is the "primary" / accent color used for --primary.
// Intermediate --stage-N vars are interpolated across all stops.

export interface GradientPreset {
  id: string;
  name: string;
  stops: string[]; // lightest → darkest (right = primary)
}

// Helper: generate a single-color gradient by lightening + desaturating
// Uses perceptual lightening: as we go lighter, we also reduce saturation
// to avoid overly vivid pastels (research: HSLuv-inspired desaturation)
export function generateSingleColorGradient(hex: string): string[] {
  const [h, s, l] = hexToHsl(hex);
  const stops: string[] = [];
  const numStops = 7;
  for (let i = 0; i < numStops; i++) {
    const t = i / (numStops - 1); // 0 = lightest, 1 = darkest (original)
    // Lightness: from 94 down to original
    const newL = 94 - (94 - l) * t;
    // Saturation: start at 20% of original, ramp up to full
    // This avoids overly bright pastels at the light end
    const satRamp = 0.2 + 0.8 * (t * t); // quadratic ramp — gentle at start
    const newS = s * satRamp;
    stops.push(hslToHex(h, Math.round(newS), Math.round(newL)));
  }
  return stops;
}

// ── Color math (shared with use-preferences) ────────────────────────────────

export function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

export function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))));
  return `#${[f(0), f(8), f(4)].map(x => x.toString(16).padStart(2, "0")).join("")}`;
}

export function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

export function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map(x => Math.round(Math.max(0, Math.min(255, x))).toString(16).padStart(2, "0")).join("")}`;
}

// ── OKLab perceptual color space (Bjorn Ottosson, 2020) ─────────────────────
// Produces perceptually smooth gradients without hue shifts or muddy midpoints.

function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function linearToSrgb(c: number): number {
  return c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

function hexToOklab(hex: string): [number, number, number] {
  const [r8, g8, b8] = hexToRgb(hex);
  const R = srgbToLinear(r8 / 255);
  const G = srgbToLinear(g8 / 255);
  const B = srgbToLinear(b8 / 255);
  // Linear sRGB → LMS
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  // LMS' → OKLab
  return [
    0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s,
  ];
}

function oklabToHex(L: number, a: number, b: number): string {
  // OKLab → LMS'
  const lp = L + 0.3963377774 * a + 0.2158037573 * b;
  const mp = L - 0.1055613458 * a - 0.0638541728 * b;
  const sp = L - 0.0894841775 * a - 1.2914855480 * b;
  // Cube → LMS
  const l = lp * lp * lp;
  const m = mp * mp * mp;
  const s = sp * sp * sp;
  // LMS → linear sRGB
  const R = Math.max(0, Math.min(1, 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s));
  const G = Math.max(0, Math.min(1, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s));
  const B = Math.max(0, Math.min(1, -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s));
  return rgbToHex(
    Math.round(linearToSrgb(R) * 255),
    Math.round(linearToSrgb(G) * 255),
    Math.round(linearToSrgb(B) * 255),
  );
}

// Interpolate between two hex colors in OKLab space (perceptually uniform)
function lerpColor(a: string, b: string, t: number): string {
  const [L1, a1, b1] = hexToOklab(a);
  const [L2, a2, b2] = hexToOklab(b);
  return oklabToHex(
    L1 + (L2 - L1) * t,
    a1 + (a2 - a1) * t,
    b1 + (b2 - b1) * t,
  );
}

/** Relative luminance (WCAG formula) — 0 = black, 1 = white */
export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map(c => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Given N gradient stops, interpolate to produce exactly `count` evenly-spaced colors
export function interpolateGradient(stops: string[], count: number): string[] {
  if (stops.length === 0) return Array(count).fill("#888888");
  if (stops.length === 1) return generateSingleColorGradient(stops[0]).slice(0, count);
  if (count === 1) return [stops[stops.length - 1]];

  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1); // 0..1
    const pos = t * (stops.length - 1);
    const idx = Math.floor(pos);
    const frac = pos - idx;
    if (idx >= stops.length - 1) {
      result.push(stops[stops.length - 1]);
    } else {
      result.push(lerpColor(stops[idx], stops[idx + 1], frac));
    }
  }
  return result;
}

// ── Preset gradients ─────────────────────────────────────────────────────────
// Inspired by common sequential color scales. Rightmost = primary.

export const GRADIENT_PRESETS: GradientPreset[] = [
  // Row 1: Warm / earthy  (Ant is custom; rest from CARTO Colors 7-class)
  { id: "ant",        name: "Ant",        stops: ["#FDF1EC", "#F8DDD3", "#F0B8A4", "#E8956E", "#D97757"] },
  { id: "burg",       name: "Burg",       stops: ["#ffc6c4", "#f4a3a8", "#e38191", "#cc607d", "#ad466c", "#8b3058", "#672044"] },
  { id: "burgyl",     name: "BurgYl",     stops: ["#fbe6c5", "#f5ba98", "#ee8a82", "#dc7176", "#c8586c", "#9c3f5d", "#70284a"] },
  { id: "redor",      name: "RedOr",      stops: ["#f6d2a9", "#f5b78e", "#f19c7c", "#ea8171", "#dd686c", "#ca5268", "#b13f64"] },
  { id: "oryel",      name: "OrYel",      stops: ["#ecda9a", "#efc47e", "#f3ad6a", "#f7945d", "#f97b57", "#f66356", "#ee4d5a"] },

  // Row 2: Warm soft
  { id: "peach",      name: "Peach",      stops: ["#fde0c5", "#facba6", "#f8b58b", "#f59e72", "#f2855d", "#ef6a4c", "#eb4a40"] },
  { id: "pinkyl",     name: "PinkYl",     stops: ["#fef6b5", "#ffdd9a", "#ffc285", "#ffa679", "#fa8a76", "#f16d7a", "#e15383"] },
  { id: "mint",       name: "Mint",       stops: ["#e4f1e1", "#b4d9cc", "#89c0b6", "#63a6a0", "#448c8a", "#287274", "#0d585f"] },
  { id: "blugrn",     name: "BluGrn",     stops: ["#c4e6c3", "#96d2a4", "#6dbc90", "#4da284", "#36877a", "#266b6e", "#1d4f60"] },

  // Row 3: Cool greens / teals
  { id: "darkmint",   name: "DarkMint",   stops: ["#d2fbd4", "#a5dbc2", "#7bbcb0", "#559c9e", "#3a7c89", "#235d72", "#123f5a"] },
  { id: "emrld",      name: "Emrld",      stops: ["#d3f2a3", "#97e196", "#6cc08b", "#4c9b82", "#217a79", "#105965", "#074050"] },
  { id: "bluyl",      name: "BluYl",      stops: ["#f7feae", "#b7e6a5", "#7ccba2", "#46aea0", "#089099", "#00718b", "#045275"] },
  { id: "teal",       name: "Teal",       stops: ["#d1eeea", "#a8dbd9", "#85c4c9", "#68abb8", "#4f90a6", "#3b738f", "#2a5674"] },

  // Row 4: Cool / purples
  { id: "tealgrn",    name: "TealGrn",    stops: ["#b0f2bc", "#89e8ac", "#67dba5", "#4cc8a3", "#38b2a3", "#2c98a0", "#257d98"] },
  { id: "purp",       name: "Purp",       stops: ["#f3e0f7", "#e4c7f1", "#d1afe8", "#b998dd", "#9f82ce", "#826dba", "#63589f"] },
  { id: "purpor",     name: "PurpOr",     stops: ["#f9ddda", "#f2b9c4", "#e597b9", "#ce78b3", "#ad5fad", "#834ba0", "#573b88"] },
  { id: "sunset",     name: "Sunset",     stops: ["#f3e79b", "#fac484", "#f8a07e", "#eb7f86", "#ce6693", "#a059a0", "#5c53a5"] },

  // Row 5: Bold
  { id: "magenta",    name: "Magenta",    stops: ["#f3cbd3", "#eaa9bd", "#dd88ac", "#ca699d", "#b14d8e", "#91357d", "#6c2167"] },
  { id: "sunsetdk",   name: "SunsetDk",   stops: ["#fcde9c", "#faa476", "#f0746e", "#e34f6f", "#dc3977", "#b9257a", "#7c1d6f"] },
  { id: "brwnyl",     name: "BrwnYl",     stops: ["#ede5cf", "#e0c2a2", "#d39c83", "#c1766f", "#a65461", "#813753", "#541f3f"] },

  // Row 6: Weavy-inspired
  { id: "wvy-1",      name: "Wvy 1",      stops: ["#eaeadc", "#f8ff99"] },
  { id: "wvy-2",      name: "Wvy 2",      stops: ["#d0e8d8", "#8ec8c0", "#52a6b4", "#4580a8", "#4f5f9c", "#6b3f90", "#6a2c7a"] },
];

// Default gradient ID
export const DEFAULT_GRADIENT_ID = "ant";

// Find a preset by ID
export function getPreset(id: string): GradientPreset | undefined {
  return GRADIENT_PRESETS.find(p => p.id === id);
}

// Get effective stops: either a preset's stops, or custom stops
export function resolveGradientStops(gradientId: string, customStops?: string[]): string[] {
  if (gradientId === "custom" && customStops && customStops.length > 0) {
    return customStops;
  }
  const preset = getPreset(gradientId);
  return preset ? preset.stops : GRADIENT_PRESETS[0].stops;
}
