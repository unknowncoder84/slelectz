import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const EmployerSettings: React.FC = () => {
  const { user, profile } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('account');
  
  const [accountSettings, setAccountSettings] = useState({
    fullName: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [companySettings, setCompanySettings] = useState({
    companyName: '',
    industry: '',
    companySize: '',
    location: '',
    website: '',
    description: '',
    logo: null as File | null,
    socialLinks: {
      linkedin: '',
      twitter: '',
      facebook: '',
    },
  });

  const [notificationSettings, setNotificationSettings] = useState({
    newApplications: true,
    applicationUpdates: true,
    candidateMessages: true,
    jobExpiryAlerts: true,
    marketingEmails: false,
    emailFrequency: 'daily',
  });

  const [billingSettings, setBillingSettings] = useState({
    plan: 'basic',
    paymentMethod: 'credit_card',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
    autoRenew: true,
  });

  const [integrationSettings, setIntegrationSettings] = useState({
    calendar: false,
    slack: false,
    zoom: false,
    googleMeet: false,
    applicantTrackingSystem: false,
  });

  useEffect(() => {
    if (profile) {
        setAccountSettings(prev => ({ ...prev, fullName: profile.full_name || '' }));
    }
    if (user) {
        setAccountSettings(prev => ({ ...prev, email: user.email || ''}));
    }
  }, [user, profile]);

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('social.')) {
      const socialPlatform = name.split('.')[1];
      setCompanySettings(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialPlatform]: value
        }
      }));
    } else {
      setCompanySettings(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setNotificationSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (name.startsWith('billingAddress.')) {
      const addressField = name.split('.')[1];
      setBillingSettings(prev => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [addressField]: value
        }
      }));
    } else {
      setBillingSettings(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }));
    }
  };

  const handleIntegrationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setIntegrationSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCompanySettings(prev => ({ ...prev, logo: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement settings update logic
    console.log('Settings update:', {
      accountSettings,
      companySettings,
      notificationSettings,
      billingSettings,
      integrationSettings
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">Manage your company settings and preferences</p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {(['account', 'company', 'notifications', 'billing', 'integrations'] as const).map((tab) => (
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

        {/* Company Settings */}
        {activeTab === 'company' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Company Logo</label>
              <div className="mt-2 flex items-center space-x-4">
                <div className="h-24 w-24 rounded-lg bg-gray-100 flex items-center justify-center">
                  {companySettings.logo ? (
                    <img
                      src={URL.createObjectURL(companySettings.logo)}
                      alt="Company logo"
                      className="h-full w-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-gray-400">No logo</span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                />
              </div>
            </div>

            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                id="companyName"
                value={companySettings.companyName}
                onChange={handleCompanyChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                Industry
              </label>
              <select
                name="industry"
                id="industry"
                value={companySettings.industry}
                onChange={handleCompanyChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
              <label htmlFor="companySize" className="block text-sm font-medium text-gray-700">
                Company Size
              </label>
              <select
                name="companySize"
                id="companySize"
                value={companySettings.companySize}
                onChange={handleCompanyChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                name="location"
                id="location"
                value={companySettings.location}
                onChange={handleCompanyChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                Website
              </label>
              <input
                type="url"
                name="website"
                id="website"
                value={companySettings.website}
                onChange={handleCompanyChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Company Description
              </label>
              <textarea
                name="description"
                id="description"
                rows={4}
                value={companySettings.description}
                onChange={handleCompanyChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
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
                  value={companySettings.socialLinks.linkedin}
                  onChange={handleCompanyChange}
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
                  value={companySettings.socialLinks.twitter}
                  onChange={handleCompanyChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="facebook" className="block text-sm font-medium text-gray-700">
                  Facebook
                </label>
                <input
                  type="url"
                  name="social.facebook"
                  id="facebook"
                  value={companySettings.socialLinks.facebook}
                  onChange={handleCompanyChange}
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
                  <h3 className="text-sm font-medium text-gray-900">New Applications</h3>
                  <p className="text-sm text-gray-500">Get notified about new job applications</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="newApplications"
                    checked={notificationSettings.newApplications}
                    onChange={handleNotificationChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Application Updates</h3>
                  <p className="text-sm text-gray-500">Get notified about application status changes</p>
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
                  <h3 className="text-sm font-medium text-gray-900">Candidate Messages</h3>
                  <p className="text-sm text-gray-500">Get notified about new messages from candidates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="candidateMessages"
                    checked={notificationSettings.candidateMessages}
                    onChange={handleNotificationChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Job Expiry Alerts</h3>
                  <p className="text-sm text-gray-500">Get notified when job postings are about to expire</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="jobExpiryAlerts"
                    checked={notificationSettings.jobExpiryAlerts}
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

        {/* Billing Settings */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            <div>
              <label htmlFor="plan" className="block text-sm font-medium text-gray-700">
                Subscription Plan
              </label>
              <select
                id="plan"
                name="plan"
                value={billingSettings.plan}
                onChange={handleBillingChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="basic">Basic</option>
                <option value="professional">Professional</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>

            <div>
              <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
                Payment Method
              </label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={billingSettings.paymentMethod}
                onChange={handleBillingChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="credit_card">Credit Card</option>
                <option value="paypal">PayPal</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900">Billing Address</h3>
              <div>
                <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                  Street Address
                </label>
                <input
                  type="text"
                  name="billingAddress.street"
                  id="street"
                  value={billingSettings.billingAddress.street}
                  onChange={handleBillingChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    name="billingAddress.city"
                    id="city"
                    value={billingSettings.billingAddress.city}
                    onChange={handleBillingChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                    State/Province
                  </label>
                  <input
                    type="text"
                    name="billingAddress.state"
                    id="state"
                    value={billingSettings.billingAddress.state}
                    onChange={handleBillingChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                    ZIP/Postal Code
                  </label>
                  <input
                    type="text"
                    name="billingAddress.zipCode"
                    id="zipCode"
                    value={billingSettings.billingAddress.zipCode}
                    onChange={handleBillingChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <input
                    type="text"
                    name="billingAddress.country"
                    id="country"
                    value={billingSettings.billingAddress.country}
                    onChange={handleBillingChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Auto-renew Subscription</h3>
                <p className="text-sm text-gray-500">Automatically renew your subscription</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="autoRenew"
                  checked={billingSettings.autoRenew}
                  onChange={handleBillingChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        )}

        {/* Integration Settings */}
        {activeTab === 'integrations' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Google Calendar</h3>
                  <p className="text-sm text-gray-500">Sync interviews with Google Calendar</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="calendar"
                    checked={integrationSettings.calendar}
                    onChange={handleIntegrationChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Slack</h3>
                  <p className="text-sm text-gray-500">Get notifications in Slack</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="slack"
                    checked={integrationSettings.slack}
                    onChange={handleIntegrationChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Zoom</h3>
                  <p className="text-sm text-gray-500">Schedule interviews with Zoom</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="zoom"
                    checked={integrationSettings.zoom}
                    onChange={handleIntegrationChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Google Meet</h3>
                  <p className="text-sm text-gray-500">Schedule interviews with Google Meet</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="googleMeet"
                    checked={integrationSettings.googleMeet}
                    onChange={handleIntegrationChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Applicant Tracking System</h3>
                  <p className="text-sm text-gray-500">Integrate with your ATS</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="applicantTrackingSystem"
                    checked={integrationSettings.applicantTrackingSystem}
                    onChange={handleIntegrationChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
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

export default EmployerSettings; 