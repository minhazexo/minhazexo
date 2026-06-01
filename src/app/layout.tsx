import type { Metadata, Viewport } from 'next'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { BackgroundEffectsProvider } from '@/components/providers/BackgroundEffectsProvider'
import { NoiseOverlay } from '@/components/effects/NoiseOverlay'
import { ScrollProgress, SectionProgress } from '@/components/effects/ScrollProgress'
import { ThemeTransition } from '@/components/effects/ThemeTransition'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: {
    default: 'MD Mehrab Hossain | Web Developer Portfolio',
    template: '%s | MD Mehrab Hossain',
  },
  description: 'Creative Web Developer building stunning digital experiences with React, Next.js, and Node.js. Building the future, one pixel at a time.',
  keywords: ['web developer', 'react developer', 'next.js developer', 'node.js developer', 'full stack developer', 'MD Mehrab Hossain', 'mehrab hossain', 'portfolio', 'frontend developer', 'javascript developer', 'typescript developer', 'minhazexo'],
  authors: [{ name: 'MD Mehrab Hossain', url: 'https://mehrabhossain.dev' }],
  creator: 'MD Mehrab Hossain',
  publisher: 'MD Mehrab Hossain',
  metadataBase: new URL('https://mehrabhossain.dev'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mehrabhossain.dev',
    title: 'MD Mehrab Hossain | Web Developer Portfolio',
    description: 'Creative Web Developer building stunning digital experiences with React, Next.js, and Node.js. Building the future, one pixel at a time.',
    siteName: 'MD Mehrab Hossain Portfolio',
    images: [
      {
        url: '/hero-astronaut.jpg',
        width: 1920,
        height: 1080,
        alt: 'MD Mehrab Hossain - Web Developer Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MD Mehrab Hossain | Web Developer Portfolio',
    description: 'Creative Web Developer building stunning digital experiences with React, Next.js, and Node.js',
    images: ['/hero-astronaut.jpg'],
    creator: '@minhazexo',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://mehrabhossain.dev',
  },
  verification: {
    google: '', // Add your Google Search Console verification code
  },
  category: 'technology',
}

export const viewport: Viewport = {
  themeColor: '#0A0A0F',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512x512.png" />
        <link rel="shortcut icon" href="/icon-192x192.png" />
        <meta name="theme-color" content="#0A0A0F" />
        <meta name="application-name" content="MD Mehrab Hossain Portfolio" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Mehrab Portfolio" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="msapplication-TileColor" content="#0A0A0F" />
        <meta name="msapplication-tap-highlight" content="no" />
        
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
              alternateName: 'minhazexo',
              jobTitle: 'Web Developer',
              url: 'https://mehrabhossain.dev',
              sameAs: [
                'https://github.com/minhazexo',
              ],
              knowsAbout: ['React', 'Next.js', 'Node.js', 'TypeScript', 'Web Development', 'Frontend Development', 'JavaScript', 'Tailwind CSS'],
              description: 'Creative Web Developer with 3+ years of experience building modern web applications',
              image: 'https://mehrabhossain.dev/profile.png',
              email: 'mehrabhossain7102@gmail.com',
              gender: 'Male',
              nationality: 'Bangladeshi',
              birthPlace: {
                '@type': 'Place',
                address: {
                  '@type': 'PostalAddress',
                  addressCountry: 'BD',
                },
              },
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
              description: 'Creative Web Developer building stunning digital experiences with React, Next.js, and Node.js',
              author: {
                '@type': 'Person',
                name: 'MD Mehrab Hossain',
              },
            }),
          }}
        />
        
        {/* Breadcrumb Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Home',
                  item: 'https://mehrabhossain.dev',
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'Projects',
                  item: 'https://mehrabhossain.dev/#projects',
                },
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: 'Contact',
                  item: 'https://mehrabhossain.dev/#contact',
                },
              ],
            }),
          }}
        />
      </head>
      <body className="antialiased">
        {/* Skip to Content Link - Accessibility */}
        <a
          href="#main-content"
          className="skip-to-content"
          id="skip-to-content"
        >
          Skip to main content
        </a>

        {/* Ambient page lighting */}
        <div className="page-ambient" aria-hidden="true" />
        
        {/* Cinematic vignette overlay */}
        <div className="vignette-overlay" aria-hidden="true" />
        
        {/* Scroll progress bar - cinematic gradient */}
        <ScrollProgress />
        
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <BackgroundEffectsProvider>
            <ThemeTransition />
            <NoiseOverlay />
            <SectionProgress />
            <main id="main-content" role="main" tabIndex={-1}>
              {children}
            </main>
          </BackgroundEffectsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}