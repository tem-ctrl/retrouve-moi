import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Retrouve-moi',
    short_name: 'Retrouve-moi',
    description:
      'Signaler et retrouver les personnes disparues, les objets perdus et les documents égarés au Cameroun.',
    lang: 'fr',
    start_url: '/',
    display: 'standalone',
    background_color: '#f6f7fb',
    theme_color: '#1f2a5c',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      {
        src: '/icons/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
