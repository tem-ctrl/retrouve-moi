import React from 'react';

import { UsersIcon, SearchIcon, CheckCircleIcon, AlertTriangleIcon } from './icons/Icons';
import StatsCard from './ui/StatsCard';

interface StatsSectionProps {
  totalReports: number;
  missingCount: number;
  foundCount: number;
  urgentCount: number;
}

const StatsSection: React.FC<StatsSectionProps> = ({
  totalReports,
  missingCount,
  foundCount,
  urgentCount
}) => {
  return (
    <section className="bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            icon={<UsersIcon size={24} className="text-blue-600" />}
            value={totalReports}
            label="Total signalements"
            iconBgColor="bg-blue-100"
          />
          <StatsCard
            icon={<SearchIcon size={24} className="text-orange-600" />}
            value={missingCount}
            label="Personnes disparues"
            iconBgColor="bg-orange-100"
          />
          <StatsCard
            icon={<CheckCircleIcon size={24} className="text-green-600" />}
            value={foundCount}
            label="Personnes retrouvées"
            iconBgColor="bg-green-100"
          />
          <StatsCard
            icon={<AlertTriangleIcon size={24} className="text-red-600" />}
            value={urgentCount}
            label="Cas urgents"
            iconBgColor="bg-red-100"
          />
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
