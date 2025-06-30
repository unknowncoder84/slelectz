import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';
import { AuthContext } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

interface Internship {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  stipend: string;
  duration: string;
  created_at: string;
}

// Helper function to normalize requirements/responsibilities
function normalizeListField(field: any): string[] {
  if (Array.isArray(field)) return field;
  if (typeof field === 'string') {
    try {
      // Try to parse as JSON array
      const parsed = JSON.parse(field);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
    // Fallback: split by newlines or commas
    return field.split(/\n|,/).map(s => s.trim()).filter(Boolean);
  }
  return [];
}

const InternshipDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useContext(AuthContext);
  const [internship, setInternship] = useState<Internship | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const { data, error } = await supabase
          .from('internships')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setInternship(data);
      } catch (err) {
        setError('Failed to load internship details');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInternship();
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      toast('Please log in to apply for this internship.');
      window.location.href = '/login';
      return;
    }
    // Check if user has jobseeker profile (e.g., required fields)
    if (!profile || !profile.full_name || !profile.phone) {
      toast('Please complete your jobseeker profile to apply.');
      window.location.href = '/profile';
      return;
    }

    try {
      const { error } = await supabase
        .from('internship_applications')
        .insert([
          {
            internship_id: id,
            user_id: user.id,
            status: 'pending'
          }
        ]);

      if (error) throw error;
      alert('Application submitted successfully!');
    } catch (err) {
      console.error('Error applying:', err);
      alert('Failed to submit application. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !internship) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600">{error || 'Internship not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{internship.title}</h1>
              <p className="text-xl text-gray-600 mb-4">{internship.company}</p>
            </div>
            <button
              onClick={handleApply}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Apply Now
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-600">
                <span className="font-semibold">Location:</span> {
                  internship.location
                    ? (typeof internship.location === 'object' && internship.location !== null
                        ? [(internship.location as any).city, (internship.location as any).area].filter(Boolean).join(', ')
                        : internship.location)
                    : 'Not specified'
                }
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Type:</span> {internship.type}
              </p>
            </div>
            <div>
              <p className="text-gray-600">
                <span className="font-semibold">Stipend:</span> {internship.stipend}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Duration:</span> {internship.duration}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Description</h2>
            <p className="text-gray-600 whitespace-pre-line">{internship.description}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Requirements</h2>
            <ul className="list-disc list-inside text-gray-600">
              {normalizeListField(internship.requirements).length > 0
                ? normalizeListField(internship.requirements).map((req, index) => (
                    <li key={index}>{req}</li>
                  ))
                : <li className="text-gray-400">No requirements listed.</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipDetails; 