import { themes } from "@/lib/themes";
import { defaultConfig } from "@tamagui/config/v5";
import { createTamagui } from "tamagui";

export const tamaguiConfig = createTamagui({
  ...defaultConfig,
  themes,
  settings: {
    ...defaultConfig.settings,
    onlyAllowShorthands: false,
    disableRootThemeClass: true,
  },
});

export default tamaguiConfig;

export type Conf = typeof tamaguiConfig;

declare module "tamagui" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TamaguiCustomConfig extends Conf {}
}
