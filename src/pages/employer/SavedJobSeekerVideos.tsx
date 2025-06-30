import React, { useContext, useEffect, useState } from 'react';
import { supabase } from '../../config/supabase';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface SavedVideo {
  id: string;
  job_seeker_id: string;
  saved_at: string;
  intro_video_url: string;
  video_thumbnail_url?: string;
  desired_location: string;
  desired_roles?: string[];
  auth_id: string;
}

const SavedJobSeekerVideos: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [videos, setVideos] = useState<SavedVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSavedVideos();
    // eslint-disable-next-line
  }, [user]);

  const fetchSavedVideos = async () => {
    if (!user) return;
    setLoading(true);
    // Join employer_saved_videos with profiles to get video info
    const { data, error } = await supabase
      .from('employer_saved_videos')
      .select(`
        id, 
        job_seeker_id, 
        saved_at,
        profiles:profiles!employer_saved_videos_job_seeker_id_fkey(auth_id, intro_video_url, video_thumbnail_url, desired_location, desired_roles)
      `)
      .eq('employer_id', user.id)
      .order('saved_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching saved videos:', error);
      toast.error('Failed to load saved videos');
      setLoading(false);
      return;
    }
    
    // Map to flat structure
    const mapped = (data || []).map((item: any) => ({
      id: item.id,
      job_seeker_id: item.job_seeker_id,
      saved_at: item.saved_at,
      intro_video_url: item.profiles?.intro_video_url,
      video_thumbnail_url: item.profiles?.video_thumbnail_url,
      desired_location: item.profiles?.desired_location,
      desired_roles: item.profiles?.desired_roles,
      auth_id: item.profiles?.auth_id || item.job_seeker_id
    }));
    
    console.log('Saved videos data:', mapped); // Debug log
    setVideos(mapped);
    setLoading(false);
  };

  const handleViewProfile = (jobSeekerId: string) => {
    setShowConfirm(jobSeekerId);
  };

  const confirmViewProfile = async (jobSeekerAuthId: string) => {
    setViewingId(jobSeekerAuthId);
    setShowConfirm(null);
    if (!user) {
      toast.error('You must be logged in as an employer.');
      setViewingId(null);
      return;
    }
    const { data, error } = await supabase.rpc('access_job_seeker_profile', {
      employer_id: user.id,
      job_seeker_id: jobSeekerAuthId
    });
    if (error) {
      toast.error(error.message || 'Failed to unlock profile.');
      setViewingId(null);
      return;
    }
    setViewingId(null);
    navigate(`/employer/job-seeker-profile/${jobSeekerAuthId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8">
      <h1 className="text-3xl font-bold mb-6 text-emerald-700">Saved Job Seeker Videos</h1>
      {loading ? (
        <div className="w-full flex justify-center items-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      ) : (
        <div className="w-full max-w-2xl flex flex-col gap-8">
          {videos.length === 0 && (
            <div className="text-center text-gray-500 py-16">No saved videos yet.</div>
          )}
          {videos.map((video) => (
            <div key={video.id} className="bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center">
              <div className="w-full flex flex-col items-center">
                <video
                  src={video.intro_video_url}
                  poster={video.video_thumbnail_url}
                  controls
                  className="rounded-xl w-full max-h-96 bg-black mb-4"
                  preload="metadata"
                />
                <div className="flex flex-col items-center w-full">
                  <span className="text-gray-700 font-medium mb-1">Desired Location:</span>
                  <span className="text-lg text-gray-900 mb-2">{video.desired_location || 'Not specified'}</span>
                  {video.desired_roles && video.desired_roles.length > 0 && (
                    <span className="text-sm text-gray-500 mb-2">Roles: {video.desired_roles.join(', ')}</span>
                  )}
                </div>
                <div className="flex gap-4 mt-2 w-full justify-center">
                  <button
                    className="px-6 py-2 bg-emerald-600 text-white rounded-full font-semibold shadow hover:bg-emerald-700 transition-colors duration-200"
                    onClick={() => navigate(`/employer/job-seeker-profile/${video.auth_id}`)}
                  >
                    View Full Profile
                  </button>
                </div>
              </div>
              {/* Confirmation Dialog */}
              {showConfirm === video.job_seeker_id && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                  <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full flex flex-col items-center">
                    <h2 className="text-lg font-semibold mb-4 text-gray-900">Use 1 credit to view full profile?</h2>
                    <p className="text-gray-600 mb-6 text-center">This action will deduct 1 credit from your balance. Are you sure you want to continue?</p>
                    <div className="flex gap-4 w-full justify-center">
                      <button
                        className="px-6 py-2 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 transition-colors duration-200"
                        onClick={() => confirmViewProfile(video.auth_id)}
                      >
                        Yes, Continue
                      </button>
                      <button
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-colors duration-200"
                        onClick={() => setShowConfirm(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobSeekerVideos; 