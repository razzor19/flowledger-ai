import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MOCK_USER, MOCK_BUDGET, MOCK_TRANSACTIONS,
  MOCK_FRIENDS, MOCK_SPLIT_GROUPS, MOCK_SHARED_EXPENSES, MOCK_SETTLEMENTS,
  type Friend, type SharedExpense, type SplitGroup, type Settlement
} from '../mockData';

// ---------- Types ----------
export type Transaction = {
  id: string;
  date: string;
  merchant: string;
  amount: number;
  type: string;
  category: string;
  tags?: string[];
  bankAccountId?: string;
};

export type Investment = {
  id: string;
  name: string;
  type: 'Brokerage' | 'Crypto';
  balance: number;
  provider: string;
};

export type SavingsPot = {
  id: string;
  name: string;
  target: number;
  saved: number;
  color: string;
};

export type Challenge = {
  id: string;
  name: string;
  goal: string;
  streak: number;
  active: boolean;
};

// Re-export split types
export type { Friend, SharedExpense, SplitGroup, Settlement };

type AppContextType = {
  // --- FlowLedger Core ---
  user: typeof MOCK_USER | null;
  setUser: (u: any) => void;
  budget: typeof MOCK_BUDGET | null;
  setBudget: (b: any) => void;
  transactions: Transaction[];
  addTransactions: (txs: Transaction[]) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  investments: Investment[];
  addInvestment: (inv: Investment) => void;
  isPrivacyMode: boolean;
  togglePrivacy: () => void;
  currentTheme: string;
  setAppTheme: (t: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  categories: string[];
  addCategory: (c: string) => void;
  deleteCategory: (c: string) => void;
  challenges: Challenge[];
  toggleChallenge: (id: string) => void;
  contributeToPot: (potId: string, amount: number) => void;
  resetAll: () => void;

  // --- Splitwise Module ---
  friends: Friend[];
  addFriend: (f: Friend) => void;
  removeFriend: (id: string) => void;
  splitGroups: SplitGroup[];
  createGroup: (g: SplitGroup) => void;
  deleteGroup: (id: string) => void;
  sharedExpenses: SharedExpense[];
  addSharedExpense: (e: SharedExpense) => void;
  deleteSharedExpense: (id: string) => void;
  convertTransactionToSharedExpense: (txId: string, expense: SharedExpense) => void;
  settlements: Settlement[];
  settleUp: (s: Settlement) => void;
  getBalanceWith: (friendId: string) => number;
  getNetBalance: () => number;
  getFriendById: (id: string) => Friend | undefined;
  getGroupExpenses: (groupId: string) => SharedExpense[];
  getGroupBalances: (groupId: string) => Record<string, number>;
};

const DEFAULT_CATEGORIES = [
  'Income', 'Rent', 'Utilities', 'Groceries', 'Dining',
  'Transportation', 'Shopping', 'Entertainment', 'Healthcare',
  'Education', 'Subscriptions', 'Insurance', 'Travel', 'Miscellaneous'
];

const DEFAULT_CHALLENGES: Challenge[] = [
  { id: 'ch1', name: 'Coffee-Free Week', goal: '7 days without café purchases', streak: 3, active: true },
  { id: 'ch2', name: 'No Takeout', goal: '5 days without delivery apps', streak: 0, active: false },
  { id: 'ch3', name: 'Walk More', goal: '7 days without ride-share', streak: 5, active: true },
];

const LS = {
  USER: 'fl_user',
  BUDGET: 'fl_budget',
  TRANSACTIONS: 'fl_transactions',
  INVESTMENTS: 'fl_investments',
  THEME: 'fl_theme',
  PREMIUM_THEME: 'fl_premium_theme',
  CATEGORIES: 'fl_categories',
  CHALLENGES: 'fl_challenges',
  FRIENDS: 'fl_friends',
  GROUPS: 'fl_split_groups',
  SHARED_EXPENSES: 'fl_shared_expenses',
  SETTLEMENTS: 'fl_settlements',
};

function loadLS<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // --- FlowLedger State ---
  const [user, setUser] = useState(() => loadLS(LS.USER, MOCK_USER));
  const [budget, setBudgetState] = useState(() => loadLS(LS.BUDGET, MOCK_BUDGET));
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadLS(LS.TRANSACTIONS, MOCK_TRANSACTIONS as Transaction[]));
  const [investments, setInvestments] = useState<Investment[]>(() => loadLS(LS.INVESTMENTS, []));
  const [isPrivacyMode, setIsPrivacyMode] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(() => loadLS(LS.PREMIUM_THEME, 'default'));
  const [theme, setTheme] = useState<'light' | 'dark'>(() => loadLS(LS.THEME, 'light'));
  const [categories, setCategories] = useState<string[]>(() => loadLS(LS.CATEGORIES, DEFAULT_CATEGORIES));
  const [challenges, setChallenges] = useState<Challenge[]>(() => loadLS(LS.CHALLENGES, DEFAULT_CHALLENGES));

  // --- Splitwise State ---
  const [friends, setFriends] = useState<Friend[]>(() => loadLS(LS.FRIENDS, MOCK_FRIENDS));
  const [splitGroups, setSplitGroups] = useState<SplitGroup[]>(() => loadLS(LS.GROUPS, MOCK_SPLIT_GROUPS));
  const [sharedExpenses, setSharedExpenses] = useState<SharedExpense[]>(() => loadLS(LS.SHARED_EXPENSES, MOCK_SHARED_EXPENSES));
  const [settlements, setSettlements] = useState<Settlement[]>(() => loadLS(LS.SETTLEMENTS, MOCK_SETTLEMENTS));

  // --- Persist ---
  useEffect(() => { localStorage.setItem(LS.USER, JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem(LS.BUDGET, JSON.stringify(budget)); }, [budget]);
  useEffect(() => { localStorage.setItem(LS.TRANSACTIONS, JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem(LS.INVESTMENTS, JSON.stringify(investments)); }, [investments]);
  useEffect(() => { localStorage.setItem(LS.CATEGORIES, JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem(LS.CHALLENGES, JSON.stringify(challenges)); }, [challenges]);
  useEffect(() => { localStorage.setItem(LS.FRIENDS, JSON.stringify(friends)); }, [friends]);
  useEffect(() => { localStorage.setItem(LS.GROUPS, JSON.stringify(splitGroups)); }, [splitGroups]);
  useEffect(() => { localStorage.setItem(LS.SHARED_EXPENSES, JSON.stringify(sharedExpenses)); }, [sharedExpenses]);
  useEffect(() => { localStorage.setItem(LS.SETTLEMENTS, JSON.stringify(settlements)); }, [settlements]);

  // --- Theme ---
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'midnight', 'emerald-night', 'crystal-light');
    if (theme === 'dark') root.classList.add('dark');
    if (currentTheme === 'midnight') { root.classList.remove('dark'); root.classList.add('midnight'); }
    if (currentTheme === 'emerald-night') { root.classList.remove('dark'); root.classList.add('emerald-night'); }
    if (currentTheme === 'crystal-light') { root.classList.remove('dark', 'midnight', 'emerald-night'); root.classList.add('crystal-light'); }
    localStorage.setItem(LS.THEME, JSON.stringify(theme));
    localStorage.setItem(LS.PREMIUM_THEME, JSON.stringify(currentTheme));
  }, [theme, currentTheme]);

  // ============================================================
  // FlowLedger Functions
  // ============================================================
  const setBudget = (b: any) => setBudgetState(b);
  const addTransactions = (txs: Transaction[]) => {
    setTransactions(prev => [...txs, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };
  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };
  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };
  const addInvestment = (inv: Investment) => setInvestments(prev => [...prev, inv]);
  const togglePrivacy = () => setIsPrivacyMode(p => !p);
  const setAppTheme = (t: string) => setCurrentTheme(t);
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const addCategory = (c: string) => { if (!categories.includes(c)) setCategories(prev => [...prev, c]); };
  const deleteCategory = (c: string) => setCategories(prev => prev.filter(cat => cat !== c));
  const toggleChallenge = (id: string) => {
    setChallenges(prev => prev.map(ch => ch.id === id ? { ...ch, active: !ch.active, streak: ch.active ? 0 : ch.streak } : ch));
  };
  const contributeToPot = (potId: string, amount: number) => {
    if (!budget) return;
    setBudgetState({
      ...budget,
      savingsPots: budget.savingsPots.map((pot: SavingsPot) =>
        pot.id === potId ? { ...pot, saved: Math.min(pot.saved + amount, pot.target) } : pot
      )
    });
  };

  // ============================================================
  // Splitwise Functions
  // ============================================================
  const addFriend = (f: Friend) => setFriends(prev => [...prev, f]);
  const removeFriend = (id: string) => setFriends(prev => prev.filter(f => f.id !== id));

  const createGroup = (g: SplitGroup) => setSplitGroups(prev => [...prev, g]);
  const deleteGroup = (id: string) => setSplitGroups(prev => prev.filter(g => g.id !== id));

  const addSharedExpense = (expense: SharedExpense) => {
    setSharedExpenses(prev => [expense, ...prev]);

    // Cross-integration: if YOU paid, add your share to personal transactions
    if (expense.paidBy === 'me') {
      const myShare = expense.splitDetails['me'] || 0;
      const groupName = splitGroups.find(g => g.id === expense.groupId)?.name;
      const tags = ['shared'];
      if (groupName) tags.push(groupName.toLowerCase().replace(/\s+/g, '-'));

      const personalTx: Transaction = {
        id: `shared-${expense.id}`,
        date: expense.date,
        merchant: expense.description,
        amount: myShare,
        type: 'debit',
        category: expense.category,
        tags,
        bankAccountId: 'checking_1',
      };
      addTransactions([personalTx]);
    }
  };

  const deleteSharedExpense = (id: string) => {
    setSharedExpenses(prev => prev.filter(e => e.id !== id));
    // Also remove the cross-integrated personal transaction
    setTransactions(prev => prev.filter(t => t.id !== `shared-${id}`));
  };

  const convertTransactionToSharedExpense = (txId: string, expense: SharedExpense) => {
    // 1. Find the original personal transaction
    const originalTx = transactions.find(t => t.id === txId);
    if (!originalTx) return;

    // 2. Add the shared expense to Splitwise state
    setSharedExpenses(prev => [expense, ...prev]);

    // 3. Keep the original id, but update it to be just the user's portion + tagged
    const myShare = expense.splitDetails['me'] || 0;
    const groupName = splitGroups.find(g => g.id === expense.groupId)?.name;
    const tags = originalTx.tags ? [...originalTx.tags] : [];
    if (!tags.includes('shared')) tags.push('shared');
    if (groupName) {
      const gTag = groupName.toLowerCase().replace(/\s+/g, '-');
      if (!tags.includes(gTag)) tags.push(gTag);
    }

    updateTransaction(txId, {
      amount: myShare,
      tags
    });
  };

  const settleUp = (s: Settlement) => {
    setSettlements(prev => [s, ...prev]);
  };

  const getFriendById = (id: string): Friend | undefined => {
    if (id === 'me') return { id: 'me', name: user?.name || 'You', avatar: user?.name?.[0] || 'A', color: '#4F46E5' };
    return friends.find(f => f.id === id);
  };

  /**
   * Calculate net balance with a specific friend.
   * Positive = they owe YOU, Negative = YOU owe them
   */
  const getBalanceWith = (friendId: string): number => {
    let balance = 0;

    sharedExpenses.filter(e => !e.settled).forEach(expense => {
      const friendInvolved = expense.splitBetween.includes(friendId);
      const meInvolved = expense.splitBetween.includes('me');
      if (!friendInvolved || !meInvolved) return;

      const friendShare = expense.splitDetails[friendId] || 0;
      const myShare = expense.splitDetails['me'] || 0;

      if (expense.paidBy === 'me') {
        // I paid, friend owes me their share
        balance += friendShare;
      } else if (expense.paidBy === friendId) {
        // Friend paid, I owe them my share
        balance -= myShare;
      }
      // If someone else paid, no direct balance change between me and this friend
    });

    // Apply settlements
    settlements.forEach(s => {
      if (s.from === friendId && s.to === 'me') {
        balance -= s.amount; // Friend paid me, reduces what they owe
      } else if (s.from === 'me' && s.to === friendId) {
        balance += s.amount; // I paid friend, reduces what I owe
      }
    });

    return balance;
  };

  /**
   * Net balance across all friends.
   * Positive = total owed TO you, Negative = total YOU owe
   */
  const getNetBalance = (): number => {
    return friends.reduce((sum, f) => sum + getBalanceWith(f.id), 0);
  };

  const getGroupExpenses = (groupId: string): SharedExpense[] => {
    return sharedExpenses.filter(e => e.groupId === groupId);
  };

  /**
   * Get per-member balances within a group.
   * Positive = that member is owed money, Negative = that member owes money.
   */
  const getGroupBalances = (groupId: string): Record<string, number> => {
    const group = splitGroups.find(g => g.id === groupId);
    if (!group) return {};

    const allMembers = ['me', ...group.members];
    const balances: Record<string, number> = {};
    allMembers.forEach(m => { balances[m] = 0; });

    const groupExps = sharedExpenses.filter(e => e.groupId === groupId && !e.settled);
    groupExps.forEach(expense => {
      const payer = expense.paidBy;
      expense.splitBetween.forEach(member => {
        const share = expense.splitDetails[member] || 0;
        if (member !== payer) {
          balances[payer] = (balances[payer] || 0) + share;   // payer is owed
          balances[member] = (balances[member] || 0) - share; // member owes
        }
      });
    });

    // Apply settlements within this group
    settlements.filter(s => s.groupId === groupId).forEach(s => {
      balances[s.from] = (balances[s.from] || 0) + s.amount;
      balances[s.to] = (balances[s.to] || 0) - s.amount;
    });

    return balances;
  };

  // ============================================================
  // Reset
  // ============================================================
  const resetAll = () => {
    Object.values(LS).forEach(key => localStorage.removeItem(key));
    setUser(MOCK_USER);
    setBudgetState(MOCK_BUDGET);
    setTransactions(MOCK_TRANSACTIONS as Transaction[]);
    setInvestments([]);
    setIsPrivacyMode(false);
    setCurrentTheme('default');
    setTheme('light');
    setCategories(DEFAULT_CATEGORIES);
    setChallenges(DEFAULT_CHALLENGES);
    setFriends(MOCK_FRIENDS);
    setSplitGroups(MOCK_SPLIT_GROUPS);
    setSharedExpenses(MOCK_SHARED_EXPENSES);
    setSettlements(MOCK_SETTLEMENTS);
  };

  return (
    <AppContext.Provider value={{
      user, setUser,
      budget, setBudget,
      transactions, addTransactions, updateTransaction, deleteTransaction,
      investments, addInvestment,
      isPrivacyMode, togglePrivacy,
      currentTheme, setAppTheme,
      theme, toggleTheme,
      categories, addCategory, deleteCategory,
      challenges, toggleChallenge,
      contributeToPot,
      resetAll,
      // Splitwise
      friends, addFriend, removeFriend,
      splitGroups, createGroup, deleteGroup,
      sharedExpenses, addSharedExpense, deleteSharedExpense, convertTransactionToSharedExpense,
      settlements, settleUp,
      getBalanceWith, getNetBalance,
      getFriendById, getGroupExpenses, getGroupBalances,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}