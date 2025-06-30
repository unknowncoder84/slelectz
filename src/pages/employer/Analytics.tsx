import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import axios from 'axios';
import ResponsiveChart from '../../components/ResponsiveChart';
import ResponsiveTable from '../../components/ResponsiveTable';

// API Response Interfaces
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

interface JobMetrics {
  id: string;
  title: string;
  views: number;
  applications: number;
  shortlisted: number;
  hired: number;
  conversionRate: number;
  postedDate: string;
  status: 'active' | 'closed' | 'draft';
}

interface CandidateMetrics {
  total: number;
  bySource: { source: string; count: number }[];
  byExperience: { range: string; count: number }[];
  byLocation: { location: string; count: number }[];
  byStatus: { status: string; count: number }[];
  bySkill: { skill: string; count: number }[];
}

interface TimeMetrics {
  date: string;
  views: number;
  applications: number;
  shortlisted: number;
  hired: number;
}

interface AnalyticsData {
  jobMetrics: JobMetrics[];
  candidateMetrics: CandidateMetrics;
  timeMetrics: TimeMetrics[];
  summary: {
    totalViews: number;
    totalApplications: number;
    conversionRate: number;
    averageTimeToHire: number;
    activeJobs: number;
    totalHired: number;
  };
}

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'overview' | 'jobs' | 'candidates'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use mock data instead of API call
      setAnalyticsData(getMockData());
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when time range changes
  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  // Mock data for development
  const getMockData = (): AnalyticsData => ({
    jobMetrics: [
      {
        id: '1',
        title: 'Senior Software Engineer',
        views: 1250,
        applications: 85,
        shortlisted: 12,
        hired: 3,
        conversionRate: 3.5,
        postedDate: '2024-03-01',
        status: 'active'
      },
      {
        id: '2',
        title: 'Product Manager',
        views: 980,
        applications: 45,
        shortlisted: 8,
        hired: 2,
        conversionRate: 4.4,
        postedDate: '2024-03-05',
        status: 'active'
      },
      {
        id: '3',
        title: 'UX Designer',
        views: 750,
        applications: 35,
        shortlisted: 6,
        hired: 1,
        conversionRate: 2.9,
        postedDate: '2024-03-10',
        status: 'active'
      }
    ],
    candidateMetrics: {
      total: 165,
      bySource: [
        { source: 'Job Board', count: 85 },
        { source: 'Referrals', count: 35 },
        { source: 'Direct', count: 25 },
        { source: 'Social Media', count: 20 }
      ],
      byExperience: [
        { range: '0-2 years', count: 45 },
        { range: '3-5 years', count: 65 },
        { range: '6-8 years', count: 35 },
        { range: '8+ years', count: 20 }
      ],
      byLocation: [
        { location: 'Mumbai', count: 45 },
        { location: 'Delhi', count: 35 },
        { location: 'Bangalore', count: 55 },
        { location: 'Other', count: 30 }
      ],
      byStatus: [
        { status: 'Applied', count: 165 },
        { status: 'Shortlisted', count: 26 },
        { status: 'Interviewed', count: 15 },
        { status: 'Hired', count: 6 }
      ],
      bySkill: [
        { skill: 'React', count: 45 },
        { skill: 'Node.js', count: 35 },
        { skill: 'Python', count: 25 },
        { skill: 'Java', count: 20 }
      ]
    },
    timeMetrics: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      views: Math.floor(Math.random() * 100) + 50,
      applications: Math.floor(Math.random() * 20) + 5,
      shortlisted: Math.floor(Math.random() * 10) + 2,
      hired: Math.floor(Math.random() * 3) + 1
    })),
    summary: {
      totalViews: 2980,
      totalApplications: 165,
      conversionRate: 5.5,
      averageTimeToHire: 24,
      activeJobs: 3,
      totalHired: 6
    }
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Loading state
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading analytics</h3>
              <p className="mt-2 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Job Views</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">2,980</p>
          <p className="mt-2 text-sm text-green-600">↑ 12% from last month</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Applications</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">165</p>
          <p className="mt-2 text-sm text-green-600">↑ 8% from last month</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500">Conversion Rate</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">5.5%</p>
          <p className="mt-2 text-sm text-red-600">↓ 2% from last month</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500">Time to Hire</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">24 days</p>
          <p className="mt-2 text-sm text-green-600">↓ 3 days from last month</p>
        </div>
      </div>

      {/* Time Series Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <h3 className="text-lg font-medium text-gray-900">Activity Over Time</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1 rounded-md text-sm ${
                timeRange === '7d'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              7D
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1 rounded-md text-sm ${
                timeRange === '30d'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              30D
            </button>
            <button
              onClick={() => setTimeRange('90d')}
              className={`px-3 py-1 rounded-md text-sm ${
                timeRange === '90d'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              90D
            </button>
          </div>
        </div>
        <ResponsiveChart
          type="line"
          data={analyticsData?.timeMetrics || []}
          dataKey="views"
          nameKey="date"
          height={300}
        />
      </div>

      {/* Candidate Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Candidate Sources</h3>
          <ResponsiveChart
            type="pie"
            data={analyticsData?.candidateMetrics.bySource || []}
            dataKey="count"
            nameKey="source"
            height={300}
            colors={COLORS}
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Experience Distribution</h3>
          <ResponsiveChart
            type="bar"
            data={analyticsData?.candidateMetrics.byExperience || []}
            dataKey="count"
            nameKey="range"
            height={300}
          />
        </div>
      </div>
    </div>
  );

  const renderJobs = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Job Performance</h3>
        <ResponsiveTable
          columns={[
            { header: 'Job Title', accessor: 'title' },
            { header: 'Views', accessor: 'views' },
            { header: 'Applications', accessor: 'applications' },
            { header: 'Shortlisted', accessor: 'shortlisted' },
            { header: 'Hired', accessor: 'hired' },
            {
              header: 'Conversion Rate',
              accessor: 'conversionRate',
              render: (value) => `${value}%`,
            },
          ]}
          data={analyticsData?.jobMetrics || []}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Job Views Distribution</h3>
        <ResponsiveChart
          type="bar"
          data={analyticsData?.jobMetrics || []}
          dataKey="views"
          nameKey="title"
          height={300}
        />
      </div>
    </div>
  );

  const renderCandidates = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ResponsiveChart
          type="pie"
          data={analyticsData?.candidateMetrics.byLocation || []}
          dataKey="count"
          nameKey="location"
          height={300}
          colors={COLORS}
        />
        <ResponsiveChart
          type="bar"
          data={analyticsData?.candidateMetrics.byExperience || []}
          dataKey="count"
          nameKey="range"
          height={300}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex flex-wrap sm:flex-nowrap space-x-4 sm:space-x-8">
            <button
              onClick={() => setSelectedMetric('overview')}
              className={`${
                selectedMetric === 'overview'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Overview
            </button>
            <button
              onClick={() => setSelectedMetric('jobs')}
              className={`${
                selectedMetric === 'jobs'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Jobs
            </button>
            <button
              onClick={() => setSelectedMetric('candidates')}
              className={`${
                selectedMetric === 'candidates'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Candidates
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      {analyticsData && (
        <>
          {selectedMetric === 'overview' && renderOverview()}
          {selectedMetric === 'jobs' && renderJobs()}
          {selectedMetric === 'candidates' && renderCandidates()}
        </>
      )}
    </div>
  );
};

export default Analytics; 