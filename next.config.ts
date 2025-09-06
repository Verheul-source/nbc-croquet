import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // App Router is default in Next.js 15+ - no experimental flag needed
  
  // Configure proper page extensions for TypeScript
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  
  // Optimize for modern builds
  reactStrictMode: true,
  
  // REMOVED THE REDIRECT SECTION - it was causing infinite loops
  
  // TypeScript configuration
  typescript: {
    // Allow builds to continue even with TypeScript errors (for gradual migration)
    ignoreBuildErrors: false,
  },
  
  // ESLint configuration
  eslint: {
    // Allow builds to continue even with ESLint errors during development
    ignoreDuringBuilds: false,
  },
  
  // Image optimization settings
  images: {
    domains: ['localhost'],
  },
  
  // Configure Turbopack for faster development
  // (This is already enabled via your package.json dev script)
};

export default nextConfig;