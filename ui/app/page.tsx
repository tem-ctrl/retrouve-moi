'use client';

import React, { useState, useRef, useCallback } from 'react';

import AuthModal from '@/components/AuthModal';
import EmergencyBanner from '@/components/EmergencyBanner';
import Footer from '@/components/Footer';
import FoundPersonsSection from '@/components/FoundPersonsSection';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import { UserIcon, PackageIcon, MapIcon, GridIcon } from '@/components/icons/Icons';
import InteractiveMap from '@/components/InteractiveMap';
import ItemDetailModal from '@/components/ItemDetailModal';
import ItemReportForm from '@/components/ItemReportForm';
import MobileMenu from '@/components/MobileMenu';
import PersonDetailModal from '@/components/PersonDetailModal';
import ProfilePage from '@/components/ProfilePage';
import RegionsSection from '@/components/RegionsSection';
import ReportForm from '@/components/ReportForm';
import SuccessModal from '@/components/SuccessModal';
import ItemCard from '@/components/ui/ItemCard';
import PersonCard from '@/components/ui/PersonCard';
import SearchFilters from '@/components/ui/SearchFilters';
import UrgentCasesSection from '@/components/UrgentCasesSection';
import { useLostItems } from '@/hooks/api/useLostItems';
import { useMissingPersons } from '@/hooks/api/useMissingPersons';
import { MissingPerson, LostItem, FilterState } from '@/types';
import { Filters } from '@/types/api-routes';

type ViewMode = 'persons' | 'items' | 'all';

