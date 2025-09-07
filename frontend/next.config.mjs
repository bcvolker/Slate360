/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The ignoreBuildErrors property has been removed.
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
