import type { Metadata } from 'next';

import { getMissingPerson } from '@/lib/og/server';
import { isFemale } from '@/lib/og/templates';

// The page itself is a client component; this server layout supplies the
// per-person title/description used by WhatsApp and Facebook link previews.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const person = await getMissingPerson(id);
  if (!person) return { title: 'Signalement introuvable' };

  const e = isFemale(person.gender) ? 'e' : '';
  const title =
    person.status === 'found'
      ? `${person.full_name} a été retrouvé${e}`
      : `Aidez-nous à retrouver ${person.full_name}`;
  const description = [
    person.age ? `${person.age} ans` : '',
    person.last_seen_location ? `vu${e} pour la dernière fois à ${person.last_seen_location}` : '',
  ]
    .filter(Boolean)
    .join(', ');

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
