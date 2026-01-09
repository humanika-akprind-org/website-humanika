/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "drive.google.com",
        pathname: "/uc/**",
      },
      {
        protocol: "https",
        hostname: "drive.google.com",
        pathname: "/file/**",
      },
      {
        protocol: "https",
        hostname: "drive.google.com",
        pathname: "/thumbnail/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
    localPatterns: [
      {
        pathname: "/api/drive-image",
      },
      {
        pathname: "/**",
      },
    ],
  },

  transpilePackages: ["jsonwebtoken", "bcryptjs", "mongodb"],

  webpack: (config, { isServer }) => {
    // Gunakan import dinamis untuk polyfill
    if (!isServer) {
      config.resolve.fallback = {
        crypto: false,
        stream: false,
        querystring: false,
      };
    }
    return config;
  },
};

export default nextConfig;
