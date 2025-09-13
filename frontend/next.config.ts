import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    // Ensure the workspace root is the frontend folder
    root: __dirname,
  },
}

export default nextConfig