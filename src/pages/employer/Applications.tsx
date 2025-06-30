import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { AuthContext } from '../../contexts/AuthContext';

// Define types for data structures
interface Applicant {
  id: string;
  full_name: string;
  avatar_url: string;
}

interface Job {
  id: string;
  title: string;
}

interface Application {
  id: string;
  created_at: string;
  status: string;
  job?: Job;
  user?: Applicant;
}

interface Internship {
  id: string;
  title: string;
}

interface InternshipApplication {
  id: string;
  created_at: string;
  status: string;
  internship?: Internship;
  user?: Applicant;
}

const Applications: React.FC = () => {
  const { profile } = useContext(AuthContext);
  const [applications, setApplications] = useState<Application[]>([]);
  const [internshipApplications, setInternshipApplications] = useState<InternshipApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'jobs' | 'internships'>('jobs');

  useEffect(() => {
    const fetchAllApplications = async () => {
      if (!profile || profile.role !== 'employer') {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        // Fetch employer's company
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('id')
          .eq('auth_id', profile.auth_id)
          .single();
        if (companyError || !companyData) {
          setApplications([]);
          setInternshipApplications([]);
          setLoading(false);
          return;
        }
        // Fetch jobs for this company
        const { data: jobsData, error: jobsError } = await supabase
          .from('jobs')
          .select('id')
          .eq('company_id', companyData.id);
        if (jobsError) throw jobsError;
        const jobIds = (jobsData || []).map((job: any) => job.id);
        // Fetch internships for this company
        const { data: internshipsData, error: internshipsError } = await supabase
          .from('internships')
          .select('id')
          .eq('company_id', companyData.id);
        if (internshipsError) throw internshipsError;
        const internshipIds = (internshipsData || []).map((i: any) => i.id);
        // Fetch job applications
        let mapped: Application[] = [];
        if (jobIds.length > 0) {
          const { data, error } = await supabase
            .from('applications')
            .select(`
              id,
              created_at,
              status,
              jobs (id, title),
              user:users!user_id (id, full_name, avatar_url)
            `)
            .in('job_id', jobIds)
            .order('created_at', { ascending: false });
          if (error) throw error;
          mapped = (data as any[]).map(app => ({
            ...app,
            job: Array.isArray(app.jobs) ? app.jobs[0] : app.jobs,
            user: Array.isArray(app.user) ? app.user[0] : app.user,
          }));
        }
        setApplications(mapped);
        // Fetch internship applications
        let mappedIntern: InternshipApplication[] = [];
        if (internshipIds.length > 0) {
          const { data, error } = await supabase
            .from('internship_applications')
            .select(`
              id,
              created_at,
              status,
              internship:internships!internship_id (id, title),
              user:users!user_id (id, full_name, avatar_url)
            `)
            .in('internship_id', internshipIds)
            .order('created_at', { ascending: false });
          if (error) throw error;
          mappedIntern = (data as any[]).map(app => ({
            ...app,
            internship: Array.isArray(app.internship) ? app.internship[0] : app.internship,
            user: Array.isArray(app.user) ? app.user[0] : app.user,
          }));
        }
        setInternshipApplications(mappedIntern);
      } catch (err: any) {
        console.error('Error fetching applications:', err);
        setError('Failed to load applications.');
      } finally {
        setLoading(false);
      }
    };
    fetchAllApplications();
  }, [profile]);
  
  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', applicationId);

      if (error) throw error;

      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      console.error('Error updating status:', err);
      // Optional: show an error message to the user
    }
  };


  if (loading) {
    return <div className="p-8">Loading applications...</div>;
  }
  
  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }
  
  if (!profile || profile.role !== 'employer') {
    return <div className="p-8">This page is for employers only.</div>;
  }
  
  return (
    <div className="p-8 bg-gray-50 min-h-full">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Applications</h1>
      <div className="mb-8 flex space-x-4">
        <button
          className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 shadow-sm border ${activeTab === 'jobs' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50'}`}
          onClick={() => setActiveTab('jobs')}
        >
          Job Applications
        </button>
        <button
          className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 shadow-sm border ${activeTab === 'internships' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50'}`}
          onClick={() => setActiveTab('internships')}
        >
          Internship Applications
        </button>
      </div>
      {loading ? (
        <div className="p-8">Loading applications...</div>
      ) : error ? (
        <div className="p-8 text-red-500">{error}</div>
      ) : !profile || profile.role !== 'employer' ? (
        <div className="p-8">This page is for employers only.</div>
      ) : (
        <>
          {activeTab === 'jobs' && (
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied On</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-8 text-gray-500">No job applications yet.</td></tr>
                  ) : applications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-full" src={application.user?.avatar_url || ''} alt="" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {application.user?.full_name || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {application.job?.title || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(application.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          application.status === 'shortlisted' ? 'bg-green-100 text-green-800' :
                          application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {application.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <select
                          value={application.status}
                          onChange={(e) => handleStatusChange(application.id, e.target.value)}
                          className="p-2 border rounded-md"
                        >
                          <option value="pending">Pending</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="rejected">Rejected</option>
                        </select>
                        <a href={`/jobseeker-profile/${application.user?.id}`} className="text-indigo-600 hover:text-indigo-900 ml-4">View Profile</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === 'internships' && (
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Internship Title</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied On</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {internshipApplications.length === 0 ? (
                    <tr><td colSpan={4} className="text-center py-8 text-gray-500">No internship applications yet.</td></tr>
                  ) : internshipApplications.map((application) => (
                    <tr key={application.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-full" src={application.user?.avatar_url || ''} alt="" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {application.user?.full_name || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {application.internship?.title || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(application.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          application.status === 'shortlisted' ? 'bg-green-100 text-green-800' :
                          application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {application.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Applications; 