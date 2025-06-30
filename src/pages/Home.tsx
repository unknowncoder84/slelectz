import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import JobRecommendations from '../components/JobRecommendations';
import AdvancedSearch from '../components/AdvancedSearch';
import AdvancedJobMatching from '../components/AdvancedJobMatching';
import NotificationCenter from '../components/NotificationCenter';
import MessagingSystem from '../components/MessagingSystem';

interface Location {
  city: string;
  area: string;
  pincode?: string;
  streetAddress?: string;
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: Location | string;
  type: string;
  salary: string;
  description: string;
  postedDate: string;
  requirements: string[] | any;
  status: 'active' | 'paused' | 'closed' | 'expired';
  applications?: number;
  experience: string;
}

const Home: React.FC = () => {
  const { user, profile } = useContext(AuthContext);
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'jobs' | 'internships' | 'companies'>('jobs');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showAIMatch, setShowAIMatch] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const filtersPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchFeaturedJobs();
  }, []);

  // Close filters when clicking outside
  useEffect(() => {
    if (!showAdvancedSearch) return;
    function handleClickOutside(event: MouseEvent) {
      if (filtersPanelRef.current && !filtersPanelRef.current.contains(event.target as Node)) {
        setShowAdvancedSearch(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAdvancedSearch]);

  const fetchFeaturedJobs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          companies (
            name
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;

      const formattedJobs = data?.map(job => ({
        id: job.id,
        title: job.title,
        company: job.companies?.name || 'Unknown Company',
        location: job.location,
        type: job.job_type,
        salary: job.salary,
        description: job.description,
        postedDate: job.created_at,
        requirements: job.requirements || [],
        status: job.status,
        experience: job.experience
      })) || [];

      setFeaturedJobs(formattedJobs);
    } catch (error) {
      console.error('Error fetching featured jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Active Jobs', value: '2,500+', icon: '💼' },
    { label: 'Companies', value: '500+', icon: '🏢' },
    { label: 'Job Seekers', value: '10,000+', icon: '👥' },
    { label: 'Success Rate', value: '85%', icon: '📈' }
  ];

  // Helper function to format location display
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
    <div className="min-h-screen bg-gray-50">
      {/* Airbnb-style Search Bar with separate Filters and AI Match buttons */}
      <div className="w-full flex flex-col items-center justify-center mt-8 mb-6 px-2 md:px-0">
        <div className="flex flex-col md:flex-row items-center w-full max-w-3xl gap-3">
          <div className="flex-1 flex items-center bg-white border border-gray-200 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl hover:border-emerald-400 focus-within:shadow-xl focus-within:border-emerald-500 px-2 py-2 group relative">
            <input
              type="text"
              placeholder="Search jobs, companies, or keywords..."
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
              className="flex-1 px-6 py-3 bg-transparent outline-none text-gray-900 text-base rounded-full placeholder-gray-400"
            />
            <div className="h-8 w-px bg-gray-200 mx-2 hidden md:block" />
            <input
              type="text"
              placeholder="Location (city, state, or remote)"
              value={searchLocation}
              onChange={e => setSearchLocation(e.target.value)}
              className="flex-1 px-6 py-3 bg-transparent outline-none text-gray-900 text-base rounded-full placeholder-gray-400"
            />
            {/* Airbnb-style Search Button */}
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg transition-all duration-200 hover:bg-emerald-700 focus:bg-emerald-700 active:scale-95 border-2 border-white group-hover:shadow-xl"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
              type="button"
              aria-label="Search"
              onClick={() => {/* TODO: implement search logic */}}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            </button>
          </div>
          <button
            className="flex items-center gap-2 px-6 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-full font-semibold shadow transition-all duration-200 text-base mt-2 md:mt-0"
            onClick={() => setShowAdvancedSearch((v) => !v)}
            type="button"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zm0 6a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" /></svg>
            Filters
          </button>
          <button
            className="flex items-center gap-2 px-6 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full font-semibold shadow transition-all duration-200 text-base mt-2 md:mt-0 animate-pulse"
            onClick={() => setShowAIMatch(true)}
            type="button"
          >
            <span role="img" aria-label="AI">✨</span> AI Match
          </button>
        </div>
        {/* Advanced Search Dropdown/Panel (no extra search bar inside) */}
        {showAdvancedSearch && (
          <div ref={filtersPanelRef} className="w-full max-w-3xl mx-auto mt-2 z-50 animate-fade-in bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <AdvancedSearch
              onSearch={() => setShowAdvancedSearch(false)}
              onReset={() => setShowAdvancedSearch(false)}
            />
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* AI Job Matching */}
            {user && (
              <AdvancedJobMatching />
            )}

            {/* Job Recommendations */}
            <JobRecommendations />

            {/* Featured Jobs */}
            <section className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Featured Jobs</h2>
                <Link
                  to="/jobs"
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  View All →
                </Link>
              </div>
              
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 h-32 rounded-xl"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {featuredJobs.map((job) => (
                    <div key={job.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                      <h3 className="font-semibold text-gray-900 mb-1">{job.title}</h3>
                      <p className="text-gray-600 mb-2">{job.company}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <span>{formatLocation(job.location)}</span>
                        <span>{job.type}</span>
                        <span>{job.salary}</span>
                      </div>
                      <Link
                        to={`/jobs/${job.id}`}
                        className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                      >
                        View Details →
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Notifications */}
            {user && (
              <NotificationCenter />
            )}

            {/* Messaging */}
            {user && (
              <MessagingSystem />
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {user ? (
                  <>
                    <Link
                      to="/post-job"
                      className="block w-full px-4 py-3 bg-emerald-600 text-white text-center rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-medium"
                    >
                      Post a Job
                    </Link>
                    <Link
                      to="/profile"
                      className="block w-full px-4 py-3 border border-gray-300 text-gray-700 text-center rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                    >
                      Update Profile
                    </Link>
                    <Link
                      to="/applications"
                      className="block w-full px-4 py-3 border border-gray-300 text-gray-700 text-center rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                    >
                      View Applications
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/signup"
                      className="block w-full px-4 py-3 bg-emerald-600 text-white text-center rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-medium"
                    >
                      Create Account
                    </Link>
                    <Link
                      to="/login"
                      className="block w-full px-4 py-3 border border-gray-300 text-gray-700 text-center rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Categories</h3>
              <div className="space-y-2">
                {['Technology', 'Marketing', 'Sales', 'Design', 'Engineering', 'Healthcare'].map((category) => (
                  <Link
                    key={category}
                    to={`/jobs?category=${category.toLowerCase()}`}
                    className="block text-gray-600 hover:text-emerald-600 transition-colors duration-200"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Job Matching Modal (mobile-friendly) */}
      {showAIMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl p-4 md:p-8 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={() => setShowAIMatch(false)}
              aria-label="Close AI Match"
            >
              &times;
            </button>
            <AdvancedJobMatching />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home; 