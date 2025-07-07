/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['imgix.cosmicjs.com', 'cdn.cosmicjs.com'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig