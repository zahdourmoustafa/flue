/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config, { isServer }) => {
    // Handle node: protocol imports for server-side only
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        "node:crypto": "crypto",
        "node:fs": "fs",
        "node:path": "path",
      });
    }

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: false,
      };
    }

    return config;
  },
};

module.exports = nextConfig;
