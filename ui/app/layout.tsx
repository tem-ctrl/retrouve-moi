import type { Metadata, Viewport } from 'next';
import { Atkinson_Hyperlegible, Familjen_Grotesk } from 'next/font/google';

import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/contexts/AuthContext';
import SWRProvider from '@/providers/SWRProviders';

import { MockServiceWorkerProvider } from './_mocks/MockServiceWorkerProvider';

// Headings: Familjen Grotesk. Body: Atkinson Hyperlegible, designed for low-vision readers.
const heading = Familjen_Grotesk({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-heading',
  display: 'swap',
});
const body = Atkinson_Hyperlegible({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-body',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_URL || 'https://retrouve-moi.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Retrouve-moi · Personnes disparues et objets perdus au Cameroun',
    template: '%s · Retrouve-moi',
  },
  description:
    'Plateforme citoyenne pour signaler et retrouver les personnes disparues, les objets perdus et les documents égarés au Cameroun.',
  applicationName: 'Retrouve-moi',
  openGraph: {
    siteName: 'Retrouve-moi',
    locale: 'fr_CM',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1f2a5c' },
    { media: '(prefers-color-scheme: dark)', color: '#161d40' },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${heading.variable} ${body.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MockServiceWorkerProvider>
            <SWRProvider>
              <AuthProvider>{children}</AuthProvider>
            </SWRProvider>
          </MockServiceWorkerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
