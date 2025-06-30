import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import { Link } from 'react-router-dom';

interface JobMatch {
  job: {
    id: string;
    title: string;
    company: string;
    location: string | { city: string; area: string; pincode?: string; streetAddress?: string };
    type: string;
    salary: string;
    description: string;
    requirements: string[];
    experience: string;
    postedDate: string;
  };
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  reasons: string[];
}

interface UserProfile {
  skills: Array<{ name: string; level: string }>;
  experience: string;
  location: string;
  desired_roles: string[];
  salary_expectation: string;
  remote_preference: string;
}

const AdvancedJobMatching: React.FC = () => {
  const { user, profile } = useContext(AuthContext);
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [filters, setFilters] = useState({
    minScore: 70,
    location: '',
    jobType: '',
    experience: ''
  });

  useEffect(() => {
    if (user && profile) {
      fetchUserProfile();
    }
  }, [user, profile]);

  useEffect(() => {
    if (userProfile) {
      findJobMatches();
    }
  }, [userProfile, filters]);

  const fetchUserProfile = async () => {
    try {
      // Get user's detailed profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (profileData) {
        setUserProfile({
          skills: profileData.skills || [],
          experience: profileData.experience || '',
          location: profileData.location || '',
          desired_roles: (profileData as any).desired_roles || [],
          salary_expectation: profileData.salary_expectation || '',
          remote_preference: profileData.remote_preference || ''
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const findJobMatches = async () => {
    try {
      setLoading(true);

      // Fetch all active jobs
      const { data: jobs, error } = await supabase
        .from('jobs')
        .select(`
          *,
          companies (
            name
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Calculate match scores for each job
      const jobMatches: JobMatch[] = jobs?.map(job => {
        const matchResult = calculateMatchScore(job, userProfile!);
        return {
          job: {
            id: job.id,
            title: job.title,
            company: job.companies?.name || 'Unknown Company',
            location: job.location,
            type: job.job_type,
            salary: job.salary,
            description: job.description,
            requirements: job.requirements || [],
            experience: job.experience,
            postedDate: job.created_at
          },
          ...matchResult
        };
      }) || [];

      // Filter and sort by match score
      const filteredMatches = jobMatches
        .filter(match => match.matchScore >= filters.minScore)
        .sort((a, b) => b.matchScore - a.matchScore);

      setMatches(filteredMatches);
    } catch (error) {
      console.error('Error finding job matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMatchScore = (job: any, userProfile: UserProfile) => {
    let score = 0;
    const reasons: string[] = [];
    const matchingSkills: string[] = [];
    const missingSkills: string[] = [];

    // Skill matching (40% of total score)
    const userSkills = userProfile.skills.map(s => s.name.toLowerCase());
    const jobRequirements = Array.isArray(job.requirements) ? 
      job.requirements.map((r: string) => r.toLowerCase()) : [];
    
    let skillMatches = 0;
    jobRequirements.forEach((req: string) => {
      const matchedSkill = userSkills.find(skill => 
        req.includes(skill) || skill.includes(req)
      );
      if (matchedSkill) {
        skillMatches++;
        matchingSkills.push(req);
      } else {
        missingSkills.push(req);
      }
    });

    const skillScore = jobRequirements.length > 0 ? 
      (skillMatches / jobRequirements.length) * 40 : 20;
    score += skillScore;

    if (skillMatches > 0) {
      reasons.push(`${skillMatches} out of ${jobRequirements.length} required skills match`);
    }

    // Experience level matching (25% of total score)
    const experienceMatch = compareExperienceLevels(userProfile.experience, job.experience);
    score += experienceMatch.score * 25;
    if (experienceMatch.reason) {
      reasons.push(experienceMatch.reason);
    }

    // Location matching (20% of total score)
    if (userProfile.location && job.location) {
      const locationMatch = compareLocations(userProfile.location, job.location);
      score += locationMatch.score * 20;
      if (locationMatch.reason) {
        reasons.push(locationMatch.reason);
      }
    } else {
      score += 10; // Neutral score if location not specified
    }

    // Role preference matching (15% of total score)
    const roleMatch = userProfile.desired_roles.some(role =>
      job.title.toLowerCase().includes(role.toLowerCase())
    );
    score += roleMatch ? 15 : 0;
    if (roleMatch) {
      reasons.push('Job title matches your desired roles');
    }

    return {
      matchScore: Math.round(score),
      matchingSkills,
      missingSkills,
      reasons
    };
  };

  const compareExperienceLevels = (userExp: string, jobExp: string) => {
    const levels = ['entry', 'mid', 'senior', 'executive'];
    const userLevel = levels.findIndex(level => 
      userExp.toLowerCase().includes(level)
    );
    const jobLevel = levels.findIndex(level => 
      jobExp.toLowerCase().includes(level)
    );

    if (userLevel === -1 || jobLevel === -1) {
      return { score: 0.5, reason: 'Experience level unclear' };
    }

    const diff = Math.abs(userLevel - jobLevel);
    if (diff === 0) {
      return { score: 1, reason: 'Perfect experience level match' };
    } else if (diff === 1) {
      return { score: 0.8, reason: 'Good experience level match' };
    } else {
      return { score: 0.3, reason: 'Experience level mismatch' };
    }
  };

  const compareLocations = (userLocation: string, jobLocation: string | any) => {
    // Handle jobLocation as object or string
    let jobLocationStr = '';
    if (typeof jobLocation === 'string') {
      jobLocationStr = jobLocation;
    } else if (typeof jobLocation === 'object' && jobLocation !== null) {
      const parts = [];
      if (jobLocation.city) parts.push(jobLocation.city);
      if (jobLocation.area) parts.push(jobLocation.area);
      jobLocationStr = parts.join(', ');
    }

    const userCity = userLocation.toLowerCase().split(',')[0].trim();
    const jobCity = jobLocationStr.toLowerCase().split(',')[0].trim();

    if (userCity === jobCity) {
      return { score: 1, reason: 'Same city location' };
    } else if (userLocation.toLowerCase().includes(jobLocationStr.toLowerCase()) || 
               jobLocationStr.toLowerCase().includes(userLocation.toLowerCase())) {
      return { score: 0.8, reason: 'Same region location' };
    } else if (jobLocationStr.toLowerCase().includes('remote')) {
      return { score: 0.9, reason: 'Remote position available' };
    } else {
      return { score: 0.2, reason: 'Different location' };
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  // Helper function to format location display
  const formatLocation = (location: string | { city: string; area: string; pincode?: string; streetAddress?: string }): string => {
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

  // Add a refresh handler
  const handleRefresh = () => {
    if (userProfile) findJobMatches();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">AI Job Matches</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">AI Job Matches</h2>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Complete your profile to get personalized job matches</p>
          <Link
            to="/profile"
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
          >
            Complete Profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span role="img" aria-label="AI">✨</span> AI Job Recommendations
        </h2>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg font-semibold shadow transition-all duration-200"
        >
          Refresh
        </button>
      </div>
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 animate-pulse">
          <svg className="w-12 h-12 text-emerald-400 animate-spin mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M4 12a8 8 0 018-8" className="opacity-75" />
          </svg>
          <span className="text-gray-500 text-lg">Finding your best matches...</span>
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center text-gray-500 py-16">
          <span>No recommendations found. Try updating your profile or filters.</span>
        </div>
      ) : (
        <div className="space-y-6">
          {matches.map((match, idx) => (
            <div key={match.job.id} className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row items-center gap-6 hover:shadow-lg transition-shadow duration-200 animate-fade-in">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-1 flex items-center gap-2">
                  {match.job.title}
                  <span className={`ml-2 px-3 py-1 rounded-full text-xs font-bold ${match.matchScore >= 90 ? 'bg-green-100 text-green-700' : match.matchScore >= 75 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{match.matchScore}% match</span>
                </h3>
                <p className="text-gray-600 mb-2">{match.job.company} &middot; {typeof match.job.location === 'string' ? match.job.location : match.job.location.city}</p>
                <p className="text-gray-500 mb-2 line-clamp-2">{match.job.description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {match.matchingSkills.map(skill => (
                    <span key={skill} className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium">{skill}</span>
                  ))}
                  {match.missingSkills.length > 0 && (
                    <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-medium">Missing: {match.missingSkills.join(', ')}</span>
                  )}
                </div>
                <div className="mt-2 text-sm text-gray-400">
                  {match.reasons.map((reason, i) => (
                    <span key={i} className="mr-2">• {reason}</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2 items-center">
                <Link
                  to={`/jobs/${match.job.id}`}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition-colors duration-200"
                >
                  View Job
                </Link>
                <button
                  className="px-4 py-1 text-xs text-gray-500 hover:text-gray-700 underline"
                  onClick={() => {/* dismiss logic if needed */}}
                >
                  Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdvancedJobMatching; 