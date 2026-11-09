import { renderImage, slugify } from '@/lib/og/render';
import { getMissingPerson, loadPhoto, siteHost } from '@/lib/og/server';
import { PersonPoster, POSTER } from '@/lib/og/templates';
import { ROUTES } from '@/lib/routes';

// Shareable / printable poster (PNG, 1080×1350). ?download=1 forces a file download.
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const person = await getMissingPerson(id);
  if (!person) return new Response('Signalement introuvable', { status: 404 });

  const photo = await loadPhoto(person.photo_url);
  const url = `${siteHost()}${ROUTES.missingPersons.byId(id)}`;
  const download = new URL(request.url).searchParams.has('download');

  return renderImage(
    <PersonPoster person={person} photo={photo} url={url} />,
    POSTER,
    download
      ? {
          'Content-Disposition': `attachment; filename="avis-de-recherche-${slugify(person.full_name)}.png"`,
        }
      : undefined,
  );
}
