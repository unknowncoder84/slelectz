import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { AuthContext } from '../../contexts/AuthContext';

interface Job {
  id: string;
  title: string;
  location: { city: string; area: string };
  job_type: string;
  status: string;
  created_at: string;
  applications: { count: number }[];
}

const PostedJobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { profile } = useContext(AuthContext);

  const fetchPostedJobs = useCallback(async () => {
    console.log('profile', profile);
    if (!profile || profile.role !== 'employer') {
      setLoading(false);
      return;
    }
    if (!profile.auth_id) {
      setError('Your profile is missing an auth_id. Please contact support or re-login.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data: companies, error: companyError } = await supabase
        .from('companies')
        .select('id')
        .eq('auth_id', profile.auth_id);
      const companyData = companies && companies.length > 0 ? companies[0] : null;
      console.log('companyData', companyData, 'companyError', companyError);
      if (companyError) throw new Error("Could not find employer's company. " + (companyError.message || JSON.stringify(companyError)));
      if (!companyData) {
        setJobs([]);
        setError('No company found for your account. Please create a company profile.');
        return;
      }
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          id,
          title,
          location,
          job_type,
          status,
          created_at,
          applications (
            count
          )
        `)
        .eq('company_id', companyData.id)
        .order('created_at', { ascending: false });
      console.log('jobs data', data, 'jobs error', error);
      if (error) throw new Error(error.message || JSON.stringify(error));
      setJobs(data as Job[]);
    } catch (err: any) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load your job postings. ' + (err?.message || JSON.stringify(err)));
    } finally {
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    fetchPostedJobs();
  }, [fetchPostedJobs]);

  const handleStatusChange = async (jobId: string, newStatus: string) => {
    try {
      await supabase.from('jobs').update({ status: newStatus }).eq('id', jobId);
      setJobs(prevJobs => prevJobs.map(job => 
        job.id === jobId ? { ...job, status: newStatus } : job
      ));
    } catch (err) {
      console.error('Error updating job status:', err);
    }
  };

  const handleDelete = async (jobId: string) => {
    if (!window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) return;

    try {
      await supabase.from('jobs').delete().eq('id', jobId);
      setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
    } catch (err) {
      console.error('Error deleting job:', err);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesFilter = filter === 'all' || job.status === filter;
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: jobs.length,
    active: jobs.filter(job => job.status === 'active').length,
    paused: jobs.filter(job => job.status === 'paused').length,
    closed: jobs.filter(job => job.status === 'closed').length,
  };

  if (loading) {
    return (
        <div className="p-8">
            <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
                <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        </div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Posted Jobs</h1>
        <Link
          to="/employer/post-job"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <span>Post New Job</span>
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-4 gap-4">
        {/* Stat cards */}
      </div>
      
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between mb-4">
          <input 
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2"
          />
          {/* Filter buttons */}
        </div>

        <div className="space-y-4">
          {filteredJobs.length > 0 ? filteredJobs.map(job => (
            <div key={job.id} className="p-6 border rounded-xl hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
                        <p className="text-gray-600">{
                          job.location
                            ? (typeof job.location === 'object' && job.location !== null
                                ? [(job.location as any).city, (job.location as any).area].filter(Boolean).join(', ')
                                : job.location)
                            : 'Not specified'
                        }</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link to={`/employer/applications/${job.id}`} className="text-blue-600 font-semibold">
                            {job.applications[0]?.count || 0} Applications
                        </Link>
                        <select value={job.status} onChange={(e) => handleStatusChange(job.id, e.target.value)} className="rounded-md">
                            <option value="active">Active</option>
                            <option value="paused">Paused</option>
                            <option value="closed">Closed</option>
                        </select>
                        <button onClick={() => handleDelete(job.id)} className="text-red-500">Delete</button>
                    </div>
                </div>
            </div>
          )) : (
            <p>No jobs found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostedJobs; 