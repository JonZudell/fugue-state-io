import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.worker\.js$/, // Match worker files
      use: { loader: "worker-loader" }, // Use worker-loader
    });

    return config;
  },
};

export default nextConfig;
