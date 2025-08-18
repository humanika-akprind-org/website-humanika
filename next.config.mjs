/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "drive.google.com",
        port: "", // Explicit kosongkan port
        pathname: "/uc/**",
      },
    ],
  },
  // Tambahkan ini untuk handle modul Node.js
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      stream: false,
      crypto: false,
    };
    return config;
  },
  experimental: {
    externalDir: true, // Optimalkan handling modul eksternal
  },
};

export default nextConfig;
