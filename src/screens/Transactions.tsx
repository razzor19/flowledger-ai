import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Plus, Search } from 'lucide-react';
import AddTransactionModal from '../components/AddTransactionModal';
import EditTransactionModal from '../components/EditTransactionModal';
import AddExpenseModal from '../components/AddExpenseModal';

export default function Transactions() {
  const { user, transactions, isPrivacyMode } = useAppContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<any>(null);
  const [splittingTx, setSplittingTx] = useState<any>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  if (!user) return null;

  const filteredTransactions = transactions.filter(t => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = !query || 
      t.merchant.toLowerCase().includes(query) || 
      t.category.toLowerCase().includes(query) || 
      (t.tags && t.tags.some(tag => tag.toLowerCase().includes(query)));

    const matchesType = filterType === 'all' || t.category.toLowerCase() === filterType.toLowerCase() || (filterType === 'food' && t.category.toLowerCase() === 'dining');

    return matchesSearch && matchesType;
  });

  return (
    <div className="screen-container animate-slide-up" style={{ padding: '0 20px 80px 20px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '12px 0 24px 0' }}>Transactions</h2>
      <div className="flex-row align-center gap-sm" style={{ 
        backgroundColor: '#F1F5F9', 
        padding: '12px 16px', 
        borderRadius: 'var(--border-radius-lg)', 
        marginBottom: 20 
      }}>
        <Search size={18} color="var(--text-secondary)" />
        <input 
          type="text" 
          placeholder="Search transactions..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ 
            background: 'none', 
            border: 'none', 
            flex: 1, 
            fontSize: '14px', 
            color: 'var(--text-primary)',
            outline: 'none'
          }}
        />
      </div>

      {/* Filter Pills */}
      <div className="flex-row gap-sm" style={{ overflowX: 'auto', marginBottom: 28, scrollbarWidth: 'none', paddingBottom: 4 }}>
        {['All', 'Food', 'Travel', 'Shopping', 'Entertainment'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterType(cat.toLowerCase())}
            style={{
              padding: '10px 24px',
              borderRadius: '20px',
              border: 'none',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: filterType === cat.toLowerCase() ? 'var(--accent-primary)' : '#F1F5F9',
              color: filterType === cat.toLowerCase() ? 'white' : 'var(--text-secondary)',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Transaction List Grouped by Date */}
      <div className="flex-col gap-xl" style={{ paddingBottom: 100 }}>
        {filteredTransactions.length === 0 ? (
          <p className="body" style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: 24 }}>No transactions found.</p>
        ) : (
          Object.entries(
            filteredTransactions.reduce((groups: any, t) => {
              const date = new Date(t.date);
              const today = new Date();
              const yesterday = new Date();
              yesterday.setDate(today.getDate() - 1);

              let dateLabel = date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
              if (date.toDateString() === today.toDateString()) dateLabel = 'TODAY';
              else if (date.toDateString() === yesterday.toDateString()) dateLabel = 'YESTERDAY';

              if (!groups[dateLabel]) groups[dateLabel] = [];
              groups[dateLabel].push(t);
              return groups;
            }, {})
          ).map(([dateLabel, txs]: [string, any]) => (
            <div key={dateLabel} className="flex-col gap-md">
              <div className="flex-row justify-between align-center">
                 <span style={{ fontSize: '12px', fontWeight: 700, color: '#111827', letterSpacing: '0.5px' }}>{dateLabel}</span>
                 {dateLabel !== 'TODAY' && dateLabel !== 'YESTERDAY' ? null : (
                   <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                     {new Date(txs[0].date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                   </span>
                 )}
              </div>
              
              {txs.map((t: any) => (
                <div key={t.id} className="flex-row justify-between align-center" style={{ cursor: 'pointer' }} onClick={() => setEditingTx(t)}>
                  <div className="flex-row align-center gap-md" style={{ flex: 1 }}>
                    <div style={{ 
                      width: 48, 
                      height: 48, 
                      borderRadius: 14, 
                      backgroundColor: '#F1F5F9', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontSize: '20px'
                    }}>
                      {t.category === 'Food' || t.category === 'Dining' ? '🍴' : 
                       t.category === 'Transportation' || t.category === 'Travel' ? '✈️' : 
                       t.category === 'Shopping' ? '🛍️' : 
                       t.type === 'credit' ? '💵' : '💳'}
                    </div>
                    <div className="flex-col">
                      <span style={{ fontSize: '15px', fontWeight: 600, color: '#111827' }}>{t.merchant}</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {t.category} • {new Date(t.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  <div className="flex-col align-end">
                    <span className={isPrivacyMode ? 'privacy-blur' : ''} style={{ 
                      fontSize: '15px', 
                      fontWeight: 700, 
                      color: t.type === 'debit' ? '#111827' : 'var(--success-color)' 
                    }}>
                      {t.type === 'debit' ? '-' : '+'}{user.currency}{t.amount.toFixed(2)}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--success-color)', fontWeight: 600 }}>Verified</span>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      <button 
        className="fab-btn" 
        onClick={() => setIsAddModalOpen(true)}
        style={{ 
          bottom: '100px', 
          backgroundColor: 'var(--accent-primary)',
          boxShadow: '0 8px 16px rgba(0, 102, 255, 0.4)'
        }}
      >
        <Plus color="white" size={24} />
      </button>

      <AddTransactionModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <EditTransactionModal 
        isOpen={!!editingTx} 
        onClose={() => setEditingTx(null)} 
        transaction={editingTx}
        onSplit={() => {
          setSplittingTx(editingTx);
          setEditingTx(null);
        }}
      />
      
      <AddExpenseModal 
        isOpen={!!splittingTx}
        onClose={() => setSplittingTx(null)}
        sourceTransaction={splittingTx}
      />
    </div>
  );
}
