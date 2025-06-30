import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import toast from 'react-hot-toast';

interface JobLocation {
  area?: string;
  city?: string;
  pincode?: string;
  streetAddress?: string;
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string | JobLocation;
  type: string;
  salary: string;
  description: string;
  postedDate: string;
  requirements: string[] | any;
  status: 'active' | 'paused' | 'closed' | 'expired';
  applications?: number;
  experience: string;
}

interface JobCardProps {
  job: Job;
}

const JobCardNew: React.FC<JobCardProps> = ({ job }) => {
  const { user } = useContext(AuthContext);

  const handleApply = async () => {
    if (!user) {
      toast.error('Please log in to apply for jobs');
      return;
    }

    try {
      const { error } = await supabase
        .from('applications')
        .insert({
          job_id: job.id,
          user_id: user.id,
          status: 'applied'
        });

      if (error) throw error;

      toast.success('Application submitted successfully!');
    } catch (error) {
      console.error('Error applying for job:', error);
      toast.error('Failed to submit application. Please try again.');
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast.error('Please log in to save jobs');
      return;
    }

    try {
      const { error } = await supabase
        .from('saved_jobs')
        .insert({
          job_id: job.id,
          user_id: user.id
        });

      if (error) throw error;

      toast.success('Job saved successfully!');
    } catch (error) {
      console.error('Error saving job:', error);
      toast.error('Failed to save job. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  // Format location display
  const formatLocation = (location: string | JobLocation): string => {
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

  // Format requirements display
  const formatRequirements = (requirements: string[] | any): string[] => {
    if (Array.isArray(requirements)) {
      return requirements;
    }
    
    if (typeof requirements === 'string') {
      // Try to parse as JSON if it's a string
      try {
        const parsed = JSON.parse(requirements);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        // If it's not JSON, split by commas or return as single item
        return requirements.split(',').map((r: string) => r.trim()).filter(Boolean);
      }
    }
    
    return [];
  };

  const requirements = formatRequirements(job.requirements);

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <Link to={`/jobs/${job.id}`} className="block">
              <h3 className="text-lg font-semibold text-gray-900 hover:text-emerald-600 transition-colors duration-200 mb-1">
                {job.title}
              </h3>
            </Link>
            <p className="text-gray-600 font-medium">{job.company}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              job.status === 'active' ? 'bg-green-100 text-green-800' :
              job.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {formatLocation(job.location)}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {job.type}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            {job.salary}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {job.experience} Level
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {job.description}
        </p>

        {/* Requirements */}
        {requirements.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Key Requirements:</p>
            <div className="flex flex-wrap gap-1">
              {requirements.slice(0, 3).map((req, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  {req}
                </span>
              ))}
              {requirements.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{requirements.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center text-xs text-gray-500">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Posted {formatDate(job.postedDate)}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-emerald-600 transition-colors duration-200"
              title="Save Job"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-1.5 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-medium"
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCardNew; 