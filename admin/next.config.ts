import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'lapse-admin.vercel.app', '*.vercel.app'],
    },
  },
}

export default nextConfig
