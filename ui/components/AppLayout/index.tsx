'use client';

import React, { useState } from 'react';

import MobileMenu from '../MobileMenu';

import Footer from './Footer';
import Header from './Header';

interface AppLayoutProps {
  children: React.ReactNode;
  banner?: React.ReactNode;
}

// Shared chrome (Header/Footer/MobileMenu) for every full-page route —
// replaces the Header/Footer/MobileMenu markup that used to be
// hand-duplicated in each page component. See refactoring.md — "apply the
// app layout to all routes".
const AppLayout: React.FC<AppLayoutProps> = ({ children, banner }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div className="min-h-dvh bg-gray-100 flex flex-col">
      {banner}
      <div className="contents lg:flex lg:min-h-dvh flex-col flex-1">
        <Header onMenuClick={() => setShowMobileMenu(true)} />
        <main className="flex-1 lg:flex lg:flex-col lg:justify-center">{children}</main>
      </div>
      <Footer />
      <MobileMenu isOpen={showMobileMenu} onClose={() => setShowMobileMenu(false)} />
    </div>
  );
};

export default AppLayout;
