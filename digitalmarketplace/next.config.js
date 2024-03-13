/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "localhost",
      "digital-marketplace-production-dc8f.up.railway.app",
    ],
  },
};

module.exports = nextConfig;
