/* eslint-disable @next/next/no-img-element -- these trees are rendered by Satori (next/og), not the DOM. */
import type { CSSProperties, ReactNode } from 'react';

import { BRAND, markSvg, ndopTileSvg, svgDataUri } from '@/lib/brand';
import { LostItem, MissingPerson } from '@/types';

/*
 * Share images, rendered by next/og (Satori: flexbox only, inline styles).
 * POSTER = portrait 4:5, sized for WhatsApp / Facebook feeds and A4 printing.
 * CARD   = 1.91:1 link preview (Open Graph) shown when a page URL is pasted.
 */
export const POSTER = { width: 1080, height: 1350 };
export const CARD = { width: 1200, height: 630 };

const HEADING = 'Familjen Grotesk';
const BODY = 'Atkinson Hyperlegible';

const MARK_ON_DARK = svgDataUri(markSvg(BRAND.coton, BRAND.kolaOnDark));
const NDOP = svgDataUri(ndopTileSvg());
const SILHOUETTE = svgDataUri(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4.5" fill="#aeb6d6"/><path d="M3 22c0-5 4-8 9-8s9 3 9 8z" fill="#aeb6d6"/></svg>`,
);
const BOX = svgDataUri(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#d9b98a" stroke-width="1.5" stroke-linejoin="round"><path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z"/><path d="M3 7.5 12 12l9-4.5M12 12v9"/></svg>`,
);

export const formatDateFr = (iso: string | undefined) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Africa/Douala',
  });
};

export const isFemale = (g?: string) => !!g && /^(f|female|femme|féminin)$/i.test(g.trim());

/** Shrink long headlines so they stay on at most two lines. */
const fit = (text: string, base: number, perChar: number, min: number) =>
  Math.max(min, Math.min(base, Math.round(base - Math.max(0, text.length - 14) * perChar)));

const clip = (text: string | undefined, max: number) =>
  !text ? '' : text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;

// ---------------------------------------------------------------------------

function Wordmark({ size, color = BRAND.coton }: { size: number; color?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.3 }}>
      <img src={MARK_ON_DARK} width={size} height={size} alt="" />
      <div
        style={{
          display: 'flex',
          fontFamily: HEADING,
          fontWeight: 700,
          fontSize: size * 0.62,
          color,
          letterSpacing: -0.5,
        }}
      >
        retrouve<span style={{ color: BRAND.kolaOnDark }}>-</span>moi
      </div>
    </div>
  );
}

function NdopStrip({ style }: { style?: CSSProperties }) {
  return (
    <div
      style={{
        display: 'flex',
        backgroundColor: BRAND.indigo,
        backgroundImage: `url(${NDOP})`,
        backgroundSize: '28px 28px',
        backgroundRepeat: 'repeat',
        ...style,
      }}
    />
  );
}

function Label({ children, bg, size = 30 }: { children: ReactNode; bg: string; size?: number }) {
  return (
    <div
      style={{
        display: 'flex',
        alignSelf: 'flex-start',
        backgroundColor: bg,
        color: '#ffffff',
        fontFamily: BODY,
        fontWeight: 700,
        fontSize: size,
        letterSpacing: 2,
        textTransform: 'uppercase',
        padding: `${size * 0.3}px ${size * 0.75}px`,
        borderRadius: 999,
      }}
    >
      {children}
    </div>
  );
}

