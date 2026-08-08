import type { LostItem, MissingPerson, Sighting, User } from '@/types';

export const missingPersonFixtures: MissingPerson[] = [
  {
    id: 1,
    full_name: 'Paul Tassong',
    age: 34,
    gender: 'male',
    // localhost:8000/uploads/** matches next.config.ts's images.remotePatterns
    // — an unconfigured host (e.g. example.com) throws when next/image
    // renders it, crashing any page that displays this fixture.
    photo_url: 'http://localhost:8000/uploads/photo1.jpg',
    description: 'Vu pour la dernière fois au marché Mokolo.',
    last_seen_location: 'Marché Mokolo, Yaoundé',
    last_seen_date: '2026-07-20',
    region: 'Centre',
    contact_phone: '+237600000001',
    status: 'missing',
    is_urgent: true,
    created_at: '2026-07-21T08:00:00Z',
    updated_at: '2026-07-21T08:00:00Z',
  },
  {
    id: 2,
    full_name: 'Aïcha Bello',
    age: 19,
    gender: 'female',
    photo_url: 'http://localhost:8000/uploads/photo2.jpg',
    description: 'Disparue après un cours du soir.',
    last_seen_location: 'Université de Douala',
    last_seen_date: '2026-07-18',
    region: 'Littoral',
    contact_phone: '+237600000002',
    status: 'searching',
    is_urgent: false,
    created_at: '2026-07-19T10:00:00Z',
    updated_at: '2026-07-19T10:00:00Z',
  },
];

export const lostItemFixtures: LostItem[] = [
  {
    id: 1,
    item_type: 'document',
    item_name: "Carte Nationale d'Identité",
    item_category: "Carte Nationale d'Identité (CNI)",
    photo_url: 'http://localhost:8000/uploads/item1.jpg',
    description: 'CNI perdue près de la gare routière.',
    location: 'Gare routière, Bafoussam',
    date_lost_found: '2026-07-22',
    region: 'Ouest',
    contact_phone: '+237600000003',
    status: 'lost',
    report_type: 'lost',
    is_urgent: false,
    reporter_name: 'Jean Mballa',
    reporter_phone: '+237600000003',
    created_at: '2026-07-22T09:00:00Z',
    updated_at: '2026-07-22T09:00:00Z',
  },
];

export const sightingFixtures: Sighting[] = [
  {
    id: 1,
    missingPersonId: 1,
    reporter_name: 'Marie Ekotto',
    reporter_phone: '+237600000004',
    location: 'Marché Central, Yaoundé',
    sightingDate: '2026-07-23',
    description: 'Personne aperçue près du marché central.',
    created_at: '2026-07-23T12:00:00Z',
  },
];

export const userFixtures: User[] = [
  {
    id: 1,
    full_name: 'Jean Mballa',
    email: 'jean.mballa@example.com',
    phone: '+237600000003',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
];
