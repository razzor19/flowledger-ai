import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Plus, Bot, AlertTriangle, TrendingUp, Clock, Zap } from 'lucide-react';
import AddTransactionModal from '../components/AddTransactionModal';
import EditTransactionModal from '../components/EditTransactionModal';
import AIChatModal from '../components/AIChatModal';
import AddSavingsModal from '../components/AddSavingsModal';
import { UPCOMING_BILLS } from '../mockData';
import './Dashboard.css';

export default function Dashboard() {
  const { user, budget, transactions, isPrivacyMode, investments } = useAppContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<any>(null);
  const [selectedPot, setSelectedPot] = useState<any>(null);

  if (!user || !budget) return <div>Loading...</div>;

  // --- Calculations ---
  const debitTxs = transactions.filter((t: any) => t.type === 'debit');
  const totalSpent = debitTxs.reduce((sum: number, t: any) => sum + t.amount, 0);
  const totalBudget = Object.values(budget.variable).reduce((sum: number, val: any) => sum + val, 0) +
                     Object.values(budget.fixed).reduce((sum: number, val: any) => sum + val, 0);
  const remaining = totalBudget - totalSpent;
  const totalInvestments = (investments || []).reduce((sum: number, inv: any) => sum + inv.balance, 0);
  const totalSavings = (budget.savingsPots || []).reduce((sum: number, pot: any) => sum + pot.saved, 0);
  const totalCash = remaining + totalSavings;

  // --- Category Breakdown ---
  const categoryMap: Record<string, number> = {};
  debitTxs.forEach((t: any) => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
  });
  const allCategories = { ...budget.fixed, ...budget.variable };
  const categoryBreakdown = Object.entries(allCategories).map(([key, planned]: [string, any]) => {
    const label = key.charAt(0).toUpperCase() + key.slice(1);
    const spent = categoryMap[label] || categoryMap[key] || 0;
    const pct = planned > 0 ? (spent / planned) * 100 : 0;
    return { label, planned, spent, pct, remaining: planned - spent };
  });

  // --- AI Spending Prediction ---
  const now = new Date();
  const dayOfMonth = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysLeft = daysInMonth - dayOfMonth;
  const dailyAvg = dayOfMonth > 0 ? totalSpent / dayOfMonth : 0;
  const daysUntilBroke = remaining > 0 && dailyAvg > 0 ? Math.floor(remaining / dailyAvg) : daysLeft;
  const brokeDate = new Date(now);
  brokeDate.setDate(now.getDate() + daysUntilBroke);

  // --- Smart Anomaly Alerts ---
  const anomalies: { category: string; message: string }[] = [];
  categoryBreakdown.forEach(cat => {
    if (cat.pct > 100) {
      anomalies.push({
        category: cat.label,
        message: `${cat.label} is ${(cat.pct - 100).toFixed(0)}% over budget`
      });
    }
  });
  if (dailyAvg > (totalBudget / daysInMonth) * 1.3) {
    anomalies.push({ category: 'Overall', message: `Daily spending ($${dailyAvg.toFixed(0)}) is 30%+ above safe pace` });
  }

  // --- Recent transactions ---
  const recentTxs = transactions.slice(0, 5);

  return (
    <div className="screen-container bg-primary animate-slide-up" style={{ padding: '20px 20px 80px 20px' }}>

      {/* TOTAL NET LIQUIDITY */}
      <section className="glass-card flex-col" style={{ padding: 24, borderRadius: 'var(--border-radius-xl)', marginBottom: 20, boxShadow: 'var(--shadow-sm)' }}>
        <div className="flex-row justify-between align-center" style={{ marginBottom: 4 }}>
           <span className="body-small" style={{ color: "var(--text-secondary)", letterSpacing: '1px', textTransform: 'uppercase', fontSize: '10px', fontWeight: 600 }}>TOTAL NET LIQUIDITY</span>
           <TrendingUp size={16} color="var(--success-color)" />
        </div>
        <h1 className={"h1 " + (isPrivacyMode ? 'privacy-blur' : '')} style={{ fontSize: '36px', fontWeight: 700, margin: '4px 0 24px 0', letterSpacing: '-1px' }}>
          {user.currency}{(totalCash + totalInvestments).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </h1>
        
        <div className="flex-row justify-between" style={{ alignItems: 'flex-start' }}>
          <div className="flex-col gap-xs">
             <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Cash</span>
             <span className={isPrivacyMode ? 'privacy-blur' : ''} style={{ fontSize: '14px', fontWeight: 600 }}>{user.currency}{totalCash.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
          </div>
          <div className="flex-col gap-xs">
             <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Investments</span>
             <span className={isPrivacyMode ? 'privacy-blur' : ''} style={{ fontSize: '14px', fontWeight: 600 }}>{user.currency}{totalInvestments.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
          </div>
          <div className="flex-col gap-xs">
             <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Digital Assets</span>
             <span className={isPrivacyMode ? 'privacy-blur' : ''} style={{ fontSize: '14px', fontWeight: 600 }}>{user.currency}6,500</span>
          </div>
        </div>
      </section>

      {/* AI FORECAST */}
      <section className="glass-card flex-col" style={{ padding: 24, borderRadius: 'var(--border-radius-xl)', marginBottom: 20, boxShadow: 'var(--shadow-sm)' }}>
        <div className="flex-row justify-between align-center" style={{ marginBottom: 16 }}>
           <span className="body-small" style={{ color: "var(--text-secondary)", letterSpacing: '1px', textTransform: 'uppercase', fontSize: '10px', fontWeight: 600 }}>AI FORECAST</span>
           <Bot size={16} color="var(--accent-primary)" />
        </div>
        <h3 className="h3" style={{ fontSize: '18px', marginBottom: 8 }}>On track for $150k</h3>
        <p className="body-small" style={{ color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.5 }}>
          Estimated arrival by Oct 12th based on current saving velocity.
        </p>

        <div className="progress-bg" style={{ height: 8, borderRadius: 4, backgroundColor: '#E2E8F0', marginBottom: 8 }}>
          <div className="progress-fill" style={{ width: '85%', backgroundColor: 'var(--accent-primary)', borderRadius: 4 }} />
        </div>
        <div className="flex-row justify-between">
          <span style={{ fontSize: '10px', color: 'var(--text-primary)', fontWeight: 500 }}>$142.8k</span>
          <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>$150k goal</span>
        </div>
      </section>

      {/* Smart Alerts */}
      <section className="flex-col gap-sm" style={{ marginBottom: 24 }}>
        <h3 className="h3" style={{ fontSize: '15px', color: 'var(--text-primary)', marginBottom: 4 }}>Smart Alerts</h3>
        
        <div className="flex-row align-center gap-md" style={{ padding: '16px', borderRadius: 'var(--border-radius-lg)', backgroundColor: '#FFF5F5', border: '1px solid #FFE4E4' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFE4E4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={20} color="#E53E3E" />
          </div>
          <div className="flex-col" style={{ flex: 1 }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>High Spending Alert</span>
            <span style={{ fontSize: '12px', color: '#718096' }}>Dining out is 24% higher than last week.</span>
          </div>
        </div>

        <div className="flex-row align-center gap-md" style={{ padding: '16px', borderRadius: 'var(--border-radius-lg)', backgroundColor: '#F0FFF4', border: '1px solid #C6F6D5' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#C6F6D5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={20} color="#38A169" />
          </div>
          <div className="flex-col" style={{ flex: 1 }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>Auto-Save Triggered</span>
            <span style={{ fontSize: '12px', color: '#718096' }}>Round-ups added $42 to Tesla Fund.</span>
          </div>
        </div>
      </section>

      {/* Category Progress */}
      <section className="flex-col gap-sm" style={{ marginBottom: 28 }}>
        <div className="flex-row justify-between align-center" style={{ marginBottom: 8 }}>
          <h3 className="h3" style={{ fontSize: '15px' }}>Category Progress</h3>
          <span style={{ fontSize: '12px', color: 'var(--accent-primary)', fontWeight: 600, cursor: 'pointer' }}>View Monthly Analysis</span>
        </div>
        
        {categoryBreakdown.slice(0, 4).map((cat, idx) => {
          const colors = ['#0066FF', '#059669', '#DC2626', '#2563EB'];
          const barColor = colors[idx % colors.length];
          return (
            <div key={cat.label} className="flex-col gap-xs" style={{ marginBottom: 12 }}>
              <div className="flex-row justify-between align-center">
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{cat.label}</span>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>{user.currency}{cat.spent.toLocaleString()} / {user.currency}{cat.planned.toLocaleString()}</span>
              </div>
              <div style={{ height: 4, width: '100%', backgroundColor: '#F1F5F9', borderRadius: 2 }}>
                <div style={{ height: '100%', width: `${Math.min(100, cat.pct)}%`, backgroundColor: barColor, borderRadius: 2 }} />
              </div>
            </div>
          );
        })}
      </section>

      {/* Savings Pots */}
      <section className="flex-col gap-sm" style={{ marginBottom: 28 }}>
        <h3 className="h3" style={{ fontSize: '15px', marginBottom: 4 }}>Savings Pots</h3>
        <div className="flex-row gap-md" style={{ overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'none' }}>
           <div className="flex-col gap-md" style={{ minWidth: 160, padding: 20, backgroundColor: '#F1F5F9', borderRadius: 'var(--border-radius-lg)' }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={20} color="#0066FF" />
              </div>
              <div className="flex-col">
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Japan 2025</span>
                <span style={{ fontSize: '16px', fontWeight: 700 }}>$4,200</span>
              </div>
           </div>
           <div className="flex-col gap-md" style={{ minWidth: 160, padding: 20, backgroundColor: '#F1F5F9', borderRadius: 'var(--border-radius-lg)' }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={20} color="#059669" />
              </div>
              <div className="flex-col">
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>House Fund</span>
                <span style={{ fontSize: '16px', fontWeight: 700 }}>$78k</span>
              </div>
           </div>
        </div>
      </section>

      {/* Upcoming Bills */}
      <section className="flex-col gap-sm" style={{ marginBottom: 20 }}>
        <h3 className="h3" style={{ fontSize: '15px' }}>Upcoming Bills</h3>
        {UPCOMING_BILLS.slice(0, 2).map(bill => (
          <div key={bill.id} className="flex-row justify-between align-center" style={{ padding: '12px 0' }}>
            <div className="flex-row align-center gap-md">
              <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={18} color="var(--text-secondary)" />
              </div>
              <div className="flex-col">
                <span style={{ fontSize: '14px', fontWeight: 600 }}>{bill.name}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Due in {bill.daysUntilDue} days</span>
              </div>
            </div>
            <span style={{ fontSize: '14px', fontWeight: 600 }}>{user.currency}{bill.amount.toFixed(2)}</span>
          </div>
        ))}
        
        {/* Optimize Banner */}
        <div className="flex-row align-center gap-md" style={{ marginTop: 12, padding: '20px', borderRadius: 'var(--border-radius-xl)', backgroundColor: '#0066FF', color: 'white' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={24} color="white" />
          </div>
          <div className="flex-col" style={{ flex: 1 }}>
            <p style={{ fontSize: '13px', lineHeight: 1.4, opacity: 0.9 }}>
              "You can save $240 more this month if you switch your energy provider. Want me to help?"
            </p>
          </div>
          <button style={{ backgroundColor: 'white', color: '#0066FF', border: 'none', padding: '8px 16px', borderRadius: 20, fontSize: '12px', fontWeight: 600 }}>
            Optimize
          </button>
        </div>
      </section>

      {/* FAB */}
      <button className="fab-btn" onClick={() => setIsAddModalOpen(true)}>
        <Plus color="white" size={24} />
      </button>

      {/* Modals */}
      <AddTransactionModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <EditTransactionModal isOpen={!!editingTx} onClose={() => setEditingTx(null)} transaction={editingTx} />
      <AIChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <AddSavingsModal isOpen={!!selectedPot} onClose={() => setSelectedPot(null)} pot={selectedPot} />
    </div>
  );
}