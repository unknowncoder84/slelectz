import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const JobseekerSettings: React.FC = () => {
  const { user, profile } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState<'account' | 'profile' | 'notifications' | 'privacy' | 'preferences'>('account');
  
  const [accountSettings, setAccountSettings] = useState({
    fullName: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (profile) {
        setAccountSettings(prev => ({ ...prev, fullName: profile.full_name || '' }));
    }
    if (user) {
        setAccountSettings(prev => ({ ...prev, email: user.email || ''}));
    }
  }, [user, profile]);

  const [profileSettings, setProfileSettings] = useState({
    headline: '',
    summary: '',
    skills: [] as string[],
    experience: [] as Array<{
      title: string;
      company: string;
      location: string;
      startDate: string;
      endDate: string;
      current: boolean;
      description: string;
    }>,
    education: [] as Array<{
      school: string;
      degree: string;
      field: string;
      startDate: string;
      endDate: string;
      current: boolean;
      description: string;
    }>,
    resume: null as File | null,
    profilePicture: null as File | null,
    socialLinks: {
      linkedin: '',
      github: '',
      portfolio: '',
      twitter: '',
    },
  });

  const [notificationSettings, setNotificationSettings] = useState({
    jobAlerts: true,
    applicationUpdates: true,
    newMessages: true,
    marketingEmails: false,
    emailFrequency: 'daily',
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showContactInfo: true,
    showResume: true,
    showActivity: true,
    allowMessages: true,
  });

  const [preferenceSettings, setPreferenceSettings] = useState({
    jobTypes: [] as string[],
    remoteWork: 'any',
    location: '',
    salaryRange: {
      min: '',
      max: '',
    },
    industries: [] as string[],
    experienceLevel: '',
  });

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('social.')) {
      const socialPlatform = name.split('.')[1];
      setProfileSettings(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialPlatform]: value
        }
      }));
    } else {
      setProfileSettings(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setNotificationSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handlePrivacyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setPrivacySettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handlePreferenceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (name.startsWith('salaryRange.')) {
      const rangeField = name.split('.')[1];
      setPreferenceSettings(prev => ({
        ...prev,
        salaryRange: {
          ...prev.salaryRange,
          [rangeField]: value
        }
      }));
    } else {
      setPreferenceSettings(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }));
    }
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileSettings(prev => ({ ...prev, resume: e.target.files![0] }));
    }
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileSettings(prev => ({ ...prev, profilePicture: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement settings update logic
    console.log('Settings update:', {
      accountSettings,
      profileSettings,
      notificationSettings,
      privacySettings,
      preferenceSettings
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">Manage your account settings and preferences</p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {(['account', 'profile', 'notifications', 'privacy', 'preferences'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Settings Forms */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Account Settings */}
        {activeTab === 'account' && (
          <div className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                id="fullName"
                value={accountSettings.fullName}
                onChange={handleAccountChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={accountSettings.email}
                onChange={handleAccountChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={accountSettings.phone}
                onChange={handleAccountChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
              <div className="mt-4 space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    id="currentPassword"
                    value={accountSettings.currentPassword}
                    onChange={handleAccountChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    id="newPassword"
                    value={accountSettings.newPassword}
                    onChange={handleAccountChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    value={accountSettings.confirmPassword}
                    onChange={handleAccountChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Settings */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
              <div className="mt-2 flex items-center space-x-4">
                <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  {profileSettings.profilePicture ? (
                    <img
                      src={URL.createObjectURL(profileSettings.profilePicture)}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400">No photo</span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                />
              </div>
            </div>

            <div>
              <label htmlFor="headline" className="block text-sm font-medium text-gray-700">
                Professional Headline
              </label>
              <input
                type="text"
                name="headline"
                id="headline"
                value={profileSettings.headline}
                onChange={handleProfileChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="e.g. Software Engineer | Full Stack Developer"
              />
            </div>

            <div>
              <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
                Professional Summary
              </label>
              <textarea
                name="summary"
                id="summary"
                rows={4}
                value={profileSettings.summary}
                onChange={handleProfileChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Write a brief summary about yourself and your career goals"
              />
            </div>

            <div>
              <label htmlFor="resume" className="block text-sm font-medium text-gray-700">
                Resume
              </label>
              <div className="mt-2">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                />
                <p className="mt-1 text-sm text-gray-500">Upload your resume in PDF or Word format</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900">Social Links</h3>
              <div>
                <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
                  LinkedIn
                </label>
                <input
                  type="url"
                  name="social.linkedin"
                  id="linkedin"
                  value={profileSettings.socialLinks.linkedin}
                  onChange={handleProfileChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="github" className="block text-sm font-medium text-gray-700">
                  GitHub
                </label>
                <input
                  type="url"
                  name="social.github"
                  id="github"
                  value={profileSettings.socialLinks.github}
                  onChange={handleProfileChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700">
                  Portfolio
                </label>
                <input
                  type="url"
                  name="social.portfolio"
                  id="portfolio"
                  value={profileSettings.socialLinks.portfolio}
                  onChange={handleProfileChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="twitter" className="block text-sm font-medium text-gray-700">
                  Twitter
                </label>
                <input
                  type="url"
                  name="social.twitter"
                  id="twitter"
                  value={profileSettings.socialLinks.twitter}
                  onChange={handleProfileChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Job Alerts</h3>
                  <p className="text-sm text-gray-500">Get notified about new job opportunities</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="jobAlerts"
                    checked={notificationSettings.jobAlerts}
                    onChange={handleNotificationChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Application Updates</h3>
                  <p className="text-sm text-gray-500">Get notified about your application status</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="applicationUpdates"
                    checked={notificationSettings.applicationUpdates}
                    onChange={handleNotificationChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">New Messages</h3>
                  <p className="text-sm text-gray-500">Get notified about new messages from employers</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="newMessages"
                    checked={notificationSettings.newMessages}
                    onChange={handleNotificationChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Marketing Emails</h3>
                  <p className="text-sm text-gray-500">Receive marketing and promotional emails</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="marketingEmails"
                    checked={notificationSettings.marketingEmails}
                    onChange={handleNotificationChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="emailFrequency" className="block text-sm font-medium text-gray-700">
                Email Frequency
              </label>
              <select
                id="emailFrequency"
                name="emailFrequency"
                value={notificationSettings.emailFrequency}
                onChange={handleNotificationChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="immediate">Immediate</option>
                <option value="daily">Daily Digest</option>
                <option value="weekly">Weekly Digest</option>
              </select>
            </div>
          </div>
        )}

        {/* Privacy Settings */}
        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <div>
              <label htmlFor="profileVisibility" className="block text-sm font-medium text-gray-700">
                Profile Visibility
              </label>
              <select
                id="profileVisibility"
                name="profileVisibility"
                value={privacySettings.profileVisibility}
                onChange={handlePrivacyChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="connections">Connections Only</option>
              </select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Show Contact Information</h3>
                  <p className="text-sm text-gray-500">Display your contact information on your profile</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="showContactInfo"
                    checked={privacySettings.showContactInfo}
                    onChange={handlePrivacyChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Show Resume</h3>
                  <p className="text-sm text-gray-500">Allow employers to view your resume</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="showResume"
                    checked={privacySettings.showResume}
                    onChange={handlePrivacyChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Show Activity</h3>
                  <p className="text-sm text-gray-500">Display your job search activity</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="showActivity"
                    checked={privacySettings.showActivity}
                    onChange={handlePrivacyChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Allow Messages</h3>
                  <p className="text-sm text-gray-500">Allow employers to send you messages</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="allowMessages"
                    checked={privacySettings.allowMessages}
                    onChange={handlePrivacyChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Preference Settings */}
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <div>
              <label htmlFor="jobTypes" className="block text-sm font-medium text-gray-700">
                Job Types
              </label>
              <select
                id="jobTypes"
                name="jobTypes"
                multiple
                value={preferenceSettings.jobTypes}
                onChange={handlePreferenceChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="temporary">Temporary</option>
              </select>
            </div>

            <div>
              <label htmlFor="remoteWork" className="block text-sm font-medium text-gray-700">
                Remote Work Preference
              </label>
              <select
                id="remoteWork"
                name="remoteWork"
                value={preferenceSettings.remoteWork}
                onChange={handlePreferenceChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="any">Any</option>
                <option value="remote">Remote Only</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">On-site Only</option>
              </select>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Preferred Location
              </label>
              <input
                type="text"
                name="location"
                id="location"
                value={preferenceSettings.location}
                onChange={handlePreferenceChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="e.g. New York, NY"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="salaryMin" className="block text-sm font-medium text-gray-700">
                  Minimum Salary
                </label>
                <input
                  type="number"
                  name="salaryRange.min"
                  id="salaryMin"
                  value={preferenceSettings.salaryRange.min}
                  onChange={handlePreferenceChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="e.g. 50000"
                />
              </div>

              <div>
                <label htmlFor="salaryMax" className="block text-sm font-medium text-gray-700">
                  Maximum Salary
                </label>
                <input
                  type="number"
                  name="salaryRange.max"
                  id="salaryMax"
                  value={preferenceSettings.salaryRange.max}
                  onChange={handlePreferenceChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="e.g. 100000"
                />
              </div>
            </div>

            <div>
              <label htmlFor="industries" className="block text-sm font-medium text-gray-700">
                Preferred Industries
              </label>
              <select
                id="industries"
                name="industries"
                multiple
                value={preferenceSettings.industries}
                onChange={handlePreferenceChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
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
              <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700">
                Experience Level
              </label>
              <select
                id="experienceLevel"
                name="experienceLevel"
                value={preferenceSettings.experienceLevel}
                onChange={handlePreferenceChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Select level</option>
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
                <option value="executive">Executive Level</option>
              </select>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="pt-5">
          <div className="flex justify-end">
            <button
              type="submit"
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default JobseekerSettings; 