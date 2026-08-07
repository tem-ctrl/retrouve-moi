import React from 'react';

import { useAuth } from '@/contexts/AuthContext';

import { HeartIcon, BellIcon, MenuIcon, PlusIcon, UserIcon, ChevronDownIcon, LogOutIcon } from './icons/Icons';

interface HeaderProps {
  onMenuClick: () => void;
  onReportClick: () => void;
  onAuthClick: () => void;
  onProfileClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onReportClick, onAuthClick, onProfileClick }) => {
  const { user, profile, loading, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#1E3A5F] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <HeartIcon size={24} className="text-orange-400" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg leading-tight">Portail des Personnes</h1>
              <p className="text-xs text-white/70">Disparues au Cameroun</p>
            </div>
            <div className="sm:hidden">
              <h1 className="font-bold text-sm">Disparus Cameroun</h1>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onReportClick}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg font-medium transition-colors text-sm"
            >
              <PlusIcon size={18} />
              <span className="hidden sm:inline">Signaler une disparition</span>
              <span className="sm:hidden">Signaler</span>
            </button>
            
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors relative">
              <BellIcon size={22} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            {!loading && (
              user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={profile?.full_name || user.email || 'User avatar'}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-sm font-bold">
                        {profile?.full_name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    )}
                    <ChevronDownIcon size={16} className={`hidden sm:block transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {showUserMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-10"
                        onClick={() => setShowUserMenu(false)}
                      />
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="font-medium text-gray-900 truncate">
                            {profile?.full_name || 'Utilisateur'}
                          </p>
                          <p className="text-sm text-gray-500 truncate">{user.email}</p>
                        </div>
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            onProfileClick();
                          }}
                          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <UserIcon size={18} />
                          Mon profil
                        </button>
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            signOut();
                          }}
                          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-t border-gray-100 mt-2"
                        >
                          <LogOutIcon size={18} />
                          Déconnexion
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={onAuthClick}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors text-sm"
                >
                  <UserIcon size={18} />
                  <span className="hidden sm:inline">Connexion</span>
                </button>
              )
            )}
            
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
