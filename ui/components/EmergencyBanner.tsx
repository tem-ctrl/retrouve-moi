import React from 'react';

import { PhoneIcon, AlertTriangleIcon } from './icons/Icons';

const EmergencyBanner: React.FC = () => {
  return (
    <div className="bg-red-600 text-white py-2">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-sm">
          <div className="flex items-center gap-2">
            <AlertTriangleIcon size={18} />
            <span className="font-medium">En cas d&apos;urgence:</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:117" className="flex items-center gap-1 hover:underline">
              <PhoneIcon size={14} />
              Police: 117
            </a>
            <a href="tel:113" className="flex items-center gap-1 hover:underline">
              <PhoneIcon size={14} />
              Gendarmerie: 113
            </a>
            <a href="tel:118" className="flex items-center gap-1 hover:underline">
              <PhoneIcon size={14} />
              Pompiers: 118
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyBanner;
