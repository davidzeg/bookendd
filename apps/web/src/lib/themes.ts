import { createV5Theme, defaultChildrenThemes } from "@tamagui/config/v5";
import { v5ComponentThemes } from "@tamagui/themes/v5";
import {
  yellow,
  yellowDark,
  red,
  redDark,
  green,
  greenDark,
} from "@tamagui/colors";

const darkPalette = [
  "hsla(260, 45%, 10%, 1)", // 1 - background (visible violet-black)
  "hsla(260, 40%, 14%, 1)", // 2 - surface
  "hsla(260, 35%, 18%, 1)", // 3
  "hsla(260, 32%, 22%, 1)", // 4
  "hsla(260, 30%, 27%, 1)", // 5
  "hsla(260, 28%, 32%, 1)", // 6
  "hsla(260, 26%, 38%, 1)", // 7
  "hsla(260, 24%, 45%, 1)", // 8
  "hsla(260, 22%, 52%, 1)", // 9
  "hsla(260, 25%, 62%, 1)", // 10
  "hsla(260, 30%, 82%, 1)", // 11 - muted text
  "hsla(260, 40%, 95%, 1)", // 12 - primary text
];
const lightPalette = [
  "hsla(260, 35%, 99%, 1)", // 1 - background
  "hsla(260, 20%, 96%, 1)", // 2
  "hsla(260, 15%, 92%, 1)", // 3
  "hsla(260, 12%, 86%, 1)", // 4
  "hsla(260, 10%, 78%, 1)", // 5
  "hsla(260, 10%, 70%, 1)", // 6
  "hsla(260, 10%, 60%, 1)", // 7
  "hsla(260, 10%, 50%, 1)", // 8
  "hsla(260, 10%, 40%, 1)", // 9
  "hsla(260, 12%, 30%, 1)", // 10
  "hsla(260, 15%, 15%, 1)", // 11
  "hsla(260, 20%, 4%, 1)", // 12 - primary text
];

const accentLight = {
  accent1: "hsla(262, 70%, 30%, 1)",
  accent2: "hsla(262, 72%, 35%, 1)",
  accent3: "hsla(262, 75%, 40%, 1)",
  accent4: "hsla(262, 78%, 45%, 1)",
  accent5: "hsla(262, 80%, 50%, 1)",
  accent6: "hsla(262, 83%, 55%, 1)",
  accent7: "hsla(262, 85%, 60%, 1)",
  accent8: "hsla(262, 88%, 65%, 1)",
  accent9: "hsla(262, 90%, 70%, 1)",
  accent10: "hsla(262, 91%, 76%, 1)", // #a78bfa
  accent11: "hsla(262, 50%, 20%, 1)",
  accent12: "hsla(262, 60%, 15%, 1)",
};

const accentDark = {
  accent1: "hsla(262, 50%, 15%, 1)",
  accent2: "hsla(262, 55%, 20%, 1)",
  accent3: "hsla(262, 60%, 25%, 1)",
  accent4: "hsla(262, 65%, 30%, 1)",
  accent5: "hsla(262, 70%, 35%, 1)",
  accent6: "hsla(262, 75%, 42%, 1)",
  accent7: "hsla(262, 80%, 50%, 1)",
  accent8: "hsla(262, 85%, 58%, 1)",
  accent9: "hsla(262, 88%, 66%, 1)",
  accent10: "hsla(262, 91%, 76%, 1)", // #a78bfa
  accent11: "hsla(262, 80%, 85%, 1)",
  accent12: "hsla(262, 70%, 93%, 1)",
};

const starLight = {
  accent1: "hsla(292, 70%, 35%, 1)",
  accent2: "hsla(292, 72%, 40%, 1)",
  accent3: "hsla(292, 75%, 45%, 1)",
  accent4: "hsla(292, 78%, 50%, 1)",
  accent5: "hsla(292, 80%, 55%, 1)",
  accent6: "hsla(292, 82%, 60%, 1)",
  accent7: "hsla(292, 85%, 65%, 1)",
  accent8: "hsla(292, 87%, 70%, 1)",
  accent9: "hsla(292, 89%, 76%, 1)",
  accent10: "hsla(292, 91%, 83%, 1)", // #f0abfc
  accent11: "hsla(292, 50%, 25%, 1)",
  accent12: "hsla(292, 60%, 15%, 1)",
};

const starDark = {
  accent1: "hsla(292, 50%, 18%, 1)",
  accent2: "hsla(292, 55%, 24%, 1)",
  accent3: "hsla(292, 60%, 30%, 1)",
  accent4: "hsla(292, 65%, 38%, 1)",
  accent5: "hsla(292, 70%, 45%, 1)",
  accent6: "hsla(292, 75%, 52%, 1)",
  accent7: "hsla(292, 80%, 60%, 1)",
  accent8: "hsla(292, 85%, 68%, 1)",
  accent9: "hsla(292, 88%, 76%, 1)",
  accent10: "hsla(292, 91%, 83%, 1)", // #f0abfc
  accent11: "hsla(292, 80%, 90%, 1)",
  accent12: "hsla(292, 70%, 95%, 1)",
};

const builtThemes = createV5Theme({
  darkPalette,
  lightPalette,
  componentThemes: v5ComponentThemes,
  childrenThemes: {
    ...defaultChildrenThemes,

    accent: {
      light: accentLight,
      dark: accentDark,
    },

    warning: {
      light: yellow,
      dark: yellowDark,
    },
    error: {
      light: red,
      dark: redDark,
    },
    success: {
      light: green,
      dark: greenDark,
    },
    star: {
      light: starLight,
      dark: starDark,
    },
  },
});

builtThemes.light.background = lightPalette[0];
builtThemes.dark.background = darkPalette[0];

export type Themes = typeof builtThemes;

export const themes = builtThemes;
