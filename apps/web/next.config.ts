import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Agar aapko aur bhi koi external domain allow karna ho toh yahan add kar sakte hain
    ],
  },
}

export default nextConfig
