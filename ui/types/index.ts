export interface MissingPerson {
  id: number;
  full_name: string;
  age: number;
  gender: string;
  photo_url: string;
  description: string;
  last_seen_location: string;
  last_seen_date: string;
  region: string;
  contact_phone: string;
  contact_email?: string;
  status: 'missing' | 'found' | 'searching' | 'urgent';
  is_urgent: boolean;
  distinctive_signs?: string;
  height?: string;
  weight?: string;
  clothing_description?: string;
  reporter_name?: string;
  reporter_phone?: string;
  reporter_email?: string;
  user_id?: number;
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
}

export interface LostItem {
  id: number;
  item_type: 'document' | 'object' | 'animal' | 'vehicle' | 'other';
  item_name: string;
  item_category: string;
  photo_url?: string;
  description: string;
  location: string;
  date_lost_found: string;
  region: string;
  contact_phone: string;
  contact_email?: string;
  status: 'lost' | 'found' | 'claimed';
  report_type: 'lost' | 'found'; // Did the user lose it or find it?
  is_urgent: boolean;
  reward?: string;
  document_type?: string; // For documents: CNI, passport, etc.
  document_number?: string;
  owner_name?: string; // If found and name is visible
  brand?: string; // For objects
  color?: string;
  serial_number?: string;
  reporter_name: string;
  reporter_phone: string;
  reporter_email?: string;
  user_id?: number;
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
}

export interface Sighting {
  id: number;
  missingPersonId: number;
  reporter_name: string;
  reporter_phone: string;
  reporter_email?: string;
  location: string;
  sightingDate: string;
  description: string;
  created_at: string;
}

export interface FilterState {
  search: string;
  region: string;
  status: string;
  gender: string;
  category?: string;
  report_type?: string;
  item_type?: string;
}

export interface User {
  id: number;
  full_name: string;
  phone?: string;
  email: string;
  avatar_url?: string;
  address?: string;
  city?: string;
  region?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: number;
  email?: string;
  phone?: string;
  metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export interface MapMarker {
  id: number;
  type: 'person' | 'item';
  latitude: number;
  longitude: number;
  title: string;
  status: string;
  is_urgent: boolean;
  photo_url?: string;
  location: string;
  date: string;
}

// Cameroon regions with approximate coordinates
export const CAMEROON_REGIONS = [
  { name: 'Adamaoua', lat: 7.3167, lng: 13.5833 },
  { name: 'Centre', lat: 3.8667, lng: 11.5167 },
  { name: 'Est', lat: 4.0333, lng: 14.15 },
  { name: 'Extrême-Nord', lat: 10.5833, lng: 14.25 },
  { name: 'Littoral', lat: 4.05, lng: 9.7 },
  { name: 'Nord', lat: 9.3, lng: 13.4 },
  { name: 'Nord-Ouest', lat: 6.0667, lng: 10.15 },
  { name: 'Ouest', lat: 5.4833, lng: 10.4167 },
  { name: 'Sud', lat: 2.95, lng: 10.9 },
  { name: 'Sud-Ouest', lat: 4.95, lng: 9.2333 },
];

export const ITEM_CATEGORIES = {
  document: [
    "Carte Nationale d'Identité (CNI)",
    'Passeport',
    'Permis de conduire',
    "Carte d'étudiant",
    'Diplôme/Certificat',
    'Acte de naissance',
    'Carte bancaire',
    'Carte professionnelle',
    'Autre document',
  ],
  object: [
    'Téléphone portable',
    'Ordinateur/Laptop',
    'Tablette',
    'Portefeuille',
    'Sac à main',
    'Bijoux',
    'Montre',
    'Clés',
    'Appareil photo',
    'Lunettes',
    'Autre objet',
  ],
  animal: ['Chien', 'Chat', 'Oiseau', 'Autre animal'],
  vehicle: ['Moto', 'Vélo', 'Voiture', 'Autre véhicule'],
  other: ['Autre'],
};
