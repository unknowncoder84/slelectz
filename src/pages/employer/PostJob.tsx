import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobs } from '../../contexts/JobsContext';
import { supabase } from '../../config/supabase';
import { AuthContext } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

interface JobFormData {
  // Step 1 fields
  jobTitle: string;
  jobTitleDescription: string;
  jobType: 'onsite' | 'remote' | 'hybrid';
  city: string;
  area: string;
  pincode: string;
  streetAddress: string;
  
  // Step 2 fields
  employmentTypes: string[];
  schedules: string[];
  customSchedule: string;
  hasPlannedStartDate: boolean;
  plannedStartDate: string;
  numberOfHires: string;
  customNumberOfHires: string;
  recruitmentTimeline: string;

  // Step 3 fields
  payType: 'range' | 'starting' | 'maximum' | 'exact';
  minAmount: string;
  maxAmount: string;
  amount: string;
  payRate: 'hour' | 'day' | 'week' | 'month' | 'year';
  supplementalPay: string[];
  customSupplementalPay: string;
  benefits: string[];
  customBenefit: string;

  // Step 4 fields
  minimumEducation: string;
  customEducation: string;
  languageRequirement: string;
  customLanguage: string;
  experienceType: 'any' | 'experienced' | 'fresher';
  minimumExperience: string;
  customExperience: string;
  selectedIndustries: string[];
  minAge: string;
  maxAge: string;
  gender: string;
  customGender: string;
  skills: string[];
  jobProfileDescription: string;
  notificationEmails: string[];
  sendIndividualEmails: boolean;
  requireResume: boolean;
  allowCandidateContact: boolean;
  hasApplicationDeadline: boolean;
  applicationDeadline: string;

  // Step 6 fields
  selectedPlan: 'basic' | 'standard' | 'premium' | null;
  couponCode: string;
  requireGstInvoice: boolean;
  saveCardForFuture: boolean;
  company?: string; // Optional company field
}

interface FormErrors {
  // Step 1 fields
  jobTitle?: string;
  jobTitleDescription?: string;
  city?: string;
  pincode?: string;
  
  // Step 2 fields
  employmentTypes?: string[];
  schedules?: string[];
  plannedStartDate?: string;
  numberOfHires?: string;
  customNumberOfHires?: string;
  recruitmentTimeline?: string;
  minimumEducation?: string;
  customEducation?: string;
  languageRequirement?: string;
  customLanguage?: string;
  minimumExperience?: string;
  customExperience?: string;
  customGender?: string;

  // Step 3 fields
  minAmount?: string;
  maxAmount?: string;
  amount?: string;

  // Step 4 fields
  jobProfileDescription?: string;
  notificationEmails?: string[];
  applicationDeadline?: string;

  // Step 5 fields (Review step - no specific error fields needed)
  
  // Step 6 fields
  selectedPlan?: string;
  couponCode?: string;
  requireGstInvoice?: string;
  saveCardForFuture?: string;
}

const EMPLOYMENT_TYPES = [
  'Full-time',
  'Permanent',
  'Fresher',
  'Part-time',
  'Internship',
  'Contractual/Temporary',
  'Freelance',
  'Volunteer'
];

const SCHEDULES = [
  'Day shift',
  'Morning shift',
  'Rotational shift',
  'Night shift',
  'Monday to Friday',
  'Evening shift',
  'Weekend availability',
  'Fixed shift',
  'US shift',
  'UK shift',
  'Weekend only',
  'Others'
];

const RECRUITMENT_TIMELINES = [
  '1 to 3 days',
  '3 to 7 days',
  '1 to 2 weeks',
  '2 to 4 weeks',
  'More than 4 weeks'
];

const SUPPLEMENTAL_PAY = [
  'Performance bonus',
  'Yearly bonus',
  'Commission pay',
  'Overtime pay',
  'Quarterly pay',
  'Shift allowance',
  'Joining bonus',
  'Other'
];

const BENEFITS = [
  'Health insurance',
  'Provident fund',
  'Cell phone reimbursement',
  'Paid sick time',
  'Work from home',
  'Paid time off',
  'Food provided',
  'Life insurance',
  'Internet reimbursement',
  'Commuter assistance',
  'Leave encashment',
  'Flexible schedule',
  'Pick up and drop',
  'One side pick up or drop',
  'Other'
];

const PAY_RATES = [
  { value: 'hour', label: 'Per hour' },
  { value: 'day', label: 'Per day' },
  { value: 'week', label: 'Per week' },
  { value: 'month', label: 'Per month' },
  { value: 'year', label: 'Per year' }
];

const EDUCATION_OPTIONS = [
  '10th or below',
  '12th Pass',
  'Diploma',
  'ITI',
  'Graduate',
  'Post Graduate',
  'PhD',
  'Other'
];

const LANGUAGE_OPTIONS = [
  'No English',
  'Basic English',
  'Good English',
  'Other'
];

const EXPERIENCE_OPTIONS = [
  '6 months',
  '1 year',
  '2 years',
  '3 years',
  '5 years',
  '10 years',
  'Other'
];

const INDUSTRY_OPTIONS = [
  'Any industry',
  'Accounting / Auditing / Taxation',
  'Agriculture / Forestry / Livestock / Fertilizers',
  'Airlines / Aviation / Aerospace',
  'Automobile / Auto-Components',
  'Banking, Financial Services & Insurance',
  'Beverage / Brewery / Distillery',
  'Chemical Manufacturing',
  'Consumer Goods & Retail',
  'Design',
  'Education',
  'Emerging Technologies',
  'Energy & Power',
  'Gold, Gems, Watches, Jewellery & Accessories',
  'Government / Public Administration',
  'HR, Recruitment & Staffing',
  'Hospitality, Travel & Tourism',
  'Hospitals, Health Care & Lifescience',
  'IT Services, Software, Internet & Computers',
  'Infrastructure & Transport',
  'Legal & Regulatory',
  'Logistics, Trade & Commerce',
  'Manufacturing & Production',
  'Media, Advertising, PR & Marketing',
  'Media, Film & Entertainment',
  'Metals & Mining',
  'NGO / Social Services / Industry Associations',
  'Outsourcing - BPO/BPM',
  'Professional Services & Consulting',
  'Real Estate & Facility Management',
  'Textile, Handicraft & Fashion'
];

