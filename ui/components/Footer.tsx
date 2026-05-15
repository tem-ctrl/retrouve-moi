import React from 'react';
import { HeartIcon, PhoneIcon, MapPinIcon, PackageIcon, FileTextIcon } from './icons/Icons';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1E3A5F] text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <HeartIcon size={28} className="text-orange-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Retrouvé.cm</h3>
                <p className="text-sm text-white/70">Cameroun</p>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              Une plateforme citoyenne dédiée à la recherche des personnes disparues 
              et des objets perdus au Cameroun.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Signalements */}
          <div>
            <h4 className="font-semibold mb-4">Signalements</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm">
                  <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Personnes disparues
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm">
                  <PackageIcon size={16} className="text-purple-400" />
                  Objets perdus
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm">
                  <FileTextIcon size={16} className="text-blue-400" />
                  Documents égarés
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Objets trouvés
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm">
                  <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Animaux perdus
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Liens rapides</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-colors text-sm">
                  Accueil
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-colors text-sm">
                  Carte interactive
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-colors text-sm">
                  Cas résolus
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-colors text-sm">
                  Comment ça marche
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-colors text-sm">
                  À propos
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-colors text-sm">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Urgences</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <PhoneIcon size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Police</p>
                  <p className="text-white/70 text-sm">117</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <PhoneIcon size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Gendarmerie</p>
                  <p className="text-white/70 text-sm">113</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <PhoneIcon size={18} className="text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Pompiers</p>
                  <p className="text-white/70 text-sm">118</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPinIcon size={18} className="text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Cameroun</p>
                  <p className="text-white/70 text-sm">Toutes les régions</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-8 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm text-center sm:text-left">
              © {currentYear} Retrouvé.cm - Portail des Signalements au Cameroun. Une initiative citoyenne.
            </p>
            <div className="flex gap-4 text-sm">
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                Confidentialité
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                Conditions
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                FAQ
              </a>
            </div>
          </div>
          <p className="text-white/40 text-xs mt-4 text-center">
            En cas d'urgence, contactez immédiatement les forces de l'ordre locales. Cette plateforme est un service citoyen gratuit.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
