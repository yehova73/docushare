import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "percevo-review-images-bucket.s3.us-east-1.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
  serverExternalPackages: ["re2"],
};

export default nextConfig;
