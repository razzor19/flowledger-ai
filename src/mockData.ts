export const MOCK_USER = {
  name: "Alex",
  email: "alex@demo.com",
  currency: "$",
  startDayOfMonth: 1
};

export const MOCK_BUDGET = {
  income: 5000,
  savingsTarget: 1000,
  fixed: {
    rent: 1500,
    utilities: 200,
    insurance: 100
  },
  variable: {
    groceries: 400,
    dining: 300,
    transportation: 150,
    shopping: 200,
    entertainment: 150
  },
  savingsPots: [
    { id: 'p1', name: 'Emergency Fund', target: 5000, saved: 1200, color: '#FF9500' },
    { id: 'p2', name: 'New Laptop', target: 2000, saved: 850, color: '#34C759' },
    { id: 'p3', name: 'Summer Trip', target: 1500, saved: 300, color: '#5856D6' }
  ]
};

const getRecentDate = (dayOfCurrentMonth: number) => {
  const d = new Date();
  d.setDate(dayOfCurrentMonth);
  return d.toISOString();
};

export const MOCK_TRANSACTIONS = [
  { id: 't1', date: getRecentDate(1), merchant: 'Company Payroll', amount: 5000, type: 'credit', category: 'Income', bankAccountId: 'checking_1', tags: ['salary', 'q1'] },
  { id: 't2', date: getRecentDate(2), merchant: 'Downtown Apartments', amount: 1500, type: 'debit', category: 'Rent', bankAccountId: 'checking_1', tags: ['housing', 'fixed'] },
  { id: 't3', date: getRecentDate(5), merchant: 'PowerCo Energy', amount: 185, type: 'debit', category: 'Utilities', bankAccountId: 'credit_1', tags: ['fixed'] },
  { id: 't4', date: getRecentDate(3), merchant: 'Whole Foods Market', amount: 120, type: 'debit', category: 'Groceries', bankAccountId: 'credit_1', tags: ['organic', 'weekend'] },
  { id: 't5', date: getRecentDate(10), merchant: 'Trader Joe\'s', amount: 95, type: 'debit', category: 'Groceries', bankAccountId: 'credit_1', tags: ['snacks'] },
  { id: 't6', date: getRecentDate(18), merchant: 'Local Farmer\'s Market', amount: 80, type: 'debit', category: 'Groceries', bankAccountId: 'checking_1', tags: ['fresh'] },
  { id: 't7', date: getRecentDate(4), merchant: 'Starbucks', amount: 6.50, type: 'debit', category: 'Dining', bankAccountId: 'credit_1', tags: ['coffee', 'morning'] },
  { id: 't8', date: getRecentDate(6), merchant: 'Sweetgreen', amount: 18.20, type: 'debit', category: 'Dining', bankAccountId: 'credit_1', tags: ['lunch'] },
  { id: 't9', date: getRecentDate(12), merchant: 'Chipotle', amount: 14.50, type: 'debit', category: 'Dining', bankAccountId: 'credit_1', tags: ['lunch'] },
  { id: 't10', date: getRecentDate(15), merchant: 'The Fancy Steakhouse', amount: 155.00, type: 'debit', category: 'Dining', bankAccountId: 'credit_1', tags: ['dinner', 'date'] },
  { id: 't11', date: getRecentDate(20), merchant: 'Uber Eats', amount: 35.00, type: 'debit', category: 'Dining', bankAccountId: 'credit_1', tags: ['delivery'] },
  { id: 't12', date: getRecentDate(21), merchant: 'Starbucks', amount: 7.00, type: 'debit', category: 'Dining', bankAccountId: 'credit_1', tags: ['coffee'] },
  { id: 't13', date: getRecentDate(23), merchant: 'Uber Eats', amount: 42.00, type: 'debit', category: 'Dining', bankAccountId: 'credit_1', tags: ['delivery'] },
  { id: 't14', date: getRecentDate(25), merchant: 'Shake Shack', amount: 22.50, type: 'debit', category: 'Dining', bankAccountId: 'checking_1', tags: ['lunch'] },
  { id: 't15', date: getRecentDate(26), merchant: 'Uber Eats', amount: 48.00, type: 'debit', category: 'Dining', bankAccountId: 'credit_1', tags: ['delivery', 'late'] },
  { id: 't16', date: getRecentDate(27), merchant: 'DoorDash', amount: 38.00, type: 'debit', category: 'Dining', bankAccountId: 'credit_1', tags: ['delivery'] },
  { id: 't17', date: getRecentDate(28), merchant: 'Starbucks', amount: 12.50, type: 'debit', category: 'Dining', bankAccountId: 'checking_1', tags: ['coffee', 'meeting'] },
  { id: 't18', date: getRecentDate(2), merchant: 'Metro Transit', amount: 50.00, type: 'debit', category: 'Transportation', bankAccountId: 'credit_1', tags: ['commute'] },
  { id: 't19', date: getRecentDate(11), merchant: 'Uber*', amount: 24.50, type: 'debit', category: 'Transportation', bankAccountId: 'credit_1', tags: ['ride'] },
  { id: 't20', date: getRecentDate(24), merchant: 'Shell Gas', amount: 45.00, type: 'debit', category: 'Transportation', bankAccountId: 'checking_1', tags: ['car'] },
  { id: 't21', date: getRecentDate(8), merchant: 'Amazon.com', amount: 145.00, type: 'debit', category: 'Shopping', bankAccountId: 'credit_1', tags: ['prime', 'electronics'] },
  { id: 't22', date: getRecentDate(14), merchant: 'Netflix', amount: 15.99, type: 'debit', category: 'Entertainment', bankAccountId: 'credit_1', tags: ['subscription'] },
  { id: 't23', date: getRecentDate(19), merchant: 'AMC Theatres', amount: 32.00, type: 'debit', category: 'Entertainment', bankAccountId: 'checking_1', tags: ['movies', 'weekend'] },
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const MOCK_HISTORY = [
  { month: 'Oct', spent: 3100, income: 5000 },
  { month: 'Nov', spent: 3500, income: 5000 },
  { month: 'Dec', spent: 4200, income: 5500 },
  { month: 'Jan', spent: 2900, income: 5000 },
  { month: 'Feb', spent: 3150, income: 5000 },
  { month: 'Mar', spent: 3800, income: 5000 },
];

export const UPCOMING_BILLS = [
  { id: 'b1', name: 'Netflix', amount: 15.99, daysUntilDue: 2, icon: 'N' },
  { id: 'b2', name: 'Gym Membership', amount: 49.99, daysUntilDue: 5, icon: 'G' },
  { id: 'b3', name: 'Car Insurance', amount: 110.00, daysUntilDue: 12, icon: 'C' },
  { id: 'b4', name: 'Spotify', amount: 10.99, daysUntilDue: 15, icon: 'S' }
];

// ============================================================
// SPLITWISE-LIKE DATA
// ============================================================

export type Friend = {
  id: string;
  name: string;
  avatar: string;
  color: string;
};

export type SharedExpense = {
  id: string;
  groupId: string | null;
  description: string;
  amount: number;
  paidBy: string; // 'me' or friend ID
  splitBetween: string[]; // includes 'me' and/or friend IDs
  splitType: 'equal' | 'exact' | 'percentage';
  splitDetails: Record<string, number>; // personId -> their share amount
  date: string;
  category: string;
  settled: boolean;
};

export type SplitGroup = {
  id: string;
  name: string;
  emoji: string;
  members: string[]; // friend IDs (always includes 'me' implicitly)
  createdAt: string;
};

export type Settlement = {
  id: string;
  from: string;
  to: string;
  amount: number;
  date: string;
  groupId: string | null;
};

export const MOCK_FRIENDS: Friend[] = [
  { id: 'f1', name: 'Sarah Chen', avatar: 'S', color: '#F472B6' },
  { id: 'f2', name: 'Mike Johnson', avatar: 'M', color: '#60A5FA' },
  { id: 'f3', name: 'Emma Wilson', avatar: 'E', color: '#34D399' },
  { id: 'f4', name: 'Jake Martinez', avatar: 'J', color: '#FBBF24' },
];

export const MOCK_SPLIT_GROUPS: SplitGroup[] = [
  {
    id: 'g1',
    name: 'Apartment',
    emoji: '🏠',
    members: ['f1', 'f2'],
    createdAt: new Date(2026, 0, 15).toISOString(),
  },
  {
    id: 'g2',
    name: 'Weekend Trip',
    emoji: '✈️',
    members: ['f1', 'f3', 'f4'],
    createdAt: new Date(2026, 2, 1).toISOString(),
  },
];

// Helper: compute equal split details
function equalSplit(amount: number, members: string[]): Record<string, number> {
  const share = amount / members.length;
  const details: Record<string, number> = {};
  members.forEach(m => { details[m] = share; });
  return details;
}

export const MOCK_SHARED_EXPENSES: SharedExpense[] = [
  // Apartment group expenses
  {
    id: 'se1', groupId: 'g1', description: 'March Rent', amount: 3000,
    paidBy: 'me', splitBetween: ['me', 'f1', 'f2'], splitType: 'equal',
    splitDetails: equalSplit(3000, ['me', 'f1', 'f2']),
    date: getRecentDate(1), category: 'Rent', settled: false
  },
  {
    id: 'se2', groupId: 'g1', description: 'Electric Bill', amount: 180,
    paidBy: 'f1', splitBetween: ['me', 'f1', 'f2'], splitType: 'equal',
    splitDetails: equalSplit(180, ['me', 'f1', 'f2']),
    date: getRecentDate(5), category: 'Utilities', settled: false
  },
  {
    id: 'se3', groupId: 'g1', description: 'WiFi + Internet', amount: 75,
    paidBy: 'f2', splitBetween: ['me', 'f1', 'f2'], splitType: 'equal',
    splitDetails: equalSplit(75, ['me', 'f1', 'f2']),
    date: getRecentDate(3), category: 'Utilities', settled: false
  },
  {
    id: 'se4', groupId: 'g1', description: 'Cleaning Supplies', amount: 45,
    paidBy: 'me', splitBetween: ['me', 'f1', 'f2'], splitType: 'equal',
    splitDetails: equalSplit(45, ['me', 'f1', 'f2']),
    date: getRecentDate(8), category: 'Groceries', settled: false
  },
  // Weekend Trip expenses
  {
    id: 'se5', groupId: 'g2', description: 'Hotel (2 nights)', amount: 480,
    paidBy: 'f3', splitBetween: ['me', 'f1', 'f3', 'f4'], splitType: 'equal',
    splitDetails: equalSplit(480, ['me', 'f1', 'f3', 'f4']),
    date: getRecentDate(10), category: 'Travel', settled: false
  },
  {
    id: 'se6', groupId: 'g2', description: 'Group Dinner', amount: 220,
    paidBy: 'me', splitBetween: ['me', 'f1', 'f3', 'f4'], splitType: 'equal',
    splitDetails: equalSplit(220, ['me', 'f1', 'f3', 'f4']),
    date: getRecentDate(11), category: 'Dining', settled: false
  },
  {
    id: 'se7', groupId: 'g2', description: 'Gas for road trip', amount: 65,
    paidBy: 'f4', splitBetween: ['me', 'f1', 'f3', 'f4'], splitType: 'equal',
    splitDetails: equalSplit(65, ['me', 'f1', 'f3', 'f4']),
    date: getRecentDate(10), category: 'Transportation', settled: false
  },
  // Non-group (individual)
  {
    id: 'se8', groupId: null, description: 'Lunch at Sushi Place', amount: 52,
    paidBy: 'f3', splitBetween: ['me', 'f3'], splitType: 'equal',
    splitDetails: equalSplit(52, ['me', 'f3']),
    date: getRecentDate(15), category: 'Dining', settled: false
  },
  {
    id: 'se9', groupId: null, description: 'Concert tickets', amount: 120,
    paidBy: 'me', splitBetween: ['me', 'f4'], splitType: 'equal',
    splitDetails: equalSplit(120, ['me', 'f4']),
    date: getRecentDate(18), category: 'Entertainment', settled: false
  },
];

export const MOCK_SETTLEMENTS: Settlement[] = [
  {
    id: 'st1', from: 'f1', to: 'me', amount: 500,
    date: getRecentDate(7), groupId: 'g1'
  },
];
