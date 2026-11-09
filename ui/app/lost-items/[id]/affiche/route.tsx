import { renderImage, slugify } from '@/lib/og/render';
import { getLostItem, loadPhoto, siteHost } from '@/lib/og/server';
import { ItemPoster, POSTER } from '@/lib/og/templates';
import { ROUTES } from '@/lib/routes';

// Shareable / printable poster (PNG, 1080×1350). ?download=1 forces a file download.
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getLostItem(id);
  if (!item) return new Response('Signalement introuvable', { status: 404 });

  const photo = await loadPhoto(item.photo_url);
  const url = `${siteHost()}${ROUTES.lostItems.byId(id)}`;
  const download = new URL(request.url).searchParams.has('download');

  return renderImage(
    <ItemPoster item={item} photo={photo} url={url} />,
    POSTER,
    download
      ? { 'Content-Disposition': `attachment; filename="affiche-${slugify(item.item_name)}.png"` }
      : undefined,
  );
}
