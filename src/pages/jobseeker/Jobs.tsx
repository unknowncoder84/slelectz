import React, { useEffect, useState } from 'react';
import { useJobs } from '../../contexts/JobsContext';
import JobList from '../../components/JobList';
import SearchBar from '../../components/SearchBar';

interface Location {
  city: string;
  area: string;
  pincode?: string;
  streetAddress?: string;
}

const Jobs: React.FC = () => {
  const { jobs, loading, error, fetchJobs } = useJobs();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');

  // Helper function to get location city
  const getLocationCity = (location: Location | string): string => {
    if (typeof location === 'string') {
      return location;
    }
    if (typeof location === 'object' && location !== null && location.city) {
      return location.city;
    }
    return '';
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchJobs();
      } catch (err) {
        console.error('Error loading jobs:', err);
      }
    };
    loadData();
  }, [fetchJobs]);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || job.job_type === selectedType;
    const jobLocationCity = getLocationCity(job.location);
    const matchesLocation = selectedLocation === 'all' || 
                          jobLocationCity.toLowerCase() === selectedLocation.toLowerCase();

    return matchesSearch && matchesType && matchesLocation;
  });

  const uniqueLocations = Array.from(new Set(jobs.map(job => getLocationCity(job.location)).filter(city => city)));
  const uniqueTypes = Array.from(new Set(jobs.map(job => job.job_type)));

  if (error) {
    return (
      <div className="min-h-screen bg-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Section */}
        <div className="mb-8">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search jobs by title, company, or description..."
            className="max-w-3xl mx-auto"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="all">All Types</option>
            {uniqueTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="all">All Locations</option>
            {uniqueLocations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        {/* Results */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Available Jobs</h2>
          <JobList
            items={filteredJobs}
            type="job"
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default Jobs; 