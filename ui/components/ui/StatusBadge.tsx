import React from 'react';

interface StatusBadgeProps {
  status: 'missing' | 'found' | 'searching' | 'urgent';
  is_urgent?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, is_urgent }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'found':
        return {
          label: 'Retrouvé',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200'
        };
      case 'searching':
        return {
          label: 'En cours de recherche',
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200'
        };
      case 'urgent':
      case 'missing':
      default:
        return {
          label: 'Disparu',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-200'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="flex gap-2 flex-wrap">
      {is_urgent && (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500 text-white border border-orange-600">
          Urgent
        </span>
      )}
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.bgColor} ${config.textColor} border ${config.borderColor}`}>
        {config.label}
      </span>
    </div>
  );
};

export default StatusBadge;
