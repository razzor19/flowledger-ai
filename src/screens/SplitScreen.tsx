import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Plus, ArrowUpRight, ArrowDownLeft, Users, ChevronRight, Clock, Handshake, UserPlus } from 'lucide-react';
import AddExpenseModal from '../components/AddExpenseModal';
import SettleUpModal from '../components/SettleUpModal';
import CreateGroupModal from '../components/CreateGroupModal';
import AddFriendModal from '../components/AddFriendModal';

type SubTab = 'overview' | 'groups' | 'activity';

export default function SplitScreen() {
  const {
    user, friends, splitGroups, sharedExpenses, settlements,
    getBalanceWith, getFriendById, getGroupExpenses,
    getGroupBalances, isPrivacyMode
  } = useAppContext();

  const [activeTab, setActiveTab] = useState<SubTab>('overview');
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isSettleOpen, setIsSettleOpen] = useState(false);
  const [settleFriendId, setSettleFriendId] = useState<string | null>(null);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  if (!user) return null;

  const currency = user.currency;

  // Split friends into owe-me and I-owe
  const friendBalances = friends.map(f => ({ friend: f, balance: getBalanceWith(f.id) }));
  const oweMe = friendBalances.filter(fb => fb.balance > 0.01);
  const iOwe = friendBalances.filter(fb => fb.balance < -0.01);

  const openSettle = (friendId: string) => {
    setSettleFriendId(friendId);
    setIsSettleOpen(true);
  };

  // Activity feed items
  const activityItems = [
    ...sharedExpenses.map(e => ({
      type: 'expense' as const,
      id: e.id,
      date: e.date,
      description: e.description,
      amount: e.amount,
      paidBy: e.paidBy,
      splitCount: e.splitBetween.length,
      groupId: e.groupId,
    })),
    ...settlements.map(s => ({
      type: 'settlement' as const,
      id: s.id,
      date: s.date,
      description: `Settlement`,
      amount: s.amount,
      from: s.from,
      to: s.to,
      groupId: s.groupId,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Group detail view
  if (selectedGroupId) {
    const group = splitGroups.find(g => g.id === selectedGroupId);
    if (!group) { setSelectedGroupId(null); return null; }
    const groupExps = getGroupExpenses(selectedGroupId);
    const balances = getGroupBalances(selectedGroupId);
    const allMembers = ['me', ...group.members];

    return (
      <div className="screen-container animate-slide-up">
        {/* Back header */}
        <header className="flex-row align-center gap-md" style={{ marginBottom: 24 }}>
          <button className="icon-btn-circle" onClick={() => setSelectedGroupId(null)} style={{ background: 'var(--bg-secondary)' }}>
            <ChevronRight size={20} color="var(--text-primary)" style={{ transform: 'rotate(180deg)' }} />
          </button>
          <div className="flex-row align-center gap-sm">
            <span style={{ fontSize: 28 }}>{group.emoji}</span>
            <h2 className="h2">{group.name}</h2>
          </div>
        </header>

        {/* Member balances */}
        <section className="flex-col gap-sm" style={{ marginBottom: 24 }}>
          <h3 className="h3">Member Balances</h3>
          {allMembers.map(memberId => {
            const member = getFriendById(memberId);
            const bal = balances[memberId] || 0;
            const isPositive = bal > 0;
            return (
              <div key={memberId} className="card flex-row justify-between align-center" style={{ padding: '14px 16px' }}>
                <div className="flex-row align-center gap-md">
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    backgroundColor: member?.color || '#888',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 700, fontSize: 14,
                  }}>
                    {member?.avatar || '?'}
                  </div>
                  <span className="body" style={{ fontWeight: 600 }}>{memberId === 'me' ? 'You' : member?.name}</span>
                </div>
                <span className={"body " + (isPrivacyMode ? 'privacy-blur' : '')} style={{
                  fontWeight: 700,
                  color: isPositive ? 'var(--success-color)' : bal < 0 ? 'var(--danger-color)' : 'var(--text-secondary)'
                }}>
                  {isPositive ? '+' : ''}{currency}{bal.toFixed(2)}
                </span>
              </div>
            );
          })}
        </section>

        {/* Group Expenses */}
        <section className="flex-col gap-sm" style={{ marginBottom: 20 }}>
          <div className="flex-row justify-between align-center">
            <h3 className="h3">Expenses</h3>
            <button
              className="btn-primary"
              style={{ width: 'auto', padding: '8px 16px', fontSize: 13 }}
              onClick={() => setIsAddExpenseOpen(true)}
            >
              <Plus size={14} style={{ marginRight: 4 }} /> Add
            </button>
          </div>
          {groupExps.length === 0 ? (
            <div className="card" style={{ padding: 24, textAlign: 'center' }}>
              <p className="body-small" style={{ color: 'var(--text-secondary)' }}>No expenses yet in this group</p>
            </div>
          ) : (
            groupExps.map(e => {
              const payer = getFriendById(e.paidBy);
              return (
                <div key={e.id} className="card flex-row justify-between align-center" style={{ padding: '14px 16px' }}>
                  <div className="flex-col">
                    <span className="body" style={{ fontWeight: 600 }}>{e.description}</span>
                    <span className="body-small" style={{ color: 'var(--text-secondary)' }}>
                      {e.paidBy === 'me' ? 'You' : payer?.name} paid • {new Date(e.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <span className={"body " + (isPrivacyMode ? 'privacy-blur' : '')} style={{ fontWeight: 700 }}>
                    {currency}{e.amount.toFixed(2)}
                  </span>
                </div>
              );
            })
          )}
        </section>

        <AddExpenseModal isOpen={isAddExpenseOpen} onClose={() => setIsAddExpenseOpen(false)} preGroupId={selectedGroupId} />
      </div>
    );
  }

  return (
    <div className="screen-container animate-slide-up" style={{ padding: '0 20px 80px 20px' }}>
      <div className="flex-row justify-between align-center" style={{ margin: '12px 0 24px 0' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Split</h2>
        <button onClick={() => setIsAddFriendOpen(true)} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer' }}>
          <UserPlus size={20} />
        </button>
      </div>

      {/* Sub-tabs */}
      <div className="flex-row" style={{
        background: 'var(--bg-secondary)', borderRadius: 12, padding: 4, marginBottom: 24
      }}>
        {(['overview', 'groups', 'activity'] as SubTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1, padding: '10px 0', borderRadius: 10, fontSize: 13, fontWeight: 600,
              fontFamily: 'var(--font-family)',
              backgroundColor: activeTab === tab ? 'var(--bg-primary)' : 'transparent',
              color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-secondary)',
              boxShadow: activeTab === tab ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s ease',
              border: 'none', cursor: 'pointer',
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* =========== OVERVIEW TAB =========== */}
      {activeTab === 'overview' && (
        <div className="flex-col gap-md animate-slide-up">
          {/* Owed Card */}
          <div className="flex-col" style={{ 
            backgroundColor: '#059669', 
            color: 'white', 
            borderRadius: 'var(--border-radius-xl)', 
            padding: '24px',
            boxShadow: '0 8px 16px rgba(5, 150, 105, 0.2)' 
          }}>
            <span style={{ fontSize: '11px', fontWeight: 600, opacity: 0.9, letterSpacing: '0.5px', textTransform: 'uppercase' }}>YOU ARE OWED</span>
            <h1 className={isPrivacyMode ? 'privacy-blur' : ''} style={{ fontSize: '32px', fontWeight: 700, margin: '8px 0' }}>
              {currency}{oweMe.reduce((sum, fb) => sum + fb.balance, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h1>
            <span style={{ fontSize: '12px', opacity: 0.8 }}>Across {oweMe.length} friends</span>
          </div>

          {/* Owe Card */}
          <div className="flex-col" style={{ 
            backgroundColor: '#0066FF', 
            color: 'white', 
            borderRadius: 'var(--border-radius-xl)', 
            padding: '24px',
            boxShadow: '0 8px 16px rgba(0, 102, 255, 0.2)' 
          }}>
            <span style={{ fontSize: '11px', fontWeight: 600, opacity: 0.9, letterSpacing: '0.5px', textTransform: 'uppercase' }}>YOU OWE</span>
            <h1 className={isPrivacyMode ? 'privacy-blur' : ''} style={{ fontSize: '24px', fontWeight: 700, margin: '6px 0' }}>
              {currency}{Math.abs(iOwe.reduce((sum, fb) => sum + fb.balance, 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h1>
            <span style={{ fontSize: '12px', opacity: 0.8 }}>To {iOwe.length} friends</span>
          </div>

          {/* Actions */}
          <div className="flex-row gap-sm" style={{ marginTop: 8 }}>
            <button
              onClick={() => setIsAddExpenseOpen(true)}
              style={{
                flex: 1, backgroundColor: '#F1F5F9', border: 'none', borderRadius: '16px', padding: '16px',
                color: '#111827', fontWeight: 600, fontSize: '14px', cursor: 'pointer'
              }}
            >
              Add Expense
            </button>
            <button
              onClick={() => {
                const firstOwed = iOwe[0]?.friend.id || oweMe[0]?.friend.id;
                if (firstOwed) openSettle(firstOwed);
              }}
              style={{
                flex: 1, backgroundColor: '#F1F5F9', border: 'none', borderRadius: '16px', padding: '16px',
                color: '#111827', fontWeight: 600, fontSize: '14px', cursor: 'pointer'
              }}
            >
              Settle Up
            </button>
          </div>

          {/* People who owe me */}
          {oweMe.length > 0 && (
            <section className="flex-col gap-sm">
              <h3 className="h3 flex-row align-center gap-sm" style={{ color: 'var(--success-color)' }}>
                <ArrowDownLeft size={18} /> Owed to You
              </h3>
              {oweMe.map(({ friend, balance }) => (
                <div key={friend.id} className="card flex-row justify-between align-center" style={{ padding: '14px 16px' }}>
                  <div className="flex-row align-center gap-md">
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%',
                      backgroundColor: friend.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: 700, fontSize: 15,
                    }}>
                      {friend.avatar}
                    </div>
                    <div className="flex-col">
                      <span className="body" style={{ fontWeight: 600 }}>{friend.name}</span>
                      <span className="body-small" style={{ color: 'var(--success-color)' }}>
                        owes you <span className={isPrivacyMode ? 'privacy-blur' : ''} style={{ fontWeight: 700 }}>{currency}{balance.toFixed(2)}</span>
                      </span>
                    </div>
                  </div>
                  <button
                    className="btn-secondary"
                    style={{ width: 'auto', padding: '6px 14px', fontSize: 12, border: '1px solid var(--border-color)' }}
                    onClick={() => openSettle(friend.id)}
                  >
                    Remind
                  </button>
                </div>
              ))}
            </section>
          )}

          {/* People I owe */}
          {iOwe.length > 0 && (
            <section className="flex-col gap-sm">
              <h3 className="h3 flex-row align-center gap-sm" style={{ color: 'var(--danger-color)' }}>
                <ArrowUpRight size={18} /> You Owe
              </h3>
              {iOwe.map(({ friend, balance }) => (
                <div key={friend.id} className="card flex-row justify-between align-center" style={{ padding: '14px 16px' }}>
                  <div className="flex-row align-center gap-md">
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%',
                      backgroundColor: friend.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: 700, fontSize: 15,
                    }}>
                      {friend.avatar}
                    </div>
                    <div className="flex-col">
                      <span className="body" style={{ fontWeight: 600 }}>{friend.name}</span>
                      <span className="body-small" style={{ color: 'var(--danger-color)' }}>
                        you owe <span className={isPrivacyMode ? 'privacy-blur' : ''} style={{ fontWeight: 700 }}>{currency}{Math.abs(balance).toFixed(2)}</span>
                      </span>
                    </div>
                  </div>
                  <button
                    className="btn-primary"
                    style={{ width: 'auto', padding: '6px 14px', fontSize: 12 }}
                    onClick={() => openSettle(friend.id)}
                  >
                    Pay Up
                  </button>
                </div>
              ))}
            </section>
          )}

          {oweMe.length === 0 && iOwe.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: 32 }}>
              <Handshake size={36} color="var(--text-tertiary)" style={{ margin: '0 auto 12px' }} />
              <p className="body" style={{ fontWeight: 600 }}>All settled up!</p>
              <p className="body-small" style={{ color: 'var(--text-secondary)', marginTop: 4 }}>No outstanding balances with friends</p>
            </div>
          )}
        </div>
      )}

      {/* =========== GROUPS TAB =========== */}
      {activeTab === 'groups' && (
        <div className="flex-col gap-md animate-slide-up">
          {splitGroups.map(group => {
            const groupBal = getGroupBalances(group.id);
            const myBal = groupBal['me'] || 0;
            const memberCount = group.members.length + 1; // +1 for me
            return (
              <div
                key={group.id}
                className="card flex-row justify-between align-center"
                style={{ padding: '18px 16px', cursor: 'pointer' }}
                onClick={() => setSelectedGroupId(group.id)}
              >
                <div className="flex-row align-center gap-md">
                  <div style={{
                    width: 48, height: 48, borderRadius: 14,
                    backgroundColor: 'var(--bg-secondary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 24,
                  }}>
                    {group.emoji}
                  </div>
                  <div className="flex-col">
                    <span className="body" style={{ fontWeight: 600 }}>{group.name}</span>
                    <div className="flex-row align-center gap-sm">
                      <Users size={12} color="var(--text-secondary)" />
                      <span className="body-small" style={{ color: 'var(--text-secondary)' }}>
                        {memberCount} members
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex-row align-center gap-sm">
                  <span className={"body " + (isPrivacyMode ? 'privacy-blur' : '')} style={{
                    fontWeight: 700,
                    color: myBal > 0 ? 'var(--success-color)' : myBal < 0 ? 'var(--danger-color)' : 'var(--text-secondary)',
                  }}>
                    {myBal > 0 ? '+' : ''}{currency}{myBal.toFixed(2)}
                  </span>
                  <ChevronRight size={16} color="var(--text-tertiary)" />
                </div>
              </div>
            );
          })}

          <button
            className="card flex-row align-center justify-center gap-sm"
            style={{ padding: 18, cursor: 'pointer', border: '2px dashed var(--border-color)', background: 'transparent' }}
            onClick={() => setIsCreateGroupOpen(true)}
          >
            <Plus size={18} color="var(--accent-primary)" />
            <span className="body" style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>Create Group</span>
          </button>
        </div>
      )}

      {/* =========== ACTIVITY TAB =========== */}
      {activeTab === 'activity' && (
        <div className="flex-col gap-sm animate-slide-up">
          {activityItems.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 32 }}>
              <Clock size={36} color="var(--text-tertiary)" style={{ margin: '0 auto 12px' }} />
              <p className="body" style={{ fontWeight: 600 }}>No activity yet</p>
              <p className="body-small" style={{ color: 'var(--text-secondary)' }}>Add a shared expense to get started</p>
            </div>
          ) : (
            activityItems.map(item => {
              if (item.type === 'expense') {
                const payer = getFriendById(item.paidBy);
                const group = splitGroups.find(g => g.id === item.groupId);
                return (
                  <div key={item.id} className="card flex-row justify-between align-center" style={{ padding: '14px 16px' }}>
                    <div className="flex-row align-center gap-md" style={{ flex: 1 }}>
                      <div style={{
                        width: 38, height: 38, borderRadius: 10,
                        backgroundColor: 'var(--accent-secondary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <ArrowUpRight size={18} color="var(--accent-primary)" />
                      </div>
                      <div className="flex-col" style={{ flex: 1 }}>
                        <span className="body" style={{ fontWeight: 600 }}>{item.description}</span>
                        <span className="body-small" style={{ color: 'var(--text-secondary)' }}>
                          {item.paidBy === 'me' ? 'You' : payer?.name} paid
                          {group ? ` • ${group.emoji} ${group.name}` : ''}
                          {' '} • split {item.splitCount} ways
                        </span>
                      </div>
                    </div>
                    <span className={"body " + (isPrivacyMode ? 'privacy-blur' : '')} style={{ fontWeight: 700 }}>
                      {currency}{item.amount.toFixed(2)}
                    </span>
                  </div>
                );
              } else {
                const from = getFriendById((item as any).from);
                const to = getFriendById((item as any).to);
                return (
                  <div key={item.id} className="card flex-row justify-between align-center" style={{ padding: '14px 16px', borderLeft: '3px solid var(--success-color)' }}>
                    <div className="flex-row align-center gap-md" style={{ flex: 1 }}>
                      <div style={{
                        width: 38, height: 38, borderRadius: 10,
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Handshake size={18} color="var(--success-color)" />
                      </div>
                      <div className="flex-col">
                        <span className="body" style={{ fontWeight: 600 }}>Settlement</span>
                        <span className="body-small" style={{ color: 'var(--text-secondary)' }}>
                          {(item as any).from === 'me' ? 'You' : from?.name} paid {(item as any).to === 'me' ? 'you' : to?.name}
                        </span>
                      </div>
                    </div>
                    <span className={"body " + (isPrivacyMode ? 'privacy-blur' : '')} style={{ fontWeight: 700, color: 'var(--success-color)' }}>
                      {currency}{item.amount.toFixed(2)}
                    </span>
                  </div>
                );
              }
            })
          )}
        </div>
      )}

      {/* FAB */}
      <button 
        className="fab-btn" 
        onClick={() => setIsAddExpenseOpen(true)}
        style={{ 
          bottom: '100px', 
          backgroundColor: 'var(--accent-primary)',
          boxShadow: '0 8px 16px rgba(0, 102, 255, 0.4)'
        }}
      >
        <Plus color="white" size={24} />
      </button>

      {/* Modals */}
      <AddExpenseModal isOpen={isAddExpenseOpen} onClose={() => setIsAddExpenseOpen(false)} />
      <SettleUpModal
        isOpen={isSettleOpen}
        onClose={() => { setIsSettleOpen(false); setSettleFriendId(null); }}
        friendId={settleFriendId}
      />
      <CreateGroupModal isOpen={isCreateGroupOpen} onClose={() => setIsCreateGroupOpen(false)} />
      <AddFriendModal isOpen={isAddFriendOpen} onClose={() => setIsAddFriendOpen(false)} />
    </div>
  );
}
