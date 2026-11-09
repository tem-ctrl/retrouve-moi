import { renderImage } from '@/lib/og/render';
import { getLostItem, loadPhoto } from '@/lib/og/server';
import { CARD, ItemCard, SiteCard } from '@/lib/og/templates';

export const alt = 'Objet perdu ou trouvé sur Retrouve-moi';
export const size = CARD;
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getLostItem(id);
  if (!item) return renderImage(<SiteCard />, CARD);
  const photo = await loadPhoto(item.photo_url);
  return renderImage(<ItemCard item={item} photo={photo} />, CARD);
}
