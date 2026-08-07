import React from 'react';

import { MapPinIcon, CalendarIcon, PhoneIcon, ArrowRightIcon } from '@/components/icons/Icons';
import { MissingPerson } from '@/types';

import StatusBadge from './StatusBadge';

interface PersonCardProps {
  person: MissingPerson;
  onViewDetails: (person: MissingPerson) => void;
  onContact: (phone: string) => void;
}

const PersonCard: React.FC<PersonCardProps> = ({ person, onViewDetails, onContact }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getAgeCategory = (age: number, gender: string) => {
    if (age < 13)
      return gender === 'Fille'
        ? 'Enfant fille'
        : gender === 'Femme'
          ? 'Enfant fille'
          : 'Enfant garçon';
    if (age < 18) return gender === 'Fille' || gender === 'Femme' ? 'Adolescente' : 'Adolescent';
    return gender === 'Femme' || gender === 'Fille' ? 'Femme' : 'Homme';
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group">
      <div className="relative">
        <img
          src={person.photo_url}
          alt={person.full_name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <StatusBadge status={person.status} is_urgent={person.is_urgent} />
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{person.full_name}</h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600 text-sm">
            <MapPinIcon size={16} className="mr-2 text-orange-500 flex-shrink-0" />
            <span className="truncate">
              {person.last_seen_location}, {person.region}
            </span>
          </div>

          <div className="flex items-center text-gray-600 text-sm">
            <CalendarIcon size={16} className="mr-2 text-orange-500 flex-shrink-0" />
            <span>{formatDate(person.last_seen_date)}</span>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          {person.age} ans • {getAgeCategory(person.age, person.gender)}
        </p>

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
            className="p-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
            title="Appeler"
          >
            <PhoneIcon size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonCard;
