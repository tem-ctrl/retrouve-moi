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
  urgentCount,
}) => {
  return (
    <section className="bg-muted py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            icon={<UsersIcon size={24} className="text-info-ink" />}
            value={totalReports}
            label="Total signalements"
            iconBgColor="bg-info-soft"
          />
          <StatsCard
            icon={<SearchIcon size={24} className="text-primary-ink" />}
            value={missingCount}
            label="Personnes disparues"
            iconBgColor="bg-primary-soft"
          />
          <StatsCard
            icon={<CheckCircleIcon size={24} className="text-success-ink" />}
            value={foundCount}
            label="Personnes retrouvées"
            iconBgColor="bg-success-soft"
          />
          <StatsCard
            icon={<AlertTriangleIcon size={24} className="text-danger-ink" />}
            value={urgentCount}
            label="Cas urgents"
            iconBgColor="bg-danger-soft"
          />
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
