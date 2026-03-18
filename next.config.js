/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "irhamputra.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
};
