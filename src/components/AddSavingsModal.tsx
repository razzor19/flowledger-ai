import React, { useState } from 'react';
import { X, Target, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

type SavingsPot = {
  id: string;
  name: string;
  target: number;
  saved: number;
  color: string;
};

type AddSavingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  pot: SavingsPot | null;
};

export default function AddSavingsModal({ isOpen, onClose, pot }: AddSavingsModalProps) {
  const { user, contributeToPot } = useAppContext();
  const [amount, setAmount] = useState('');

  if (!isOpen || !pot) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!isNaN(val) && val > 0) {
      contributeToPot(pot.id, val);
      onClose();
      setAmount('');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex-row justify-between" style={{ marginBottom: 24 }}>
          <h2 className="h3">Add to Savings</h2>
          <button onClick={onClose} className="icon-btn-circle" style={{ background: 'var(--bg-secondary)' }}>
            <X size={20} color="var(--text-secondary)" />
          </button>
        </div>

        <div className="flex-col align-center" style={{ marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: pot.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Target size={28} color={pot.color} />
          </div>
          <h2 className="h2">{pot.name}</h2>
          <p className="body-small" style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
            Goal: {user?.currency}{pot.target.toLocaleString()}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex-col gap-lg">
          <div className="flex-col gap-sm">
            <label className="body-small" style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>Contribution Amount</label>
            <div className="input-with-icon">
              <span className="input-currency">{user?.currency || '$'}</span>
              <input 
                type="number" 
                autoFocus
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="custom-input"
              />
            </div>
          </div>

          <button type="submit" className="btn-primary flex-row justify-center gap-sm" style={{ marginTop: 8 }}>
            <span>Add to Goal</span>
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
