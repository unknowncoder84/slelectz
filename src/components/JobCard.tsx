import React from 'react';
import { Link } from 'react-router-dom';

interface Location {
  city: string;
  area: string;
  pincode?: string;
  streetAddress?: string;
}

interface Job {
  id: string;
  title: string;
  description: string;
  job_type: string;
  location: Location | string;
  pay_type: string;
  min_amount: number;
  max_amount: number;
  amount: number;
  pay_rate: string;
}

interface JobCardProps {
  job: Job;
  onApply: () => void;
  onSave: () => void;
  onShare: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onApply, onSave, onShare }) => {
  // Format location display
  const formatLocation = (location: Location | string): string => {
    if (typeof location === 'string') {
      return location;
    }
    
    if (typeof location === 'object' && location !== null) {
      const parts = [];
      if (location.city) parts.push(location.city);
      if (location.area) parts.push(location.area);
      if (location.pincode) parts.push(location.pincode);
      return parts.join(', ') || 'Location not specified';
    }
    
    return 'Location not specified';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <Link to={`/jobs/${job.id}`} className="block">
          <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
          <p className="mt-2 text-sm text-gray-500 line-clamp-2">{job.description}</p>
        </Link>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {job.job_type}
            </span>
            <span className="text-sm text-gray-500">
              {formatLocation(job.location)}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            {job.pay_type === 'range' ? (
              `${job.min_amount} - ${job.max_amount} ${job.pay_rate}`
            ) : (
              `${job.amount} ${job.pay_rate}`
            )}
          </div>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={onApply}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Apply
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Save
          </button>
          <button
            onClick={onShare}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
}; 