import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './Splash.css';

export default function Splash() {
  const navigate = useNavigate();
  const { user } = useAppContext();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 1800);
    const navTimer = setTimeout(() => {
      if (user) {
        navigate('/app/dashboard');
      } else {
        navigate('/onboarding');
      }
    }, 2400);
    return () => { clearTimeout(fadeTimer); clearTimeout(navTimer); };
  }, [navigate, user]);

  return (
    <div className={`splash-screen ${fadeOut ? 'splash-fade-out' : ''}`}>
      <div className="splash-content">
        <div className="splash-logo-ring">
          <div className="splash-logo-inner">
            <Layers size={48} color="var(--accent-primary)" strokeWidth={1.5} />
          </div>
        </div>
        <h1 className="splash-title">FlowLedger AI</h1>
        <p className="splash-tagline">Your money, recorded automatically</p>
      </div>
      <div className="splash-loader">
        <div className="splash-loader-bar" />
      </div>
    </div>
  );
}
