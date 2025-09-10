/** @type {import('next').NextConfig} */
const nextConfig = {
  // We are fixing errors, not ignoring them.
  // eslint: { ignoreDuringBuilds: false },
  // typescript: { ignoreBuildErrors: false },
  images: {
    domains: ['localhost', 'images.unsplash.com', 'www.w3schools.com'],
  },
};

export default nextConfig;
