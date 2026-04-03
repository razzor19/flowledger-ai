import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Zap, TrendingDown, TrendingUp, AlertCircle, CheckCircle, Bot } from 'lucide-react';
import AIChatModal from '../components/AIChatModal';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  AreaChart, Area, Legend
} from 'recharts';
import { MOCK_HISTORY } from '../mockData';

export default function Report() {
  const { user, budget, transactions, isPrivacyMode, investments } = useAppContext();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  if (!user || !budget) return <div>Loading...</div>;

  // --- Core Calculations ---
  const debitTxs = transactions.filter((t: any) => t.type === 'debit');
  const totalSpent = debitTxs.reduce((sum: number, t: any) => sum + t.amount, 0);
  const totalInvestments = (investments || []).reduce((sum: number, inv: any) => sum + inv.balance, 0);
  const totalSavings = (budget.savingsPots || []).reduce((sum: number, pot: any) => sum + pot.saved, 0);
  const totalBudget = Object.values(budget.variable).reduce((sum: number, val: any) => sum + val, 0) +
                     Object.values(budget.fixed).reduce((sum: number, val: any) => sum + val, 0);
  const currentNetWorth = totalInvestments + totalSavings + (totalBudget - totalSpent);
  const monthlySavings = budget.income - totalSpent;

  // --- Wealth Projection ---
  const projectionData = Array.from({ length: 7 }).map((_, i) => ({
    month: i === 0 ? 'Now' : 'M+' + i,
    wealth: currentNetWorth + (monthlySavings * i)
  }));

  // --- Category Variance ---
  const categoryMap: Record<string, number> = {};
  debitTxs.forEach((t: any) => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
  });
  const allBudgetCats = { ...budget.fixed, ...budget.variable };
  const varianceData = Object.entries(allBudgetCats).map(([key, planned]: [string, any]) => {
    const label = key.charAt(0).toUpperCase() + key.slice(1);
    const spent = categoryMap[label] || categoryMap[key] || 0;
    const variance = spent - planned;
    const variancePct = planned > 0 ? ((spent - planned) / planned) * 100 : 0;
    return { label, planned, spent, variance, variancePct };
  });
  const overBudgetCats = varianceData.filter(v => v.variance > 0).sort((a, b) => b.variance - a.variance);
  const underBudgetCats = varianceData.filter(v => v.variance <= 0).sort((a, b) => a.variance - b.variance);

  // --- Radar / Fingerprint Data ---
  const radarData = varianceData.map(v => ({
    category: v.label.substring(0, 6),
    spent: v.spent,
    budget: v.planned,
  }));

  // --- Subscription Auditor ---
  const subKeywords = ['Netflix', 'Spotify', 'Amazon', 'Adobe', 'Gym', 'Disney', 'Hulu', 'YouTube'];
  const subscriptions = transactions.filter((t: any) =>
    subKeywords.some(s => t.merchant.toLowerCase().includes(s.toLowerCase()))
  );
  const monthlySubCost = subscriptions.reduce((sum: number, s: any) => sum + s.amount, 0);
  const annualLeak = monthlySubCost * 12;

  // --- Financial Heatmap ---
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const firstDayOffset = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
  const dayTotals: Record<number, number> = {};
  debitTxs.forEach((t: any) => {
    const d = new Date(t.date);
    if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
      const day = d.getDate();
      dayTotals[day] = (dayTotals[day] || 0) + t.amount;
    }
  });
  const maxDaySpend = Math.max(1, ...Object.values(dayTotals));

  const selectedDayTxs = selectedDay
    ? transactions.filter((t: any) => {
        const d = new Date(t.date);
        return d.getDate() === selectedDay && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
    : [];

  // --- AI Insights ---
  const savingsGap = budget.savingsTarget - (budget.income - totalSpent);
  const topOverspend = overBudgetCats[0];

  return (
    <div className="screen-container animate-slide-up" style={{ padding: '0 20px 80px 20px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '12px 0 24px 0' }}>AI Report</h2>


      {/* AI Insight Card */}
      <section className="flex-col gap-md" style={{ 
        padding: '24px', 
        borderRadius: 'var(--border-radius-xl)', 
        backgroundColor: '#F1F5F9', 
        marginBottom: 24 
      }}>
        <div className="flex-row align-center gap-sm" style={{ marginBottom: 12 }}>
          <Bot size={20} color="var(--accent-primary)" />
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-primary)', letterSpacing: '0.5px' }}>AI SUMMARY</span>
        </div>
        <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#111827', fontWeight: 500 }}>
          You're on track to save <strong>$1,240</strong> this month, which is <strong>12% higher</strong> than your average. 
          However, your "Dining" spend is accelerating.
        </p>
      </section>

      {/* Stats Grid */}
      <div className="flex-row gap-md" style={{ marginBottom: 32 }}>
        <div className="flex-col gap-xs" style={{ flex: 1, padding: '20px', backgroundColor: 'white', borderRadius: 'var(--border-radius-lg)', border: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>INFLOW</span>
          <span style={{ fontSize: '18px', fontWeight: 700 }}>{user.currency}{budget.income.toLocaleString()}</span>
        </div>
        <div className="flex-col gap-xs" style={{ flex: 1, padding: '20px', backgroundColor: 'white', borderRadius: 'var(--border-radius-lg)', border: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>OUTFLOW</span>
          <span style={{ fontSize: '18px', fontWeight: 700 }}>{user.currency}{totalSpent.toLocaleString()}</span>
        </div>
      </div>

      {/* Category Variance Table */}
      <section className="flex-col gap-sm" style={{ marginBottom: 24 }}>
        <h3 className="h3">Category Variance</h3>
        {overBudgetCats.length > 0 && (
          <div className="flex-col gap-sm">
            <span className="body-small" style={{ fontWeight: 700, color: 'var(--danger-color)' }}>⚠️ Over Budget</span>
            {overBudgetCats.map(v => (
              <div key={v.label} className="card flex-row justify-between align-center" style={{ padding: '12px 16px', borderLeft: '3px solid var(--danger-color)' }}>
                <div className="flex-col">
                  <span className="body" style={{ fontWeight: 600 }}>{v.label}</span>
                  <span className={"body-small " + (isPrivacyMode ? 'privacy-blur' : '')} style={{ color: 'var(--text-secondary)' }}>
                    {user.currency}{v.spent.toFixed(0)} / {user.currency}{v.planned}
                  </span>
                </div>
                <div className="flex-row align-center gap-sm">
                  <TrendingUp size={14} color="var(--danger-color)" />
                  <span className="body-small" style={{ fontWeight: 700, color: 'var(--danger-color)' }}>+{v.variancePct.toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
        {underBudgetCats.length > 0 && (
          <div className="flex-col gap-sm" style={{ marginTop: 8 }}>
            <span className="body-small" style={{ fontWeight: 700, color: 'var(--success-color)' }}>✅ Within Budget</span>
            {underBudgetCats.map(v => (
              <div key={v.label} className="card flex-row justify-between align-center" style={{ padding: '12px 16px', borderLeft: '3px solid var(--success-color)' }}>
                <div className="flex-col">
                  <span className="body" style={{ fontWeight: 600 }}>{v.label}</span>
                  <span className={"body-small " + (isPrivacyMode ? 'privacy-blur' : '')} style={{ color: 'var(--text-secondary)' }}>
                    {user.currency}{v.spent.toFixed(0)} / {user.currency}{v.planned}
                  </span>
                </div>
                <div className="flex-row align-center gap-sm">
                  {v.variance < 0 ? <TrendingDown size={14} color="var(--success-color)" /> : <CheckCircle size={14} color="var(--success-color)" />}
                  <span className="body-small" style={{ fontWeight: 700, color: 'var(--success-color)' }}>{v.variancePct.toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Wealth Projection Chart */}
      <section className="flex-col gap-sm" style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: 12 }}>Wealth Projection</h3>
        <div style={{ height: 200, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projectionData}>
              <defs>
                <linearGradient id="colorWealth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0066FF" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#0066FF" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-sm)' }}
                labelStyle={{ fontWeight: 600 }}
              />
              <Area type="monotone" dataKey="wealth" stroke="#0066FF" strokeWidth={3} fillOpacity={1} fill="url(#colorWealth)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Spending vs. Income */}
      <h3 className="h3" style={{ marginTop: 32, marginBottom: 16 }}>Spending vs. Income</h3>
      <div className="card" style={{ height: 280, padding: '20px 12px 12px 4px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={MOCK_HISTORY} barGap={4}>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} tickFormatter={(v: number) => (v / 1000).toFixed(1) + 'k'} width={40} />
            <Tooltip
              contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12 }}
              wrapperClassName={isPrivacyMode ? 'privacy-blur' : ''}
            />
            <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 11 }} />
            <Bar name="Income" dataKey="income" fill="var(--success-color)" radius={[4, 4, 0, 0]} barSize={14} fillOpacity={0.3} stroke="var(--success-color)" strokeWidth={1} />
            <Bar name="Spent" dataKey="spent" radius={[4, 4, 0, 0]} barSize={14}>
              {MOCK_HISTORY.map((entry, index) => {
                const isOver = entry.spent > entry.income;
                return <rect key={index} fill={isOver ? 'var(--danger-color)' : 'var(--accent-primary)'} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Spending Fingerprint */}
      <h3 className="h3" style={{ marginTop: 32, marginBottom: 16 }}>Spending Fingerprint</h3>
      <div className="card" style={{ height: 300, padding: '16px 8px', background: 'var(--bg-elevated)' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="var(--border-color)" gridType="circle" />
            <PolarAngleAxis dataKey="category" tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} />
            <Radar name="Budget" dataKey="budget" stroke="var(--text-tertiary)" fill="var(--text-tertiary)" fillOpacity={0.1} strokeWidth={1} strokeDasharray="4 4" />
            <Radar name="Spent" dataKey="spent" stroke="var(--accent-primary)" fill="var(--accent-primary)" fillOpacity={0.2} strokeWidth={2} dot={{ r: 4, fill: 'var(--accent-primary)' }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Financial Heatmap */}
      <h3 className="h3" style={{ marginTop: 32, marginBottom: 16 }}>
        Financial Heatmap — {now.toLocaleDateString([], { month: 'long', year: 'numeric' })}
      </h3>
      <div className="card" style={{ padding: 16 }}>
        {/* Day labels */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 6 }}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={i} style={{ textAlign: 'center', fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 600 }}>{d}</div>
          ))}
        </div>
        {/* Calendar grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {/* Empty cells for offset */}
          {Array.from({ length: firstDayOffset }).map((_, i) => (
            <div key={'empty-' + i} style={{ aspectRatio: '1', borderRadius: 8 }} />
          ))}
          {/* Day cells */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const spent = dayTotals[day] || 0;
            const intensity = spent > 0 ? Math.max(0.15, spent / maxDaySpend) : 0;
            const isSelected = selectedDay === day;
            const isFuture = day > now.getDate();
            return (
              <div
                key={day}
                onClick={() => !isFuture && setSelectedDay(isSelected ? null : day)}
                style={{
                  aspectRatio: '1',
                  borderRadius: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: isFuture ? 'default' : 'pointer',
                  opacity: isFuture ? 0.3 : 1,
                  background: isSelected
                    ? 'var(--accent-primary)'
                    : spent > 0
                      ? `rgba(239, 68, 68, ${intensity})`
                      : 'var(--bg-secondary)',
                  color: isSelected ? 'white' : 'var(--text-primary)',
                  transition: 'all 0.2s ease',
                  border: isSelected ? '2px solid var(--accent-primary)' : '1px solid transparent'
                }}
              >
                {day}
              </div>
            );
          })}
        </div>

        {/* Selected Day Transactions */}
        {selectedDay && (
          <div className="flex-col gap-sm animate-slide-up" style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-color)' }}>
            <span className="body-small" style={{ fontWeight: 700 }}>
              Transactions on {now.toLocaleDateString([], { month: 'short' })} {selectedDay}
            </span>
            {selectedDayTxs.length === 0 ? (
              <span className="body-small" style={{ color: 'var(--text-secondary)' }}>No transactions on this day</span>
            ) : (
              selectedDayTxs.map((t: any) => (
                <div key={t.id} className="flex-row justify-between align-center" style={{ padding: '8px 0' }}>
                  <div className="flex-col">
                    <span className="body" style={{ fontWeight: 500 }}>{t.merchant}</span>
                    <span className="body-small" style={{ color: 'var(--text-secondary)' }}>{t.category}</span>
                  </div>
                  <span className={"body " + (isPrivacyMode ? 'privacy-blur' : '')} style={{
                    fontWeight: 600,
                    color: t.type === 'debit' ? 'var(--text-primary)' : 'var(--success-color)'
                  }}>
                    {t.type === 'debit' ? '-' : '+'}{user.currency}{t.amount.toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Subscription Auditor */}
      <div className="card flex-row align-center gap-md" style={{ marginTop: 24, background: 'var(--accent-secondary)' }}>
        <Zap size={22} color="var(--accent-primary)" />
        <div className="flex-col">
          <span className="body-small" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>ANNUAL SUBSCRIPTION LEAK</span>
          <h4 className={"h2 " + (isPrivacyMode ? 'privacy-blur' : '')}>{user.currency}{annualLeak.toLocaleString()}</h4>
          <span className="body-small" style={{ color: 'var(--text-secondary)' }}>
            {subscriptions.length} recurring service{subscriptions.length !== 1 ? 's' : ''} detected
          </span>
        </div>
      </div>

      {/* AI Recommendations */}
      <section className="flex-col gap-md" style={{ marginTop: 24, marginBottom: 20 }}>
        <h3 className="h3">AI Recommendations</h3>
        {overBudgetCats.length > 0 && (
          <div className="card flex-col gap-sm" style={{ padding: 16, borderLeft: '4px solid var(--accent-primary)' }}>
            <span className="body" style={{ fontWeight: 600 }}>🎯 Cost Reduction</span>
            <p className="body-small" style={{ lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              You exceeded your <strong>{overBudgetCats[0].label}</strong> budget by {overBudgetCats[0].variancePct.toFixed(0)}%.
              {overBudgetCats[0].label === 'Dining' && ' Most of the overspend came from delivery app orders in the second half of the month.'}
              {' '}Setting a weekly cap of {user.currency}{Math.floor(overBudgetCats[0].planned / 4)} could help stay on track.
            </p>
          </div>
        )}
        {savingsGap > 0 && (
          <div className="card flex-col gap-sm" style={{ padding: 16, borderLeft: '4px solid var(--warning-color)' }}>
            <span className="body" style={{ fontWeight: 600 }}>💰 Savings Strategy</span>
            <p className="body-small" style={{ lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              You're {user.currency}{savingsGap.toFixed(0)} short of your monthly savings target. Consider automating a transfer of {user.currency}{Math.floor(budget.savingsTarget / 4)} per week to stay consistent.
            </p>
          </div>
        )}
        <div className="card flex-col gap-sm" style={{ padding: 16, borderLeft: '4px solid var(--success-color)' }}>
          <span className="body" style={{ fontWeight: 600 }}>📈 Budget Adjustment</span>
          <p className="body-small" style={{ lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            {underBudgetCats.length > 0
              ? `Great job managing ${underBudgetCats[0].label}! You spent ${Math.abs(underBudgetCats[0].variancePct).toFixed(0)}% below budget. Consider reallocating the surplus to categories that need more room.`
              : 'Keep monitoring your spending patterns. Consistent tracking leads to better financial outcomes over time.'
            }
          </p>
        </div>
      </section>

      {/* FAB */}
      <button 
        className="fab-btn" 
        onClick={() => setIsChatOpen(true)}
        style={{ 
          bottom: '100px', 
          backgroundColor: 'var(--accent-primary)',
          boxShadow: '0 8px 16px rgba(0, 102, 255, 0.4)'
        }}
      >
        <Bot color="white" size={24} />
      </button>

      <AIChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}