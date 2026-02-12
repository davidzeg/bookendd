// Screen layout
export const SCREEN_PADDING_H = 20;

// Border radii — three tiers, always numeric for Android compat
export const RADIUS_SM = 8;
export const RADIUS_MD = 14;
export const RADIUS_LG = 20;

// Book cover sizes — 2:3 aspect ratio
export const COVER = {
  shelf: { w: 88, h: 132 },
  card: { w: 64, h: 96 },
  feed: { w: 52, h: 78 },
  detail: { w: 160, h: 240 },
  modal: { w: 88, h: 132 },
  mini: { w: 52, h: 78 },
} as const;

export type CoverSize = keyof typeof COVER;

// Shadow system — three tiers
// Using `as const` instead of ViewStyle to keep literal types compatible with Tamagui
export const SHADOW_BOOK = {
  shadowColor: "#000" as const,
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.25,
  shadowRadius: 12,
  elevation: 8,
};

export const SHADOW_CARD = {
  shadowColor: "#000" as const,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.12,
  shadowRadius: 6,
  elevation: 3,
};

export const SHADOW_SUBTLE = {
  shadowColor: "#000" as const,
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.08,
  shadowRadius: 3,
  elevation: 1,
};
