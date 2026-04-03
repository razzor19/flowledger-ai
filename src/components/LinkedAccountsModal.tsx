import { useState } from 'react';
import { X, CreditCard, Plus, TrendingUp, Coins, ChevronLeft, ShieldCheck } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function LinkedAccountsModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { investments, addInvestment, user } = useAppContext();
  const [showConnect, setShowConnect] = useState(false);
  const [bankingAccounts] = useState([
    { id: 1, name: 'Visa •••• 4321', type: 'Credit Card', icon: CreditCard, status: 'Connected' }
  ]);

  if (!user) return null;

  const handleConnect = (type: 'Brokerage' | 'Crypto') => {
    const newInv = {
      id: Math.random().toString(36).substr(2, 9),
      name: type === 'Brokerage' ? 'Fidelity Brokerage' : 'Coinbase Wallet',
      type: type,
      balance: type === 'Brokerage' ? 42500 : 8400,
      provider: type === 'Brokerage' ? 'Fidelity' : 'Coinbase'
    };
    addInvestment(newInv as any);
    setShowConnect(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex-row justify-between" style={{ marginBottom: 24 }}>
          <div className="flex-row gap-sm align-center">
            {showConnect && (
              <button onClick={() => setShowConnect(false)} className="icon-btn-circle" style={{ background: 'none', width: 32 }}>
                <ChevronLeft size={20} color="var(--text-primary)" />
              </button>
            )}
            <h2 className="h3">{showConnect ? 'Connect Wealth' : 'Linked Accounts'}</h2>
          </div>
          <button onClick={onClose} className="icon-btn-circle" style={{ background: 'var(--bg-secondary)' }}>
            <X size={20} color="var(--text-secondary)" />
          </button>
        </div>

        {!showConnect ? (
          <div className="flex-col gap-md">
            <span className="body-tiny" style={{ opacity: 0.6, fontWeight: 700, letterSpacing: 1 }}>BANKING</span>
            {bankingAccounts.map(acc => (
              <div key={acc.id} className="card flex-row justify-between" style={{ padding: 16 }}>
                <div className="flex-row gap-md">
                  <CreditCard size={20} color="var(--accent-primary)" />
                  <div className="flex-col">
                    <span className="body" style={{ fontWeight: 600 }}>{acc.name}</span>
                    <span className="body-small">{acc.type}</span>
                  </div>
                </div>
                <span className="body-small" style={{ color: 'var(--success-color)', fontWeight: 600 }}>{acc.status}</span>
              </div>
            ))}

            {(investments || []).length > 0 && (
              <>
                <span className="body-tiny" style={{ marginTop: 8, opacity: 0.6, fontWeight: 700, letterSpacing: 1 }}>WEALTH & TRADING</span>
                {investments.map(inv => (
                  <div key={inv.id} className="card flex-row justify-between" style={{ padding: 16 }}>
                    <div className="flex-row gap-md">
                      {inv.type === 'Crypto' ? <Coins size={20} /> : <TrendingUp size={20} />}
                      <div className="flex-col">
                        <span className="body" style={{ fontWeight: 600 }}>{inv.name}</span>
                        <span className="body-small">{inv.provider}</span>
                      </div>
                    </div>
                    <span className="body-small" style={{ fontWeight: 700 }}>{user.currency}{inv.balance.toLocaleString()}</span>
                  </div>
                ))}
              </>
            )}

            <button className="btn-secondary flex-row justify-center gap-sm" style={{ marginTop: 16, borderStyle: 'dashed' }} onClick={() => setShowConnect(true)}>
              <Plus size={18} />
              <span>Connect Wealth Account</span>
            </button>
          </div>
        ) : (
          <div className="flex-col gap-lg animate-slide-up">
            <div className="card flex-col gap-sm" style={{ textAlign: 'center', padding: '32px 24px', background: 'var(--bg-secondary)', border: 'none' }}>
              <ShieldCheck size={48} color="var(--success-color)" style={{ alignSelf: 'center', marginBottom: 8 }} />
              <p className="body" style={{ fontWeight: 600 }}>Secure Wealth Connection</p>
              <p className="body-small">FlowLedger uses bank-grade encryption to sync your balances without ever seeing your credentials.</p>
            </div>
            <div className="flex-col gap-sm">
              <button className="card flex-row justify-between" style={{ padding: 20, cursor: 'pointer', border: '1px solid var(--border-color)', textAlign: 'left', width: '100%' }} onClick={() => handleConnect('Brokerage')}>
                <TrendingUp size={24} color="var(--accent-primary)" />
                <div className="flex-col">
                  <span className="body" style={{ fontWeight: 600 }}>Brokerage Account</span>
                  <span className="body-small">Fidelity, Vanguard, Robinhood...</span>
                </div>
              </button>
              <button className="card flex-row justify-between" style={{ padding: 20, cursor: 'pointer', border: '1px solid var(--border-color)', textAlign: 'left', width: '100%' }} onClick={() => handleConnect('Crypto')}>
                <Coins size={24} color="var(--accent-primary)" />
                <div className="flex-col">
                  <span className="body" style={{ fontWeight: 600 }}>Crypto Exchange</span>
                  <span className="body-small">Coinbase, Binance, Kraken...</span>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}