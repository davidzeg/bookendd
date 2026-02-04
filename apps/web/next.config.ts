import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["tamagui", "@tamagui/lucide-icons"],
  /* config options here */
  reactCompiler: true,
  turbopack: {
    resolveAlias: {
      "react-native": "react-native-web",
      "react-native-svg": "@tamagui/react-native-svg",
    },
  },
};

export default nextConfig;
