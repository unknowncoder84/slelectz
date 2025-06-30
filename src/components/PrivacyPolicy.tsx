// This is a placeholder component for the Privacy Policy page. Replace with actual content and routing as needed.
import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '80vh', background: '#f9f9f9', padding: '3rem 0' }}>
      <div
        style={{
          background: '#fff',
          padding: '2.5rem 2rem 3rem 2rem',
          borderRadius: '1rem',
          boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
          maxWidth: 900,
          width: '100%',
          borderLeft: '6px solid #16a34a',
          transition: 'box-shadow 0.3s, transform 0.3s',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(22,163,74,0.13)';
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 16px rgba(0,0,0,0.07)';
          (e.currentTarget as HTMLDivElement).style.transform = 'none';
        }}
      >
        <h1 style={{ fontWeight: 800, fontSize: '2.3rem', marginBottom: '1.2rem', textAlign: 'center', color: '#16a34a', letterSpacing: '-1px' }}>Privacy Policy</h1>
        <section style={{ marginBottom: '2.2rem' }}>
          <p style={{ fontSize: '1.13rem', color: '#222', lineHeight: 1.8, marginBottom: '1.5rem', textAlign: 'center' }}>
            Your privacy matters to us. We collect only the necessary information required to provide you with job matches, application tracking, and account security.<br /><br />
            We do not sell or misuse your data. All personal details — including your resume, phone number, or email — are stored securely and only shared with recruiters when you apply or choose to share them.<br /><br />
            You are in full control of your profile visibility, and you can request data deletion at any time.<br /><br />
            For more details or concerns, please email us at <span style={{ color: '#16a34a', fontWeight: 600 }}>[your support email]</span>.
          </p>
        </section>
        <section style={{ marginBottom: '2.2rem' }}>
          <h2 style={{ fontWeight: 600, fontSize: '1.25rem', color: '#222', marginBottom: '0.7rem' }}>Your Privacy Matters</h2>
          <p style={{ fontSize: '1.1rem', color: '#444', lineHeight: 1.7 }}>
            We collect only the necessary information required to provide you with job matches, application tracking, and account security.
          </p>
        </section>
        <section style={{ marginBottom: '2.2rem' }}>
          <h2 style={{ fontWeight: 600, fontSize: '1.18rem', color: '#16a34a', marginBottom: '0.5rem' }}>Data Security</h2>
          <p style={{ fontSize: '1.08rem', color: '#444', lineHeight: 1.7 }}>
            We do not sell or misuse your data. All personal details — including your resume, phone number, or email — are stored securely and only shared with recruiters when you apply or choose to share them.
          </p>
        </section>
        <section style={{ marginBottom: '2.2rem' }}>
          <h2 style={{ fontWeight: 600, fontSize: '1.18rem', color: '#16a34a', marginBottom: '0.5rem' }}>Your Control</h2>
          <p style={{ fontSize: '1.08rem', color: '#444', lineHeight: 1.7 }}>
            You are in full control of your profile visibility, and you can request data deletion at any time.
          </p>
        </section>
        <section style={{ marginBottom: '2.2rem' }}>
          <h2 style={{ fontWeight: 600, fontSize: '1.18rem', color: '#16a34a', marginBottom: '0.5rem' }}>Contact Us</h2>
          <p style={{ fontSize: '1.08rem', color: '#444', lineHeight: 1.7 }}>
            For more details or concerns, please email us at <span style={{ color: '#16a34a', fontWeight: 600 }}>[your support email]</span>.
          </p>
        </section>
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '1.18rem' }}>
            Your trust is our priority.
          </span>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 