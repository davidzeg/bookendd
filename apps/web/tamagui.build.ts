import { TamaguiBuildOptions } from "tamagui";

export default {
  components: ["tamagui"],
  config: "./tamagui.config.ts",
  outputCSS: "./public/tamagui.css",
} satisfies TamaguiBuildOptions;
