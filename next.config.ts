// DEFAULT
// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   experimental: {
//     serverActions: {
//       bodySizeLimit: "50mb",
//     },
//   },
// };

// export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  webpack: (config) => {
    config.cache = false; // Disables Webpack cache to prevent issues
    return config;
  },
};

export default nextConfig;
