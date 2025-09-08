/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // TypeScript checking is now enabled
  images: {
    // Add any external image domains your site uses here.
    domains: ['localhost', 'images.unsplash.com'],
  },
  async rewrites() {
    return [
      { source: '/api/health', destination: '/api/health/check' },
    ];
  },
};

export default nextConfig;
