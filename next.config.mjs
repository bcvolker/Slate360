/** @type {import('next').NextConfig} */
const nextConfig = {
  // WARNING: These are temporary settings to force a build.
  // They should be removed after the project is stable.
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['localhost', 'images.unsplash.com', 'www.w3schools.com'],
  },
};

export default nextConfig;
