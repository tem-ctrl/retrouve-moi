import { renderImage } from '@/lib/og/render';
import { CARD, SiteCard } from '@/lib/og/templates';

export const alt =
  'Retrouve-moi : personnes disparues, objets perdus et documents égarés au Cameroun';
export const size = CARD;
export const contentType = 'image/png';

export default function Image() {
  return renderImage(<SiteCard />, CARD);
}
