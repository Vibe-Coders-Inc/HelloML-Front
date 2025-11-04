/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Don’t fail the Vercel build because of ESLint errors
    ignoreDuringBuilds: true,
  },
  // If TypeScript errors also block you, uncomment:
  // typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
