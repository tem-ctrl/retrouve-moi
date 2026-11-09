import React from 'react';

interface StatsCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  iconBgColor: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon, value, label, iconBgColor }) => {
  return (
    <div className="bg-card rounded-xl p-4 shadow-sm border border-border flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`p-3 rounded-lg ${iconBgColor}`}>{icon}</div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
};

export default StatsCard;
