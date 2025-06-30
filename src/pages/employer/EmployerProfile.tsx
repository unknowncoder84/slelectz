import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { supabase } from '../../config/supabase';

interface CompanyInfo {
  name: string;
  industry: string;
  size: string;
  location: string;
  website: string;
  description: string;
}

interface PersonalInfo {
  fullName: string;
  position: string;
  email: string;
  phone: string;
  linkedin: string;
}

const EmployerProfile: React.FC = () => {
  const { user, profile } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'company' | 'personal'>('company');
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: '',
    industry: '',
    size: '',
    location: '',
    website: '',
    description: ''
  });
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: profile?.full_name || '',
    position: '',
    email: user?.email || '',
    phone: '',
    linkedin: ''
  });

  useEffect(() => {
    if (user?.id) {
      fetchCompanyProfile();
    }
  }, [user]);

  const fetchCompanyProfile = async () => {
    try {
      console.log('Fetching company profile for user:', user?.id);
      
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('auth_id', user?.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching company profile:', error);
        throw error;
      }

      console.log('Company profile data:', data);

      if (data) {
        setCompanyInfo({
          name: data.name || '',
          industry: data.industry || '',
          size: data.size || '',
          location: data.location || '',
          website: data.website || '',
          description: data.description || ''
        });
      }
    } catch (err) {
      console.error('Error in fetchCompanyProfile:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch company profile');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!user?.id) {
        throw new Error('User not found');
      }

      console.log('Current user ID:', user.id);

      // Validate website URL if provided
      let websiteUrl = companyInfo.website;
      if (websiteUrl && !websiteUrl.startsWith('http://') && !websiteUrl.startsWith('https://')) {
        websiteUrl = `https://${websiteUrl}`;
      }

      const companyData = {
        auth_id: user.id,
        name: companyInfo.name,
        industry: companyInfo.industry,
        size: companyInfo.size,
        location: companyInfo.location,
        website: websiteUrl,
        description: companyInfo.description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Attempting to save company data:', companyData);

      // First check if company exists
      const { data: existingCompany, error: checkError } = await supabase
        .from('companies')
        .select('id')
        .eq('auth_id', user.id)
        .maybeSingle();

      console.log('Existing company check:', { existingCompany, checkError });

      if (checkError) {
        console.error('Error checking existing company:', checkError);
        throw checkError;
      }

      let result;
      if (existingCompany) {
        // Update existing company
        result = await supabase
          .from('companies')
          .update(companyData)
          .eq('id', existingCompany.id)
          .select();
      } else {
        // Create new company
        result = await supabase
          .from('companies')
          .insert([companyData])
          .select();
      }

      console.log('Save result:', result);

      if (result.error) {
        console.error('Error saving company:', result.error);
        throw result.error;
      }

      if (!result.data || result.data.length === 0) {
        throw new Error('Failed to save company data - no data returned');
      }

      console.log('Company saved successfully:', result.data);
      setSuccess('Company profile updated successfully!');
      setTimeout(() => {
        window.location.href = '/employer/dashboard';
      }, 1000);
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8">
            <h1 className="text-2xl font-semibold text-[#1d1d1f] mb-6">Company Profile</h1>

            {/* Tabs */}
            <div className="mb-8">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('company')}
                    className={`${
                      activeTab === 'company'
                        ? 'border-black text-black'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Company Information
                  </button>
                  <button
                    onClick={() => setActiveTab('personal')}
                    className={`${
                      activeTab === 'personal'
                        ? 'border-black text-black'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Personal Information
                  </button>
                </nav>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-xl text-green-600 text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {activeTab === 'company' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={companyInfo.name}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
                      className="block w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:border-[#000000] focus:ring-[#000000] text-base transition-colors duration-200 bg-white hover:border-gray-400"
                      placeholder="Enter company name"
                    />
                  </div>

                  <div>
                    <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                      Industry
                    </label>
                    <select
                      id="industry"
                      value={companyInfo.industry}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, industry: e.target.value })}
                      className="block w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:border-[#000000] focus:ring-[#000000] text-base transition-colors duration-200 bg-white hover:border-gray-400"
                    >
                      <option value="">Select industry</option>
                      <option value="technology">Technology</option>
                      <option value="finance">Finance</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="education">Education</option>
                      <option value="retail">Retail</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
                      Company Size
                    </label>
                    <select
                      id="size"
                      value={companyInfo.size}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, size: e.target.value })}
                      className="block w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:border-[#000000] focus:ring-[#000000] text-base transition-colors duration-200 bg-white hover:border-gray-400"
                    >
                      <option value="">Select size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="501-1000">501-1000 employees</option>
                      <option value="1000+">1000+ employees</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      value={companyInfo.location}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, location: e.target.value })}
                      className="block w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:border-[#000000] focus:ring-[#000000] text-base transition-colors duration-200 bg-white hover:border-gray-400"
                      placeholder="Enter location"
                    />
                  </div>

                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <input
                      type="url"
                      id="website"
                      value={companyInfo.website}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, website: e.target.value })}
                      className="block w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:border-[#000000] focus:ring-[#000000] text-base transition-colors duration-200 bg-white hover:border-gray-400"
                      placeholder="Enter website URL"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Company Description
                    </label>
                    <textarea
                      id="description"
                      value={companyInfo.description}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, description: e.target.value })}
                      rows={4}
                      className="block w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:border-[#000000] focus:ring-[#000000] text-base transition-colors duration-200 bg-white hover:border-gray-400"
                      placeholder="Enter company description"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      value={personalInfo.fullName}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                      className="block w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:border-[#000000] focus:ring-[#000000] text-base transition-colors duration-200 bg-white hover:border-gray-400"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                      Position
                    </label>
                    <input
                      type="text"
                      id="position"
                      value={personalInfo.position}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, position: e.target.value })}
                      className="block w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:border-[#000000] focus:ring-[#000000] text-base transition-colors duration-200 bg-white hover:border-gray-400"
                      placeholder="Enter your position"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={personalInfo.email}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                      className="block w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:border-[#000000] focus:ring-[#000000] text-base transition-colors duration-200 bg-white hover:border-gray-400"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={personalInfo.phone}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                      className="block w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:border-[#000000] focus:ring-[#000000] text-base transition-colors duration-200 bg-white hover:border-gray-400"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1">
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      id="linkedin"
                      value={personalInfo.linkedin}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })}
                      className="block w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:border-[#000000] focus:ring-[#000000] text-base transition-colors duration-200 bg-white hover:border-gray-400"
                      placeholder="Enter your LinkedIn profile URL"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerProfile; 