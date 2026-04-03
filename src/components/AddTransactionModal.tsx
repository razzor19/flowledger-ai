import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

type AddTransactionModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddTransactionModal({ isOpen, onClose }: AddTransactionModalProps) {
  const { addTransactions, user, categories } = useAppContext();
  
  const [amount, setAmount] = useState('');
  const [merchant, setMerchant] = useState('');
  const [category, setCategory] = useState(categories[0] || 'Groceries');
  const [type, setType] = useState<'debit' | 'credit'>('debit');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !merchant) return;

    const newTx = {
      id: `manual-${Date.now()}`,
      date: new Date().toISOString(),
      merchant,
      amount: parseFloat(amount),
      type,
      category
    };

    addTransactions([newTx]);
    setAmount('');
    setMerchant('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-slide-up" onClick={e => e.stopPropagation()} style={{ maxHeight: '85vh', overflow: 'auto' }}>
        <div className="flex-row justify-between" style={{ marginBottom: 24 }}>
          <h2 className="h3">Add Transaction</h2>
          <button onClick={onClose} className="icon-btn-circle" style={{ background: 'var(--bg-secondary)' }}>
            <X size={20} color="var(--text-secondary)" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-col gap-lg">
          
          <div className="flex-col gap-sm">
            <label className="body-small" style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>Type</label>
            <div className="flex-row gap-md">
              <button 
                type="button"
                className="btn-secondary flex-1"
                style={{ 
                  backgroundColor: type === 'debit' ? 'var(--accent-secondary)' : 'var(--bg-secondary)',
                  color: type === 'debit' ? 'var(--accent-primary)' : 'var(--text-primary)',
                  border: type === 'debit' ? '1px solid var(--accent-primary)' : '1px solid transparent'
                }}
                onClick={() => setType('debit')}
              >
                Expense
              </button>
              <button 
                type="button"
                className="btn-secondary flex-1"
                style={{ 
                  backgroundColor: type === 'credit' ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-secondary)',
                  color: type === 'credit' ? 'var(--success-color)' : 'var(--text-primary)',
                  border: type === 'credit' ? '1px solid var(--success-color)' : '1px solid transparent'
                }}
                onClick={() => setType('credit')}
              >
                Income
              </button>
            </div>
          </div>

          <div className="flex-col gap-sm">
            <label className="body-small" style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>Amount</label>
            <div className="input-with-icon">
              <span className="input-currency">{user?.currency || '$'}</span>
              <input 
                type="number" 
                step="0.01"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                className="custom-input"
                autoFocus
              />
            </div>
          </div>

          <div className="flex-col gap-sm">
            <label className="body-small" style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>Merchant / Description</label>
            <input 
              type="text" 
              value={merchant}
              onChange={e => setMerchant(e.target.value)}
              placeholder="e.g. Starbucks, Salary"
              className="custom-input"
            />
          </div>

          <div className="flex-col gap-sm">
            <label className="body-small" style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>Category</label>
            <select 
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="custom-input"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: 8 }}>
            Save Transaction
          </button>
        </form>
      </div>
    </div>
  );
}
