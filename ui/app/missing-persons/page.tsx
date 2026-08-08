'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { UserIcon } from '@/components/icons/Icons';
import MobileMenu from '@/components/MobileMenu';
import PersonCard from '@/components/ui/PersonCard';
import SearchFilters from '@/components/ui/SearchFilters';
import { useMissingPersonsInfinite } from '@/hooks/api/useMissingPersonsInfinite';
import { buildFilterQueryString, filtersFromSearchParams, ROUTES } from '@/lib/routes';
import { FilterState, MissingPerson } from '@/types';
import { Filters } from '@/types/api-routes';

// useSearchParams() below requires a Suspense boundary during static
// prerendering — same pattern as app/page.tsx and app/report/page.tsx.
export default function MissingPersonsList() {
  return (
    <Suspense fallback={null}>
      <MissingPersonsListContent />
    </Suspense>
  );
}

function MissingPersonsListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filters = filtersFromSearchParams(searchParams);
  const apiFilters: Filters = {
    ...(filters.search && { search: filters.search }),
    ...(filters.region && { region: filters.region }),
    ...(filters.status && { status: filters.status }),
    ...(filters.gender && { gender: filters.gender }),
  };

  const {
    data: persons,
    isLoading,
    hasMore,
    isLoadingMore,
    loadMore,
  } = useMissingPersonsInfinite(apiFilters);

  const handleFilterChange = (next: FilterState) => {
    router.replace(`${ROUTES.missingPersons.list}${buildFilterQueryString(next)}`);
  };

  const handleViewDetails = (person: MissingPerson) => {
    router.push(ROUTES.missingPersons.byId(person.id));
  };

  const handleContact = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const clearFilters = () => router.replace(ROUTES.missingPersons.list);
  const hasActiveFilters = filters.search || filters.region || filters.status || filters.gender;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header onMenuClick={() => setShowMobileMenu(true)} />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
              <UserIcon size={28} className="text-orange-500" />
              Personnes disparues
            </h1>
            <p className="text-gray-600">Consultez tous les signalements de personnes disparues</p>
          </div>

          <SearchFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
            viewMode="persons"
          />

          <div className="mt-6 mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {persons.length} personne{persons.length !== 1 ? 's' : ''}
            </h2>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                Effacer les filtres
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse"
                >
                  <div className="h-48 bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="h-10 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : persons.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {persons.map((person) => (
                  <PersonCard
                    key={person.id}
                    person={person}
                    onViewDetails={handleViewDetails}
                    onContact={handleContact}
                  />
                ))}
              </div>
              {hasMore && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={loadMore}
                    disabled={isLoadingMore}
                    className="px-6 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 text-gray-700 rounded-full font-medium transition-colors"
                  >
                    {isLoadingMore ? 'Chargement...' : 'Charger plus de personnes'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun résultat trouvé</h3>
              <p className="text-gray-500 mb-4">Essayez de modifier vos critères de recherche</p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <MobileMenu isOpen={showMobileMenu} onClose={() => setShowMobileMenu(false)} />
    </div>
  );
}
