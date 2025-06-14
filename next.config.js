/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true
  },
  output: 'standalone',
  runtime: 'nodejs'
}

module.exports = nextConfig
