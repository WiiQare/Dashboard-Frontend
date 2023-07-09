/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  // distDir: 'dist',
  images: { unoptimized: true },
  env: {
    WIIQARE_URI: 'https://wiiqare.neema.co.za/api/v1/admin'

  }
}

module.exports = nextConfig
