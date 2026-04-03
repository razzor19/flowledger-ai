import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  preGroupId?: string | null;
  sourceTransaction?: any | null;
};

export default function AddExpenseModal({ isOpen, onClose, preGroupId, sourceTransaction }: Props) {
  const { user, friends, splitGroups, addSharedExpense, convertTransactionToSharedExpense, categories } = useAppContext();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('me');
  const [splitBetween, setSplitBetween] = useState<string[]>(['me']);
  const [splitType, setSplitType] = useState<'equal' | 'exact' | 'percentage'>('equal');
  const [groupId, setGroupId] = useState<string | null>(preGroupId || null);
  const [category, setCategory] = useState('Dining');

  React.useEffect(() => {
    if (isOpen && sourceTransaction) {
      setDescription(sourceTransaction.merchant || '');
      setAmount(sourceTransaction.amount ? sourceTransaction.amount.toString() : '');
      setCategory(sourceTransaction.category || 'Dining');
      setPaidBy('me'); // Assume I paid since it's on my transaction list
    } else if (isOpen) {
      // Reset if opened without source transaction
      setDescription('');
      setAmount('');
      setPaidBy('me');
      setSplitBetween(['me']);
      setSplitType('equal');
      setGroupId(preGroupId || null);
    }
  }, [isOpen, sourceTransaction, preGroupId]);

  if (!isOpen || !user) return null;

  // When group is selected, auto-populate splitBetween
  const handleGroupChange = (gId: string) => {
    if (gId === '') {
      setGroupId(null);
      setSplitBetween(['me']);
    } else {
      setGroupId(gId);
      const group = splitGroups.find(g => g.id === gId);
      if (group) {
        setSplitBetween(['me', ...group.members]);
      }
    }
  };

  const toggleMember = (id: string) => {
    if (splitBetween.includes(id)) {
      if (id === 'me' && splitBetween.length === 1) return; // must have at least 'me'
      setSplitBetween(prev => prev.filter(m => m !== id));
    } else {
      setSplitBetween(prev => [...prev, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amount);
    if (!description.trim() || isNaN(amountNum) || amountNum <= 0 || splitBetween.length < 2) return;

    // Calculate split details
    const splitDetails: Record<string, number> = {};
    if (splitType === 'equal') {
      const share = amountNum / splitBetween.length;
      splitBetween.forEach(m => { splitDetails[m] = share; });
    }

    const expense = {
      id: `se-${Date.now()}`,
      groupId,
      description: description.trim(),
      amount: amountNum,
      paidBy,
      splitBetween,
      splitType,
      splitDetails,
      date: sourceTransaction ? sourceTransaction.date : new Date().toISOString(),
      category,
      settled: false,
    };

    if (sourceTransaction) {
      convertTransactionToSharedExpense(sourceTransaction.id, expense);
    } else {
      addSharedExpense(expense);
    }

    // Reset handled by useEffect on next open
    onClose();
  };

  const perPerson = splitBetween.length > 0 && amount
    ? (parseFloat(amount) / splitBetween.length)
    : 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-slide-up" onClick={e => e.stopPropagation()} style={{ maxHeight: '88vh', overflow: 'auto' }}>
        <div className="flex-row justify-between align-center" style={{ marginBottom: 20 }}>
          <h2 className="h3">{sourceTransaction ? 'Split Transaction' : 'Add Shared Expense'}</h2>
          <button onClick={onClose} className="icon-btn-circle" style={{ background: 'var(--bg-secondary)' }}>
            <X size={20} color="var(--text-secondary)" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-col gap-lg">
          {/* Description */}
          <div className="flex-col gap-sm">
            <label className="body-small" style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>What's it for?</label>
            <input
              type="text" placeholder="e.g. Dinner, Uber, Groceries"
              value={description} onChange={e => setDescription(e.target.value)}
              className="custom-input" autoFocus
            />
          </div>

          {/* Amount */}
          <div className="flex-col gap-sm">
            <label className="body-small" style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>Amount</label>
            <div className="input-with-icon">
              <span className="input-currency">{user.currency}</span>
              <input
                type="number" step="0.01" placeholder="0.00"
                value={amount} onChange={e => setAmount(e.target.value)}
                className="custom-input"
              />
            </div>
          </div>

          {/* Group */}
          <div className="flex-col gap-sm">
            <label className="body-small" style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>Group (optional)</label>
            <select value={groupId || ''} onChange={e => handleGroupChange(e.target.value)} className="custom-input">
              <option value="">No Group</option>
              {splitGroups.map(g => (
                <option key={g.id} value={g.id}>{g.emoji} {g.name}</option>
              ))}
            </select>
          </div>

          {/* Who paid */}
          <div className="flex-col gap-sm">
            <label className="body-small" style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>Who paid?</label>
            <div className="flex-row gap-sm" style={{ flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setPaidBy('me')}
                style={{
                  padding: '8px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                  border: 'none', cursor: 'pointer', fontFamily: 'var(--font-family)',
                  backgroundColor: paidBy === 'me' ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                  color: paidBy === 'me' ? 'white' : 'var(--text-primary)',
                }}
              >
                You
              </button>
              {friends.map(f => (
                <button
                  key={f.id} type="button"
                  onClick={() => setPaidBy(f.id)}
                  style={{
                    padding: '8px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                    border: 'none', cursor: 'pointer', fontFamily: 'var(--font-family)',
                    backgroundColor: paidBy === f.id ? f.color : 'var(--bg-secondary)',
                    color: paidBy === f.id ? 'white' : 'var(--text-primary)',
                  }}
                >
                  {f.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Split between */}
          <div className="flex-col gap-sm">
            <label className="body-small" style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>Split between</label>
            <div className="flex-col gap-sm">
              {/* Me */}
              <div
                className="card flex-row justify-between align-center"
                style={{ padding: '10px 14px', cursor: 'pointer' }}
                onClick={() => toggleMember('me')}
              >
                <div className="flex-row align-center gap-md">
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    backgroundColor: '#4F46E5',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 700, fontSize: 13,
                  }}>
                    {user.name[0]}
                  </div>
                  <span className="body" style={{ fontWeight: 500 }}>You</span>
                </div>
                <div style={{
                  width: 24, height: 24, borderRadius: 6,
                  border: `2px solid ${splitBetween.includes('me') ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                  backgroundColor: splitBetween.includes('me') ? 'var(--accent-primary)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {splitBetween.includes('me') && <Check size={14} color="white" />}
                </div>
              </div>
              {/* Friends */}
              {friends.map(f => (
                <div
                  key={f.id}
                  className="card flex-row justify-between align-center"
                  style={{ padding: '10px 14px', cursor: 'pointer' }}
                  onClick={() => toggleMember(f.id)}
                >
                  <div className="flex-row align-center gap-md">
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      backgroundColor: f.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: 700, fontSize: 13,
                    }}>
                      {f.avatar}
                    </div>
                    <span className="body" style={{ fontWeight: 500 }}>{f.name}</span>
                  </div>
                  <div style={{
                    width: 24, height: 24, borderRadius: 6,
                    border: `2px solid ${splitBetween.includes(f.id) ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                    backgroundColor: splitBetween.includes(f.id) ? 'var(--accent-primary)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {splitBetween.includes(f.id) && <Check size={14} color="white" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Split preview */}
          {splitBetween.length >= 2 && amount && (
            <div className="card" style={{ background: 'var(--accent-secondary)', border: '1px solid var(--accent-primary)', padding: 14, textAlign: 'center' }}>
              <p className="body-small" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
                {user.currency}{perPerson.toFixed(2)} per person ({splitBetween.length} people)
              </p>
            </div>
          )}

          {/* Category */}
          <div className="flex-col gap-sm">
            <label className="body-small" style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="custom-input">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: 4 }}>
            {sourceTransaction ? 'Split & Update Budget' : 'Add Expense'}
          </button>
        </form>
      </div>
    </div>
  );
}
