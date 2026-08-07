import Image from 'next/image';
import React from 'react';

import { MissingPerson } from '@/types';

import {
  AlertTriangleIcon,
  MapPinIcon,
  CalendarIcon,
  PhoneIcon,
  ArrowRightIcon,
} from './icons/Icons';
interface UrgentCasesSectionProps {
  persons: MissingPerson[];
  onViewDetails: (person: MissingPerson) => void;
  onContact: (phone: string) => void;
}
const UrgentCasesSection: React.FC<UrgentCasesSectionProps> = ({
  persons,
  onViewDetails,
  onContact,
}) => {
  const urgentCases = persons.filter((p) => p.is_urgent && p.status !== 'found').slice(0, 3);
  if (urgentCases.length === 0) return null;
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };
  const getDaysSince = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  return (
    <section className="py-12 bg-red-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangleIcon size={28} className="text-red-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Cas urgents</h2>
              <p className="text-gray-600 text-sm">Personnes nécessitant une attention immédiate</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {urgentCases.map((person) => (
            <div
              key={person.id}
              className="bg-white rounded-xl shadow-md border-2 border-red-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-56">
                <Image
                  src={person.photo_url}
                  alt={person.full_name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-4">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-full animate-pulse">
                      <AlertTriangleIcon size={16} />
                      URGENT
                    </span>
                    <span
                      className="px-3 py-1 bg-white/90 text-gray-900 text-sm font-medium rounded-full"
                      data-mixed-content="true"
                    >
                      {getDaysSince(person.last_seen_date)} jours
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{person.full_name}</h3>
                <p className="text-gray-500 mb-4">
                  {person.age} ans • {person.gender}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPinIcon size={16} className="mr-2 text-red-500 flex-shrink-0" />
                    <span data-mixed-content="true">
                      {person.last_seen_location}, {person.region}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <CalendarIcon size={16} className="mr-2 text-red-500 flex-shrink-0" />
                    <span data-mixed-content="true">
                      Disparu(e) le {formatDate(person.last_seen_date)}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{person.description}</p>

                <div className="flex gap-2">
                  <button
                    onClick={() => onViewDetails(person)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
                  >
                    Voir détails
                    <ArrowRightIcon size={16} />
                  </button>
                  <button
                    onClick={() => onContact(person.contact_phone)}
                    className="p-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    title="Appeler"
                  >
                    <PhoneIcon size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default UrgentCasesSection;
