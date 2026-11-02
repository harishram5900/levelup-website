import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // This app lives in a subfolder of a repo that has its own lockfile; pin the root here.
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