const PostJob: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showIndustryModal, setShowIndustryModal] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [formData, setFormData] = useState<JobFormData>({
    // Step 1 fields
    jobTitle: '',
    jobTitleDescription: '',
    jobType: 'onsite',
    city: '',
    area: '',
    pincode: '',
    streetAddress: '',
    
    // Step 2 fields
    employmentTypes: [],
    schedules: [],
    customSchedule: '',
    hasPlannedStartDate: false,
    plannedStartDate: '',
    numberOfHires: '1',
    customNumberOfHires: '',
    recruitmentTimeline: '',

    // Step 3 fields
    payType: 'range',
    minAmount: '',
    maxAmount: '',
    amount: '',
    payRate: 'month',
    supplementalPay: [],
    customSupplementalPay: '',
    benefits: [],
    customBenefit: '',

    // Step 4 fields
    minimumEducation: '',
    customEducation: '',
    languageRequirement: '',
    customLanguage: '',
    experienceType: 'any',
    minimumExperience: '',
    customExperience: '',
    selectedIndustries: [],
    minAge: '',
    maxAge: '',
    gender: 'both',
    customGender: '',
    skills: [],
    jobProfileDescription: '',
    notificationEmails: [''],
    sendIndividualEmails: false,
    requireResume: false,
    allowCandidateContact: false,
    hasApplicationDeadline: false,
    applicationDeadline: '',

    // Step 6 fields
    selectedPlan: null,
    couponCode: '',
    requireGstInvoice: false,
    saveCardForFuture: false
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const [additionalReqOpen, setAdditionalReqOpen] = useState({
    industry: false,
    age: false,
    gender: false,
    skills: false,
  });

  useEffect(() => {
    const checkCompanyProfile = async () => {
      if (!user) {
        navigate('/login');
        return;
      }
      // Check if user has a company profile
      const { data, error } = await supabase
        .from('companies')
        .select('id')
        .eq('auth_id', user.id)
        .maybeSingle();
      if (error || !data) {
        toast('Please complete your company profile to post a job.');
        navigate('/employer/company-details');
        return;
      }
    };
    checkCompanyProfile();
  }, [user, navigate]);

  const handleToggleAdditionalReq = (key: keyof typeof additionalReqOpen) => {
    setAdditionalReqOpen((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required';
    }
    if (!formData.jobTitleDescription.trim()) {
      newErrors.jobTitleDescription = 'Job title description is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (formData.employmentTypes.length === 0) {
      newErrors.employmentTypes = ['Select at least one employment type'];
    }
    if (formData.schedules.length === 0) {
      newErrors.schedules = ['Select at least one schedule'];
    }
    if (formData.hasPlannedStartDate && !formData.plannedStartDate) {
      newErrors.plannedStartDate = 'Select a start date';
    }
    if (!formData.numberOfHires) {
      newErrors.numberOfHires = 'Select number of hires';
    }
    if (formData.numberOfHires === 'custom' && !formData.customNumberOfHires) {
      newErrors.customNumberOfHires = 'Enter number of hires';
    }
    if (!formData.recruitmentTimeline) {
      newErrors.recruitmentTimeline = 'Select recruitment timeline';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (formData.payType === 'range') {
      if (!formData.minAmount) {
        newErrors.minAmount = 'Enter minimum amount';
      }
      if (!formData.maxAmount) {
        newErrors.maxAmount = 'Enter maximum amount';
      }
    } else {
      if (!formData.amount) {
        newErrors.amount = 'Enter amount';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep4 = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;
    
    if (!formData.minimumEducation) {
      newErrors.minimumEducation = 'Minimum education is required';
      isValid = false;
    }
    if (formData.minimumEducation === 'Other' && !formData.customEducation) {
      newErrors.customEducation = 'Please specify education';
      isValid = false;
    }
    if (!formData.languageRequirement) {
      newErrors.languageRequirement = 'Language requirement is required';
      isValid = false;
    }
    if (formData.languageRequirement === 'Other' && !formData.customLanguage) {
      newErrors.customLanguage = 'Please specify language';
      isValid = false;
    }
    if ((formData.experienceType === 'any' || formData.experienceType === 'experienced') && !formData.minimumExperience) {
      newErrors.minimumExperience = 'Minimum experience is required';
      isValid = false;
    }
    if (formData.minimumExperience === 'Other' && !formData.customExperience) {
      newErrors.customExperience = 'Please specify experience';
      isValid = false;
    }
    if (formData.gender === 'others' && !formData.customGender) {
      newErrors.customGender = 'Please specify gender';
      isValid = false;
    }
    if (!formData.jobProfileDescription.trim()) {
      newErrors.jobProfileDescription = 'Job profile description is required';
      isValid = false;
    } else if (formData.jobProfileDescription.length < 30) {
      newErrors.jobProfileDescription = 'Job profile description must be at least 30 characters';
      isValid = false;
    }

    // Validate at least one email is provided and is valid
    const hasValidEmail = formData.notificationEmails.some(email => 
      email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    );
    if (!hasValidEmail) {
      newErrors.notificationEmails = ['At least one valid email is required'];
      isValid = false;
    }

    if (formData.hasApplicationDeadline && !formData.applicationDeadline) {
      newErrors.applicationDeadline = 'Select application deadline';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateStep5 = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Step 5 is a review step, so we validate all previous steps
    if (!validateStep1() || !validateStep2() || !validateStep3() || !validateStep4()) {
      return false;
    }

    setErrors(newErrors);
    return true;
  };

  const validateStep6 = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.selectedPlan) {
      newErrors.selectedPlan = 'Please select a plan';
    }

    // Validate coupon code if provided
    if (formData.couponCode && !/^[A-Z0-9]+$/.test(formData.couponCode)) {
      newErrors.couponCode = 'Invalid coupon code format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let canProceed = false;
    
    switch (currentStep) {
      case 1:
        canProceed = validateStep1();
        if (canProceed) {
          setCurrentStep(2);
        }
        break;
      case 2:
        canProceed = validateStep2();
        if (canProceed) {
          setCurrentStep(3);
        }
        break;
      case 3:
        canProceed = validateStep3();
        if (canProceed) {
          setCurrentStep(4);
        }
        break;
      case 4:
        canProceed = validateStep4();
        if (canProceed) {
          setCurrentStep(5);
        }
        break;
      case 5:
        canProceed = validateStep5();
        if (canProceed) {
          setCurrentStep(6);
        }
        break;
      case 6:
        canProceed = validateStep6();
        if (canProceed) {
          console.log('Form submitted:', formData);
          navigate('/employer');
        }
        break;
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleNext();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    const errorKey = name as keyof FormErrors;
    if (errorKey in errors) {
      setErrors((prev) => ({
        ...prev,
        [errorKey]: undefined,
      }));
    }
  };

  const handleMultiSelect = (field: 'employmentTypes' | 'schedules' | 'supplementalPay' | 'benefits', value: string) => {
    setFormData((prev) => {
      const currentValues = prev[field];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      
      return {
        ...prev,
        [field]: newValues,
      };
    });
  };

  const handleAddEmail = () => {
    setFormData(prev => ({
      ...prev,
      notificationEmails: [...prev.notificationEmails, '']
    }));
  };

  const handleEmailChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      notificationEmails: prev.notificationEmails.map((email, i) => 
        i === index ? value : email
      )
    }));
  };

  const handleRemoveEmail = (index: number) => {
    setFormData(prev => ({
      ...prev,
      notificationEmails: prev.notificationEmails.filter((_, i) => i !== index)
    }));
  };

  const handleCancel = () => {
    setShowCancelDialog(true);
  };

  const handleSaveDraft = () => {
    // TODO: Implement draft saving logic
    localStorage.setItem('jobPostDraft', JSON.stringify(formData));
    navigate('/employer');
  };

  const handleDiscard = () => {
    localStorage.removeItem('jobPostDraft');
    navigate('/employer');
  };

  const handleSkillInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!formData.skills.includes(skillInput.trim())) {
        setFormData(prev => ({
          ...prev,
          skills: [...prev.skills, skillInput.trim()]
        }));
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleEditStep = (step: number) => {
    setCurrentStep(step);
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!user) throw new Error("User not authenticated");

      // 1. Fetch the employer's company ID
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('id')
        .eq('auth_id', user.id)
        .single();

      if (companyError || !companyData) {
        throw new Error("Could not find the employer's company. Please create a company profile first.");
      }

      // 2. Construct the job object for the database
      const jobPayload = {
        company_id: companyData.id,
        title: formData.jobTitle,
        description: formData.jobTitleDescription,
        job_type: formData.jobType,
        location: {
          city: formData.city,
          area: formData.area,
          pincode: formData.pincode,
          streetAddress: formData.streetAddress
        },
        employment_types: formData.employmentTypes,
        schedules: formData.schedules,
        custom_schedule: formData.customSchedule,
        planned_start_date: formData.hasPlannedStartDate ? formData.plannedStartDate : null,
        number_of_hires: formData.numberOfHires === 'custom' ? formData.customNumberOfHires : formData.numberOfHires,
        recruitment_timeline: formData.recruitmentTimeline,
        pay_type: formData.payType,
        min_amount: formData.minAmount ? parseFloat(formData.minAmount) : null,
        max_amount: formData.maxAmount ? parseFloat(formData.maxAmount) : null,
        amount: formData.amount ? parseFloat(formData.amount) : null,
        pay_rate: formData.payRate,
        supplemental_pay: formData.supplementalPay,
        custom_supplemental_pay: formData.customSupplementalPay,
        benefits: formData.benefits,
        custom_benefit: formData.customBenefit,
        minimum_education: formData.minimumEducation === 'Other' ? formData.customEducation : formData.minimumEducation,
        language_requirement: formData.languageRequirement === 'Other' ? formData.customLanguage : formData.languageRequirement,
        experience_type: formData.experienceType,
        minimum_experience: formData.experienceType === 'experienced' 
          ? (formData.minimumExperience === 'Other' ? formData.customExperience : formData.minimumExperience) 
          : '0',
        industries: formData.selectedIndustries,
        min_age: formData.minAge ? parseInt(formData.minAge) : null,
        max_age: formData.maxAge ? parseInt(formData.maxAge) : null,
        gender: formData.gender === 'Other' ? formData.customGender : formData.gender,
        skills: formData.skills,
        job_profile_description: formData.jobProfileDescription,
        notification_emails: formData.notificationEmails,
        send_individual_emails: formData.sendIndividualEmails,
        require_resume: formData.requireResume,
        allow_candidate_contact: formData.allowCandidateContact,
        application_deadline: formData.hasApplicationDeadline ? formData.applicationDeadline : null,
        status: 'active', // Default status
      };

      // 3. Insert the job into the database
      const { error: insertError } = await supabase.from('jobs').insert(jobPayload);

      if (insertError) {
        console.error('Error inserting job:', insertError);
        throw new Error(`Database error: ${insertError.message}`);
      }
      
      // 4. Success and redirect
      toast('Job posted successfully!'); // Replace with a more elegant notification if possible
      navigate('/employer/posted-jobs');

    } catch (err: any) {
      console.error('Final submission error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderCancelDialog = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <h3 className="text-xl font-semibold text-[#1d1d1f] mb-4">Save as Draft?</h3>
        <p className="text-gray-600 mb-6">
          Would you like to save your progress as a draft? You can continue filling this form later.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleDiscard}
            className="px-6 py-2 rounded-full text-sm font-medium text-[#1d1d1f] hover:bg-gray-100 transition-all duration-200"
          >
            Discard
          </button>
          <button
            onClick={handleSaveDraft}
            className="px-6 py-2 rounded-full text-sm font-medium text-white bg-[#000000] hover:bg-[#1d1d1f] active:bg-[#2d2d2f] transition-all duration-200"
          >
            Save Draft
          </button>
        </div>
      </div>
    </div>
  );

  const renderIndustryModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-[#1d1d1f]">Select Industries</h3>
          <button
            onClick={() => setShowIndustryModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {INDUSTRY_OPTIONS.map((industry) => (
              <label
                key={industry}
                className={`relative flex items-center px-4 py-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                  formData.selectedIndustries.includes(industry)
                    ? 'border-[#000000] bg-[#000000]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.selectedIndustries.includes(industry)}
                  onChange={() => {
                    setFormData(prev => ({
                      ...prev,
                      selectedIndustries: prev.selectedIndustries.includes(industry)
                        ? prev.selectedIndustries.filter(i => i !== industry)
                        : [...prev.selectedIndustries, industry]
                    }));
                  }}
                  className="sr-only"
                />
                <span className="text-sm font-medium">{industry}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setShowIndustryModal(false)}
            className="px-6 py-2 rounded-full text-sm font-medium text-white bg-[#000000] hover:bg-[#1d1d1f] active:bg-[#2d2d2f] transition-all duration-200"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-[#1d1d1f] mb-2">Basic Information</h2>
        <p className="text-gray-500">Let's start with the essential details about your job posting.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
            Job Title *
          </label>
          <input
            type="text"
            id="jobTitle"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleInputChange}
            className="block w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:border-[#000000] focus:ring-[#000000] text-base transition-colors duration-200 bg-white hover:border-gray-400"
            placeholder="e.g., Senior Software Engineer"
          />
          {errors.jobTitle && (
            <p className="mt-1 text-sm text-red-600">{errors.jobTitle}</p>
          )}
        </div>

        <div>
          <label htmlFor="jobTitleDescription" className="block text-sm font-medium text-gray-700 mb-1">
            Brief Description *
          </label>
          <textarea
            id="jobTitleDescription"
            name="jobTitleDescription"
            value={formData.jobTitleDescription}
            onChange={handleInputChange}
            rows={3}
            className="block w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:border-[#000000] focus:ring-[#000000] text-base transition-colors duration-200 bg-white hover:border-gray-400"
            placeholder="A brief description of the job role..."
          />
          {errors.jobTitleDescription && (
            <p className="mt-1 text-sm text-red-600">{errors.jobTitleDescription}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Work Location *</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
                className="block w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:border-[#000000] focus:ring-[#000000] text-base transition-colors duration-200 bg-white hover:border-gray-400"
                placeholder="City"
            />
            {errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              id="area"
              name="area"
              value={formData.area}
              onChange={handleInputChange}
                className="block w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:border-[#000000] focus:ring-[#000000] text-base transition-colors duration-200 bg-white hover:border-gray-400"
                placeholder="Area/Locality"
            />
            </div>
          </div>
          </div>

          <div>
          <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
            Pincode *
            </label>
            <input
              type="text"
              id="pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleInputChange}
            className="block w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:border-[#000000] focus:ring-[#000000] text-base transition-colors duration-200 bg-white hover:border-gray-400"
            placeholder="Enter pincode"
            />
            {errors.pincode && (
            <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>
            )}
          </div>

          <div>
          <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700 mb-1">
              Street Address
            </label>
            <input
              type="text"
              id="streetAddress"
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleInputChange}
            className="block w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:border-[#000000] focus:ring-[#000000] text-base transition-colors duration-200 bg-white hover:border-gray-400"
              placeholder="Enter street address"
            />
      </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Work Type *</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['onsite', 'remote', 'hybrid'].map((type) => (
        <button
                key={type}
          type="button"
                onClick={() => setFormData(prev => ({ ...prev, jobType: type as 'onsite' | 'remote' | 'hybrid' }))}
                className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                  formData.jobType === type
                    ? 'border-[#000000] bg-gradient-to-r from-[#000000] to-[#1d1d1f] text-white shadow-sm'
                    : 'border-gray-300 text-gray-700 hover:border-[#000000] hover:bg-gray-50'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
        </button>
            ))}
      </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#1d1d1f]">Add Job Details</h1>
        <p className="mt-2 text-gray-600">Specify employment type, schedule, and other details</p>
      </div>

      <div className="space-y-8">
        {/* Minimum Education */}
        <div>
          <label htmlFor="minimumEducation" className="block text-sm font-medium text-[#1d1d1f] mb-2">
            Minimum Education *
          </label>
          <select
            id="minimumEducation"
            name="minimumEducation"
            value={formData.minimumEducation}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.minimumEducation ? 'border-[#ff2d55]' : 'border-gray-200'
            } focus:outline-none focus:ring-2 focus:ring-[#000000] focus:border-transparent transition-all duration-200`}
          >
            <option value="">Select minimum education</option>
            {EDUCATION_OPTIONS.map((education) => (
              <option key={education} value={education}>
                {education}
              </option>
            ))}
          </select>
          {formData.minimumEducation === 'Other' && (
            <div className="mt-4">
              <input
                type="text"
                name="customEducation"
                value={formData.customEducation}
                onChange={handleInputChange}
                placeholder="Specify education"
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.customEducation ? 'border-[#ff2d55]' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-[#000000] focus:border-transparent transition-all duration-200`}
              />
              {errors.customEducation && (
                <p className="mt-1 text-sm text-[#ff2d55]">{errors.customEducation}</p>
              )}
            </div>
          )}
          {errors.minimumEducation && (
            <p className="mt-1 text-sm text-[#ff2d55]">{errors.minimumEducation}</p>
          )}
        </div>

        {/* Language Requirement */}
        <div>
          <label className="block text-sm font-medium text-[#1d1d1f] mb-4">
            Language Required *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {LANGUAGE_OPTIONS.map((language) => (
              <label
                key={language}
                className={`relative flex items-center justify-center px-4 py-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                  formData.languageRequirement === language
                    ? 'border-[#000000] bg-[#000000]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="languageRequirement"
                  value={language}
                  checked={formData.languageRequirement === language}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <span className="text-sm font-medium">{language}</span>
              </label>
            ))}
          </div>
          {formData.languageRequirement === 'Other' && (
            <div className="mt-4">
              <input
                type="text"
                name="customLanguage"
                value={formData.customLanguage}
                onChange={handleInputChange}
                placeholder="Specify language"
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.customLanguage ? 'border-[#ff2d55]' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-[#000000] focus:border-transparent transition-all duration-200`}
              />
              {errors.customLanguage && (
                <p className="mt-1 text-sm text-[#ff2d55]">{errors.customLanguage}</p>
              )}
            </div>
          )}
          {errors.languageRequirement && (
            <p className="mt-2 text-sm text-[#ff2d55]">{errors.languageRequirement}</p>
          )}
        </div>

        {/* Total Experience Required */}
        <div>
          <label className="block text-sm font-medium text-[#1d1d1f] mb-4">
            Total Experience Required *
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'any', label: 'Any' },
              { value: 'experienced', label: 'Experienced Only' },
              { value: 'fresher', label: 'Fresher Only' }
            ].map((type) => (
              <label
                key={type.value}
                className={`relative flex items-center justify-center px-4 py-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                  formData.experienceType === type.value
                    ? 'border-[#000000] bg-[#000000]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="experienceType"
                  value={type.value}
                  checked={formData.experienceType === type.value}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <span className="text-sm font-medium">{type.label}</span>
              </label>
            ))}
          </div>
          {(formData.experienceType === 'any' || formData.experienceType === 'experienced') && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                Minimum Experience
              </label>
              <select
                name="minimumExperience"
                value={formData.minimumExperience}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.minimumExperience ? 'border-[#ff2d55]' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-[#000000] focus:border-transparent transition-all duration-200`}
              >
                <option value="">Select minimum experience</option>
                {EXPERIENCE_OPTIONS.map((experience) => (
                  <option key={experience} value={experience}>
                    {experience}
                  </option>
                ))}
              </select>
              {formData.minimumExperience === 'Other' && (
                <div className="mt-4">
                  <input
                    type="text"
                    name="customExperience"
                    value={formData.customExperience}
                    onChange={handleInputChange}
                    placeholder="Specify experience"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.customExperience ? 'border-[#ff2d55]' : 'border-gray-200'
                    } focus:outline-none focus:ring-2 focus:ring-[#000000] focus:border-transparent transition-all duration-200`}
                  />
                  {errors.customExperience && (
                    <p className="mt-1 text-sm text-[#ff2d55]">{errors.customExperience}</p>
                  )}
                </div>
              )}
              {errors.minimumExperience && (
                <p className="mt-1 text-sm text-[#ff2d55]">{errors.minimumExperience}</p>
              )}
            </div>
          )}
        </div>

        {/* Additional Requirements */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-[#1d1d1f]">Additional Requirements (Optional)</h3>
          <div className="flex justify-between gap-2">
            {[
              { key: 'industry', label: 'Industry' },
              { key: 'age', label: 'Age' },
              { key: 'gender', label: 'Gender' },
              { key: 'skills', label: 'Skills' },
            ].map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => handleToggleAdditionalReq(key as keyof typeof additionalReqOpen)}
                className={`flex-1 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                  additionalReqOpen[key as keyof typeof additionalReqOpen]
                    ? 'border-[#000000] bg-[#000000]/5 text-[#000000]'
                    : 'border-gray-200 hover:border-gray-300 text-[#1d1d1f]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {/* Conditional Sections */}
          <div className="space-y-6">
            {/* Industry Section */}
            <div
              className={`transition-all duration-300 overflow-hidden ${
                additionalReqOpen.industry ? 'max-h-[200px] opacity-100 mt-4' : 'max-h-0 opacity-0'
              }`}
            >
              {additionalReqOpen.industry && (
                <>
                  <button
                    type="button"
                    onClick={() => setShowIndustryModal(true)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 hover:border-gray-300 text-left text-sm font-medium text-[#1d1d1f] transition-all duration-200"
                  >
                    {formData.selectedIndustries.length > 0
                      ? `${formData.selectedIndustries.length} industries selected`
                      : 'Select Industry Experience'}
                  </button>
                  {showIndustryModal && renderIndustryModal()}
                </>
              )}
            </div>
            {/* Age Section */}
            <div
              className={`transition-all duration-300 overflow-hidden ${
                additionalReqOpen.age ? 'max-h-[200px] opacity-100 mt-4' : 'max-h-0 opacity-0'
              }`}
            >
              {additionalReqOpen.age && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                      Minimum Age
                    </label>
                    <input
                      type="number"
                      name="minAge"
                      value={formData.minAge}
                      onChange={handleInputChange}
                      placeholder="Min age"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#000000] focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                      Maximum Age
                    </label>
                    <input
                      type="number"
                      name="maxAge"
                      value={formData.maxAge}
                      onChange={handleInputChange}
                      placeholder="Max age"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#000000] focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
              )}
            </div>
            {/* Gender Section */}
            <div
              className={`transition-all duration-300 overflow-hidden ${
                additionalReqOpen.gender ? 'max-h-[200px] opacity-100 mt-4' : 'max-h-0 opacity-0'
              }`}
            >
              {additionalReqOpen.gender && (
                <div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['Both', 'Male', 'Female', 'Others'].map((gender) => (
                      <label
                        key={gender}
                        className={`relative flex items-center justify-center px-4 py-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                          formData.gender === gender.toLowerCase()
                            ? 'border-[#000000] bg-[#000000]/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="gender"
                          value={gender.toLowerCase()}
                          checked={formData.gender === gender.toLowerCase()}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <span className="text-sm font-medium">{gender}</span>
                      </label>
                    ))}
                  </div>
                  {formData.gender === 'others' && (
                    <div className="mt-4">
                      <input
                        type="text"
                        name="customGender"
                        value={formData.customGender}
                        onChange={handleInputChange}
                        placeholder="Specify gender"
                        className={`w-full px-4 py-3 rounded-xl border ${
                          errors.customGender ? 'border-[#ff2d55]' : 'border-gray-200'
                        } focus:outline-none focus:ring-2 focus:ring-[#000000] focus:border-transparent transition-all duration-200`}
                      />
                      {errors.customGender && (
                        <p className="mt-1 text-sm text-[#ff2d55]">{errors.customGender}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* Skills Section */}
            <div
              className={`transition-all duration-300 overflow-hidden ${
                additionalReqOpen.skills ? 'max-h-[200px] opacity-100 mt-4' : 'max-h-0 opacity-0'
              }`}
            >
              {additionalReqOpen.skills && (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleSkillInputKeyDown}
                    placeholder="Type a skill and press Enter"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#000000] focus:border-transparent transition-all duration-200"
                  />
                  {formData.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#000000]/5 text-[#1d1d1f]"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="ml-2 text-gray-500 hover:text-gray-700"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Employment Types */}
        <div>
          <label className="block text-sm font-medium text-[#1d1d1f] mb-4">
            Employment Type
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {EMPLOYMENT_TYPES.map((type) => (
              <label
                key={type}
                className={`relative flex items-center justify-center px-4 py-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                  formData.employmentTypes.includes(type)
                    ? 'border-[#000000] bg-[#000000]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.employmentTypes.includes(type)}
                  onChange={() => handleMultiSelect('employmentTypes', type)}
                  className="sr-only"
                />
                <span className="text-sm font-medium">{type}</span>
              </label>
            ))}
          </div>
          {errors.employmentTypes && (
            <p className="mt-2 text-sm text-[#ff2d55]">{errors.employmentTypes[0]}</p>
          )}
        </div>

        {/* Schedules */}
        <div>
          <label className="block text-sm font-medium text-[#1d1d1f] mb-4">
            Schedule
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {SCHEDULES.map((schedule) => (
              <label
                key={schedule}
                className={`relative flex items-center justify-center px-4 py-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                  formData.schedules.includes(schedule)
                    ? 'border-[#000000] bg-[#000000]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.schedules.includes(schedule)}
                  onChange={() => handleMultiSelect('schedules', schedule)}
                  className="sr-only"
                />
                <span className="text-sm font-medium">{schedule}</span>
              </label>
            ))}
          </div>
          {formData.schedules.includes('Others') && (
            <div className="mt-4">
              <input
                type="text"
                name="customSchedule"
                value={formData.customSchedule}
                onChange={handleInputChange}
                placeholder="Enter custom schedule"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#000000] focus:border-transparent transition-all duration-200"
              />
            </div>
          )}
          {errors.schedules && (
            <p className="mt-2 text-sm text-[#ff2d55]">{errors.schedules[0]}</p>
          )}
        </div>

        {/* Planned Start Date */}
        <div>
          <label className="block text-sm font-medium text-[#1d1d1f] mb-4">
            Planned Start Date for this Role
          </label>
          <div className="space-y-4">
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="hasPlannedStartDate"
                  checked={formData.hasPlannedStartDate}
                  onChange={() => setFormData(prev => ({ ...prev, hasPlannedStartDate: true }))}
                  className="h-4 w-4 text-[#000000] focus:ring-[#000000] border-gray-300"
                />
                <span className="ml-2 text-sm text-[#1d1d1f]">Yes</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="hasPlannedStartDate"
                  checked={!formData.hasPlannedStartDate}
                  onChange={() => setFormData(prev => ({ ...prev, hasPlannedStartDate: false }))}
                  className="h-4 w-4 text-[#000000] focus:ring-[#000000] border-gray-300"
                />
                <span className="ml-2 text-sm text-[#1d1d1f]">No</span>
              </label>
            </div>
            {formData.hasPlannedStartDate && (
              <input
                type="date"
                name="plannedStartDate"
                value={formData.plannedStartDate}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.plannedStartDate ? 'border-[#ff2d55]' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-[#000000] focus:border-transparent transition-all duration-200`}
              />
            )}
            {errors.plannedStartDate && (
              <p className="mt-1 text-sm text-[#ff2d55]">{errors.plannedStartDate}</p>
            )}
          </div>
        </div>

        {/* Number of People to Hire */}
        <div>
          <label htmlFor="numberOfHires" className="block text-sm font-medium text-[#1d1d1f] mb-2">
            Number of People to Hire
          </label>
          <select
            id="numberOfHires"
            name="numberOfHires"
            value={formData.numberOfHires}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.numberOfHires ? 'border-[#ff2d55]' : 'border-gray-200'
            } focus:outline-none focus:ring-2 focus:ring-[#000000] focus:border-transparent transition-all duration-200`}
          >
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={String(i + 1)}>
                {i + 1}
              </option>
            ))}
            <option value="10+">10+</option>
            <option value="custom">Custom</option>
          </select>
          {formData.numberOfHires === 'custom' && (
            <div className="mt-4">
              <input
                type="number"
                name="customNumberOfHires"
                value={formData.customNumberOfHires}
                onChange={handleInputChange}
                placeholder="Enter number of hires"
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.customNumberOfHires ? 'border-[#ff2d55]' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-[#000000] focus:border-transparent transition-all duration-200`}
              />
              {errors.customNumberOfHires && (
                <p className="mt-1 text-sm text-[#ff2d55]">{errors.customNumberOfHires}</p>
              )}
            </div>
          )}
          {errors.numberOfHires && (
            <p className="mt-1 text-sm text-[#ff2d55]">{errors.numberOfHires}</p>
          )}
        </div>

        {/* Timeline to Recruit */}
        <div>
          <label htmlFor="recruitmentTimeline" className="block text-sm font-medium text-[#1d1d1f] mb-2">
            Timeline to Recruit for This Role
          </label>
          <select
            id="recruitmentTimeline"
            name="recruitmentTimeline"
            value={formData.recruitmentTimeline}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.recruitmentTimeline ? 'border-[#ff2d55]' : 'border-gray-200'
            } focus:outline-none focus:ring-2 focus:ring-[#000000] focus:border-transparent transition-all duration-200`}
          >
            <option value="">Select timeline</option>
            {RECRUITMENT_TIMELINES.map((timeline) => (
              <option key={timeline} value={timeline}>
                {timeline}
              </option>
            ))}
          </select>
          {errors.recruitmentTimeline && (
            <p className="mt-1 text-sm text-[#ff2d55]">{errors.recruitmentTimeline}</p>
          )}
        </div>
      </div>
    </>
  );

  const renderStep3 = () => (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#1d1d1f]">Add Pay & Benefits</h1>
        <p className="mt-2 text-gray-600">Specify compensation and benefits for the role</p>
      </div>

      <div className="space-y-8">
        {/* Pay Section */}
        <div>
          <label className="block text-sm font-medium text-[#1d1d1f] mb-4">
            How Much Pay
          </label>
          <div className="space-y-6">
            {/* Pay Type Selection */}
            <div>
              <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                Show Pay by
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { value: 'range', label: 'Range' },
                  { value: 'starting', label: 'Starting amount' },
                  { value: 'maximum', label: 'Maximum amount' },
                  { value: 'exact', label: 'Exact amount' }
                ].map((type) => (
                  <label
                    key={type.value}
                    className={`relative flex items-center justify-center px-4 py-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                      formData.payType === type.value
                        ? 'border-[#000000] bg-[#000000]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payType"
                      value={type.value}
                      checked={formData.payType === type.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Amount Input(s) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.payType === 'range' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                      Minimum Amount
                    </label>
                    <input
                      type="number"
                      name="minAmount"
                      value={formData.minAmount}
                      onChange={handleInputChange}
                      placeholder="Enter minimum amount"
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.minAmount ? 'border-[#ff2d55]' : 'border-gray-200'
                      } focus:outline-none focus:ring-2 focus:ring-[#000000] focus:border-transparent transition-all duration-200`}
                    />
                    {errors.minAmount && (
                      <p className="mt-1 text-sm text-[#ff2d55]">{errors.minAmount}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                      Maximum Amount
                    </label>
                    <input
                      type="number"
                      name="maxAmount"
                      value={formData.maxAmount}
                      onChange={handleInputChange}
                      placeholder="Enter maximum amount"
                      className={`w-full px-4 py-3 rounded-xl border ${
                        errors.maxAmount ? 'border-[#ff2d55]' : 'border-gray-200'
                      } focus:outline-none focus:ring-2 focus:ring-[#000000] focus:border-transparent transition-all duration-200`}
                    />
                    {errors.maxAmount && (
                      <p className="mt-1 text-sm text-[#ff2d55]">{errors.maxAmount}</p>
                    )}
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="Enter amount"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.amount ? 'border-[#ff2d55]' : 'border-gray-200'
                    } focus:outline-none focus:ring-2 focus:ring-[#000000] focus:border-transparent transition-all duration-200`}
                  />
                  {errors.amount && (
                    <p className="mt-1 text-sm text-[#ff2d55]">{errors.amount}</p>
                  )}
                </div>
              )}
            </div>

            {/* Pay Rate */}
            <div>
              <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
                Rate
              </label>
              <select
                name="payRate"
                value={formData.payRate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#000000] focus:border-transparent transition-all duration-200"
              >
                {PAY_RATES.map((rate) => (
                  <option key={rate.value} value={rate.value}>
                    {rate.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Supplemental Pay */}
        <div>
          <label className="block text-sm font-medium text-[#1d1d1f] mb-4">
            Supplemental Pay
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {SUPPLEMENTAL_PAY.map((pay) => (
              <label
                key={pay}
                className={`relative flex items-center justify-center px-4 py-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                  formData.supplementalPay.includes(pay)
                    ? 'border-[#000000] bg-[#000000]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.supplementalPay.includes(pay)}
                  onChange={() => handleMultiSelect('supplementalPay', pay)}
                  className="sr-only"
                />
                <span className="text-sm font-medium">{pay}</span>
              </label>
            ))}
          </div>
          {formData.supplementalPay.includes('Other') && (
            <div className="mt-4">
              <input
                type="text"
                name="customSupplementalPay"
                value={formData.customSupplementalPay}
                onChange={handleInputChange}
                placeholder="Enter custom supplemental pay"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#000000] focus:border-transparent transition-all duration-200"
              />
            </div>
          )}
        </div>

        {/* Benefits */}
        <div>
          <label className="block text-sm font-medium text-[#1d1d1f] mb-4">
            Benefits
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {BENEFITS.map((benefit) => (
              <label
                key={benefit}
                className={`relative flex items-center justify-center px-4 py-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                  formData.benefits.includes(benefit)
                    ? 'border-[#000000] bg-[#000000]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.benefits.includes(benefit)}
                  onChange={() => handleMultiSelect('benefits', benefit)}
                  className="sr-only"
                />
                <span className="text-sm font-medium">{benefit}</span>
              </label>
            ))}
          </div>
          {formData.benefits.includes('Other') && (
            <div className="mt-4">
              <input
                type="text"
                name="customBenefit"
                value={formData.customBenefit}
                onChange={handleInputChange}
                placeholder="Enter custom benefit"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#000000] focus:border-transparent transition-all duration-200"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );

  const renderStep4 = () => (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#1d1d1f]">Job Description & Preferences</h1>
        <p className="mt-2 text-gray-600">Provide detailed job profile description and set application preferences</p>
      </div>

      <div className="space-y-8">
        {/* Job Profile Description */}
        <div>
          <label htmlFor="jobProfileDescription" className="block text-sm font-medium text-[#1d1d1f] mb-2">
            Detailed Job Profile Description
          </label>
          <textarea
            id="jobProfileDescription"
            name="jobProfileDescription"
            value={formData.jobProfileDescription}
            onChange={handleInputChange}
            rows={12}
            placeholder="Provide a comprehensive description of the job profile, including:
• Detailed responsibilities and duties
• Required qualifications and experience
• Skills and competencies needed
• Work environment and culture
• Growth opportunities
• Any other relevant details..."
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.jobProfileDescription ? 'border-[#ff2d55]' : 'border-gray-200'
            } focus:outline-none focus:ring-2 focus:ring-[#000000] focus:border-transparent transition-all duration-200 resize-none`}
          />
          <div className="mt-2 flex justify-between items-center">
            <p className="text-sm text-gray-500">
              {formData.jobProfileDescription.length}/5000 characters
            </p>
            {errors.jobProfileDescription && (
              <p className="text-sm text-[#ff2d55]">{errors.jobProfileDescription}</p>
            )}
          </div>
        </div>

        {/* Communication Preferences */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-[#1d1d1f]">Communication Preferences</h3>
          
          <div>
            <label className="block text-sm font-medium text-[#1d1d1f] mb-2">
              Send daily updates to:
            </label>
            <div className="space-y-3">
              {formData.notificationEmails.map((email, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleEmailChange(index, e.target.value)}
                    placeholder="Enter email address"
                    className={`flex-1 px-4 py-3 rounded-xl border ${
                      errors.notificationEmails ? 'border-[#ff2d55]' : 'border-gray-200'
                    } focus:outline-none focus:ring-2 focus:ring-[#000000] focus:border-transparent transition-all duration-200`}
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveEmail(index)}
                      className="px-4 py-3 text-[#ff2d55] hover:bg-[#ff2d55]/5 rounded-xl transition-all duration-200"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddEmail}
                className="text-[#000000] hover:text-[#1d1d1f] transition-colors duration-200"
              >
                + Add email
              </button>
            </div>
            {errors.notificationEmails && (
              <p className="mt-2 text-sm text-[#ff2d55]">{errors.notificationEmails[0]}</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="sendIndividualEmails"
              checked={formData.sendIndividualEmails}
              onChange={(e) => setFormData(prev => ({ ...prev, sendIndividualEmails: e.target.checked }))}
              className="h-4 w-4 text-[#000000] focus:ring-[#000000] border-gray-300 rounded"
            />
            <label htmlFor="sendIndividualEmails" className="ml-2 text-sm text-[#1d1d1f]">
              Also send an individual email each time someone applies
            </label>
          </div>
        </div>

        {/* Application Preferences */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-[#1d1d1f]">Application Preferences</h3>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="requireResume"
                checked={formData.requireResume}
                onChange={(e) => setFormData(prev => ({ ...prev, requireResume: e.target.checked }))}
                className="h-4 w-4 text-[#000000] focus:ring-[#000000] border-gray-300 rounded"
              />
              <label htmlFor="requireResume" className="ml-2 text-sm text-[#1d1d1f]">
                Resume is required
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="allowCandidateContact"
                checked={formData.allowCandidateContact}
                onChange={(e) => setFormData(prev => ({ ...prev, allowCandidateContact: e.target.checked }))}
                className="h-4 w-4 text-[#000000] focus:ring-[#000000] border-gray-300 rounded"
              />
              <label htmlFor="allowCandidateContact" className="ml-2 text-sm text-[#1d1d1f]">
                Let potential candidates contact you about this job by email
              </label>
            </div>
            {formData.allowCandidateContact && (
              <p className="text-sm text-gray-600 ml-6">
                Your email address will be displayed to candidates
              </p>
            )}
          </div>
        </div>

        {/* Application Deadline */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-[#1d1d1f]">Application Deadline</h3>
          
          <div>
            <label className="block text-sm font-medium text-[#1d1d1f] mb-4">
              Is there an application deadline?
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="hasApplicationDeadline"
                  checked={formData.hasApplicationDeadline}
                  onChange={() => setFormData(prev => ({ ...prev, hasApplicationDeadline: true }))}
                  className="h-4 w-4 text-[#000000] focus:ring-[#000000] border-gray-300"
                />
                <span className="ml-2 text-sm text-[#1d1d1f]">Yes</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="hasApplicationDeadline"
                  checked={!formData.hasApplicationDeadline}
                  onChange={() => setFormData(prev => ({ ...prev, hasApplicationDeadline: false }))}
                  className="h-4 w-4 text-[#000000] focus:ring-[#000000] border-gray-300"
                />
                <span className="ml-2 text-sm text-[#1d1d1f]">No</span>
              </label>
            </div>
            {formData.hasApplicationDeadline && (
              <div className="mt-4">
                <input
                  type="date"
                  name="applicationDeadline"
                  value={formData.applicationDeadline}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.applicationDeadline ? 'border-[#ff2d55]' : 'border-gray-200'
                  } focus:outline-none focus:ring-2 focus:ring-[#000000] focus:border-transparent transition-all duration-200`}
                />
                {errors.applicationDeadline && (
                  <p className="mt-1 text-sm text-[#ff2d55]">{errors.applicationDeadline}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showIndustryModal && renderIndustryModal()}
    </>
  );

  const renderStep5 = () => (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#1d1d1f]">Review Job Post</h1>
        <p className="mt-2 text-gray-600">Review all details before submitting your job post</p>
      </div>

      <div className="space-y-8 max-h-[calc(100vh-300px)] overflow-y-auto pr-4">
        {/* Company Info Section */}
        <div className="bg-white rounded-2xl shadow-md p-6 relative">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold text-[#1d1d1f]">Company Information</h2>
            <button
              onClick={() => handleEditStep(1)}
              className="text-gray-500 hover:text-[#000000] transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Job Title</h3>
              <p className="mt-1 text-[#1d1d1f]">{formData.jobTitle}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Job Title Description</h3>
              <p className="mt-1 text-[#1d1d1f]">{formData.jobTitleDescription}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Job Type</h3>
              <p className="mt-1 text-[#1d1d1f] capitalize">{formData.jobType}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Location</h3>
              <p className="mt-1 text-[#1d1d1f]">
                {[formData.city, formData.area, formData.pincode, formData.streetAddress]
                  .filter(Boolean)
                  .join(', ')}
              </p>
            </div>
          </div>
        </div>

        {/* Job Details Section */}
        <div className="bg-white rounded-2xl shadow-md p-6 relative">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold text-[#1d1d1f]">Job Details</h2>
            <button
              onClick={() => handleEditStep(2)}
              className="text-gray-500 hover:text-[#000000] transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Employment Types</h3>
              <p className="mt-1 text-[#1d1d1f]">{formData.employmentTypes.join(', ')}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Schedule</h3>
              <p className="mt-1 text-[#1d1d1f]">
                {formData.schedules.join(', ')}
                {formData.customSchedule && ` (${formData.customSchedule})`}
              </p>
            </div>
            {formData.hasPlannedStartDate && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Planned Start Date</h3>
                <p className="mt-1 text-[#1d1d1f]">{formData.plannedStartDate}</p>
              </div>
            )}
            <div>
              <h3 className="text-sm font-medium text-gray-500">Number of Hires</h3>
              <p className="mt-1 text-[#1d1d1f]">
                {formData.numberOfHires === 'custom' ? formData.customNumberOfHires : formData.numberOfHires}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Recruitment Timeline</h3>
              <p className="mt-1 text-[#1d1d1f]">{formData.recruitmentTimeline}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Minimum Education</h3>
              <p className="mt-1 text-[#1d1d1f]">
                {formData.minimumEducation === 'Other' ? formData.customEducation : formData.minimumEducation}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Language Required</h3>
              <p className="mt-1 text-[#1d1d1f]">
                {formData.languageRequirement === 'Other' ? formData.customLanguage : formData.languageRequirement}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Experience Required</h3>
              <p className="mt-1 text-[#1d1d1f]">
                {formData.experienceType === 'any' ? 'Any' : 
                 formData.experienceType === 'experienced' ? 'Experienced Only' : 'Fresher Only'}
                {(formData.experienceType === 'any' || formData.experienceType === 'experienced') && 
                 formData.minimumExperience && (
                  <span>
                    {' '}(Minimum: {formData.minimumExperience === 'Other' ? 
                      formData.customExperience : formData.minimumExperience})
                  </span>
                )}
              </p>
            </div>
            {(formData.selectedIndustries.length > 0 || formData.minAge || formData.maxAge || 
              formData.gender !== 'both' || formData.skills.length > 0) && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Additional Requirements</h3>
                <div className="mt-1 space-y-2">
                  {formData.selectedIndustries.length > 0 && (
                    <p className="text-[#1d1d1f]">
                      <span className="font-medium">Industries:</span> {formData.selectedIndustries.join(', ')}
                    </p>
                  )}
                  {(formData.minAge || formData.maxAge) && (
                    <p className="text-[#1d1d1f]">
                      <span className="font-medium">Age Range:</span> {formData.minAge} - {formData.maxAge} years
                    </p>
                  )}
                  {formData.gender !== 'both' && (
                    <p className="text-[#1d1d1f]">
                      <span className="font-medium">Gender:</span> {formData.gender === 'others' ? 
                        formData.customGender : formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1)}
                    </p>
                  )}
                  {formData.skills.length > 0 && (
                    <p className="text-[#1d1d1f]">
                      <span className="font-medium">Skills:</span> {formData.skills.join(', ')}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pay and Benefits Section */}
        <div className="bg-white rounded-2xl shadow-md p-6 relative">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold text-[#1d1d1f]">Pay and Benefits</h2>
            <button
              onClick={() => handleEditStep(3)}
              className="text-gray-500 hover:text-[#000000] transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Pay</h3>
              <p className="mt-1 text-[#1d1d1f]">
                {formData.payType === 'range' ? (
                  `${formData.minAmount} - ${formData.maxAmount} per ${formData.payRate}`
                ) : (
                  `${formData.amount} per ${formData.payRate}`
                )}
              </p>
            </div>
            {formData.supplementalPay.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Supplemental Pay</h3>
                <p className="mt-1 text-[#1d1d1f]">
                  {formData.supplementalPay.join(', ')}
                  {formData.customSupplementalPay && ` (${formData.customSupplementalPay})`}
                </p>
              </div>
            )}
            {formData.benefits.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Benefits</h3>
                <p className="mt-1 text-[#1d1d1f]">
                  {formData.benefits.join(', ')}
                  {formData.customBenefit && ` (${formData.customBenefit})`}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Job Description & Preferences Section */}
        <div className="bg-white rounded-2xl shadow-md p-6 relative">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold text-[#1d1d1f]">Job Description & Preferences</h2>
            <button
              onClick={() => handleEditStep(4)}
              className="text-gray-500 hover:text-[#000000] transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Job Description</h3>
              <p className="mt-1 text-[#1d1d1f] whitespace-pre-wrap">{formData.jobProfileDescription}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Communication Preferences</h3>
              <div className="mt-1 space-y-2">
                <p className="text-[#1d1d1f]">
                  <span className="font-medium">Notification Emails:</span> {formData.notificationEmails.join(', ')}
                </p>
                {formData.sendIndividualEmails && (
                  <p className="text-[#1d1d1f]">Send individual email for each application</p>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Application Preferences</h3>
              <div className="mt-1 space-y-2">
                {formData.requireResume && (
                  <p className="text-[#1d1d1f]">Resume is required</p>
                )}
                {formData.allowCandidateContact && (
                  <p className="text-[#1d1d1f]">Allow candidates to contact by email</p>
                )}
                {formData.hasApplicationDeadline && (
                  <p className="text-[#1d1d1f]">
                    <span className="font-medium">Application Deadline:</span> {formData.applicationDeadline}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-8">
        <button
          onClick={handleNext}
          className="w-full px-8 py-4 rounded-xl text-base font-medium text-white bg-[#000000] hover:bg-[#1d1d1f] active:bg-[#2d2d2f] transition-all duration-200 shadow-sm"
        >
          Submit Job Post
        </button>
      </div>
    </>
  );

  const renderStep6 = () => (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#1d1d1f]">Choose a Plan & Complete Payment</h1>
        <p className="mt-2 text-gray-600">Select a plan that best suits your needs</p>
      </div>

      <div className="space-y-8">
        {/* Pricing Plans */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Basic Plan */}
          <div className={`relative bg-white rounded-2xl shadow-xl p-6 transition-all duration-200 ${
            formData.selectedPlan === 'basic' ? 'ring-2 ring-[#000000]' : 'hover:scale-105'
          }`}>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[#1d1d1f]">Basic Plan</h3>
              <div className="text-3xl font-bold text-[#1d1d1f]">₹0</div>
              <ul className="space-y-3">
                <li className="flex items-center text-sm text-gray-600">
                  <svg className="h-5 w-5 text-[#000000] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Job listed for 7 days
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <svg className="h-5 w-5 text-[#000000] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Visible to nearby applicants
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <svg className="h-5 w-5 text-[#000000] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  No email alerts
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <svg className="h-5 w-5 text-[#000000] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  No support
                </li>
              </ul>
              <button
                onClick={() => setFormData(prev => ({ ...prev, selectedPlan: 'basic' }))}
                className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  formData.selectedPlan === 'basic'
                    ? 'bg-[#000000] text-white'
                    : 'bg-gray-100 text-[#1d1d1f] hover:bg-gray-200'
                }`}
              >
                Select Plan
              </button>
            </div>
          </div>

          {/* Standard Plan */}
          <div className={`relative bg-white rounded-2xl shadow-xl p-6 transition-all duration-200 ${
            formData.selectedPlan === 'standard' ? 'ring-2 ring-[#000000]' : 'hover:scale-105'
          }`}>
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-[#000000] text-white text-xs font-medium px-3 py-1 rounded-full">
                Recommended
              </span>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[#1d1d1f]">Standard Plan</h3>
              <div className="text-3xl font-bold text-[#1d1d1f]">₹999</div>
              <ul className="space-y-3">
                <li className="flex items-center text-sm text-gray-600">
                  <svg className="h-5 w-5 text-[#000000] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Job listed for 30 days
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <svg className="h-5 w-5 text-[#000000] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Reach wider audience
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <svg className="h-5 w-5 text-[#000000] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Includes daily email alerts
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <svg className="h-5 w-5 text-[#000000] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Basic customer support
                </li>
              </ul>
              <button
                onClick={() => setFormData(prev => ({ ...prev, selectedPlan: 'standard' }))}
                className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  formData.selectedPlan === 'standard'
                    ? 'bg-[#000000] text-white'
                    : 'bg-gray-100 text-[#1d1d1f] hover:bg-gray-200'
                }`}
              >
                Select Plan
              </button>
            </div>
          </div>

          {/* Premium Plan */}
          <div className={`relative bg-white rounded-2xl shadow-xl p-6 transition-all duration-200 ${
            formData.selectedPlan === 'premium' ? 'ring-2 ring-[#000000]' : 'hover:scale-105'
          }`}>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[#1d1d1f]">Premium Plan</h3>
              <div className="text-3xl font-bold text-[#1d1d1f]">₹2499</div>
              <ul className="space-y-3">
                <li className="flex items-center text-sm text-gray-600">
                  <svg className="h-5 w-5 text-[#000000] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Job listed for 60 days
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <svg className="h-5 w-5 text-[#000000] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Featured job (top of search)
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <svg className="h-5 w-5 text-[#000000] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Daily + instant alerts
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <svg className="h-5 w-5 text-[#000000] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Premium support
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <svg className="h-5 w-5 text-[#000000] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Custom reach targeting
                </li>
              </ul>
              <button
                onClick={() => setFormData(prev => ({ ...prev, selectedPlan: 'premium' }))}
                className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  formData.selectedPlan === 'premium'
                    ? 'bg-[#000000] text-white'
                    : 'bg-gray-100 text-[#1d1d1f] hover:bg-gray-200'
                }`}
              >
                Select Plan
              </button>
            </div>
          </div>
        </div>

        {/* Additional Options */}
        <div className="bg-white rounded-2xl shadow-md p-6 space-y-6">
          {/* Coupon Code */}
          <div>
            <label htmlFor="couponCode" className="block text-sm font-medium text-[#1d1d1f] mb-2">
              Have a coupon code?
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                id="couponCode"
                name="couponCode"
                value={formData.couponCode}
                onChange={handleInputChange}
                placeholder="Enter coupon code"
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#000000] focus:border-transparent transition-all duration-200"
              />
              <button
                type="button"
                className="px-6 py-3 rounded-xl text-sm font-medium text-white bg-[#000000] hover:bg-[#1d1d1f] active:bg-[#2d2d2f] transition-all duration-200"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Additional Options */}
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="requireGstInvoice"
                checked={formData.requireGstInvoice}
                onChange={(e) => setFormData(prev => ({ ...prev, requireGstInvoice: e.target.checked }))}
                className="h-4 w-4 text-[#000000] focus:ring-[#000000] border-gray-300 rounded"
              />
              <label htmlFor="requireGstInvoice" className="ml-2 text-sm text-[#1d1d1f]">
                Require GST invoice
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="saveCardForFuture"
                checked={formData.saveCardForFuture}
                onChange={(e) => setFormData(prev => ({ ...prev, saveCardForFuture: e.target.checked }))}
                className="h-4 w-4 text-[#000000] focus:ring-[#000000] border-gray-300 rounded"
              />
              <label htmlFor="saveCardForFuture" className="ml-2 text-sm text-[#1d1d1f]">
                Save card for future payments
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={handleBack}
            className="px-8 py-3 rounded-full text-sm font-medium text-[#1d1d1f] hover:bg-gray-100 transition-all duration-200"
          >
            Back
          </button>
          {formData.selectedPlan === 'basic' ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-8 py-3 rounded-full text-sm font-medium text-white bg-[#000000] hover:bg-[#1d1d1f] active:bg-[#2d2d2f] transition-all duration-200 shadow-sm"
            >
              Post Job Now
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="px-8 py-3 rounded-full text-sm font-medium text-white bg-[#000000] hover:bg-[#1d1d1f] active:bg-[#2d2d2f] transition-all duration-200 shadow-sm"
            >
              Proceed to Payment
            </button>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-[#1d1d1f]">Step {currentStep} of 6</h2>
            <span className="text-sm font-medium text-[#000000]">{(currentStep / 6 * 100).toFixed(0)}% Complete</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5">
            <div 
              className="bg-gradient-to-r from-[#000000] to-[#1d1d1f] h-2.5 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${(currentStep / 6 * 100)}%` }}
            />
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}
          {currentStep === 6 && renderStep6()}
          </div>

          {/* Navigation Buttons */}
          <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-100 flex justify-between items-center">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                className="px-6 py-3 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-white hover:border-[#000000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#000000] transition-all duration-200"
                >
                  Back
                </button>
              )}
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-6 py-3 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-white hover:border-[#000000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#000000] transition-all duration-200"
              >
                Save as Draft
              </button>
              {currentStep < 6 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-8 py-3 bg-gradient-to-r from-[#000000] to-[#1d1d1f] text-white rounded-full text-sm font-medium hover:from-[#1d1d1f] hover:to-[#2d2d2f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#000000] transition-all duration-200 shadow-sm"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-[#000000] to-[#1d1d1f] text-white rounded-full text-sm font-medium hover:from-[#1d1d1f] hover:to-[#2d2d2f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#000000] transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Posting...' : 'Post Job'}
                </button>
              )}
      </div>
          </div>
        </div>
      </div>

      {/* Cancel Dialog */}
      {showCancelDialog && renderCancelDialog()}

      {/* Industry Modal */}
      {showIndustryModal && renderIndustryModal()}
    </div>
  );
};

export default PostJob; 