import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SITE_METADATA } from '@/config/site';
import { Motion } from '@/components/Motion';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_METADATA.url),
  title: SITE_METADATA.title,
  description: SITE_METADATA.description,
  openGraph: {
    title: SITE_METADATA.title,
    description: SITE_METADATA.description,
    url: SITE_METADATA.url,
    siteName: 'Motion Dojo',
    images: [{ url: SITE_METADATA.ogImage, width: 1280, height: 720, alt: 'Motion Dojo' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_METADATA.title,
    description: SITE_METADATA.description,
    images: [SITE_METADATA.ogImage],
  },
  icons: {
    icon: '/assets/favicon-128.png',
    apple: '/assets/favicon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#F7F5FF',
};

// Marks the page as JS-enabled so scroll reveals only hide content when they can show it again.
const jsFlag = `document.documentElement.classList.add('js');`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Clash Display is served by Fontshare (Indian Type Foundry), free for commercial use */}
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link href="https://api.fontshare.com/v2/css?f[]=clash-display@500,600,700&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{ __html: jsFlag }} />
      </head>
      <body>
        {children}
        <Motion />
      </body>
    </html>
  );
}
