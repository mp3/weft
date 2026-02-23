import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'
import withSerwistInit from '@serwist/next'
import type { NextConfig } from 'next'

initOpenNextCloudflareForDev()

const withSerwist = withSerwistInit({
  swSrc: 'app/sw.ts',
  swDest: 'public/sw.js',
  disable: process.env.NODE_ENV === 'development',
})

const nextConfig: NextConfig = {
  turbopack: {},
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
        ],
      },
    ]
  },
}

export default withSerwist(nextConfig)