function Photo({
  src,
  fallback,
  width,
  height,
  radius = 0,
}: {
  src: string | null;
  fallback: string;
  width: number;
  height: number;
  radius?: number;
}) {
  if (src) {
    return (
      <img
        src={src}
        width={width}
        height={height}
        alt=""
        style={{ objectFit: 'cover', borderRadius: radius }}
      />
    );
  }
  return (
    <div
      style={{
        display: 'flex',
        width,
        height,
        borderRadius: radius,
        backgroundColor: '#e4e7f3',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img
        src={fallback}
        width={Math.min(width, height) * 0.45}
        height={Math.min(width, height) * 0.45}
        alt=""
      />
    </div>
  );
}

function Fact({ label, value, size = 34 }: { label: string; value: string; size?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div
        style={{
          display: 'flex',
          fontFamily: BODY,
          fontWeight: 700,
          fontSize: size * 0.62,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          color: BRAND.muted,
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: 'flex',
          fontFamily: BODY,
          fontSize: size,
          color: BRAND.ink,
          lineHeight: 1.25,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function ContactBlock({ phone, url, intro }: { phone?: string; url: string; intro: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        backgroundColor: BRAND.indigo,
        borderRadius: 28,
        padding: '30px 40px',
      }}
    >
      <div style={{ display: 'flex', fontFamily: BODY, fontSize: 30, color: '#c7cad6' }}>
        {intro}
      </div>
      {phone ? (
        <div
          style={{
            display: 'flex',
            fontFamily: HEADING,
            fontWeight: 700,
            fontSize: 72,
            color: BRAND.coton,
            letterSpacing: 1,
          }}
        >
          {phone}
        </div>
      ) : null}
      <div
        style={{
          display: 'flex',
          fontFamily: BODY,
          fontWeight: 700,
          fontSize: 28,
          color: BRAND.kolaOnDark,
        }}
      >
        {url}
      </div>
    </div>
  );
}

function ThanksBlock({ text }: { text: string }) {
  return (
    <div
      style={{
        display: 'flex',
        backgroundColor: BRAND.success,
        borderRadius: 28,
        padding: '34px 40px',
        fontFamily: HEADING,
        fontWeight: 700,
        fontSize: 44,
        color: '#ffffff',
        lineHeight: 1.2,
      }}
    >
      {text}
    </div>
  );
}

function PosterFrame({
  label,
  labelBg,
  children,
}: {
  label: string;
  labelBg: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: BRAND.coton,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: BRAND.indigo,
          padding: '40px 56px',
        }}
      >
        <Label bg={labelBg}>{label}</Label>
        <Wordmark size={60} />
      </div>
      <NdopStrip style={{ height: 28 }} />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          padding: '44px 56px 52px',
          gap: 28,
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Missing persons

const personLabel = (p: MissingPerson) => {
  const f = isFemale(p.gender);
  if (p.status === 'found') return { text: f ? 'Retrouvée' : 'Retrouvé', bg: BRAND.success };
  return { text: 'Personne disparue', bg: BRAND.kola };
};

export function PersonPoster({
  person,
  photo,
  url,
}: {
  person: MissingPerson;
  photo: string | null;
  url: string;
}) {
  const label = personLabel(person);
  const found = person.status === 'found';
  const date = formatDateFr(person.last_seen_date);
  const seen = [clip(person.last_seen_location, 60), date ? `le ${date}` : '']
    .filter(Boolean)
    .join(', ');
  return (
    <PosterFrame label={label.text} labelBg={label.bg}>
      <div style={{ display: 'flex', gap: 40 }}>
        <Photo src={photo} fallback={SILHOUETTE} width={500} height={640} radius={24} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 26, flex: 1, paddingTop: 6 }}>
          <div
            style={{
              display: 'flex',
              fontFamily: HEADING,
              fontWeight: 700,
              fontSize: fit(person.full_name, 72, 2.4, 46),
              color: BRAND.indigo,
              lineHeight: 1.05,
            }}
          >
            {clip(person.full_name, 48)}
          </div>
          <div
            style={{
              display: 'flex',
              fontFamily: BODY,
              fontWeight: 700,
              fontSize: 40,
              color: BRAND.ink,
            }}
          >
            {person.age ? `${person.age} ans` : ''}
          </div>
          <Fact
            label={`${isFemale(person.gender) ? 'Vue' : 'Vu'} pour la dernière fois`}
            value={seen}
          />
          {person.region ? <Fact label="Région" value={person.region} /> : null}
        </div>
      </div>
      {person.distinctive_signs || person.clothing_description ? (
        <Fact
          label={person.distinctive_signs ? 'Signes distinctifs' : 'Vêtements'}
          value={clip(person.distinctive_signs || person.clothing_description, 150)}
          size={30}
        />
      ) : null}
      <div style={{ display: 'flex', flexGrow: 1 }} />
      {found ? (
        <ThanksBlock text="Merci à toutes celles et ceux qui ont partagé cet avis." />
      ) : (
        <ContactBlock
          intro="Si vous avez une information, appelez :"
          phone={person.contact_phone}
          url={url}
        />
      )}
    </PosterFrame>
  );
}

function CardFrame({
  photo,
  fallback,
  children,
}: {
  photo: string | null;
  fallback: string;
  children: ReactNode;
}) {
  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', backgroundColor: BRAND.indigo }}>
      <Photo src={photo} fallback={fallback} width={470} height={630} />
      <NdopStrip style={{ width: 28, height: '100%' }} />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          padding: '48px 52px 44px',
          gap: 18,
          color: BRAND.coton,
        }}
      >
        {children}
        <div style={{ display: 'flex', flexGrow: 1 }} />
        <Wordmark size={52} />
      </div>
    </div>
  );
}

const cardTitle = (text: string): CSSProperties => ({
  display: 'flex',
  fontFamily: HEADING,
  fontWeight: 700,
  fontSize: fit(text, 64, 1.8, 40),
  lineHeight: 1.05,
});
const cardLine: CSSProperties = {
  display: 'flex',
  fontFamily: BODY,
  fontSize: 30,
  color: '#c7cad6',
};

