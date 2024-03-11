/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [{
      protocol: "https",
      hostname: "digital-marketplace-production-dc8f.up.railway.app"
    }],
  },
};

module.exports = nextConfig;
