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

const Internships: React.FC = () => {
  const { internships, loading, error, fetchInternships } = useJobs();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedDuration, setSelectedDuration] = useState<string>('all');

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
        console.log('Attempting to fetch internships...');
        await fetchInternships();
        console.log('Fetch internships completed.');
      } catch (err) {
        console.error('Error loading internships in Internships.tsx:', err);
      }
    };
    loadData();
  }, [fetchInternships]);

  console.log('Internships data from context:', internships);
  console.log('Loading state:', loading);
  console.log('Error state:', error);
  console.log('Search term:', searchTerm);
  console.log('Selected type:', selectedType);
  console.log('Selected location:', selectedLocation);
  console.log('Selected duration:', selectedDuration);

  const filteredInternships = internships.filter(internship => {
    const matchesSearch = internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.company?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || internship.internship_type === selectedType;
    const internshipLocationCity = getLocationCity(internship.location);
    const matchesLocation = selectedLocation === 'all' || 
                          internshipLocationCity.toLowerCase() === selectedLocation.toLowerCase();
    const matchesDuration = selectedDuration === 'all' || internship.duration === selectedDuration;

    return matchesSearch && matchesType && matchesLocation && matchesDuration;
  });

  console.log('Filtered internships for display:', filteredInternships);

  const uniqueLocations = Array.from(new Set(internships.map(internship => getLocationCity(internship.location)).filter(city => city)));
  const uniqueTypes = Array.from(new Set(internships.map(internship => internship.internship_type)));
  const uniqueDurations = Array.from(new Set(internships.map(internship => internship.duration)));

  if (error) {
    return (
      <div className="min-h-screen bg-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading internships...</p>
          </div>
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
            placeholder="Search internships by title, company, or description..."
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

          <select
            value={selectedDuration}
            onChange={(e) => setSelectedDuration(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="all">All Durations</option>
            {uniqueDurations.map((duration) => (
              <option key={duration} value={duration}>
                {duration}
              </option>
            ))}
          </select>
        </div>

        {/* Results */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Available Internships</h2>
          <JobList
            items={filteredInternships}
            type="internship"
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default Internships; 