export function PersonCard({ person, photo }: { person: MissingPerson; photo: string | null }) {
  const label = personLabel(person);
  return (
    <CardFrame photo={photo} fallback={SILHOUETTE}>
      <Label bg={label.bg} size={24}>
        {label.text}
      </Label>
      <div style={cardTitle(person.full_name)}>{clip(person.full_name, 40)}</div>
      <div style={cardLine}>
        {[person.age ? `${person.age} ans` : '', clip(person.last_seen_location, 40)]
          .filter(Boolean)
          .join(' · ')}
      </div>
      {person.status !== 'found' && person.contact_phone ? (
        <div
          style={{
            display: 'flex',
            fontFamily: HEADING,
            fontWeight: 700,
            fontSize: 40,
            color: BRAND.kolaOnDark,
          }}
        >
          {person.contact_phone}
        </div>
      ) : null}
    </CardFrame>
  );
}

// ---------------------------------------------------------------------------
// Lost & found items

const itemLabel = (i: LostItem) => {
  if (i.status === 'claimed') return { text: 'Restitué', bg: BRAND.success };
  if (i.report_type === 'found') return { text: 'Objet trouvé', bg: BRAND.indigoLight };
  return { text: i.item_type === 'document' ? 'Document perdu' : 'Objet perdu', bg: BRAND.item };
};

const itemSubtitle = (i: LostItem) =>
  [i.item_category, i.document_type, i.brand, i.color].filter(Boolean).join(' · ');

// Document and serial numbers are deliberately never printed: posters circulate publicly.
export function ItemPoster({
  item,
  photo,
  url,
}: {
  item: LostItem;
  photo: string | null;
  url: string;
}) {
  const label = itemLabel(item);
  const where = item.report_type === 'found' ? 'Trouvé à' : 'Perdu à';
  // Each optional row (owner, reward) takes room from the photo so the contact block always fits.
  const photoHeight = 520 - 60 * (Number(!!item.owner_name) + Number(!!item.reward));
  return (
    <PosterFrame label={label.text} labelBg={label.bg}>
      <Photo src={photo} fallback={BOX} width={968} height={photoHeight} radius={24} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div
          style={{
            display: 'flex',
            fontFamily: HEADING,
            fontWeight: 700,
            fontSize: fit(item.item_name, 80, 1.6, 52),
            color: BRAND.indigo,
            lineHeight: 1.05,
          }}
        >
          {clip(item.item_name, 60)}
        </div>
        <div style={{ display: 'flex', fontFamily: BODY, fontSize: 34, color: BRAND.muted }}>
          {itemSubtitle(item)}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 48 }}>
        <Fact label={where} value={clip(item.location, 50)} />
        {item.date_lost_found ? (
          <Fact label="Le" value={formatDateFr(item.date_lost_found)} />
        ) : null}
      </div>
      {item.owner_name ? <Fact label="Au nom de" value={clip(item.owner_name, 50)} /> : null}
      {item.reward ? (
        <Label bg={BRAND.success} size={28}>{`Récompense : ${clip(item.reward, 40)}`}</Label>
      ) : null}
      <div style={{ display: 'flex', flexGrow: 1 }} />
      {item.status === 'claimed' ? (
        <ThanksBlock text="Rendu à son propriétaire. Merci pour votre aide !" />
      ) : (
        <ContactBlock
          intro={
            item.report_type === 'found'
              ? 'C’est à vous ? Appelez :'
              : 'Vous l’avez trouvé ? Appelez :'
          }
          phone={item.contact_phone}
          url={url}
        />
      )}
    </PosterFrame>
  );
}

export function ItemCard({ item, photo }: { item: LostItem; photo: string | null }) {
  const label = itemLabel(item);
  return (
    <CardFrame photo={photo} fallback={BOX}>
      <Label bg={label.bg} size={24}>
        {label.text}
      </Label>
      <div style={cardTitle(item.item_name)}>{clip(item.item_name, 44)}</div>
      <div style={cardLine}>
        {[itemSubtitle(item), clip(item.location, 36)].filter(Boolean).join(' · ')}
      </div>
    </CardFrame>
  );
}

// ---------------------------------------------------------------------------

export function SiteCard() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundImage: `linear-gradient(180deg, ${BRAND.indigo}, ${BRAND.indigoDeep})`,
        color: BRAND.coton,
      }}
    >
      <div
        style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '80px 88px', gap: 36 }}
      >
        <Wordmark size={120} />
        <div
          style={{
            display: 'flex',
            fontFamily: HEADING,
            fontWeight: 700,
            fontSize: 60,
            lineHeight: 1.1,
          }}
        >
          Ensemble, retrouvons-les.
        </div>
        <div
          style={{
            display: 'flex',
            fontFamily: BODY,
            fontSize: 34,
            color: '#c7cad6',
            maxWidth: 900,
          }}
        >
          Personnes disparues, objets perdus et documents égarés au Cameroun.
        </div>
      </div>
      <NdopStrip style={{ height: 36 }} />
    </div>
  );
}

export const NotFoundPoster = SiteCard;
