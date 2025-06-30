import React, { useState } from 'react';

interface Plan {
  id: string;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  jobPosts: number;
  highlighted?: boolean;
  type: 'subscription' | 'per-job';
  category?: 'basic' | 'premium';
}

interface Subscription {
  id: string;
  planId: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'cancelled' | 'expired';
  amount: number;
  billingCycle: 'monthly' | 'yearly';
  autoRenew: boolean;
}

interface BillingHistory {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  invoiceNumber: string;
  description: string;
}

const Billing: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>('professional');
  const [activeTab, setActiveTab] = useState<'plans' | 'history' | 'settings'>('plans');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [selectedPlanDetails, setSelectedPlanDetails] = useState<Plan | null>(null);
  const [showPlanDetails, setShowPlanDetails] = useState(false);

  // Mock data for current subscription
  const currentSubscription: Subscription = {
    id: 'sub_123',
    planId: 'professional',
    startDate: '2024-03-01',
    endDate: '2024-04-01',
    status: 'active',
    amount: 99,
    billingCycle: 'monthly',
    autoRenew: true
  };

  // Mock data for billing history
  const billingHistory: BillingHistory[] = [
    {
      id: 'inv_001',
      date: '2024-03-01',
      amount: 99,
      status: 'paid',
      invoiceNumber: 'INV-2024-001',
      description: 'Professional Plan - Monthly'
    },
    {
      id: 'inv_002',
      date: '2024-02-01',
      amount: 99,
      status: 'paid',
      invoiceNumber: 'INV-2024-002',
      description: 'Professional Plan - Monthly'
    }
  ];

  const plans: Plan[] = [
    // Per-Job Posting Plans
    {
      id: 'single-basic',
      name: 'Single Job Post - Basic',
      price: 1999,
      billingCycle: 'monthly',
      features: [
        '30 days job listing',
        'Basic job visibility',
        'Standard application management',
        'Email support',
        'Basic candidate filtering'
      ],
      jobPosts: 1,
      type: 'per-job',
      category: 'basic'
    },
    {
      id: 'single-premium',
      name: 'Single Job Post - Premium',
      price: 3499,
      billingCycle: 'monthly',
      features: [
        '30 days job listing',
        'Featured job placement',
        'Priority in search results',
        'Advanced application management',
        'Priority support',
        'Advanced candidate filtering',
        'Company branding'
      ],
      jobPosts: 1,
      type: 'per-job',
      category: 'premium'
    },
    // Subscription Plans
    {
      id: 'basic',
      name: 'Basic',
      price: billingCycle === 'monthly' ? 3499 : 34990,
      billingCycle,
      features: [
        '5 job posts per month',
        'Basic analytics',
        'Email support',
        'Standard job visibility',
        'Basic candidate filtering'
      ],
      jobPosts: 5,
      type: 'subscription'
    },
    {
      id: 'professional',
      name: 'Professional',
      price: billingCycle === 'monthly' ? 6999 : 69990,
      billingCycle,
      features: [
        '15 job posts per month',
        'Advanced analytics',
        'Priority support',
        'Featured job listings',
        'Advanced candidate filtering',
        'Custom branding'
      ],
      jobPosts: 15,
      highlighted: true,
      type: 'subscription'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: billingCycle === 'monthly' ? 19999 : 199990,
      billingCycle,
      features: [
        'Unlimited job posts',
        'Premium analytics',
        '24/7 dedicated support',
        'Featured job listings',
        'Advanced candidate filtering',
        'Custom branding',
        'API access',
        'Custom integrations'
      ],
      jobPosts: -1,
      type: 'subscription'
    }
  ];

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleSubscribe = (planId: string) => {
    setShowPaymentModal(true);
  };

  const handleViewPlanDetails = (plan: Plan) => {
    setSelectedPlanDetails(plan);
    setShowPlanDetails(true);
  };

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method);
  };

  const handlePaymentSubmit = () => {
    // TODO: Implement payment processing
    console.log('Processing payment...');
    setShowPaymentModal(false);
  };

  const renderPlanDetails = () => {
    if (!selectedPlanDetails) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900">{selectedPlanDetails.name}</h3>
              <p className="mt-1 text-gray-600">
                {selectedPlanDetails.type === 'subscription' ? 'Subscription Plan' : 'Single Job Post'}
              </p>
            </div>
            <button
              onClick={() => setShowPlanDetails(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-4xl font-bold text-gray-900">₹{selectedPlanDetails.price}</span>
                  {selectedPlanDetails.type === 'subscription' && (
                    <span className="text-gray-500">/{selectedPlanDetails.billingCycle}</span>
                  )}
                </div>
                <button
                  onClick={() => handleSubscribe(selectedPlanDetails.id)}
                  className="px-6 py-3 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800"
                >
                  {selectedPlanDetails.type === 'subscription' ? 'Subscribe Now' : 'Post Job Now'}
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Features</h4>
              <ul className="space-y-4">
                {selectedPlanDetails.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {selectedPlanDetails.type === 'per-job' && (
              <div className="bg-blue-50 rounded-lg p-6">
                <h4 className="text-lg font-medium text-blue-900 mb-2">Single Job Post Details</h4>
                <p className="text-blue-700">
                  This plan allows you to post a single job for 30 days. Perfect for occasional hiring needs.
                  {selectedPlanDetails.category === 'premium' && ' Premium listing includes enhanced visibility and features.'}
                </p>
              </div>
            )}

            {selectedPlanDetails.type === 'subscription' && (
              <div className="bg-blue-50 rounded-lg p-6">
                <h4 className="text-lg font-medium text-blue-900 mb-2">Subscription Details</h4>
                <p className="text-blue-700">
                  This subscription plan includes {selectedPlanDetails.jobPosts === -1 ? 'unlimited' : selectedPlanDetails.jobPosts} job posts per month.
                  {selectedPlanDetails.billingCycle === 'yearly' && ' Save 20% with yearly billing.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderCurrentPlan = () => {
    const currentPlan = plans.find(plan => plan.id === currentSubscription.planId);
    if (!currentPlan) return null;

    return (
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Current Plan</h3>
            <p className="mt-1 text-gray-600">{currentPlan.name}</p>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            Active
          </span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Next Billing Date</p>
            <p className="mt-1 text-gray-900">{new Date(currentSubscription.endDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Amount</p>
            <p className="mt-1 text-gray-900">${currentSubscription.amount}/{currentSubscription.billingCycle}</p>
          </div>
        </div>
        <div className="mt-6">
          <button
            onClick={() => setActiveTab('settings')}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Manage Subscription →
          </button>
        </div>
      </div>
    );
  };

  const renderBillingHistory = () => (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900">Billing History</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {billingHistory.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(item.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === 'paid' ? 'bg-green-100 text-green-800' :
                    item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button
                    onClick={() => window.open(`/invoices/${item.invoiceNumber}`, '_blank')}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {item.invoiceNumber}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSubscriptionSettings = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Subscription Settings</h3>
      
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-gray-900">Billing Cycle</h4>
          <div className="mt-2">
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              value={currentSubscription.billingCycle}
              onChange={(e) => console.log('Change billing cycle')}
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly (Save 20%)</option>
            </select>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-900">Auto-Renewal</h4>
          <div className="mt-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-black"
                checked={currentSubscription.autoRenew}
                onChange={() => console.log('Toggle auto-renewal')}
              />
              <span className="ml-2 text-gray-700">Automatically renew my subscription</span>
            </label>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-900">Payment Method</h4>
          <div className="mt-2">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <p className="text-sm text-gray-600">•••• •••• •••• 4242</p>
                <p className="text-xs text-gray-500">Expires 12/24</p>
              </div>
              <button
                onClick={() => console.log('Update payment method')}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Update
              </button>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <button
            onClick={() => console.log('Cancel subscription')}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Cancel Subscription
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Billing & Subscription</h1>
        <p className="mt-2 text-gray-600">Manage your subscription and billing preferences</p>
      </div>

      {/* Current Plan Overview */}
      {renderCurrentPlan()}

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('plans')}
              className={`${
                activeTab === 'plans'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Available Plans
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`${
                activeTab === 'history'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Billing History
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`${
                activeTab === 'settings'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Settings
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'plans' && (
        <>
          {/* Single Job Post Plans Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Single Job Post Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {plans
                .filter(plan => plan.type === 'per-job')
                .map((plan) => (
                  <div
                    key={plan.id}
                    className={`bg-white rounded-xl shadow-sm p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${
                      plan.category === 'premium' ? 'ring-2 ring-black' : ''
                    }`}
                    onClick={() => handleViewPlanDetails(plan)}
                  >
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                      <div className="mt-4">
                        <span className="text-4xl font-bold text-gray-900">₹{plan.price}</span>
                        <span className="text-gray-500">/job post</span>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">30 days listing duration</p>
                    </div>

                    <div className="mt-6">
                      <ul className="space-y-4">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <svg
                              className="h-5 w-5 text-green-500 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span className="text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-8">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSubscribe(plan.id);
                        }}
                        className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                          plan.category === 'premium'
                            ? 'bg-black text-white hover:bg-gray-800'
                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        }`}
                      >
                        Post Job Now
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Subscription Plans Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Subscription Plans</h2>
            <div className="flex justify-center mb-8">
              <div className="bg-white p-1 rounded-lg shadow-sm inline-flex">
                <button
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    billingCycle === 'monthly'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                  onClick={() => setBillingCycle('monthly')}
                >
                  Monthly
                </button>
                <button
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    billingCycle === 'yearly'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                  onClick={() => setBillingCycle('yearly')}
                >
                  Yearly (Save 20%)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {plans
                .filter(plan => plan.type === 'subscription')
                .map((plan) => (
                  <div
                    key={plan.id}
                    className={`bg-white rounded-xl shadow-sm p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${
                      plan.highlighted ? 'ring-2 ring-black' : ''
                    }`}
                    onClick={() => handleViewPlanDetails(plan)}
                  >
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                      <div className="mt-4">
                        <span className="text-4xl font-bold text-gray-900">₹{plan.price}</span>
                        <span className="text-gray-500">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        {plan.jobPosts === -1 ? 'Unlimited' : `${plan.jobPosts} job posts`} per month
                      </p>
                    </div>

                    <div className="mt-6">
                      <ul className="space-y-4">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <svg
                              className="h-5 w-5 text-green-500 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span className="text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-8">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSubscribe(plan.id);
                        }}
                        className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                          plan.highlighted
                            ? 'bg-black text-white hover:bg-gray-800'
                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                        }`}
                      >
                        {selectedPlan === plan.id ? 'Current Plan' : 'Subscribe Now'}
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'history' && renderBillingHistory()}
      {activeTab === 'settings' && renderSubscriptionSettings()}

      {/* Plan Details Modal */}
      {showPlanDetails && renderPlanDetails()}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Complete Payment</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                <div className="mt-2 space-y-2">
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="payment-method"
                      value="card"
                      checked={selectedPaymentMethod === 'card'}
                      onChange={() => handlePaymentMethodSelect('card')}
                      className="h-4 w-4 text-black focus:ring-black"
                    />
                    <span className="text-sm text-gray-700">Credit Card</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="payment-method"
                      value="paypal"
                      checked={selectedPaymentMethod === 'paypal'}
                      onChange={() => handlePaymentMethodSelect('paypal')}
                      className="h-4 w-4 text-black focus:ring-black"
                    />
                    <span className="text-sm text-gray-700">PayPal</span>
                  </label>
                </div>
              </div>

              {selectedPaymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">CVC</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePaymentSubmit}
                  className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800"
                >
                  Complete Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Plan Section */}
      <div className="mt-12 max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-900">Need a Custom Plan?</h3>
            <p className="mt-2 text-gray-600">
              Contact us for a tailored solution that meets your specific requirements
            </p>
            <button
              onClick={() => window.location.href = 'mailto:sales@vibeZ.com'}
              className="mt-4 px-6 py-3 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors duration-200"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-12 max-w-7xl mx-auto">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h4 className="text-lg font-medium text-gray-900">Can I change plans later?</h4>
            <p className="mt-2 text-gray-600">
              Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h4 className="text-lg font-medium text-gray-900">What payment methods do you accept?</h4>
            <p className="mt-2 text-gray-600">
              We accept all major credit cards, PayPal, and bank transfers for enterprise plans.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h4 className="text-lg font-medium text-gray-900">Is there a free trial?</h4>
            <p className="mt-2 text-gray-600">
              Yes, we offer a 14-day free trial for all plans. No credit card required to start.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h4 className="text-lg font-medium text-gray-900">What happens if I exceed my job post limit?</h4>
            <p className="mt-2 text-gray-600">
              You'll be notified when you're close to your limit. You can upgrade your plan or wait for the next billing cycle.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing; 