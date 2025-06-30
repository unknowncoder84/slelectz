import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { AuthContext } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

// Define the types for our data structures
interface Company {
  id: string;
  name: string;
  logo_url: string;
  description: string;
}

interface Job {
  id: string;
  title: string;
  companies: Company;
  description: string;
  responsibilities: string[];
  requirements: string[];
  salary_min: number;
  salary_max: number;
  location: string;
  job_type: string; // e.g., Full-time, Part-time
  employer_id: string;
}

// Helper function to normalize requirements/responsibilities
function normalizeListField(field: any): string[] {
  if (Array.isArray(field)) return field;
  if (typeof field === 'string') {
    try {
      // Try to parse as JSON array
      const parsed = JSON.parse(field);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
    // Fallback: split by newlines or commas
    return field.split(/\n|,/).map(s => s.trim()).filter(Boolean);
  }
  return [];
}

const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const authContext = useContext(AuthContext);

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const { data: jobData, error: jobError } = await supabase
          .from('jobs')
          .select(`
            *,
            companies(*)
          `)
          .eq('id', id)
          .single();

        if (jobError) throw jobError;
        setJob(jobData as Job);
        
        const profile = authContext.profile;
        if (profile && profile.role === 'jobseeker') {
          const { data: applicationData, error: applicationError } = await supabase
            .from('applications')
            .select('id')
            .eq('job_id', id)
            .eq('user_id', profile.id)
            .maybeSingle();

          if (applicationError) throw applicationError;
          if (applicationData) {
            setHasApplied(true);
          }
        }
      } catch (err: any) {
        console.error('Error fetching job details:', err);
        setError('Failed to load job details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id, authContext.profile]);

  const handleApply = async () => {
    if (!authContext.user) {
      toast('Please log in to apply for this job.');
      window.location.href = '/login';
      return;
    }
    // Check if user has jobseeker profile (e.g., required fields)
    const profile = authContext.profile;
    if (!profile || !profile.full_name || !profile.phone) {
      toast('Please complete your jobseeker profile to apply.');
      window.location.href = '/profile';
      return;
    }
    if (!job || !profile || hasApplied) return;

    setIsApplying(true);
    setError(null);
    try {
      const { error: applyError } = await supabase
        .from('applications')
        .insert({
          job_id: job.id,
          user_id: profile.id,
          employer_id: job.employer_id,
        });
      
      if (applyError) throw applyError;

      setHasApplied(true);
    } catch (err: any) {
      console.error('Error applying for job:', err);
      setError('An error occurred while submitting your application. Please try again.');
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }

  if (!job) {
    return <div className="text-center py-10">Job not found.</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <header className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <img src={job.companies.logo_url || '/placeholder-logo.svg'} alt={`${job.companies.name} logo`} className="w-24 h-24 rounded-2xl object-cover border border-gray-200" />
              <div>
                <h1 className="text-4xl font-bold text-gray-900">{job.title}</h1>
                <p className="text-xl text-gray-600 mt-2">{job.companies.name}</p>
              </div>
            </div>
            {authContext.profile?.role === 'jobseeker' && (
              <button
                onClick={handleApply}
                disabled={hasApplied || isApplying}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg ${
                  hasApplied
                    ? 'bg-green-500 text-white cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
                }`}
              >
                {hasApplied ? 'Applied ✓' : (isApplying ? 'Applying...' : 'Apply Now')}
              </button>
            )}
          </div>
          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center space-x-8 text-gray-600">
            <div className="flex items-center space-x-2">
              <span className="font-semibold">Location:</span>
              <span>{
                job.location
                  ? (typeof job.location === 'object' && job.location !== null
                      ? [(job.location as any).city, (job.location as any).area].filter(Boolean).join(', ')
                      : job.location)
                  : 'Not specified'
              }</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold">Job Type:</span>
              <span>{job.job_type}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold">Salary:</span>
              <span>{
                typeof job.salary_min === 'number' && typeof job.salary_max === 'number'
                  ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`
                  : 'Not specified'
              }</span>
            </div>
          </div>
        </header>

        <main className="grid grid-cols-3 gap-8">
          <div className="col-span-2 bg-white rounded-2xl shadow-lg p-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Job Description</h2>
              <p className="text-gray-700 leading-relaxed">{job.description}</p>
            </section>
            
            <section className="mt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Responsibilities</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {normalizeListField(job.responsibilities).length > 0
                  ? normalizeListField(job.responsibilities).map((item, index) => <li key={index}>{item}</li>)
                  : <li className="text-gray-400">No responsibilities listed.</li>}
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Requirements</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {normalizeListField(job.requirements).length > 0
                  ? normalizeListField(job.requirements).map((item, index) => <li key={index}>{item}</li>)
                  : <li className="text-gray-400">No requirements listed.</li>}
              </ul>
            </section>
          </div>
          <aside className="col-span-1 bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">About {job.companies.name}</h2>
            <p className="text-gray-700 leading-relaxed">{job.companies.description}</p>
          </aside>
        </main>
      </div>
    </div>
  );
};

export default JobDetails; 