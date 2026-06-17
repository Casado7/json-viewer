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

export const ACCENT_STORAGE_KEY = "json-viewer-accent";
