// This is a placeholder component for the About Us page. Replace with actual content and routing as needed.
import React from 'react';

const AboutUs: React.FC = () => {
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
        <h1 style={{ fontWeight: 800, fontSize: '2.3rem', marginBottom: '1.2rem', textAlign: 'center', color: '#16a34a', letterSpacing: '-1px' }}>About Us</h1>
        <section style={{ marginBottom: '2.2rem' }}>
          <p style={{ fontSize: '1.13rem', color: '#222', lineHeight: 1.8, marginBottom: '1.5rem', textAlign: 'center' }}>
            Welcome to our job portal — your trusted partner in finding better opportunities faster. We're on a mission to simplify the job search experience for everyone — whether you're a fresher, an experienced professional, or someone returning to the workforce.<br /><br />
            We believe job hunting shouldn't be complicated. That's why we built a platform that's easy to use, mobile-friendly, and packed with features like smart filters, instant apply, and soon — video resumes to help you stand out.<br /><br />
            Join thousands of users who trust us to connect with companies that value their talent. <span style={{ color: '#16a34a', fontWeight: 700 }}>Let's build your career, together.</span>
          </p>
        </section>
        <section style={{ marginBottom: '2.2rem' }}>
          <h2 style={{ fontWeight: 600, fontSize: '1.25rem', color: '#222', marginBottom: '0.7rem' }}>Who We Are</h2>
          <p style={{ fontSize: '1.1rem', color: '#444', lineHeight: 1.7 }}>
            Welcome to our job portal — your trusted partner in finding better opportunities, faster. We're dedicated to making job searching simple, effective, and accessible for everyone: whether you're a fresher, an experienced professional, or someone returning to the workforce.
          </p>
        </section>
        <section style={{ marginBottom: '2.2rem' }}>
          <h2 style={{ fontWeight: 600, fontSize: '1.18rem', color: '#16a34a', marginBottom: '0.5rem' }}>Our Mission</h2>
          <p style={{ fontSize: '1.08rem', color: '#444', lineHeight: 1.7 }}>
            We believe job hunting shouldn't be complicated. That's why we built a platform that's easy to use, mobile-friendly, and packed with features like smart filters, instant apply, and soon — video resumes to help you stand out.
          </p>
        </section>
        <section style={{ marginBottom: '2.2rem' }}>
          <h2 style={{ fontWeight: 600, fontSize: '1.18rem', color: '#16a34a', marginBottom: '0.5rem' }}>Why Choose Us?</h2>
          <p style={{ fontSize: '1.08rem', color: '#444', lineHeight: 1.7 }}>
            Thousands of users trust us to connect them with companies that value their talent. Our platform is designed to empower you to take control of your career journey, with tools and support every step of the way.
          </p>
        </section>
        <section style={{ marginBottom: '2.2rem' }}>
          <h2 style={{ fontWeight: 600, fontSize: '1.18rem', color: '#16a34a', marginBottom: '0.5rem' }}>What's Next?</h2>
          <p style={{ fontSize: '1.08rem', color: '#444', lineHeight: 1.7 }}>
            We're constantly innovating — from launching video resumes to introducing smarter job matching. Stay tuned for new features designed to make your job search even more successful.
          </p>
        </section>
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '1.18rem' }}>
            Let's build your career, together.
          </span>
        </div>
      </div>
    </div>
  );
};

export default AboutUs; 