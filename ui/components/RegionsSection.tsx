import React from 'react';

import { MissingPerson } from '@/types';

import { MapPinIcon } from './icons/Icons';

interface RegionsSectionProps {
  persons: MissingPerson[];
  onRegionClick: (region: string) => void;
}

const REGIONS_DATA = [
  { name: 'Centre', capital: 'Yaoundé', color: 'bg-blue-500' },
  { name: 'Littoral', capital: 'Douala', color: 'bg-orange-500' },
  { name: 'Ouest', capital: 'Bafoussam', color: 'bg-green-500' },
  { name: 'Nord-Ouest', capital: 'Bamenda', color: 'bg-purple-500' },
  { name: 'Sud-Ouest', capital: 'Buéa', color: 'bg-pink-500' },
  { name: 'Sud', capital: 'Ebolowa', color: 'bg-teal-500' },
  { name: 'Est', capital: 'Bertoua', color: 'bg-yellow-500' },
  { name: 'Adamaoua', capital: 'Ngaoundéré', color: 'bg-red-500' },
  { name: 'Nord', capital: 'Garoua', color: 'bg-indigo-500' },
  { name: 'Extrême-Nord', capital: 'Maroua', color: 'bg-cyan-500' },
];

const RegionsSection: React.FC<RegionsSectionProps> = ({ persons, onRegionClick }) => {
  const getRegionCount = (regionName: string) => {
    return persons.filter((p) => p.region === regionName && p.status !== 'found').length;
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Rechercher par région
          </h2>
          <p className="text-gray-600">
            Cliquez sur une région pour voir les signalements correspondants
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {REGIONS_DATA.map((region) => {
            const count = getRegionCount(region.name);
            return (
              <button
                key={region.name}
                onClick={() => onRegionClick(region.name)}
                className="group relative bg-gray-50 hover:bg-gray-100 rounded-xl p-4 text-left transition-all hover:shadow-md"
              >
                <div
                  className={`w-10 h-10 ${region.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                >
                  <MapPinIcon size={20} className="text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{region.name}</h3>
                <p className="text-sm text-gray-500">{region.capital}</p>
                {count > 0 && (
                  <span className="absolute top-3 right-3 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RegionsSection;
