import React from 'react';
import { XIcon, HomeIcon, PlusIcon, SearchIcon, CheckCircleIcon, InfoIcon, PhoneIcon, PackageIcon, MapIcon } from './icons/Icons';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onReportClick: () => void;
  onItemReportClick?: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, onReportClick, onItemReportClick }) => {
  if (!isOpen) return null;

  const menuItems = [
    { icon: <HomeIcon size={20} />, label: 'Accueil', onClick: onClose },
    { icon: <PlusIcon size={20} />, label: 'Signaler une disparition', onClick: () => { onClose(); onReportClick(); }, highlight: 'orange' },
    { icon: <PackageIcon size={20} />, label: 'Signaler un objet', onClick: () => { onClose(); onItemReportClick?.(); }, highlight: 'purple' },
    { icon: <SearchIcon size={20} />, label: 'Rechercher', onClick: onClose },
    { icon: <MapIcon size={20} />, label: 'Carte interactive', onClick: onClose },
    { icon: <CheckCircleIcon size={20} />, label: 'Cas résolus', onClick: onClose },
    { icon: <InfoIcon size={20} />, label: 'À propos', onClick: onClose },
    { icon: <PhoneIcon size={20} />, label: 'Contact', onClick: onClose },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Menu Panel */}
      <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-xl animate-slide-left">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XIcon size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="p-4">
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={item.onClick}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    item.highlight === 'orange' 
                      ? 'bg-orange-50 text-orange-700 hover:bg-orange-100' 
                      : item.highlight === 'purple'
                      ? 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className={
                    item.highlight === 'orange' 
                      ? 'text-orange-500' 
                      : item.highlight === 'purple'
                      ? 'text-purple-500'
                      : 'text-gray-500'
                  }>{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Quick Stats */}
        <div className="mx-4 p-4 bg-gray-50 rounded-xl mb-4">
          <h3 className="font-semibold text-gray-900 mb-3 text-sm">Statistiques</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">Personnes</div>
              <div className="text-xs text-gray-500">Disparues</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">Objets</div>
              <div className="text-xs text-gray-500">Perdus/Trouvés</div>
            </div>
          </div>
        </div>

        {/* Emergency Numbers */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-gray-50">
          <h3 className="font-semibold text-gray-900 mb-3 text-sm">Numéros d&apos;urgence</h3>
          <div className="grid grid-cols-2 gap-2">
            <a 
              href="tel:117"
              className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium"
            >
              <PhoneIcon size={16} />
              Police: 117
            </a>
            <a 
              href="tel:113"
              className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium"
            >
              <PhoneIcon size={16} />
              Gend.: 113
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
