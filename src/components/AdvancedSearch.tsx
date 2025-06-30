import React, { useState } from 'react';

interface SearchFilters {
  keyword: string;
  location: string;
  jobType: string;
  experienceLevel: string;
  salaryRange: string;
  remoteWork: string;
  industry: string;
  companySize: string;
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onReset: () => void;
  loading?: boolean;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ onSearch, onReset, loading = false }) => {
  const [filters, setFilters] = useState<SearchFilters>({
    keyword: '',
    location: '',
    jobType: '',
    experienceLevel: '',
    salaryRange: '',
    remoteWork: '',
    industry: '',
    companySize: ''
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({
      keyword: '',
      location: '',
      jobType: '',
      experienceLevel: '',
      salaryRange: '',
      remoteWork: '',
      industry: '',
      companySize: ''
    });
    onReset();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 animate-fade-in">
      <form onSubmit={handleSubmit}>
        {/* Basic Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              name="keyword"
              value={filters.keyword}
              onChange={handleInputChange}
              placeholder="Search jobs, companies, or keywords..."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 transition-colors duration-200 shadow-sm hover:shadow-md hover:border-emerald-400"
            />
          </div>
          <div className="flex-1">
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleInputChange}
              placeholder="Location (city, state, or remote)"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 transition-colors duration-200 shadow-sm hover:shadow-md hover:border-emerald-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:bg-gray-400 transition-colors duration-200 font-medium shadow hover:scale-105"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="flex justify-between items-center mb-4">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2 transition-all duration-200"
          >
            <span>Advanced Filters</span>
            <svg
              className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="text-gray-500 hover:text-gray-700 text-sm transition-colors duration-200"
          >
            Clear All
          </button>
        </div>

        {/* Advanced Filters */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200 transition-all duration-300 ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
          style={{
            transitionProperty: 'max-height, opacity',
          }}
        >
          {/* Job Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
            <select
              name="jobType"
              value={filters.jobType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 hover:border-emerald-400 transition-all duration-200 shadow-sm"
            >
              <option value="">All Types</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
              <option value="temporary">Temporary</option>
            </select>
          </div>

          {/* Experience Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Age Bracket</label>
            <select
              name="experienceLevel"
              value={filters.experienceLevel}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 hover:border-emerald-400 transition-all duration-200 shadow-sm"
            >
              <option value="">All</option>
              <option value="18-24">18-24</option>
              <option value="25-34">25-34</option>
              <option value="35-44">35-44</option>
              <option value="45-54">45-54</option>
              <option value="55+">55+</option>
            </select>
          </div>

          {/* Salary Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
            <select
              name="salaryRange"
              value={filters.salaryRange}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 hover:border-emerald-400 transition-all duration-200 shadow-sm"
            >
              <option value="">Any Salary</option>
              <option value="0-30000">$0 - $30,000</option>
              <option value="30000-50000">$30,000 - $50,000</option>
              <option value="50000-75000">$50,000 - $75,000</option>
              <option value="75000-100000">$75,000 - $100,000</option>
              <option value="100000+">$100,000+</option>
            </select>
          </div>

          {/* Remote Work */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Remote Work</label>
            <select
              name="remoteWork"
              value={filters.remoteWork}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 hover:border-emerald-400 transition-all duration-200 shadow-sm"
            >
              <option value="">Any</option>
              <option value="remote">Remote Only</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">On-site Only</option>
            </select>
          </div>

          {/* Industry */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
            <select
              name="industry"
              value={filters.industry}
              onChange={handleInputChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 hover:border-emerald-400 transition-all duration-200 shadow-sm"
            >
              <option value="">All Industries</option>
              <option value="technology">Technology</option>
              <option value="finance">Finance</option>
              <option value="healthcare">Healthcare</option>
              <option value="education">Education</option>
              <option value="retail">Retail</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="marketing">Marketing</option>
              <option value="consulting">Consulting</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdvancedSearch; 