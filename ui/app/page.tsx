'use client';

import { useRouter } from 'next/navigation';
import React, { useCallback, useRef } from 'react';

import AppLayout from '@/components/AppLayout';
import EmergencyBanner from '@/components/EmergencyBanner';
import FoundPersonsSection from '@/components/FoundPersonsSection';
import HeroSection from '@/components/HeroSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import { UserIcon, PackageIcon, MapIcon, GridIcon, SearchIcon } from '@/components/icons/Icons';
import InteractiveMap from '@/components/InteractiveMap';
import RegionsSection from '@/components/RegionsSection';
import UrgentCasesSection from '@/components/UrgentCasesSection';
import { useLostItems } from '@/hooks/api/useLostItems';
import { useMissingPersons } from '@/hooks/api/useMissingPersons';
import { ROUTES } from '@/lib/routes';
import { MissingPerson, LostItem } from '@/types';

export default function Home() {
  const router = useRouter();
  const { data: persons } = useMissingPersons({ limit: 30 });
  const { data: items } = useLostItems({ limit: 30 });

  const mapRef = useRef<HTMLDivElement>(null);

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
  const handleViewPersonDetails = useCallback(
    (person: MissingPerson) => {
      router.push(ROUTES.missingPersons.byId(person.id));
    },
    [router],
  );

  const handleViewItemDetails = useCallback(
    (item: LostItem) => {
      router.push(ROUTES.lostItems.byId(item.id));
    },
    [router],
  );

  const handleContact = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const scrollToMap = () => {
    mapRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // The full browsing experience (filters, infinite grid) now lives on
  // /missing-persons and /lost-items — see refactoring.md Phase 3.8. Region
  // browsing defaults to the persons listing, matching every other
  // "browse" entry point on this page.
  const handleRegionClick = (region: string) => {
    router.push(`${ROUTES.missingPersons.list}?region=${encodeURIComponent(region)}`);
  };

  const handleReportClick = () => {
    router.push(ROUTES.report());
  };

  const handleItemReportClick = () => {
    router.push(ROUTES.report('item'));
  };

  return (
    <AppLayout banner={<EmergencyBanner />}>
      {/* Hero Section */}
      <HeroSection
        onReportClick={handleReportClick}
        onSearchClick={() => router.push(ROUTES.missingPersons.list)}
      />

      {/* Stats Section - Extended */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            <div className="bg-linear-to-br from-orange-50 to-orange-100 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.totalPersons}</div>
              <div className="text-xs text-orange-700">Personnes signalées</div>
            </div>
            <div className="bg-linear-to-br from-red-50 to-red-100 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.urgentPersons}</div>
              <div className="text-xs text-red-700">Cas urgents</div>
            </div>
            <div className="bg-linear-to-br from-amber-50 to-amber-100 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-amber-600">{stats.missingPersons}</div>
              <div className="text-xs text-amber-700">Personnes disparues</div>
            </div>
            <div className="bg-linear-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.foundPersons}</div>
              <div className="text-xs text-green-700">Personnes retrouvées</div>
            </div>
            <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.totalItems}</div>
              <div className="text-xs text-purple-700">Objets signalés</div>
            </div>
            <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.lostItems}</div>
              <div className="text-xs text-blue-700">Objets perdus</div>
            </div>
            <div className="bg-linear-to-br from-teal-50 to-teal-100 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-teal-600">{stats.foundItems}</div>
              <div className="text-xs text-teal-700">Objets trouvés</div>
            </div>
            <div className="bg-linear-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-emerald-600">{stats.claimedItems}</div>
              <div className="text-xs text-emerald-700">Objets réclamés</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
              onClick={() => router.push(ROUTES.missingPersons.list)}
              className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border-2 border-transparent hover:border-green-200"
            >
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                <GridIcon size={28} className="text-green-600" />
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-900">Parcourir les personnes</div>
                <div className="text-sm text-gray-500">Tous les signalements</div>
              </div>
            </button>
            <button
              onClick={() => router.push(ROUTES.lostItems.list)}
              className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border-2 border-transparent hover:border-teal-200"
            >
              <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center">
                <SearchIcon size={28} className="text-teal-600" />
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-900">Parcourir les objets</div>
                <div className="text-sm text-gray-500">Perdus ou trouvés</div>
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

      {/* Found Persons Section */}
      <FoundPersonsSection persons={persons} />
    </AppLayout>
  );
}
