// This is a placeholder component for the Terms of Service page. Replace with actual content and routing as needed.
import React from 'react';

const TermsOfService: React.FC = () => {
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
        <h1 style={{ fontWeight: 800, fontSize: '2.3rem', marginBottom: '1.2rem', textAlign: 'center', color: '#16a34a', letterSpacing: '-1px' }}>Terms & Services</h1>
        <section style={{ marginBottom: '2.2rem' }}>
          <p style={{ fontSize: '1.13rem', color: '#222', lineHeight: 1.8, marginBottom: '1.5rem', textAlign: 'center' }}>
            By using our platform, you agree to use it only for lawful and ethical job-related activities.<br /><br />
            You must provide accurate information in your profile and job applications. We do not tolerate fake job posts, fraudulent recruiters, or misuse of candidate data.<br /><br />
            We reserve the right to suspend or terminate accounts that violate our terms.<br /><br />
            While we strive to connect you with the best opportunities, we are not responsible for the outcome of any job application or interaction with employers.<br /><br />
            Continued use of our services means you agree to these terms.
          </p>
        </section>
        <section style={{ marginBottom: '2.2rem' }}>
          <h2 style={{ fontWeight: 600, fontSize: '1.25rem', color: '#222', marginBottom: '0.7rem' }}>Your Agreement</h2>
          <p style={{ fontSize: '1.1rem', color: '#444', lineHeight: 1.7 }}>
            By using our platform, you agree to use it only for lawful and ethical job-related activities. You must provide accurate information in your profile and job applications.
          </p>
        </section>
        <section style={{ marginBottom: '2.2rem' }}>
          <h2 style={{ fontWeight: 600, fontSize: '1.18rem', color: '#16a34a', marginBottom: '0.5rem' }}>Our Policy</h2>
          <p style={{ fontSize: '1.08rem', color: '#444', lineHeight: 1.7 }}>
            We do not tolerate fake job posts, fraudulent recruiters, or misuse of candidate data. We reserve the right to suspend or terminate accounts that violate our terms.
          </p>
        </section>
        <section style={{ marginBottom: '2.2rem' }}>
          <h2 style={{ fontWeight: 600, fontSize: '1.18rem', color: '#16a34a', marginBottom: '0.5rem' }}>Disclaimer</h2>
          <p style={{ fontSize: '1.08rem', color: '#444', lineHeight: 1.7 }}>
            While we strive to connect you with the best opportunities, we are not responsible for the outcome of any job application or interaction with employers. Continued use of our services means you agree to these terms.
          </p>
        </section>
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '1.18rem' }}>
            Thank you for being a responsible member of our community.
          </span>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService; 