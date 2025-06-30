import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

interface FormData {
  title: string;
  description: string;
  type: string;
  location: string;
  duration: string;
  stipend: string;
  requirements: string[];
  responsibilities: string[];
  skills: string[];
  perks: string[];
  application_deadline: string;
  start_date: string;
  end_date: string;
}

const INTERNSHIP_TYPES = [
  'Full Time',
  'Part Time',
  'Remote',
  'Hybrid'
];

const PostInternship = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    type: '',
    location: '',
    duration: '',
    stipend: '',
    requirements: [''],
    responsibilities: [''],
    skills: [''],
    perks: [''],
    application_deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    start_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
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
        toast('Please complete your company profile to post an internship.');
        navigate('/employer/company-details');
        return;
      }
    };
    checkCompanyProfile();
  }, [user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayInputChange = (index: number, value: string, field: 'requirements' | 'responsibilities' | 'skills' | 'perks') => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (field: 'requirements' | 'responsibilities' | 'skills' | 'perks') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (index: number, field: 'requirements' | 'responsibilities' | 'skills' | 'perks') => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (!user?.id) {
        toast.error('Please sign in to post an internship');
        return;
      }

      // Get company ID for the current user
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('id')
        .eq('auth_id', user.id)
        .maybeSingle();

      if (companyError) {
        throw companyError;
      }

      if (!companyData) {
        toast.error('Company profile not found. Please set up your company profile first.');
        return;
      }

      // Validate required fields
      if (!formData.title?.trim() || 
          !formData.description?.trim() || 
          !formData.type?.trim() || 
          !formData.location?.trim() || 
          !formData.duration?.trim() || 
          !formData.stipend?.trim()) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Validate date order
      if (formData.start_date && formData.end_date) {
        const startDate = new Date(formData.start_date);
        const endDate = new Date(formData.end_date);

        if (endDate <= startDate) {
          toast.error('End date must be after start date');
          return;
        }
      }

      if (formData.application_deadline && formData.start_date) {
        const appDeadline = new Date(formData.application_deadline);
        const startDate = new Date(formData.start_date);
        
        if (startDate < appDeadline) {
          toast.error('Start date must be after application deadline');
          return;
        }
      }

      // Filter out empty strings
      const requirementsArray = formData.requirements.filter(req => req.trim() !== '');
      const responsibilitiesArray = formData.responsibilities.filter(resp => resp.trim() !== '');
      const skillsArray = formData.skills.filter(skill => skill.trim() !== '');
      const perksArray = formData.perks.filter(perk => perk.trim() !== '');

      // Format data for submission
      const formattedData = {
        company_id: companyData.id,
        title: formData.title.trim(),
        description: formData.description.trim(),
        type: formData.type.trim(),
        location: formData.location.trim(),
        duration: formData.duration.trim(),
        stipend: formData.stipend.trim(),
        requirements: requirementsArray.length > 0 ? requirementsArray : null,
        responsibilities: responsibilitiesArray.length > 0 ? responsibilitiesArray : null,
        skills: skillsArray.length > 0 ? skillsArray : null,
        perks: perksArray.length > 0 ? perksArray : null,
        application_deadline: formData.application_deadline ? new Date(formData.application_deadline).toISOString() : null,
        start_date: formData.start_date ? new Date(formData.start_date).toISOString() : null,
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log("Formatted data before insertion:", formattedData);

      // Insert the internship
      const { data, error } = await supabase
        .from('internships')
        .insert([formattedData])
        .select();

      if (error) {
        console.error("Supabase insertion error:", error);
        throw error;
      }

      console.log("Internship posted successfully. Supabase response:", data);

      toast.success('Internship posted successfully!');
      navigate('/employer/internships');
    } catch (error: any) {
      console.error('Error creating internship:', error);
      toast.error(error.message || 'Failed to post internship. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Post a New Internship</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Internship Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., Software Development Intern"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe the internship role and responsibilities..."
            rows={4}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location *
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="e.g., Bangalore, India"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type *
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select type</option>
            {INTERNSHIP_TYPES.map((type) => (
              <option key={type} value={type.toLowerCase()}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration *
          </label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            placeholder="e.g., 3 months"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Stipend */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stipend *
          </label>
          <input
            type="text"
            name="stipend"
            value={formData.stipend}
            onChange={handleInputChange}
            placeholder="e.g., ₹25,000/month"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Requirements */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Requirements *
          </label>
          {formData.requirements.map((req, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={req}
                onChange={(e) => handleArrayInputChange(index, e.target.value, 'requirements')}
                placeholder="List the requirements and qualifications..."
                className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeArrayField(index, 'requirements')}
                  className="px-3 py-2 text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField('requirements')}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            + Add Requirement
          </button>
        </div>

        {/* Responsibilities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Responsibilities
          </label>
          {formData.responsibilities.map((resp, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={resp}
                onChange={(e) => handleArrayInputChange(index, e.target.value, 'responsibilities')}
                placeholder="List the key responsibilities..."
                className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeArrayField(index, 'responsibilities')}
                  className="px-3 py-2 text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField('responsibilities')}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            + Add Responsibility
          </button>
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Required Skills
          </label>
          {formData.skills.map((skill, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={skill}
                onChange={(e) => handleArrayInputChange(index, e.target.value, 'skills')}
                placeholder="e.g., React, Node.js, Python..."
                className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeArrayField(index, 'skills')}
                  className="px-3 py-2 text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField('skills')}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            + Add Skill
          </button>
        </div>

        {/* Perks */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Perks & Benefits
          </label>
          {formData.perks.map((perk, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={perk}
                onChange={(e) => handleArrayInputChange(index, e.target.value, 'perks')}
                placeholder="e.g., Flexible hours, Remote work..."
                className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeArrayField(index, 'perks')}
                  className="px-3 py-2 text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField('perks')}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            + Add Perk
          </button>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Application Deadline *
            </label>
            <input
              type="date"
              name="application_deadline"
              value={formData.application_deadline}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date *
            </label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date *
            </label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Posting...' : 'Post Internship'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostInternship; 