export default function Home() {
  const {
    data: persons,
    isLoading: personsLoading,
    mutate: mutatePersons,
  } = useMissingPersons({ limit: 30 });
  const { data: items, isLoading: itemsLoading, mutate: mutateItems } = useLostItems({ limit: 30 });
  const loading = personsLoading || itemsLoading;
  const [selectedPerson, setSelectedPerson] = useState<MissingPerson | null>(null);
  const [selectedItem, setSelectedItem] = useState<LostItem | null>(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const [showItemReportForm, setShowItemReportForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfilePage, setShowProfilePage] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    region: '',
    status: '',
    gender: '',
    item_type: '',
    report_type: '',
  });

  const listingRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // Server-side filtered listing data for the "Tous les signalements" grid
  // only — deliberately separate from the unfiltered `persons`/`items`
  // above, which power stats/map/urgent-cases/regions and must stay
  // unaffected by the user's search filters. When no filter is active these
  // resolve to the same SWR key as the unfiltered fetch above, so SWR's
  // cache dedupes them into a single request rather than two.
  const personListFilters: Filters = {
    limit: 30,
    ...(filters.search && { search: filters.search }),
    ...(filters.region && { region: filters.region }),
    ...(filters.status && { status: filters.status }),
    ...(filters.gender && { gender: filters.gender }),
  };
  const itemListFilters: Filters = {
    limit: 30,
    ...(filters.search && { search: filters.search }),
    ...(filters.region && { region: filters.region }),
    ...(filters.item_type && { item_type: filters.item_type }),
    ...(filters.report_type && { report_type: filters.report_type }),
  };
  const { data: filteredPersons } = useMissingPersons(personListFilters);
  const { data: filteredItems } = useLostItems(itemListFilters);

  // Calculate statistics
  const stats = {
    totalPersons: persons.length,
    missingPersons: persons.filter((p) => p.status === 'missing' || p.status === 'searching')
      .length,
    foundPersons: persons.filter((p) => p.status === 'found').length,
    urgentPersons: persons.filter((p) => p.is_urgent && p.status !== 'found').length,
    totalItems: items.length,
    lostItems: items.filter((i) => i.report_type === 'lost' && i.status !== 'claimed').length,
    foundItems: items.filter((i) => i.report_type === 'found' && i.status !== 'claimed').length,
    claimedItems: items.filter((i) => i.status === 'claimed').length,
  };

  // Stable references: InteractiveMap's marker-rebuild effect depends on
  // these, and rebuilds every marker (with position jitter) whenever they
  // change identity — an inline function here would re-run that effect on
  // every render of Home.
  const handleViewPersonDetails = useCallback((person: MissingPerson) => {
    setSelectedPerson(person);
  }, []);

  const handleViewItemDetails = useCallback((item: LostItem) => {
    setSelectedItem(item);
  }, []);

  const handleContact = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleReportSuccess = () => {
    setShowReportForm(false);
    setShowItemReportForm(false);
    setShowSuccessModal(true);
    mutatePersons();
    mutateItems();
  };

  const scrollToListings = () => {
    listingRef.current?.scrollIntoView({ behavior: 'smooth' });
    setShowFilters(true);
  };

  const scrollToMap = () => {
    mapRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRegionClick = (region: string) => {
    setFilters((prev) => ({ ...prev, region }));
    scrollToListings();
  };

  const handleReportClick = () => {
    setShowReportForm(true);
  };

  const handleItemReportClick = () => {
    setShowItemReportForm(true);
  };

  // Show profile page if open
  if (showProfilePage) {
    return (
      <ProfilePage
        onClose={() => setShowProfilePage(false)}
        onViewPerson={(person) => {
          setShowProfilePage(false);
          setSelectedPerson(person);
        }}
      />
    );
  }

  const clearFilters = () => {
    setFilters({ search: '', region: '', status: '', gender: '', item_type: '', report_type: '' });
  };

  const hasActiveFilters =
    filters.search ||
    filters.region ||
    filters.status ||
    filters.gender ||
    filters.item_type ||
    filters.report_type;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Emergency Banner */}
      <EmergencyBanner />

      {/* Header */}
      <Header
        onMenuClick={() => setShowMobileMenu(true)}
        onReportClick={handleReportClick}
        onAuthClick={() => setShowAuthModal(true)}
        onProfileClick={() => setShowProfilePage(true)}
      />

      {/* Hero Section */}
      <HeroSection onReportClick={handleReportClick} onSearchClick={scrollToListings} />

      {/* Stats Section - Extended */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.totalPersons}</div>
              <div className="text-xs text-orange-700">Personnes signalées</div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.urgentPersons}</div>
              <div className="text-xs text-red-700">Cas urgents</div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-amber-600">{stats.missingPersons}</div>
              <div className="text-xs text-amber-700">Personnes disparues</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.foundPersons}</div>
              <div className="text-xs text-green-700">Personnes retrouvées</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.totalItems}</div>
              <div className="text-xs text-purple-700">Objets signalés</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.lostItems}</div>
              <div className="text-xs text-blue-700">Objets perdus</div>
            </div>
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-teal-600">{stats.foundItems}</div>
              <div className="text-xs text-teal-700">Objets trouvés</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-emerald-600">{stats.claimedItems}</div>
              <div className="text-xs text-emerald-700">Objets réclamés</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={handleReportClick}
              className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border-2 border-transparent hover:border-orange-200"
            >
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                <UserIcon size={28} className="text-orange-600" />
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-900">Signaler une disparition</div>
                <div className="text-sm text-gray-500">Personne disparue</div>
              </div>
            </button>
            <button
              onClick={handleItemReportClick}
              className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border-2 border-transparent hover:border-purple-200"
            >
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                <PackageIcon size={28} className="text-purple-600" />
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-900">Signaler un objet</div>
                <div className="text-sm text-gray-500">Perdu ou trouvé</div>
              </div>
            </button>
            <button
              onClick={scrollToMap}
              className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border-2 border-transparent hover:border-blue-200"
            >
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                <MapIcon size={28} className="text-blue-600" />
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-900">Voir la carte</div>
                <div className="text-sm text-gray-500">Tous les signalements</div>
              </div>
            </button>
            <button
              onClick={scrollToListings}
              className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border-2 border-transparent hover:border-green-200"
            >
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                <GridIcon size={28} className="text-green-600" />
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-900">Parcourir</div>
                <div className="text-sm text-gray-500">Tous les cas</div>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Urgent Cases Section */}
      <UrgentCasesSection
        persons={persons}
        onViewDetails={handleViewPersonDetails}
        onContact={handleContact}
      />

      {/* Interactive Map Section */}
      <div ref={mapRef}>
        <InteractiveMap
          persons={persons}
          items={items}
          onSelectPerson={handleViewPersonDetails}
          onSelectItem={handleViewItemDetails}
        />
      </div>

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Regions Section */}
      <RegionsSection persons={persons} onRegionClick={handleRegionClick} />

      {/* Main Content - All Listings */}
      <main className="flex-1 py-8 bg-gray-100" ref={listingRef}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Tous les signalements
            </h2>
            <p className="text-gray-600">
              Consultez tous les cas signalés et aidez-nous à retrouver ces personnes et objets
            </p>
          </div>

          {/* View Mode Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <button
              onClick={() => setViewMode('all')}
              className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                viewMode === 'all'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              Tout ({persons.length + items.length})
            </button>
            <button
              onClick={() => setViewMode('persons')}
              className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                viewMode === 'persons'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              Personnes ({persons.length})
            </button>
            <button
              onClick={() => setViewMode('items')}
              className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                viewMode === 'items'
                  ? 'bg-purple-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              Objets ({items.length})
            </button>
          </div>

          {/* Search and Filters */}
          <SearchFilters
            filters={filters}
            onFilterChange={setFilters}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
            viewMode={viewMode}
          />

          {/* Results Count */}
          <div className="mt-6 mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {viewMode === 'persons' &&
                `${filteredPersons.length} personne${filteredPersons.length !== 1 ? 's' : ''}`}
              {viewMode === 'items' &&
                `${filteredItems.length} objet${filteredItems.length !== 1 ? 's' : ''}`}
              {viewMode === 'all' &&
                `${filteredPersons.length + filteredItems.length} signalement${filteredPersons.length + filteredItems.length !== 1 ? 's' : ''}`}
            </h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                Effacer les filtres
              </button>
            )}
          </div>

          {/* Loading State */}
          {loading ? (
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
          ) : (
            <>
              {/* Persons Grid */}
              {(viewMode === 'persons' || viewMode === 'all') && filteredPersons.length > 0 && (
                <div className="mb-8">
                  {viewMode === 'all' && (
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <UserIcon size={20} className="text-orange-500" />
                      Personnes disparues ({filteredPersons.length})
                    </h4>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredPersons.map((person) => (
                      <PersonCard
                        key={person.id}
                        person={person}
                        onViewDetails={handleViewPersonDetails}
                        onContact={handleContact}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Items Grid */}
              {(viewMode === 'items' || viewMode === 'all') && filteredItems.length > 0 && (
                <div className="mb-8">
                  {viewMode === 'all' && (
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <PackageIcon size={20} className="text-purple-500" />
                      Objets perdus/trouvés ({filteredItems.length})
                    </h4>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredItems.map((item) => (
                      <ItemCard
                        key={item.id}
                        item={item}
                        onViewDetails={handleViewItemDetails}
                        onContact={handleContact}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {((viewMode === 'persons' && filteredPersons.length === 0) ||
                (viewMode === 'items' && filteredItems.length === 0) ||
                (viewMode === 'all' &&
                  filteredPersons.length === 0 &&
                  filteredItems.length === 0)) && (
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Aucun résultat trouvé
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Essayez de modifier vos critères de recherche
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Found Persons Section */}
      <FoundPersonsSection persons={persons} />

      {/* Footer */}
      <Footer />

      {/* Modals */}
      {selectedPerson && (
        <PersonDetailModal person={selectedPerson} onClose={() => setSelectedPerson(null)} />
      )}

      {selectedItem && (
        <ItemDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}

      {showReportForm && (
        <ReportForm onClose={() => setShowReportForm(false)} onSuccess={handleReportSuccess} />
      )}

      {showItemReportForm && (
        <ItemReportForm
          onClose={() => setShowItemReportForm(false)}
          onSuccess={handleReportSuccess}
        />
      )}

      {showSuccessModal && <SuccessModal onClose={() => setShowSuccessModal(false)} />}

      {showAuthModal && (
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      )}

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
        onReportClick={handleReportClick}
      />
    </div>
  );
}
