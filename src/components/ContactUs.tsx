// This is a placeholder component for the Contact Us page. Replace with actual content and routing as needed.
import React from 'react';

const ContactUs: React.FC = () => {
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
        <h1 style={{ fontWeight: 800, fontSize: '2.3rem', marginBottom: '1.2rem', textAlign: 'center', color: '#16a34a', letterSpacing: '-1px' }}>Contact Us</h1>
        <section style={{ marginBottom: '2.2rem' }}>
          <h2 style={{ fontWeight: 600, fontSize: '1.25rem', color: '#222', marginBottom: '0.7rem' }}>We're Here to Help</h2>
          <p style={{ fontSize: '1.1rem', color: '#444', lineHeight: 1.7 }}>
            Have questions, feedback, or need help with something? Our support team is ready to assist you.
          </p>
        </section>
        <section style={{ marginBottom: '2.2rem' }}>
          <h2 style={{ fontWeight: 600, fontSize: '1.18rem', color: '#16a34a', marginBottom: '0.5rem' }}>Contact Details</h2>
          <p style={{ fontSize: '1.08rem', color: '#444', lineHeight: 1.7 }}>
            Email: <span style={{ color: '#16a34a', fontWeight: 600 }}>[your support email]</span><br />
            Phone: <span style={{ color: '#16a34a', fontWeight: 600 }}>[your contact number]</span> (10 AM – 6 PM, Mon–Sat)
          </p>
        </section>
        <section style={{ marginBottom: '2.2rem' }}>
          <h2 style={{ fontWeight: 600, fontSize: '1.18rem', color: '#16a34a', marginBottom: '0.5rem' }}>Quick Response</h2>
          <p style={{ fontSize: '1.08rem', color: '#444', lineHeight: 1.7 }}>
            You can also message us through the Contact Us form on the website. We typically respond within 24 hours.
          </p>
        </section>
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '1.18rem' }}>
            We look forward to assisting you!
          </span>
        </div>
      </div>
    </div>
  );
};

export default ContactUs; 