import React from 'react';

import { SearchIcon, FilterIcon, ChevronDownIcon } from '@/components/icons/Icons';
import { FilterState } from '@/types';

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
  'Sud-Ouest',
];

const PERSON_STATUSES = [
  { value: '', label: 'Tous les statuts' },
  { value: 'missing', label: 'Disparu' },
  { value: 'searching', label: 'En cours de recherche' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'found', label: 'Retrouvé' },
];

// Values match what ReportForm actually submits (MissingPerson.gender), not
// the French labels — these never lined up before, so this filter silently
// matched nothing.
const GENDERS = [
  { value: '', label: 'Tous les genres' },
  { value: 'male', label: 'Homme' },
  { value: 'female', label: 'Femme' },
  { value: 'girl', label: 'Fille' },
  { value: 'boy', label: 'Garçon' },
];

const item_typeS = [
  { value: '', label: 'Tous les types' },
  { value: 'document', label: 'Document' },
  { value: 'object', label: 'Objet' },
  { value: 'animal', label: 'Animal' },
  { value: 'vehicle', label: 'Véhicule' },
  { value: 'other', label: 'Autre' },
];

const report_typeS = [
  { value: '', label: 'Perdu & Trouvé' },
  { value: 'lost', label: 'Perdu' },
  { value: 'found', label: 'Trouvé' },
];

const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFilterChange,
  showFilters,
  onToggleFilters,
  viewMode = 'all',
}) => {
  const handleChange = (key: keyof FilterState, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const showPersonFilters = viewMode === 'persons' || viewMode === 'all';
  const showItemFilters = viewMode === 'items' || viewMode === 'all';

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
      <button
        onClick={onToggleFilters}
        className="w-full flex items-center justify-between p-4 hover:bg-muted transition-colors"
      >
        <div className="flex items-center gap-2">
          <FilterIcon size={20} className="text-muted-foreground" />
          <span className="font-medium text-subtle">Recherche avancée</span>
        </div>
        <ChevronDownIcon
          size={20}
          className={`text-muted-foreground transition-transform ${showFilters ? 'rotate-180' : ''}`}
        />
      </button>

      {showFilters && (
        <div className="p-4 pt-0 space-y-4 border-t border-border">
          <h4 className="font-semibold text-subtle flex items-center gap-2 pt-4">
            <FilterIcon size={18} />
            Filtrer les recherches
          </h4>

          {/* Search Input */}
          <div className="relative">
            <SearchIcon
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder={
                viewMode === 'items'
                  ? 'Rechercher un objet...'
                  : viewMode === 'persons'
                    ? 'Rechercher une personne...'
                    : 'Rechercher...'
              }
              value={filters.search}
              onChange={(e) => handleChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary outline-none transition-all"
            />
          </div>

          {/* Common Filter - Region */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <select
              value={filters.region}
              onChange={(e) => handleChange('region', e.target.value)}
              className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary outline-none transition-all bg-card text-subtle"
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
                  className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary outline-none transition-all bg-card text-subtle"
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
                  className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-primary outline-none transition-all bg-card text-subtle"
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
                  className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-item focus:border-item outline-none transition-all bg-card text-subtle"
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
                  className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-item focus:border-item outline-none transition-all bg-card text-subtle"
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
            <span className="text-sm text-muted-foreground">Filtres rapides:</span>
            <button
              onClick={() => onFilterChange({ ...filters, status: 'urgent' })}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filters.status === 'urgent'
                  ? 'bg-danger-soft text-danger-ink'
                  : 'bg-muted text-subtle hover:bg-muted-strong'
              }`}
            >
              Cas urgents
            </button>
            <button
              onClick={() => onFilterChange({ ...filters, report_type: 'lost' })}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filters.report_type === 'lost'
                  ? 'bg-primary-soft text-primary-ink'
                  : 'bg-muted text-subtle hover:bg-muted-strong'
              }`}
            >
              Objets perdus
            </button>
            <button
              onClick={() => onFilterChange({ ...filters, report_type: 'found' })}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filters.report_type === 'found'
                  ? 'bg-success-soft text-success-ink'
                  : 'bg-muted text-subtle hover:bg-muted-strong'
              }`}
            >
              Objets trouvés
            </button>
            <button
              onClick={() => onFilterChange({ ...filters, item_type: 'document' })}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filters.item_type === 'document'
                  ? 'bg-info-soft text-info-ink'
                  : 'bg-muted text-subtle hover:bg-muted-strong'
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
