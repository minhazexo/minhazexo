import type { Metadata, Viewport } from 'next'
import { Inter, IBM_Plex_Mono } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { ThemeAutoCycle } from '@/components/providers/ThemeAutoCycle'
import { ThemeTransition } from '@/components/providers/ThemeTransition'
import { Background } from '@/components/background/Background'
import { CursorGlow } from '@/components/effects/CursorGlow'
import { ScrollProgress } from '@/components/effects/ScrollProgress'
import { BackgroundMusic } from '@/components/effects/BackgroundMusic'
import '@/styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'MD Mehrab Hossain | Web Developer Portfolio',
    template: '%s | MD Mehrab Hossain',
  },
  description: 'Full-stack web developer crafting premium digital experiences with React, Next.js, and Node.js.',
  keywords: ['web developer', 'react developer', 'next.js developer', 'full stack developer', 'MD Mehrab Hossain', 'mehrab hossain', 'portfolio', 'frontend developer'],
  authors: [{ name: 'MD Mehrab Hossain' }],
  creator: 'MD Mehrab Hossain',
  publisher: 'MD Mehrab Hossain',
  metadataBase: new URL('https://mehrabhossain.dev'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mehrabhossain.dev',
    title: 'MD Mehrab Hossain | Web Developer Portfolio',
    description: 'Full-stack web developer crafting premium digital experiences.',
    siteName: 'MD Mehrab Hossain Portfolio',
    images: [{ url: '/hero-astronaut.jpg', width: 1920, height: 1080, alt: 'MD Mehrab Hossain Portfolio' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MD Mehrab Hossain | Web Developer Portfolio',
    description: 'Full-stack web developer crafting premium digital experiences.',
    images: ['/hero-astronaut.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  alternates: { canonical: 'https://mehrabhossain.dev' },
}

export const viewport: Viewport = {
  themeColor: '#05070A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${ibmPlexMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512x512.png" />
        <link rel="shortcut icon" href="/favicon_io/favicon.ico" />
        <meta name="theme-color" content="#05070A" />
        <meta name="application-name" content="MD Mehrab Hossain Portfolio" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />

        {/* Person Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'MD Mehrab Hossain',
              givenName: 'MD Mehrab',
              familyName: 'Hossain',
              jobTitle: 'Web Developer',
              url: 'https://mehrabhossain.dev',
              sameAs: ['https://github.com/minhazexo'],
              knowsAbout: ['React', 'Next.js', 'Node.js', 'TypeScript', 'Web Development'],
              email: 'mehrabhossain7102@gmail.com',
            }),
          }}
        />

        {/* Website Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'MD Mehrab Hossain Portfolio',
              url: 'https://mehrabhossain.dev',
              author: { '@type': 'Person', name: 'MD Mehrab Hossain' },
            }),
          }}
        />
      </head>
      <body className="antialiased" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif', color: 'var(--text)' }}>
        <a href="#main-content" className="skip-to-content">Skip to main content</a>
        <ThemeProvider attribute="data-theme" defaultTheme="blue" enableSystem={false}>
          <ThemeAutoCycle />
          <ThemeTransition />
          <ScrollProgress />
          <Background />
          <CursorGlow />
          <main id="main-content" role="main" tabIndex={-1} style={{ position: 'relative', zIndex: 10 }}>
            {children}
          </main>
          <BackgroundMusic />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}