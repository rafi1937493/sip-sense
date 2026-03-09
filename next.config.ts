import type { NextConfig } from "next";

// next-pwa uses CommonJS
// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Empty turbopack config to silence the warning when using webpack
  turbopack: {},
};

export default withPWA(nextConfig);
