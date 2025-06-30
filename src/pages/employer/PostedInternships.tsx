import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { AuthContext } from '../../contexts/AuthContext';

interface Internship {
  id: string;
  title: string;
  location: string | { city: string; area: string; pincode?: string; streetAddress?: string };
  type: string;
  status: string;
  created_at: string;
}

const PostedInternships: React.FC = () => {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { profile } = useContext(AuthContext);

  const fetchPostedInternships = useCallback(async () => {
    if (!profile || profile.role !== 'employer') {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('id')
        .eq('auth_id', profile.auth_id)
        .single();

      if (companyError) throw new Error("Could not find employer's company.");
      if (!companyData) {
        setInternships([]);
        return;
      }

      const { data, error } = await supabase
        .from('internships')
        .select(`id, title, location, type, status, created_at`)
        .eq('company_id', companyData.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInternships(data as Internship[]);
    } catch (err: any) {
      console.error('Error fetching internships:', err);
      setError('Failed to load your internship postings.');
    } finally {
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    fetchPostedInternships();
  }, [fetchPostedInternships]);

  const handleStatusChange = async (internshipId: string, newStatus: string) => {
    try {
      await supabase.from('internships').update({ status: newStatus }).eq('id', internshipId);
      setInternships(prev => prev.map(item => 
        item.id === internshipId ? { ...item, status: newStatus } : item
      ));
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDelete = async (internshipId: string) => {
    if (!window.confirm('Are you sure you want to delete this internship?')) return;
    try {
      await supabase.from('internships').delete().eq('id', internshipId);
      setInternships(prev => prev.filter(item => item.id !== internshipId));
    } catch (err) {
      console.error('Error deleting internship:', err);
    }
  };

  // Helper function to get location string
  const getLocationString = (location: string | { city: string; area: string; pincode?: string; streetAddress?: string }): string => {
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

  const filteredInternships = internships.filter(internship => {
    const matchesFilter = filter === 'all' || internship.status === filter;
    const locationString = getLocationString(internship.location);
    const matchesSearch = internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         locationString.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: internships.length,
    active: internships.filter(internship => internship.status === 'active').length,
    paused: internships.filter(internship => internship.status === 'paused').length,
    closed: internships.filter(internship => internship.status === 'closed').length,
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Posted Internships</h1>
        <Link
          to="/employer/post-internship"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Post New Internship
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Internships</h3>
          <p className="mt-2 text-3xl font-semibold text-[#1d1d1f]">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Active Internships</h3>
          <p className="mt-2 text-3xl font-semibold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Paused Internships</h3>
          <p className="mt-2 text-3xl font-semibold text-yellow-600">{stats.paused}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Closed Internships</h3>
          <p className="mt-2 text-3xl font-semibold text-red-600">{stats.closed}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search internships..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000000] focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000000] focus:border-transparent"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Internships List */}
      <div className="space-y-4">
        {filteredInternships.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <h3 className="text-lg font-medium text-[#1d1d1f]">No internships found</h3>
            <p className="mt-2 text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          filteredInternships.map((internship) => (
            <div key={internship.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-[#1d1d1f]">{internship.title}</h3>
                  <p className="text-gray-500">{getLocationString(internship.location)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    internship.status === 'active' ? 'bg-green-100 text-green-800' :
                    internship.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {internship.status.charAt(0).toUpperCase() + internship.status.slice(1)}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleStatusChange(internship.id, internship.status === 'active' ? 'paused' : 'active')}
                    className="text-sm text-gray-600 hover:text-[#1d1d1f]"
                  >
                    {internship.status === 'active' ? 'Pause' : 'Resume'}
                  </button>
                  <button
                    onClick={() => handleDelete(internship.id)}
                    className="text-sm text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </div>
                <div className="text-sm text-gray-500">
                  Posted on {new Date(internship.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PostedInternships; 