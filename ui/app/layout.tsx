import type { Metadata } from 'next';

import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import SWRProvider from '@/providers/SWRProviders';

import { MockServiceWorkerProvider } from './_mocks/MockServiceWorkerProvider';

export const metadata: Metadata = {
  title: 'Signalement Disparitions - Retrouvez les personnes disparues et objets perdus',
  description:
    'Plateforme de signalement et de recherche de personnes disparues et objets perdus/trouvés en Afrique',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        <MockServiceWorkerProvider>
          <SWRProvider>
            <AuthProvider>{children}</AuthProvider>
          </SWRProvider>
        </MockServiceWorkerProvider>
      </body>
    </html>
  );
}
