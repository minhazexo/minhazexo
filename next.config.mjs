import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    remotePatterns: [
      { protocol: 'https', hostname: '**.public.blob.vercel-storage.com' },
      { protocol: 'https', hostname: '**.blob.vercel-storage.com' },
    ],
  },
  productionBrowserSourceMaps: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizeCss: false,
    scrollRestoration: true,
  },
}

// Build-time env validation
if (process.env.NODE_ENV === 'production' && !process.env.RESEND_API_KEY) {
  console.warn('⚠ Missing RESEND_API_KEY — contact form will not send emails in production')
}

if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_GA_ID) {
  console.warn('⚠ Missing NEXT_PUBLIC_GA_ID — Google Analytics will not be active')
}

export default withBundleAnalyzer(nextConfig)
