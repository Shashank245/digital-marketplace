/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "https://digital-marketplace-production-dc8f.up.railway.app",
        port: "",
      },
    ],
  },
};

module.exports = nextConfig;
