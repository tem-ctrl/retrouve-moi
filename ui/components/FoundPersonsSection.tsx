import Image from 'next/image';
import React from 'react';

import { MissingPerson } from '@/types';

import { CheckCircleIcon, CalendarIcon, MapPinIcon } from './icons/Icons';

interface FoundPersonsSectionProps {
  persons: MissingPerson[];
}

const FoundPersonsSection: React.FC<FoundPersonsSectionProps> = ({ persons }) => {
  const foundPersons = persons.filter((p) => p.status === 'found').slice(0, 4);

  if (foundPersons.length === 0) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <section className="py-12 bg-success-soft">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-success-soft rounded-full mb-4">
            <CheckCircleIcon size={20} className="text-success-ink" />
            <span className="text-sm font-semibold text-success-ink">Bonnes nouvelles</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Personnes retrouvées
          </h2>
          <p className="text-subtle max-w-2xl mx-auto">
            Grâce à la mobilisation citoyenne, ces personnes ont été retrouvées saines et sauves.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {foundPersons.map((person) => (
            <div
              key={person.id}
              className="bg-card rounded-xl shadow-sm border border-success-line overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative h-40">
                <Image
                  src={person.photo_url}
                  alt={person.full_name}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover"
                />
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-success text-white text-xs font-semibold rounded-full">
                    <CheckCircleIcon size={14} />
                    Retrouvé
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-foreground mb-2">{person.full_name}</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPinIcon size={14} className="text-success-ink" />
                    <span className="truncate">{person.region}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon size={14} className="text-success-ink" />
                    <span>{formatDate(person.updated_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FoundPersonsSection;
