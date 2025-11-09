import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['localhost', 'images.unsplash.com', 'placehold.co', "morth.nic.in", "your-s3-bucket.s3.amazonaws.com", "cdn.example.com",
      "bee-ai.s3.ap-northeast-1.amazonaws.com", "cep.fundingbee.my"
    ],
  },

  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"),
      "@/assets": path.resolve(__dirname, "public"),
    };
    return config;
  },
  // DANGER! for temporary only 
  typescript: {
    ignoreBuildErrors: true,
  },
  // DANGER! for temporary only
  eslint: {
    ignoreDuringBuilds: true,
  },

};

export default nextConfig;
