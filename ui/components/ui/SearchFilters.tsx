import React from 'react';
import { FilterState } from '@/types';
import { SearchIcon, FilterIcon, ChevronDownIcon } from '@/components/icons/Icons';

interface SearchFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  viewMode?: 'persons' | 'items' | 'all';
}

const REGIONS = [
  'Toutes les régions',
  'Adamaoua',
  'Centre',
  'Est',
  'Extrême-Nord',
  'Littoral',
  'Nord',
  'Nord-Ouest',
  'Ouest',
  'Sud',
  'Sud-Ouest'
];

const PERSON_STATUSES = [
  { value: '', label: 'Tous les statuts' },
  { value: 'missing', label: 'Disparu' },
  { value: 'searching', label: 'En cours de recherche' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'found', label: 'Retrouvé' }
];

const GENDERS = [
  { value: '', label: 'Tous les genres' },
  { value: 'Homme', label: 'Homme' },
  { value: 'Femme', label: 'Femme' },
  { value: 'Fille', label: 'Fille' },
  { value: 'Garçon', label: 'Garçon' }
];

const item_typeS = [
  { value: '', label: 'Tous les types' },
  { value: 'document', label: 'Document' },
  { value: 'object', label: 'Objet' },
  { value: 'animal', label: 'Animal' },
  { value: 'vehicle', label: 'Véhicule' },
  { value: 'other', label: 'Autre' }
];

const report_typeS = [
  { value: '', label: 'Perdu & Trouvé' },
  { value: 'lost', label: 'Perdu' },
  { value: 'found', label: 'Trouvé' }
];

const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFilterChange,
  showFilters,
  onToggleFilters,
  viewMode = 'all'
}) => {
  const handleChange = (key: keyof FilterState, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const showPersonFilters = viewMode === 'persons' || viewMode === 'all';
  const showItemFilters = viewMode === 'items' || viewMode === 'all';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        onClick={onToggleFilters}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <FilterIcon size={20} className="text-gray-500" />
          <span className="font-medium text-gray-700">Recherche avancée</span>
        </div>
        <ChevronDownIcon
          size={20}
          className={`text-gray-500 transition-transform ${showFilters ? 'rotate-180' : ''}`}
        />
      </button>

      {showFilters && (
        <div className="p-4 pt-0 space-y-4 border-t border-gray-100">
          <h4 className="font-semibold text-gray-700 flex items-center gap-2 pt-4">
            <FilterIcon size={18} />
            Filtrer les recherches
          </h4>

          {/* Search Input */}
          <div className="relative">
            <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={viewMode === 'items' ? "Rechercher un objet..." : viewMode === 'persons' ? "Rechercher une personne..." : "Rechercher..."}
              value={filters.search}
              onChange={(e) => handleChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
            />
          </div>

          {/* Common Filter - Region */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <select
              value={filters.region}
              onChange={(e) => handleChange('region', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-white text-gray-700"
            >
              {REGIONS.map((region) => (
                <option key={region} value={region === 'Toutes les régions' ? '' : region}>
                  {region}
                </option>
              ))}
            </select>

            {/* Person-specific filters */}
            {showPersonFilters && (
              <>
                <select
                  value={filters.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-white text-gray-700"
                >
                  {PERSON_STATUSES.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-white text-gray-700"
                >
                  {GENDERS.map((gender) => (
                    <option key={gender.value} value={gender.value}>
                      {gender.label}
                    </option>
                  ))}
                </select>
              </>
            )}

            {/* Item-specific filters */}
            {showItemFilters && (
              <>
                <select
                  value={filters.item_type || ''}
                  onChange={(e) => handleChange('item_type', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-white text-gray-700"
                >
                  {item_typeS.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.report_type || ''}
                  onChange={(e) => handleChange('report_type', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-white text-gray-700"
                >
                  {report_typeS.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>

          {/* Quick Filter Chips */}
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="text-sm text-gray-500">Filtres rapides:</span>
            <button
              onClick={() => onFilterChange({ ...filters, status: 'urgent' })}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filters.status === 'urgent'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Cas urgents
            </button>
            <button
              onClick={() => onFilterChange({ ...filters, report_type: 'lost' })}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filters.report_type === 'lost'
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Objets perdus
            </button>
            <button
              onClick={() => onFilterChange({ ...filters, report_type: 'found' })}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filters.report_type === 'found'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Objets trouvés
            </button>
            <button
              onClick={() => onFilterChange({ ...filters, item_type: 'document' })}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filters.item_type === 'document'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Documents
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
