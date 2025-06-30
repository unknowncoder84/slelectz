import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const EmployerDashboard: React.FC = () => {
  const { profile } = useContext(AuthContext);
  // Mock data - in a real app, this would come from an API
  const stats = {
    activeJobs: 12,
    totalApplications: 156,
    newApplications: 23,
    interviewsScheduled: 8,
  };

  const recentApplications = [
    {
      id: 1,
      candidateName: 'John Doe',
      position: 'Senior Developer',
      date: '2024-03-15',
      status: 'New',
    },
    {
      id: 2,
      candidateName: 'Jane Smith',
      position: 'Product Manager',
      date: '2024-03-14',
      status: 'Under Review',
    },
    {
      id: 3,
      candidateName: 'Mike Johnson',
      position: 'UX Designer',
      date: '2024-03-13',
      status: 'Interview Scheduled',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-[#1d1d1f]">Welcome back, {profile?.full_name || 'Employer'}</h1>
        <div className="flex flex-col space-y-2">
          <Link
            to="/employer/post-job"
            className="bg-[#000000] text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-[#1d1d1f] transition-colors duration-200"
          >
            Post Job
          </Link>
          <Link
            to="/employer/post-internship"
            className="bg-[#000000] text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-[#1d1d1f] transition-colors duration-200"
          >
            Post Internship
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <h3 className="text-sm font-medium text-gray-500">Active Jobs</h3>
          <p className="mt-2 text-3xl font-semibold text-[#1d1d1f]">{stats.activeJobs}</p>
        </div>
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <h3 className="text-sm font-medium text-gray-500">Total Applications</h3>
          <p className="mt-2 text-3xl font-semibold text-[#1d1d1f]">{stats.totalApplications}</p>
        </div>
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <h3 className="text-sm font-medium text-gray-500">New Applications</h3>
          <p className="mt-2 text-3xl font-semibold text-[#ff2d55]">{stats.newApplications}</p>
        </div>
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
          <h3 className="text-sm font-medium text-gray-500">Interviews Scheduled</h3>
          <p className="mt-2 text-3xl font-semibold text-[#34c759]">{stats.interviewsScheduled}</p>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-[#1d1d1f]">Recent Applications</h2>
          <div className="mt-6">
            <div className="flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-[#1d1d1f]">Candidate</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-[#1d1d1f]">Position</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-[#1d1d1f]">Date</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-[#1d1d1f]">Status</th>
                        <th className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                          <span className="sr-only">View</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentApplications.map((application) => (
                        <tr key={application.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-[#1d1d1f]">
                            {application.candidateName}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{application.position}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{application.date}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              application.status === 'New' ? 'bg-[#ff2d55]/10 text-[#ff2d55]' :
                              application.status === 'Under Review' ? 'bg-[#ff9500]/10 text-[#ff9500]' :
                              'bg-[#34c759]/10 text-[#34c759]'
                            }`}>
                              {application.status}
                            </span>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                            <Link to={`/employer/applications/${application.id}`} className="text-[#000000] hover:text-[#1d1d1f]">
                              View<span className="sr-only">, {application.candidateName}</span>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phase 3 Features - Reverse Hiring */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-[#1d1d1f] mb-2">Reverse Hiring</h2>
          <p className="text-gray-600 mb-6">Discover talented job seekers through video reels and unlock their full profiles with credits.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/employer/reels"
              className="group bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl border border-emerald-200 hover:border-emerald-300 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">🎥</div>
                <div>
                  <h3 className="font-semibold text-emerald-800 group-hover:text-emerald-900">Job Seeker Reels</h3>
                  <p className="text-sm text-emerald-600">Browse video profiles</p>
                </div>
              </div>
            </Link>
            <Link
              to="/employer/saved-videos"
              className="group bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">💾</div>
                <div>
                  <h3 className="font-semibold text-blue-800 group-hover:text-blue-900">Saved Videos</h3>
                  <p className="text-sm text-blue-600">View your saved profiles</p>
                </div>
              </div>
            </Link>
            <Link
              to="/employer/credits"
              className="group bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 hover:border-purple-300 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">💳</div>
                <div>
                  <h3 className="font-semibold text-purple-800 group-hover:text-purple-900">Credits</h3>
                  <p className="text-sm text-purple-600">Manage your balance</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard; 