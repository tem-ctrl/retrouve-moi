import React from 'react';

import { LogoMark } from '@/components/brand/Logo';

import { SearchIcon, PlusIcon, PackageIcon, MapIcon } from './icons/Icons';

interface HeroSectionProps {
  onReportClick: () => void;
  onSearchClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onReportClick, onSearchClick }) => {
  return (
    <section className="relative bg-linear-to-b from-chrome to-chrome-deep text-chrome-foreground overflow-hidden">
      {/* Oversized brand mark, cropped at the right edge */}
      <LogoMark
        tone="reversed"
        size={560}
        className="pointer-events-none absolute -right-48 -top-24 opacity-[0.06] hidden md:block"
      />

      <div className="relative max-w-7xl mx-auto px-4 pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
            <LogoMark tone="reversed" size={18} />
            <span className="text-sm font-medium">Retrouve-moi · Cameroun</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            Ensemble, retrouvons-les
            <span className="block text-kola-bright">Personnes, objets et documents</span>
          </h1>

          {/* Description */}
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Une plateforme citoyenne pour signaler et rechercher les personnes disparues, les objets
            perdus et les documents égarés au Cameroun.
          </p>

          {/* Stats Row */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg">
              <svg
                className="w-5 h-5 text-kola-bright"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="text-sm font-medium">Personnes disparues</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg">
              <PackageIcon size={20} className="text-item-bright" />
              <span className="text-sm font-medium">Objets perdus</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg">
              <svg
                className="w-5 h-5 text-info-bright"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="text-sm font-medium">Documents égarés</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onReportClick}
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-kola hover:bg-kola/90 text-white rounded-xl font-semibold transition-colors"
            >
              <PlusIcon size={20} />
              Signaler une disparition
            </button>

            <button
              onClick={onSearchClick}
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl font-semibold transition-all"
            >
              <SearchIcon size={20} />
              Voir les annonces
            </button>
          </div>

          {/* Features */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-white/5 backdrop-blur-sm rounded-xl">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-kola-bright"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-semibold text-sm">Signalement rapide</div>
                <div className="text-xs text-white/60">En quelques clics</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white/5 backdrop-blur-sm rounded-xl">
              <div className="w-10 h-10 bg-item/20 rounded-lg flex items-center justify-center">
                <MapIcon size={20} className="text-item-bright" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-sm">Carte interactive</div>
                <div className="text-xs text-white/60">Localisation précise</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white/5 backdrop-blur-sm rounded-xl">
              <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-success-bright"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-semibold text-sm">100% Gratuit</div>
                <div className="text-xs text-white/60">Service citoyen</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ndop band: the textile motif marks the bottom edge of the hero */}
      <div className="ndop-band absolute bottom-0 inset-x-0 h-6" aria-hidden />
    </section>
  );
};

export default HeroSection;
