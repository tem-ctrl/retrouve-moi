import { renderImage } from '@/lib/og/render';
import { getMissingPerson, loadPhoto } from '@/lib/og/server';
import { CARD, PersonCard, SiteCard } from '@/lib/og/templates';

export const alt = 'Avis de recherche Retrouve-moi';
export const size = CARD;
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const person = await getMissingPerson(id);
  if (!person) return renderImage(<SiteCard />, CARD);
  const photo = await loadPhoto(person.photo_url);
  return renderImage(<PersonCard person={person} photo={photo} />, CARD);
}
