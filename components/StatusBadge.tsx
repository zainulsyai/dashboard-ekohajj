import React from 'react';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { Status } from '../types';

interface StatusBadgeProps {
  currentStatus: Status;
  onStatusChange: (status: Status) => void;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ currentStatus, onStatusChange }) => {
  const getStatusClasses = (status: Status) => {
    switch (status) {
      case Status.DONE:
        return 'bg-emerald-500 hover:bg-emerald-600';
      case Status.ON_PROGRESS:
        return 'bg-yellow-500 hover:bg-yellow-600';
      case Status.FAILED:
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getStatusIcon = (status: Status) => {
    switch (status) {
      case Status.DONE:
        return <CheckCircle size={16} />; 
      case Status.ON_PROGRESS:
        return <Clock size={16} />; 
      case Status.FAILED:
        return <XCircle size={16} />; 
      default:
        return null;
    }
  };

  const getStatusText = (status: Status) => {
    switch (status) {
      case Status.DONE:
        return 'Selesai';
      case Status.ON_PROGRESS:
        return 'Dalam Proses';
      case Status.FAILED:
        return 'Gagal';
      default:
        return 'Semua';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => onStatusChange(currentStatus === Status.ALL ? Status.DONE : Status.ALL)}
        className={`flex items-center gap-2 text-white font-semibold px-4 py-2 rounded-full transition-colors duration-200 ${getStatusClasses(currentStatus)}`}
      >
        {getStatusIcon(currentStatus)}
        <span>{getStatusText(currentStatus)}</span>
      </button>
      {/* Dropdown for other statuses could be added here */}
    </div>
  );
};
