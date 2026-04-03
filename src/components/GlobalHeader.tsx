import { Eye, EyeOff } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function GlobalHeader() {
  const { isPrivacyMode, togglePrivacy } = useAppContext();

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '24px 20px 12px 20px',
      backgroundColor: 'var(--bg-primary)',
      zIndex: 10,
      position: 'sticky',
      top: 0
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img 
          src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=e2e8f0" 
          alt="Avatar" 
          style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#E2E8F0', border: '2px solid white', boxShadow: 'var(--shadow-sm)' }} 
        />
        <h1 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
          The Ledger
        </h1>
      </div>

      <button onClick={togglePrivacy} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', padding: '4px' }}>
        {isPrivacyMode ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </header>
  );
}
