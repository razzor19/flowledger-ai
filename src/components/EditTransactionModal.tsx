import React, { useState, useEffect } from 'react';
import { X, Trash2, Users } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

type Transaction = {
  id: string;
  date: string;
  merchant: string;
  amount: number;
  type: string;
  category: string;
  tags?: string[];
  bankAccountId?: string;
};

type EditTransactionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onSplit?: () => void;
};

export default function EditTransactionModal({ isOpen, onClose, transaction, onSplit }: EditTransactionModalProps) {
  const { updateTransaction, deleteTransaction, user, categories } = useAppContext();
  
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (transaction) {
      setCategory(transaction.category);
      setAmount(transaction.amount.toString());
      setTagsStr(transaction.tags ? transaction.tags.join(', ') : '');
      setShowDeleteConfirm(false);
    }
  }, [transaction]);

  if (!isOpen || !transaction) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAmount = parseFloat(amount);
    const newTags = tagsStr.split(',').map(s => s.trim()).filter(s => s.length > 0);
    
    updateTransaction(transaction.id, { 
      category, 
      amount: isNaN(newAmount) ? transaction.amount : newAmount,
      tags: newTags
    });
    
    onClose();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (showDeleteConfirm) {
      deleteTransaction(transaction.id);
      setShowDeleteConfirm(false);
      onClose();
    } else {
      setShowDeleteConfirm(true);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-slide-up" onClick={e => e.stopPropagation()} style={{ maxHeight: '85vh', overflow: 'auto' }}>
        <div className="flex-row justify-between align-center" style={{ marginBottom: 24 }}>
          <h2 className="h3">Transaction Details</h2>
          <div className="flex-row gap-sm">
            <button onClick={onClose} className="icon-btn-circle" style={{ background: 'var(--bg-secondary)' }}>
              <X size={20} color="var(--text-secondary)" />
            </button>
          </div>
        </div>

        <div className="flex-col" style={{ alignItems: 'center', marginBottom: 24 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: 12 }}>
            {transaction.category.charAt(0)}
          </div>
          <h2 className="h2">{transaction.merchant}</h2>
          <p className="body-small" style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
            {new Date(transaction.date).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex-col gap-lg">
          <div className="flex-col gap-sm">
            <label className="body-small" style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>Amount</label>
            <div className="input-with-icon">
              <span className="input-currency">{user?.currency || '$'}</span>
              <input 
                type="number" 
                step="0.01"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="custom-input"
              />
            </div>
          </div>
          <div className="flex-col gap-sm">
            <label className="body-small" style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>Category</label>
            <select 
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="custom-input"
            >
              {[...categories, 'Transfer'].map(c => (
                <option key={c} value={c}>{c === 'Transfer' ? 'Transfer (Exclude from Budget)' : c}</option>
              ))}
            </select>
          </div>
          
          <div className="flex-col gap-sm">
            <label className="body-small" style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>Custom Tags</label>
            <input 
              type="text" 
              placeholder="e.g. vacation, lunch, business"
              value={tagsStr}
              onChange={e => setTagsStr(e.target.value)}
              className="custom-input"
            />
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: 4 }}>
            Save Changes
          </button>

          {onSplit && (
            <button 
              type="button" 
              onClick={(e) => { e.preventDefault(); onSplit(); }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 24px', width: '100%',
                borderRadius: 16, backgroundColor: 'var(--accent-secondary)', border: '1px solid var(--accent-primary)',
                color: 'var(--accent-primary)', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-family)',
              }}
            >
              <Users size={16} />
              Split Transaction with Friends
            </button>
          )}

          {/* Delete Button - always visible, with inline confirmation */}
          {!showDeleteConfirm ? (
            <button
              type="button"
              onClick={handleDelete}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '14px 24px',
                width: '100%',
                borderRadius: 16,
                backgroundColor: 'transparent',
                border: '1px solid var(--danger-color)',
                color: 'var(--danger-color)',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                fontFamily: 'var(--font-family)',
                transition: 'all 0.2s ease',
              }}
            >
              <Trash2 size={16} />
              Delete Transaction
            </button>
          ) : (
            <div className="flex-col gap-sm">
              <p className="body-small" style={{ textAlign: 'center', color: 'var(--danger-color)', fontWeight: 600 }}>
                Are you sure? This cannot be undone.
              </p>
              <div className="flex-row gap-sm">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  style={{
                    flex: 1,
                    padding: '14px 24px',
                    borderRadius: 16,
                    backgroundColor: 'var(--danger-color)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-family)',
                    border: 'none',
                  }}
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
