import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ChevronRight, LogOut, Download, CreditCard, PieChart, Tag, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EditBudgetModal from '../components/EditBudgetModal';
import LinkedAccountsModal from '../components/LinkedAccountsModal';
import CategoryManager from '../components/CategoryManager';
import './Settings.css';

export default function Settings() {
  const { user, resetAll, transactions, isPrivacyMode, togglePrivacy } = useAppContext();
  const navigate = useNavigate();
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isLinkedAccountsOpen, setIsLinkedAccountsOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);

  const handleLogout = () => {
    resetAll();
    navigate('/');
  };

  const handleExportCSV = () => {
    if (!transactions.length) {
      alert("No transactions to export.");
      return;
    }
    const headers = "ID,Date,Merchant,Amount,Type,Category\n";
    const csvContent = transactions.map(t => 
      `${t.id},${new Date(t.date).toISOString().split('T')[0]},"${t.merchant}",${t.amount},${t.type},${t.category}`
    ).join("\n");
    
    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `flowledger_export_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="screen-container animate-slide-up" style={{ padding: '0 20px 100px 20px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '12px 0 24px 0' }}>Settings</h2>

      <div className="flex-row align-center gap-md" style={{ marginBottom: 32, padding: '12px 0' }}>
        <div style={{ 
          width: 64, height: 64, borderRadius: '50%', 
          backgroundColor: 'var(--accent-primary)', 
          color: 'white', display: 'flex', alignItems: 'center', 
          justifyContent: 'center', fontSize: '24px', fontWeight: 700 
        }}>
          {user?.name?.[0] || 'A'}
        </div>
        <div className="flex-col">
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>{user?.name || 'Alex'}</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>{user?.email || 'alex@demo.com'}</p>
        </div>
      </div>

      <div className="flex-col gap-lg">
        {/* Account Section */}
        <div className="flex-col gap-sm">
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.5px' }}>ACCOUNT</span>
          <div className="flex-col gap-0" style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
            {[
              { label: 'Linked Accounts', icon: <CreditCard size={18} />, onClick: () => setIsLinkedAccountsOpen(true) },
              { label: 'Edit Budget', icon: <PieChart size={18} />, onClick: () => setIsBudgetModalOpen(true) },
              { label: 'Manage Categories', icon: <Tag size={18} />, onClick: () => setIsCategoryManagerOpen(true) }
            ].map((item, i) => (
              <div key={i} onClick={item.onClick} style={{ 
                padding: '16px 20px', display: 'flex', justifyContent: 'space-between', 
                alignItems: 'center', cursor: 'pointer', borderBottom: i === 2 ? 'none' : '1px solid #F1F5F9' 
              }}>
                <div className="flex-row align-center gap-md">
                  <div style={{ color: 'var(--text-secondary)' }}>{item.icon}</div>
                  <span style={{ fontSize: '15px', fontWeight: 500 }}>{item.label}</span>
                </div>
                <ChevronRight size={18} color="#94A3B8" />
              </div>
            ))}
          </div>
        </div>

        {/* Preferences Section */}
        <div className="flex-col gap-sm">
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.5px' }}>PREFERENCES</span>
          <div className="flex-col gap-0" style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
            <div onClick={togglePrivacy} style={{ 
              padding: '16px 20px', display: 'flex', justifyContent: 'space-between', 
              alignItems: 'center', cursor: 'pointer', borderBottom: '1px solid #F1F5F9' 
            }}>
              <div className="flex-row align-center gap-md">
                <div style={{ color: 'var(--text-secondary)' }}><Shield size={18} /></div>
                <span style={{ fontSize: '15px', fontWeight: 500 }}>Privacy Mode</span>
              </div>
              <div style={{ width: 44, height: 24, backgroundColor: isPrivacyMode ? 'var(--accent-primary)' : '#E2E8F0', borderRadius: 12, position: 'relative', transition: 'all 0.2s' }}>
                <div style={{ 
                  width: 18, height: 18, backgroundColor: 'white', borderRadius: '50%', 
                  position: 'absolute', top: 3, left: isPrivacyMode ? 23 : 3, transition: 'all 0.2s' 
                }} />
              </div>
            </div>
            <div onClick={handleExportCSV} style={{ 
              padding: '16px 20px', display: 'flex', justifyContent: 'space-between', 
              alignItems: 'center', cursor: 'pointer' 
            }}>
              <div className="flex-row align-center gap-md">
                <div style={{ color: 'var(--text-secondary)' }}><Download size={18} /></div>
                <span style={{ fontSize: '15px', fontWeight: 500 }}>Export Data (CSV)</span>
              </div>
              <ChevronRight size={18} color="#94A3B8" />
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={handleLogout}
        style={{ 
          marginTop: 40, width: '100%', padding: '16px', borderRadius: '16px', 
          backgroundColor: '#FEF2F2', color: '#EF4444', border: 'none', 
          fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', 
          justifyContent: 'center', gap: '8px', cursor: 'pointer' 
        }}
      >
        <LogOut size={18} />
        Log Out
      </button>

      <EditBudgetModal isOpen={isBudgetModalOpen} onClose={() => setIsBudgetModalOpen(false)} />
      <LinkedAccountsModal isOpen={isLinkedAccountsOpen} onClose={() => setIsLinkedAccountsOpen(false)} />
      <CategoryManager isOpen={isCategoryManagerOpen} onClose={() => setIsCategoryManagerOpen(false)} />
    </div>
  );
}
