import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './contexts/AuthContext';
import { JobsProvider } from './contexts/JobsContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import EmployerLayout from './layouts/EmployerLayout';

// Pages
import Home from './pages/Home';
import Jobs from './pages/jobseeker/Jobs';
import Internships from './pages/jobseeker/Internships';
import Companies from './pages/Companies';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import JobDetails from './pages/jobseeker/JobDetails';
import InternshipDetails from './pages/jobseeker/InternshipDetails';
import JobseekerProfile from './pages/jobseeker/JobseekerProfile';
import JobseekerDashboard from './pages/JobseekerDashboard';
import JobseekerSettings from './pages/JobseekerSettings';
import EmployerProfile from './pages/employer/EmployerProfile';
import EmployerDashboard from './pages/employer/Dashboard';
import Applications from './pages/employer/Applications';
import Billing from './pages/employer/Billing';
import Analytics from './pages/employer/Analytics';
import EmployerSettings from './pages/employer/EmployerSettings';
import PostJob from './pages/employer/PostJob';
import PostInternship from './pages/employer/PostInternship';
import PostedJobs from './pages/employer/PostedJobs';
import PostedInternships from './pages/employer/PostedInternships';
import NotFound from './pages/NotFound';
import CompanyDetailsForm from './pages/employer/CompanyDetailsForm';
import EmployerJobSeekerProfileView from './pages/employer/EmployerJobSeekerProfileView';
import JobSeekerReels from './pages/employer/JobSeekerReels';
import SavedJobSeekerVideos from './pages/employer/SavedJobSeekerVideos';
import Credits from './pages/employer/Credits';
import AboutUs from './components/AboutUs';
import Careers from './components/Careers';
import HelpCenter from './components/HelpCenter';
import ContactUs from './components/ContactUs';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile } = useContext(AuthContext);
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (profile?.role === 'employer') {
    return <Navigate to="/employer/dashboard" />;
  }
  if (profile?.role === 'jobseeker') {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
};

// Role-specific protected route
const RoleProtectedRoute: React.FC<{ 
  children: React.ReactNode;
  allowedRole: 'employer' | 'jobseeker';
}> = ({ children, allowedRole }) => {
  const { user, profile } = useContext(AuthContext);
  if (!user) {
    return <Navigate to="/login" />;
  }
  // Allow access to employer routes for both employers and jobseekers
  if (allowedRole === 'employer') {
    return <>{children}</>;
  }
  // For jobseeker routes, only allow jobseekers
  if (profile?.role !== allowedRole) {
    return <Navigate to={profile?.role === 'employer' ? '/employer/dashboard' : '/'} />;
  }
  return <>{children}</>;
};

// Root route component to handle initial routing
const RootRoute: React.FC = () => {
  const { user, profile } = useContext(AuthContext);
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (profile?.role === 'employer') {
    return <Navigate to="/employer/dashboard" />;
  }
  if (profile?.role === 'jobseeker') {
    return <Navigate to="/" />;
  }
  return <Navigate to="/" />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <JobsProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* Root route */}
          <Route path="/" element={<RootRoute />} />
          {/* Main layout routes (for jobseekers) */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="internships" element={<Internships />} />
            <Route path="jobs/:id" element={<JobDetails />} />
            <Route path="internships/:id" element={<InternshipDetails />} />
            <Route path="profile" element={
              <RoleProtectedRoute allowedRole="jobseeker">
                <JobseekerProfile />
              </RoleProtectedRoute>
            } />
            <Route path="settings" element={
              <RoleProtectedRoute allowedRole="jobseeker">
                <JobseekerSettings />
              </RoleProtectedRoute>
            } />
            {/* Placeholder informational pages */}
            <Route path="about-us" element={<AboutUs />} />
            <Route path="about" element={<AboutUs />} />
            <Route path="careers" element={<Careers />} />
            <Route path="help-center" element={<HelpCenter />} />
            <Route path="help" element={<HelpCenter />} />
            <Route path="contact-us" element={<ContactUs />} />
            <Route path="contact" element={<ContactUs />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="terms-of-service" element={<TermsOfService />} />
            <Route path="terms" element={<TermsOfService />} />
          </Route>
          {/* Employer routes */}
          <Route
            path="/employer"
            element={
              <RoleProtectedRoute allowedRole="employer">
                <EmployerLayout />
              </RoleProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<EmployerDashboard />} />
            <Route path="jobs" element={<PostedJobs />} />
            <Route path="internships" element={<PostedInternships />} />
            <Route path="applications" element={<Applications />} />
            <Route path="billing" element={<Billing />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="profile" element={<EmployerProfile />} />
            <Route path="settings" element={<EmployerSettings />} />
            <Route path="post-job" element={<PostJob />} />
            <Route path="posted-jobs" element={<PostedJobs />} />
            <Route path="post-internship" element={<PostInternship />} />
            <Route path="posted-internships" element={<PostedInternships />} />
            <Route path="company-details" element={<CompanyDetailsForm />} />
            <Route path="job-seeker-profile/:id" element={<EmployerJobSeekerProfileView />} />
            <Route path="reels" element={<JobSeekerReels />} />
            <Route path="saved-videos" element={<SavedJobSeekerVideos />} />
            <Route path="credits" element={<Credits />} />
          </Route>
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </JobsProvider>
    </AuthProvider>
  );
};

export default App; 