/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ["www.themealdb.com"],
  },
};

module.exports = nextConfig;
