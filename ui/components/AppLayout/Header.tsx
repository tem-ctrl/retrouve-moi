import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import Logo from '@/components/brand/Logo';
import ThemeToggle from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/lib/routes';

import {
  BellIcon,
  MenuIcon,
  PlusIcon,
  UserIcon,
  ChevronDownIcon,
  LogOutIcon,
} from '../icons/Icons';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, profile, loading, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-chrome text-chrome-foreground shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href={ROUTES.home} aria-label="Retrouve-moi, accueil">
            <Logo tone="reversed" size={36} compact />
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link
              href={ROUTES.report()}
              className="flex items-center gap-2 px-4 py-2 bg-kola hover:bg-kola/90 rounded-lg font-medium transition-colors text-sm"
            >
              <PlusIcon size={18} />
              <span className="hidden sm:inline">Signaler une disparition</span>
              <span className="sm:hidden">Signaler</span>
            </Link>

            <ThemeToggle />

            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors relative">
              <BellIcon size={22} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-kola-bright rounded-full"></span>
            </button>

            {/* User Menu */}
            {!loading &&
              (user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {profile?.avatar_url ? (
                      <Image
                        src={profile.avatar_url}
                        alt={profile?.full_name || user.email || 'User avatar'}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-kola rounded-full flex items-center justify-center text-sm font-bold">
                        {profile?.full_name?.charAt(0)?.toUpperCase() ||
                          user.email?.charAt(0)?.toUpperCase() ||
                          'U'}
                      </div>
                    )}
                    <ChevronDownIcon
                      size={16}
                      className={`hidden sm:block transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {showUserMenu && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                      <div className="absolute right-0 top-full mt-2 w-56 bg-card rounded-xl shadow-lg border border-border py-2 z-20">
                        <div className="px-4 py-2 border-b border-border">
                          <p className="font-medium text-foreground truncate">
                            {profile?.full_name || 'Utilisateur'}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                        </div>
                        <Link
                          href={ROUTES.profile}
                          onClick={() => setShowUserMenu(false)}
                          className="w-full px-4 py-2 text-left text-subtle hover:bg-muted flex items-center gap-2"
                        >
                          <UserIcon size={18} />
                          Mon profil
                        </Link>
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            signOut();
                          }}
                          className="w-full px-4 py-2 text-left text-subtle hover:bg-muted flex items-center gap-2 border-t border-border mt-2"
                        >
                          <LogOutIcon size={18} />
                          Déconnexion
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  href={ROUTES.login()}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors text-sm"
                >
                  <UserIcon size={18} />
                  <span className="hidden sm:inline">Connexion</span>
                </Link>
              ))}

            <button
              onClick={onMenuClick}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors lg:hidden"
            >
              <MenuIcon size={22} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
