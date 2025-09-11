/** @type {import('next').NextConfig} */
const nextConfig = {
  // The project is NOT a static export. The 'output' line should be absent.
  // output: 'export', <--- THIS LINE SHOULD NOT BE PRESENT

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;