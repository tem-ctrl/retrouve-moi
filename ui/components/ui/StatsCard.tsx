import React from 'react';

interface StatsCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  iconBgColor: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon, value, label, iconBgColor }) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`p-3 rounded-lg ${iconBgColor}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
};

export default StatsCard;
