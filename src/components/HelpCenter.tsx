// This is a placeholder component for the Help Center page. Replace with actual content and routing as needed.
import React from 'react';

const HelpCenter: React.FC = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '80vh', background: '#f9f9f9', padding: '3rem 0' }}>
      <div style={{ background: '#fff', padding: '2.5rem 2rem 3rem 2rem', borderRadius: '1rem', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', maxWidth: 700, width: '100%', borderLeft: '6px solid #16a34a' }}>
        <h1 style={{ fontWeight: 800, fontSize: '2.3rem', marginBottom: '1.2rem', textAlign: 'center', color: '#16a34a', letterSpacing: '-1px' }}>Help Center</h1>
        <section style={{ marginBottom: '2.2rem' }}>
          <h2 style={{ fontWeight: 600, fontSize: '1.25rem', color: '#222', marginBottom: '0.7rem' }}>How can we help you?</h2>
          <p style={{ fontSize: '1.1rem', color: '#444', lineHeight: 1.7 }}>
            Need assistance using our platform? Here are answers to some of the most common questions:
          </p>
        </section>
        <section style={{ marginBottom: '2.2rem' }}>
          <h2 style={{ fontWeight: 600, fontSize: '1.18rem', color: '#16a34a', marginBottom: '0.5rem' }}>Frequently Asked Questions</h2>
          <div style={{ fontSize: '1.08rem', color: '#444', lineHeight: 1.7 }}>
            <p style={{ marginBottom: '1rem' }}><strong>How to apply for jobs?</strong><br />Visit the Jobs section, browse listings, and click “Apply” on positions that interest you.</p>
            <p style={{ marginBottom: '1rem' }}><strong>How to edit or update your profile?</strong><br />Go to your profile page and click “Edit Profile” to update your information.</p>
            <p style={{ marginBottom: '1rem' }}><strong>What is a video resume and how to make one?</strong><br />Check our upcoming Video Resume feature for tips and upload options.</p>
            <p style={{ marginBottom: '1rem' }}><strong>How to report a fake job post?</strong><br />Click “Report” on the job listing or contact our support team directly.</p>
            <p style={{ marginBottom: '1rem' }}><strong>How to contact a company after applying?</strong><br />If the employer has enabled messaging, you'll see a "Contact Employer" button on your application status page.</p>
          </div>
        </section>
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '1.18rem' }}>
            Still need help? Reach out to our support team anytime.
          </span>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter; 