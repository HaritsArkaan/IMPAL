import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000); // Transition duration
    }, 3000); // Display duration

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={`landing-page ${fadeOut ? 'fade-out' : ''}`}>
      <div className="gradient-background">
        <div className="text-container">
          <h1 className="welcome-text">Selamat Datang di</h1>
          <h2 className="brand-text">Snackhunt</h2>
        </div>
      </div>
      <style jsx>{`
        .landing-page {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          z-index: 1000;
          opacity: 1;
          transition: opacity 1s ease-out, transform 1s ease-out;
        }
        .fade-out {
          opacity: 0;
          transform: translateY(-20px);
        }
        .gradient-background {
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, #BED1BD 0%, #FFC3BE 150%);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .text-container {
          text-align: center;
        }
        .welcome-text {
          font-size: 2.5rem;
          font-weight: 400;
          color: #000000;
          margin-bottom: 0.5rem;
        }
        .brand-text {
          font-size: 4rem;
          font-weight: 700;
          color: #000000;
          line-height: 1.2;
        }
      `}</style>
    </div>
  );
}

