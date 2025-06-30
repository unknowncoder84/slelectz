// This is a placeholder component for the Careers page. Replace with actual content and routing as needed.
import React from 'react';

const Careers: React.FC = () => {
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
        <h1 style={{ fontWeight: 800, fontSize: '2.3rem', marginBottom: '1.2rem', textAlign: 'center', color: '#16a34a', letterSpacing: '-1px' }}>Careers</h1>
        <section style={{ marginBottom: '2.2rem' }}>
          <p style={{ fontSize: '1.13rem', color: '#222', lineHeight: 1.8, marginBottom: '1.5rem', textAlign: 'center' }}>
            Want to help others get hired while building your own dream career? We're growing fast and are always looking for passionate people to join our team.<br /><br />
            Whether you're into tech, design, marketing, or customer success — we offer opportunities where your work directly impacts thousands of job seekers across the country.<br /><br />
            If you're excited by innovation, helping people, and building the future of hiring, drop us a message at <span style={{ color: '#16a34a', fontWeight: 600 }}>[your email]</span> or check for open roles right here. Let's shape the future of recruitment together.
          </p>
        </section>
        <section style={{ marginBottom: '2.2rem' }}>
          <h2 style={{ fontWeight: 600, fontSize: '1.25rem', color: '#222', marginBottom: '0.7rem' }}>Join Our Mission</h2>
          <p style={{ fontSize: '1.1rem', color: '#444', lineHeight: 1.7 }}>
            Want to help others get hired while building your own dream career? We're growing fast and are always looking for passionate people to join our team.
          </p>
        </section>
        <section style={{ marginBottom: '2.2rem' }}>
          <h2 style={{ fontWeight: 600, fontSize: '1.18rem', color: '#16a34a', marginBottom: '0.5rem' }}>Opportunities for Everyone</h2>
          <p style={{ fontSize: '1.08rem', color: '#444', lineHeight: 1.7 }}>
            Whether you're into tech, design, marketing, or customer success — we offer opportunities where your work directly impacts thousands of job seekers across the country.
          </p>
        </section>
        <section style={{ marginBottom: '2.2rem' }}>
          <h2 style={{ fontWeight: 600, fontSize: '1.18rem', color: '#16a34a', marginBottom: '0.5rem' }}>Shape the Future</h2>
          <p style={{ fontSize: '1.08rem', color: '#444', lineHeight: 1.7 }}>
            If you're excited by innovation, helping people, and building the future of hiring, drop us a message at <span style={{ color: '#16a34a', fontWeight: 600 }}>[your email]</span> or check for open roles right here. Let's shape the future of recruitment together.
          </p>
        </section>
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '1.18rem' }}>
            Your next big opportunity starts here.
          </span>
        </div>
      </div>
    </div>
  );
};

export default Careers; 