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
      <section className="py-8 bg-card">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            <div className="bg-primary-soft rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-primary-ink">{stats.totalPersons}</div>
              <div className="text-xs text-primary-ink">Personnes signalées</div>
            </div>
            <div className="bg-danger-soft rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-danger-ink">{stats.urgentPersons}</div>
              <div className="text-xs text-danger-ink">Cas urgents</div>
            </div>
            <div className="bg-warning-soft rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-warning-ink">{stats.missingPersons}</div>
              <div className="text-xs text-warning-ink">Personnes disparues</div>
            </div>
            <div className="bg-success-soft rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-success-ink">{stats.foundPersons}</div>
              <div className="text-xs text-success-ink">Personnes retrouvées</div>
            </div>
            <div className="bg-primary-soft rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-primary-ink">{stats.totalItems}</div>
              <div className="text-xs text-primary-ink">Objets signalés</div>
            </div>
            <div className="bg-item-soft rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-item-ink">{stats.lostItems}</div>
              <div className="text-xs text-item-ink">Objets perdus</div>
            </div>
            <div className="bg-info-soft rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-info-ink">{stats.foundItems}</div>
              <div className="text-xs text-info-ink">Objets trouvés</div>
            </div>
            <div className="bg-success-soft rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-success-ink">{stats.claimedItems}</div>
              <div className="text-xs text-success-ink">Objets réclamés</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-8 bg-muted">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <button
              onClick={handleReportClick}
              className="flex items-center gap-4 p-6 bg-card rounded-xl shadow-sm hover:shadow-md transition-all border-2 border-transparent hover:border-primary-line"
            >
              <div className="w-14 h-14 bg-primary-soft rounded-xl flex items-center justify-center">
                <UserIcon size={28} className="text-primary-ink" />
              </div>
              <div className="text-left">
                <div className="font-bold text-foreground">Signaler une disparition</div>
                <div className="text-sm text-muted-foreground">Personne disparue</div>
              </div>
            </button>
            <button
              onClick={handleItemReportClick}
              className="flex items-center gap-4 p-6 bg-card rounded-xl shadow-sm hover:shadow-md transition-all border-2 border-transparent hover:border-item-line"
            >
              <div className="w-14 h-14 bg-item-soft rounded-xl flex items-center justify-center">
                <PackageIcon size={28} className="text-item-ink" />
              </div>
              <div className="text-left">
                <div className="font-bold text-foreground">Signaler un objet</div>
                <div className="text-sm text-muted-foreground">Perdu ou trouvé</div>
              </div>
            </button>
            <button
              onClick={scrollToMap}
              className="flex items-center gap-4 p-6 bg-card rounded-xl shadow-sm hover:shadow-md transition-all border-2 border-transparent hover:border-info-line"
            >
              <div className="w-14 h-14 bg-info-soft rounded-xl flex items-center justify-center">
                <MapIcon size={28} className="text-info-ink" />
              </div>
              <div className="text-left">
                <div className="font-bold text-foreground">Voir la carte</div>
                <div className="text-sm text-muted-foreground">Tous les signalements</div>
              </div>
            </button>
            <button
              onClick={() => router.push(ROUTES.missingPersons.list)}
              className="flex items-center gap-4 p-6 bg-card rounded-xl shadow-sm hover:shadow-md transition-all border-2 border-transparent hover:border-success-line"
            >
              <div className="w-14 h-14 bg-success-soft rounded-xl flex items-center justify-center">
                <GridIcon size={28} className="text-success-ink" />
              </div>
              <div className="text-left">
                <div className="font-bold text-foreground">Parcourir les personnes</div>
                <div className="text-sm text-muted-foreground">Tous les signalements</div>
              </div>
            </button>
            <button
              onClick={() => router.push(ROUTES.lostItems.list)}
              className="flex items-center gap-4 p-6 bg-card rounded-xl shadow-sm hover:shadow-md transition-all border-2 border-transparent hover:border-item-line"
            >
              <div className="w-14 h-14 bg-item-soft rounded-xl flex items-center justify-center">
                <SearchIcon size={28} className="text-item-ink" />
              </div>
              <div className="text-left">
                <div className="font-bold text-foreground">Parcourir les objets</div>
                <div className="text-sm text-muted-foreground">Perdus ou trouvés</div>
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
