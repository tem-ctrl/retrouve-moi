import type { Metadata } from 'next';

import { getLostItem } from '@/lib/og/server';

// Server layout supplying per-item title/description for link previews
// (the page itself is a client component).
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const item = await getLostItem(id);
  if (!item) return { title: 'Signalement introuvable' };

  const title =
    item.status === 'claimed'
      ? `${item.item_name} : rendu à son propriétaire`
      : item.report_type === 'found'
        ? `Trouvé : ${item.item_name}`
        : `Perdu : ${item.item_name}`;
  const description = [item.item_category, item.location].filter(Boolean).join(' · ');

  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { card: 'summary_large_image' },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
