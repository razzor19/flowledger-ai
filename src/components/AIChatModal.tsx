import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, User } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function AIChatModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { user, transactions, budget, getNetBalance, friends, getBalanceWith } = useAppContext();
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: `Hello ${user?.name || 'there'}! I'm your FlowLedger Assistant. How can I help you with your finances today?` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showChips, setShowChips] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const processQuery = (userMessage: string) => {
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsTyping(true);
    setShowChips(false);

    setTimeout(() => {
      let response = "I'm not exactly sure what you mean, but I'm learning! Try asking me about your spending, your budget, your savings, or who owes you money.";
      const lowerInput = userMessage.toLowerCase();

      // 1. Debt & Splitwise Intent
      if (lowerInput.includes('owe') || lowerInput.includes('debt') || lowerInput.includes('splitwise')) {
        const net = getNetBalance();
        if (net > 0) {
          let owesYouStr = friends
            .map(f => ({ name: f.name, bal: getBalanceWith(f.id) }))
            .filter(f => f.bal > 0)
            .map(f => `${f.name} (**${user?.currency}${f.bal.toFixed(2)}**)`)
            .join(', ');
          response = `Overall, you are in the green! People owe you a total of **${user?.currency}${net.toFixed(2)}**.\n\nSpecifically: ${owesYouStr || 'No one specifically.'}`;
        } else if (net < 0) {
          response = `You currently are in debt for a net total of **${user?.currency}${Math.abs(net).toFixed(2)}**. Make sure to settle up!`;
        } else {
          response = `You are completely settled up! Your net balance with friends is **${user?.currency}0.00**.`;
        }
      } 
      // 2. Spending Intent
      else if (lowerInput.includes('spent') || lowerInput.includes('spend')) {
        const totalSpent = transactions.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);
        response = `Based on your records, you've spent a total of **${user?.currency}${totalSpent.toFixed(2)}** so far this month.`;
      } 
      // 3. Biggest Expense Intent
      else if (lowerInput.includes('biggest') || lowerInput.includes('highest') || lowerInput.includes('largest')) {
        const debits = transactions.filter(t => t.type === 'debit');
        if (debits.length > 0) {
          const biggest = debits.reduce((max, t) => t.amount > max.amount ? t : max, debits[0]);
          response = `Your biggest expense this month was **${user?.currency}${biggest.amount.toFixed(2)}** at **${biggest.merchant}** on ${new Date(biggest.date).toLocaleDateString()}.`;
        } else {
          response = `You don't have any recorded expenses yet!`;
        }
      }
      // 4. Savings Intent
      else if (lowerInput.includes('save') || lowerInput.includes('savings') || lowerInput.includes('pot')) {
        const totalSavings = (budget?.savingsPots || []).reduce((s: number, p: any) => s + p.saved, 0);
        response = `You currently have **${user?.currency}${totalSavings.toLocaleString()}** tucked away in your Savings Pots. Keep it up!`;
      }
      // 5. Budget Intent
      else if (lowerInput.includes('budget')) {
        const income = budget?.income || 0;
        response = `Your current monthly income is set to **${user?.currency}${income.toLocaleString()}**. You're tracking nicely against your limits!`;
      }

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 1200);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    processQuery(input.trim());
  };

  // Helper to parse basic markdown **bold**
  const renderMessageContent = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} style={{ color: 'var(--text-primary)' }}>{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-slide-up flex-col" style={{ height: '80vh', maxWidth: '500px', padding: 0, overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
        <header className="flex-row justify-between align-center" style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-elevated)' }}>
          <div className="flex-row align-center gap-sm">
            <div className="icon-wrap bg-indigo" style={{ width: 32, height: 32 }}>
              <Bot size={18} color="white" />
            </div>
            <h3 className="h3">AI Assistant</h3>
          </div>
          <button onClick={onClose} className="icon-btn-circle">
            <X size={20} color="var(--text-secondary)" />
          </button>
        </header>

        <div ref={scrollRef} className="flex-col gap-md" style={{ flex: 1, padding: '24px', overflowY: 'auto', backgroundColor: 'var(--bg-primary)' }}>
          {messages.map((m, i) => (
            <div key={i} className={`flex-row gap-sm ${m.role === 'user' ? 'justify-end' : ''}`}>
              {m.role === 'assistant' && (
                <div className="icon-wrap bg-secondary" style={{ width: 28, height: 28, flexShrink: 0 }}>
                  <Bot size={14} color="var(--accent-primary)" />
                </div>
              )}
              <div className={`card ${m.role === 'user' ? 'bg-indigo' : ''}`} style={{ padding: '12px 16px', maxWidth: '80%', borderRadius: 16, borderTopLeftRadius: m.role === 'assistant' ? 4 : 16, borderTopRightRadius: m.role === 'user' ? 4 : 16 }}>
                <p className="body" style={{ color: m.role === 'user' ? 'white' : 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
                  {renderMessageContent(m.content)}
                </p>
              </div>
              {m.role === 'user' && (
                <div className="icon-wrap bg-secondary" style={{ width: 28, height: 28, flexShrink: 0 }}>
                  <User size={14} color="var(--text-secondary)" />
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex-row gap-sm">
              <div className="icon-wrap bg-secondary" style={{ width: 28, height: 28 }}>
                <Bot size={14} color="var(--accent-primary)" />
              </div>
              <div className="card" style={{ padding: '12px 16px', borderRadius: 16, borderTopLeftRadius: 4 }}>
                <div className="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          )}
          {showChips && !isTyping && (
            <div className="flex-row gap-sm" style={{ flexWrap: 'wrap', marginTop: 8 }}>
              {["Who owes me money?", "What was my biggest expense?", "How are my savings?"].map(chip => (
                <button
                  key={chip}
                  onClick={() => processQuery(chip)}
                  style={{
                    padding: '8px 14px', borderRadius: 20, fontSize: 13, backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)', color: 'var(--text-primary)', cursor: 'pointer',
                    fontFamily: 'var(--font-family)', transition: 'all 0.2s ease'
                  }}
                  className="hover-bg-elevated"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="flex-row gap-sm" style={{ padding: '20px 24px', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-elevated)' }}>
          <input 
            type="text" 
            placeholder="Ask anything..." 
            value={input}
            onChange={e => setInput(e.target.value)}
            className="custom-input"
            style={{ flex: 1, border: 'none', backgroundColor: 'var(--bg-secondary)' }}
          />
          <button type="submit" className="icon-btn-circle bg-indigo" style={{ width: 44, height: 44, cursor: 'pointer' }}>
            <Send size={18} color="white" />
          </button>
        </form>
      </div>
    </div>
  );
}
