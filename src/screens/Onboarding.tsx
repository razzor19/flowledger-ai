import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { MOCK_USER, MOCK_TRANSACTIONS } from '../mockData';
import {
  ArrowRight, ArrowLeft, Wallet, TrendingUp, Cpu,
  Mail, Lock, User, ChevronDown, Building2, CreditCard,
  CheckCircle2, Shield, DollarSign,
  Home, Zap, ShoppingBag, UtensilsCrossed, Car, Film,
  PiggyBank, Eye, EyeOff
} from 'lucide-react';
import './Onboarding.css';

type Step =
  | 'carousel'
  | 'signup'
  | 'profile'
  | 'wizard-income'
  | 'wizard-fixed'
  | 'wizard-variable'
  | 'wizard-savings'
  | 'wizard-review'
  | 'connect-bank'
  | 'syncing'
  | 'done';

const CURRENCIES = ['$ USD', '€ EUR', '£ GBP', '¥ JPY', 'AED', 'SAR', 'INR'];
const COUNTRIES = ['United States', 'United Kingdom', 'Germany', 'UAE', 'India', 'Saudi Arabia', 'Japan'];

export default function Onboarding() {
  const navigate = useNavigate();
  const { setUser, setBudget, addTransactions } = useAppContext();
  const [step, setStep] = useState<Step>('carousel');
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  // Form state
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    currency: '$ USD',
    country: 'United States',
    startDay: '1',
    income: '5000',
    rent: '1500',
    utilities: '200',
    insurance: '100',
    subscriptions: '50',
    groceries: '400',
    dining: '300',
    transportation: '150',
    shopping: '200',
    entertainment: '150',
    healthcare: '80',
    savingsGoal: '1000',
  });

  const [syncProgress, setSyncProgress] = useState(0);
  const [syncStage, setSyncStage] = useState('');

  const updateForm = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));

  const carouselSlides = [
    {
      icon: <Wallet size={44} strokeWidth={1.5} />,
      title: 'Automatic Tracking',
      desc: 'Connect your bank once. Every transaction is recorded — no manual entry, ever.',
      color: '#4A6FFF',
      bg: '#EBF0FF',
    },
    {
      icon: <Cpu size={44} strokeWidth={1.5} />,
      title: 'AI Categorization',
      desc: 'Our AI learns your spending habits and auto-categorizes every purchase accurately.',
      color: '#7B61FF',
      bg: '#F0ECFF',
    },
    {
      icon: <TrendingUp size={44} strokeWidth={1.5} />,
      title: 'Smart Insights',
      desc: 'Get monthly variance reports and personalized savings recommendations powered by AI.',
      color: '#10B981',
      bg: '#ECFDF5',
    },
  ];

  // Sync animation
  useEffect(() => {
    if (step !== 'syncing') return;
    const stages = [
      { label: 'Connecting to your bank...', target: 20 },
      { label: 'Fetching transactions...', target: 50 },
      { label: 'AI is categorizing expenses...', target: 80 },
      { label: 'Building your dashboard...', target: 100 },
    ];
    let i = 0;
    const run = () => {
      if (i >= stages.length) {
        setTimeout(() => setStep('done'), 600);
        return;
      }
      setSyncStage(stages[i].label);
      const target = stages[i].target;
      const interval = setInterval(() => {
        setSyncProgress(prev => {
          if (prev >= target) { clearInterval(interval); return prev; }
          return prev + 1;
        });
      }, 30);
      setTimeout(() => { clearInterval(interval); setSyncProgress(target); i++; run(); }, 1200);
    };
    run();
  }, [step]);

  // After done, finish setup
  useEffect(() => {
    if (step !== 'done') return;
    const timer = setTimeout(() => {
      setUser({ ...MOCK_USER, name: form.name || 'Alex', currency: form.currency.charAt(0) });
      setBudget({
        income: Number(form.income),
        savingsTarget: Number(form.savingsGoal),
        fixed: { rent: Number(form.rent), utilities: Number(form.utilities), insurance: Number(form.insurance) },
        variable: {
          groceries: Number(form.groceries),
          dining: Number(form.dining),
          transportation: Number(form.transportation),
          shopping: Number(form.shopping),
          entertainment: Number(form.entertainment),
        },
      });
      addTransactions(MOCK_TRANSACTIONS);
      navigate('/app/dashboard');
    }, 1800);
    return () => clearTimeout(timer);
  }, [step]);

  const totalFixed = Number(form.rent) + Number(form.utilities) + Number(form.insurance) + Number(form.subscriptions);
  const totalVariable = Number(form.groceries) + Number(form.dining) + Number(form.transportation) + Number(form.shopping) + Number(form.entertainment) + Number(form.healthcare);
  const totalPlanned = totalFixed + totalVariable + Number(form.savingsGoal);
  const remaining = Number(form.income) - totalPlanned;

  // ====== RENDER HELPERS ======
  const renderCarousel = () => {
    const slide = carouselSlides[carouselIdx];
    return (
      <div className="ob-screen ob-carousel">
        <div className="ob-carousel-content" key={carouselIdx}>
          <div className="ob-icon-circle" style={{ backgroundColor: slide.bg, color: slide.color }}>
            {slide.icon}
          </div>
          <h1 className="ob-title">{slide.title}</h1>
          <p className="ob-desc">{slide.desc}</p>
        </div>
        <div className="ob-dots">
          {carouselSlides.map((_, i) => (
            <div key={i} className={`ob-dot ${i === carouselIdx ? 'active' : ''}`} style={i === carouselIdx ? { backgroundColor: slide.color } : {}} />
          ))}
        </div>
        <div className="ob-actions">
          <button className="btn-primary ob-btn" onClick={() => {
            if (carouselIdx < 2) setCarouselIdx(carouselIdx + 1);
            else setStep('signup');
          }}>
            {carouselIdx < 2 ? 'Next' : 'Get Started'}
            <ArrowRight size={18} />
          </button>
          {carouselIdx < 2 && (
            <button className="ob-skip" onClick={() => setStep('signup')}>Skip</button>
          )}
        </div>
      </div>
    );
  };

  const renderSignup = () => (
    <div className="ob-screen ob-signup">
      <div className="ob-top">
        <h1 className="ob-title" style={{ textAlign: 'left' }}>Create your<br />account</h1>
        <p className="ob-desc" style={{ textAlign: 'left' }}>Start your financial autopilot in 2 minutes.</p>
      </div>
      <div className="ob-form">
        <div className="ob-input-group">
          <Mail size={18} className="ob-input-icon" />
          <input
            type="email"
            placeholder="Email address"
            className="ob-input"
            value={form.email}
            onChange={e => updateForm('email', e.target.value)}
          />
        </div>
        <div className="ob-input-group">
          <Lock size={18} className="ob-input-icon" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Create password"
            className="ob-input"
            value={form.password}
            onChange={e => updateForm('password', e.target.value)}
          />
          <button className="ob-eye-btn" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <button className="btn-primary ob-btn" onClick={() => setStep('profile')}>
          Sign Up
          <ArrowRight size={18} />
        </button>
        <div className="ob-divider">
          <span>or continue with</span>
        </div>
        <div className="ob-social-row">
          <button className="ob-social-btn">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="20" height="20" />
            Google
          </button>
          <button className="ob-social-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 21.99 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 21.99C7.79 22.03 6.8 20.68 5.96 19.47C4.25 16.97 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/></svg>
            Apple
          </button>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="ob-screen">
      <button className="ob-back" onClick={() => setStep('signup')}><ArrowLeft size={20} /></button>
      <div className="ob-top">
        <div className="ob-step-badge">Step 1 of 6</div>
        <h1 className="ob-title" style={{ textAlign: 'left' }}>Set up your profile</h1>
        <p className="ob-desc" style={{ textAlign: 'left' }}>Tell us a bit about yourself.</p>
      </div>
      <div className="ob-form">
        <div className="ob-input-group">
          <User size={18} className="ob-input-icon" />
          <input placeholder="Your name" className="ob-input" value={form.name} onChange={e => updateForm('name', e.target.value)} />
        </div>
        <label className="ob-label">Currency</label>
        <div className="ob-input-group">
          <DollarSign size={18} className="ob-input-icon" />
          <select className="ob-input ob-select" value={form.currency} onChange={e => updateForm('currency', e.target.value)}>
            {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown size={16} className="ob-chevron" />
        </div>
        <label className="ob-label">Country</label>
        <div className="ob-input-group">
          <Building2 size={18} className="ob-input-icon" />
          <select className="ob-input ob-select" value={form.country} onChange={e => updateForm('country', e.target.value)}>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown size={16} className="ob-chevron" />
        </div>
        <label className="ob-label">Budget cycle start day</label>
        <div className="ob-input-group">
          <input type="number" min="1" max="28" className="ob-input" value={form.startDay} onChange={e => updateForm('startDay', e.target.value)} />
        </div>
      </div>
      <div className="ob-actions ob-actions-bottom">
        <button className="btn-primary ob-btn" onClick={() => setStep('wizard-income')}>
          Continue <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );

  const renderWizardIncome = () => (
    <div className="ob-screen">
      <button className="ob-back" onClick={() => setStep('profile')}><ArrowLeft size={20} /></button>
      <div className="ob-top">
        <div className="ob-step-badge">Step 2 of 6</div>
        <h1 className="ob-title" style={{ textAlign: 'left' }}>Monthly Income</h1>
        <p className="ob-desc" style={{ textAlign: 'left' }}>How much do you earn per month after tax?</p>
      </div>
      <div className="ob-form">
        <div className="ob-amount-input">
          <span className="ob-currency-symbol">{form.currency.charAt(0)}</span>
          <input
            type="number"
            className="ob-amount-field"
            value={form.income}
            onChange={e => updateForm('income', e.target.value)}
            placeholder="0"
          />
          <span className="ob-amount-label">/month</span>
        </div>
      </div>
      <div className="ob-actions ob-actions-bottom">
        <button className="btn-primary ob-btn" onClick={() => setStep('wizard-fixed')}>
          Continue <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );

  const renderWizardFixed = () => (
    <div className="ob-screen">
      <button className="ob-back" onClick={() => setStep('wizard-income')}><ArrowLeft size={20} /></button>
      <div className="ob-top">
        <div className="ob-step-badge">Step 3 of 6</div>
        <h1 className="ob-title" style={{ textAlign: 'left' }}>Fixed Expenses</h1>
        <p className="ob-desc" style={{ textAlign: 'left' }}>Monthly recurring costs that stay roughly the same.</p>
      </div>
      <div className="ob-form ob-budget-list">
        {[
          { key: 'rent', label: 'Rent / Housing', icon: <Home size={18} /> },
          { key: 'utilities', label: 'Utilities', icon: <Zap size={18} /> },
          { key: 'insurance', label: 'Insurance', icon: <Shield size={18} /> },
          { key: 'subscriptions', label: 'Subscriptions', icon: <Film size={18} /> },
        ].map(item => (
          <div key={item.key} className="ob-budget-row">
            <div className="ob-budget-row-left">
              <div className="ob-budget-icon">{item.icon}</div>
              <span>{item.label}</span>
            </div>
            <div className="ob-budget-amount-wrap">
              <span className="ob-budget-currency">{form.currency.charAt(0)}</span>
              <input
                type="number"
                className="ob-budget-amount"
                value={(form as any)[item.key]}
                onChange={e => updateForm(item.key, e.target.value)}
              />
            </div>
          </div>
        ))}
        <div className="ob-total-row">
          <span>Total Fixed</span>
          <span className="ob-total-value">{form.currency.charAt(0)}{totalFixed.toLocaleString()}</span>
        </div>
      </div>
      <div className="ob-actions ob-actions-bottom">
        <button className="btn-primary ob-btn" onClick={() => setStep('wizard-variable')}>
          Continue <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );

  const renderWizardVariable = () => (
    <div className="ob-screen">
      <button className="ob-back" onClick={() => setStep('wizard-fixed')}><ArrowLeft size={20} /></button>
      <div className="ob-top">
        <div className="ob-step-badge">Step 4 of 6</div>
        <h1 className="ob-title" style={{ textAlign: 'left' }}>Variable Budgets</h1>
        <p className="ob-desc" style={{ textAlign: 'left' }}>Set spending limits for flexible categories.</p>
      </div>
      <div className="ob-form ob-budget-list">
        {[
          { key: 'groceries', label: 'Groceries', icon: <ShoppingBag size={18} /> },
          { key: 'dining', label: 'Dining Out', icon: <UtensilsCrossed size={18} /> },
          { key: 'transportation', label: 'Transportation', icon: <Car size={18} /> },
          { key: 'shopping', label: 'Shopping', icon: <ShoppingBag size={18} /> },
          { key: 'entertainment', label: 'Entertainment', icon: <Film size={18} /> },
          { key: 'healthcare', label: 'Healthcare', icon: <Shield size={18} /> },
        ].map(item => (
          <div key={item.key} className="ob-budget-row">
            <div className="ob-budget-row-left">
              <div className="ob-budget-icon">{item.icon}</div>
              <span>{item.label}</span>
            </div>
            <div className="ob-budget-amount-wrap">
              <span className="ob-budget-currency">{form.currency.charAt(0)}</span>
              <input
                type="number"
                className="ob-budget-amount"
                value={(form as any)[item.key]}
                onChange={e => updateForm(item.key, e.target.value)}
              />
            </div>
          </div>
        ))}
        <div className="ob-total-row">
          <span>Total Variable</span>
          <span className="ob-total-value">{form.currency.charAt(0)}{totalVariable.toLocaleString()}</span>
        </div>
      </div>
      <div className="ob-actions ob-actions-bottom">
        <button className="btn-primary ob-btn" onClick={() => setStep('wizard-savings')}>
          Continue <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );

  const renderWizardSavings = () => (
    <div className="ob-screen">
      <button className="ob-back" onClick={() => setStep('wizard-variable')}><ArrowLeft size={20} /></button>
      <div className="ob-top">
        <div className="ob-step-badge">Step 5 of 6</div>
        <h1 className="ob-title" style={{ textAlign: 'left' }}>Savings Goal</h1>
        <p className="ob-desc" style={{ textAlign: 'left' }}>How much do you want to save each month?</p>
      </div>
      <div className="ob-form">
        <div className="ob-amount-input">
          <span className="ob-currency-symbol">{form.currency.charAt(0)}</span>
          <input
            type="number"
            className="ob-amount-field"
            value={form.savingsGoal}
            onChange={e => updateForm('savingsGoal', e.target.value)}
            placeholder="0"
          />
          <span className="ob-amount-label">/month</span>
        </div>
        <div className="ob-savings-hint">
          <PiggyBank size={20} color="var(--accent-primary)" />
          <span>
            After planned expenses ({form.currency.charAt(0)}{(totalFixed + totalVariable).toLocaleString()}) and this savings goal, you'll have{' '}
            <strong style={{ color: remaining >= 0 ? 'var(--success-color)' : 'var(--danger-color)' }}>
              {form.currency.charAt(0)}{remaining.toLocaleString()}
            </strong>{' '}
            remaining.
          </span>
        </div>
      </div>
      <div className="ob-actions ob-actions-bottom">
        <button className="btn-primary ob-btn" onClick={() => setStep('wizard-review')}>
          Review Plan <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );

  const renderWizardReview = () => (
    <div className="ob-screen">
      <button className="ob-back" onClick={() => setStep('wizard-savings')}><ArrowLeft size={20} /></button>
      <div className="ob-top">
        <div className="ob-step-badge">Step 6 of 6</div>
        <h1 className="ob-title" style={{ textAlign: 'left' }}>Review Your Plan</h1>
        <p className="ob-desc" style={{ textAlign: 'left' }}>Here's a summary of your monthly budget.</p>
      </div>
      <div className="ob-form">
        <div className="ob-review-card ob-review-income">
          <div className="ob-review-label">Monthly Income</div>
          <div className="ob-review-value">{form.currency.charAt(0)}{Number(form.income).toLocaleString()}</div>
        </div>
        <div className="ob-review-card">
          <div className="ob-review-label">Fixed Expenses</div>
          <div className="ob-review-value" style={{ color: 'var(--text-primary)' }}>-{form.currency.charAt(0)}{totalFixed.toLocaleString()}</div>
        </div>
        <div className="ob-review-card">
          <div className="ob-review-label">Variable Budgets</div>
          <div className="ob-review-value" style={{ color: 'var(--text-primary)' }}>-{form.currency.charAt(0)}{totalVariable.toLocaleString()}</div>
        </div>
        <div className="ob-review-card ob-review-savings">
          <div className="ob-review-label">Savings Target</div>
          <div className="ob-review-value">{form.currency.charAt(0)}{Number(form.savingsGoal).toLocaleString()}</div>
        </div>
        <div className="ob-review-divider" />
        <div className="ob-review-card ob-review-remaining">
          <div className="ob-review-label">Unallocated</div>
          <div className="ob-review-value" style={{ color: remaining >= 0 ? 'var(--success-color)' : 'var(--danger-color)' }}>
            {form.currency.charAt(0)}{remaining.toLocaleString()}
          </div>
        </div>
      </div>
      <div className="ob-actions ob-actions-bottom">
        <button className="btn-primary ob-btn" onClick={() => setStep('connect-bank')}>
          Looks Good! <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );

  const renderConnectBank = () => (
    <div className="ob-screen ob-connect-screen">
      <div className="ob-top" style={{ textAlign: 'center', alignItems: 'center' }}>
        <div className="ob-icon-circle" style={{ backgroundColor: '#ECFDF5', color: '#10B981', marginBottom: 24 }}>
          <CreditCard size={44} strokeWidth={1.5} />
        </div>
        <h1 className="ob-title">Connect Your Accounts</h1>
        <p className="ob-desc">Securely link your bank accounts and credit cards. We use bank-level encryption.</p>
      </div>
      <div className="ob-form" style={{ gap: 12 }}>
        <button className="ob-bank-btn" onClick={() => setStep('syncing')}>
          <div className="ob-bank-btn-left">
            <div className="ob-bank-logo" style={{ background: '#1a1f71' }}>V</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Visa •••• 4321</div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Credit Card</div>
            </div>
          </div>
          <span className="ob-connect-label">Connect</span>
        </button>
        <button className="ob-bank-btn" onClick={() => setStep('syncing')}>
          <div className="ob-bank-btn-left">
            <div className="ob-bank-logo" style={{ background: '#0066b2' }}>C</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Chase Checking</div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Bank Account</div>
            </div>
          </div>
          <span className="ob-connect-label">Connect</span>
        </button>
        <button className="ob-bank-btn" onClick={() => setStep('syncing')}>
          <div className="ob-bank-btn-left">
            <div className="ob-bank-logo" style={{ background: '#cc0000' }}>B</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Bank of America</div>
              <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Savings Account</div>
            </div>
          </div>
          <span className="ob-connect-label">Connect</span>
        </button>
      </div>
      <div className="ob-security-note">
        <Shield size={16} color="var(--success-color)" />
        <span>256-bit encryption • Read-only access • Powered by Plaid</span>
      </div>
    </div>
  );

  const renderSyncing = () => (
    <div className="ob-screen ob-sync-screen">
      <div className="ob-sync-content">
        <div className="ob-sync-spinner-wrap">
          <svg className="ob-sync-ring" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="8" />
            <circle
              cx="60" cy="60" r="52" fill="none"
              stroke="url(#syncGrad)" strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${syncProgress * 3.27} 327`}
              style={{ transition: 'stroke-dasharray 0.3s ease' }}
            />
            <defs>
              <linearGradient id="syncGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4A6FFF" />
                <stop offset="100%" stopColor="#7B61FF" />
              </linearGradient>
            </defs>
          </svg>
          <span className="ob-sync-percent">{syncProgress}%</span>
        </div>
        <h2 className="ob-title" style={{ marginTop: 32 }}>Setting Things Up</h2>
        <p className="ob-sync-stage">{syncStage}</p>
      </div>
    </div>
  );

  const renderDone = () => (
    <div className="ob-screen ob-done-screen">
      <div className="ob-done-content">
        <div className="ob-done-check">
          <CheckCircle2 size={72} strokeWidth={1.5} />
        </div>
        <h1 className="ob-title">You're All Set!</h1>
        <p className="ob-desc">Your financial autopilot is ready. Let's see your dashboard.</p>
      </div>
    </div>
  );

  // ====== MAIN RENDER ======
  return (
    <div className="ob-container">
      {step === 'carousel' && renderCarousel()}
      {step === 'signup' && renderSignup()}
      {step === 'profile' && renderProfile()}
      {step === 'wizard-income' && renderWizardIncome()}
      {step === 'wizard-fixed' && renderWizardFixed()}
      {step === 'wizard-variable' && renderWizardVariable()}
      {step === 'wizard-savings' && renderWizardSavings()}
      {step === 'wizard-review' && renderWizardReview()}
      {step === 'connect-bank' && renderConnectBank()}
      {step === 'syncing' && renderSyncing()}
      {step === 'done' && renderDone()}
    </div>
  );
}
