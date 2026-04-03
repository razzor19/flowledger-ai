import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Handshake } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  friendId: string | null;
};

export default function SettleUpModal({ isOpen, onClose, friendId }: Props) {
  const { user, getFriendById, getBalanceWith, settleUp } = useAppContext();
  
  const [amount, setAmount] = useState('');
  const [paidByUs, setPaidByUs] = useState(true); // true = I paid them, false = they paid me

  const friend = friendId ? getFriendById(friendId) : null;
  const balanceWithFriend = friendId ? getBalanceWith(friendId) : 0; // positive = they owe me, negative = I owe them

  useEffect(() => {
    if (isOpen && balanceWithFriend !== 0) {
      setAmount(Math.abs(balanceWithFriend).toString());
      setPaidByUs(balanceWithFriend < 0); // If I owe them (negative balance), default to I paid them
    } else if (isOpen) {
      setAmount('');
      setPaidByUs(true);
    }
  }, [isOpen, balanceWithFriend]);

  if (!isOpen || !user || !friend) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const settleAmount = parseFloat(amount);
    if (isNaN(settleAmount) || settleAmount <= 0) return;

    settleUp({
      id: `set-${Date.now()}`,
      from: paidByUs ? 'me' : friend.id,
      to: paidByUs ? friend.id : 'me',
      amount: settleAmount,
      date: new Date().toISOString(),
      groupId: null, // Simple generic settlement for now
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex-row justify-between align-center" style={{ marginBottom: 20 }}>
          <h2 className="h3">Settle Up</h2>
          <button onClick={onClose} className="icon-btn-circle" style={{ background: 'var(--bg-secondary)' }}>
            <X size={20} color="var(--text-secondary)" />
          </button>
        </div>

        <div className="flex-col align-center gap-sm" style={{ marginBottom: 32 }}>
          <div className="flex-row align-center gap-md">
            {paidByUs ? (
              <>
                <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 16 }}>
                  {user.name[0]}
                </div>
                <ArrowRight size={20} color="var(--text-tertiary)" />
                <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: friend.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 16 }}>
                  {friend.avatar}
                </div>
              </>
            ) : (
              <>
                <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: friend.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 16 }}>
                  {friend.avatar}
                </div>
                <ArrowRight size={20} color="var(--text-tertiary)" />
                 <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 16 }}>
                  {user.name[0]}
                </div>
              </>
            )}
          </div>
          <span className="body" style={{ fontWeight: 600 }}>
            {paidByUs ? `You paid ${friend.name}` : `${friend.name} paid you`}
          </span>
          <button 
            type="button" 
            onClick={() => setPaidByUs(!paidByUs)}
            style={{ padding: '6px 12px', background: 'var(--bg-secondary)', border: 'none', borderRadius: 12, fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-family)', color: 'var(--text-secondary)' }}
          >
             Swap Direction
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-col gap-lg">
          <div className="flex-col gap-sm">
             <label className="body-small" style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>Amount</label>
            <div className="input-with-icon">
              <span className="input-currency">{user.currency}</span>
              <input 
                type="number" step="0.01" placeholder="0.00"
                value={amount} onChange={e => setAmount(e.target.value)}
                className="custom-input" autoFocus
              />
            </div>
          </div>

          <button type="submit" className="btn-primary flex-row align-center justify-center gap-sm">
            <Handshake size={18} /> Record Payment
          </button>
        </form>
      </div>
    </div>
  );
}
