import React from 'react';

interface Filters {
  search: string;
  location: string;
  type: string;
}

interface FilterBarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      <select
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
        value={filters.type}
        onChange={(e) => onChange({ ...filters, type: e.target.value })}
      >
        <option value="">All Types</option>
        <option value="Full-time">Full-time</option>
        <option value="Part-time">Part-time</option>
        <option value="Contract">Contract</option>
        <option value="Remote">Remote</option>
      </select>

      <input
        type="text"
        placeholder="Filter by location"
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
        value={filters.location}
        onChange={(e) => onChange({ ...filters, location: e.target.value })}
      />
    </div>
  );
}; 