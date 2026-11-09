import Link from 'next/link';
import React from 'react';

import { ROUTES } from '@/lib/routes';

import {
  XIcon,
  HomeIcon,
  PlusIcon,
  SearchIcon,
  CheckCircleIcon,
  InfoIcon,
  PhoneIcon,
  PackageIcon,
  MapIcon,
} from './icons/Icons';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const menuItems = [
    { icon: <HomeIcon size={20} />, label: 'Accueil', href: ROUTES.home },
    {
      icon: <PlusIcon size={20} />,
      label: 'Signaler une disparition',
      href: ROUTES.report(),
      highlight: 'orange',
    },
    {
      icon: <PackageIcon size={20} />,
      label: 'Signaler un objet',
      href: ROUTES.report('item'),
      highlight: 'purple',
    },
    { icon: <SearchIcon size={20} />, label: 'Rechercher', onClick: onClose },
    { icon: <MapIcon size={20} />, label: 'Carte interactive', onClick: onClose },
    { icon: <CheckCircleIcon size={20} />, label: 'Cas résolus', onClick: onClose },
    { icon: <InfoIcon size={20} />, label: 'À propos', onClick: onClose },
    { icon: <PhoneIcon size={20} />, label: 'Contact', onClick: onClose },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Menu Panel */}
      <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-card shadow-xl animate-slide-left">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-bold text-foreground">Menu</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
            <XIcon size={24} className="text-muted-foreground" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="p-4">
          <ul className="space-y-1">
            {menuItems.map((item, index) => {
              const className = `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                item.highlight === 'orange'
                  ? 'bg-primary-soft text-primary-ink hover:bg-primary-soft'
                  : item.highlight === 'purple'
                    ? 'bg-item-soft text-item-ink hover:bg-item-soft'
                    : 'text-subtle hover:bg-muted'
              }`;
              const iconClassName =
                item.highlight === 'orange'
                  ? 'text-primary-ink'
                  : item.highlight === 'purple'
                    ? 'text-item-ink'
                    : 'text-muted-foreground';
              const content = (
                <>
                  <span className={iconClassName}>{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </>
              );

              return (
                <li key={index}>
                  {item.href ? (
                    <Link href={item.href} onClick={onClose} className={className}>
                      {content}
                    </Link>
                  ) : (
                    <button onClick={item.onClick} className={className}>
                      {content}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Quick Stats */}
        <div className="mx-4 p-4 bg-muted rounded-xl mb-4">
          <h3 className="font-semibold text-foreground mb-3 text-sm">Statistiques</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <div className="text-lg font-bold text-primary-ink">Personnes</div>
              <div className="text-xs text-muted-foreground">Disparues</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-item-ink">Objets</div>
              <div className="text-xs text-muted-foreground">Perdus/Trouvés</div>
            </div>
          </div>
        </div>

        {/* Emergency Numbers */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-muted">
          <h3 className="font-semibold text-foreground mb-3 text-sm">Numéros d&apos;urgence</h3>
          <div className="grid grid-cols-2 gap-2">
            <a
              href="tel:117"
              className="flex items-center gap-2 px-3 py-2 bg-danger-soft text-danger-ink rounded-lg text-sm font-medium"
            >
              <PhoneIcon size={16} />
              Police: 117
            </a>
            <a
              href="tel:113"
              className="flex items-center gap-2 px-3 py-2 bg-info-soft text-info-ink rounded-lg text-sm font-medium"
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
