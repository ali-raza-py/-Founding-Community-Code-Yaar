import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // During static export, Next.js serves images from the `public/` folder.
    // To prevent Next.js from inlining base64-encoded images, disable the
    // image optimization behavior that requires the default loader.
    unoptimized: true,
  },
};

export default nextConfig;
