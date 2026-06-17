export type AccentColor =
  | "neutral"
  | "gray"
  | "slate"
  | "zinc"
  | "stone"
  | "red"
  | "rose"
  | "orange"
  | "green"
  | "blue"
  | "yellow"
  | "violet";

export type BaseTheme =
  | "neutral"
  | "stone"
  | "zinc"
  | "gray"
  | "mauve"
  | "olive"
  | "mist"
  | "taupe";

export const accentColorLabels: Record<AccentColor, string> = {
  neutral: "Neutral",
  gray: "Gray",
  slate: "Slate",
  zinc: "Zinc",
  stone: "Stone",
  red: "Red",
  rose: "Rose",
  orange: "Orange",
  green: "Green",
  blue: "Blue",
  yellow: "Yellow",
  violet: "Violet",
};

export const accentColors: AccentColor[] = [
  "neutral",
  "gray",
  "slate",
  "zinc",
  "stone",
  "red",
  "rose",
  "orange",
  "green",
  "blue",
  "yellow",
  "violet",
];

export const baseThemeLabels: Record<BaseTheme, string> = {
  neutral: "Neutral",
  stone: "Stone",
  zinc: "Zinc",
  gray: "Gray",
  mauve: "Mauve",
  olive: "Olive",
  mist: "Mist",
  taupe: "Taupe",
};

export const baseThemes: BaseTheme[] = [
  "neutral",
  "stone",
  "zinc",
  "gray",
  "mauve",
  "olive",
  "mist",
  "taupe",
];

export const ACCENT_STORAGE_KEY = "json-viewer-accent";
export const BASE_THEME_STORAGE_KEY = "json-viewer-base-theme";

export const BASE_THEME_CSS_CLASS = "theme";
