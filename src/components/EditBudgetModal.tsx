import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function EditBudgetModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { user, budget, setBudget } = useAppContext();
  
  const [formData, setFormData] = useState({
    income: '0',
    savingsTarget: '0',
    rent: '0',
    utilities: '0',
    insurance: '0',
    groceries: '0',
    dining: '0',
    transportation: '0',
    shopping: '0',
    entertainment: '0'
  });

  useEffect(() => {
    if (budget && user) {
      setFormData({
        income: budget.income.toString(),
        savingsTarget: budget.savingsTarget.toString(),
        rent: budget.fixed.rent.toString(),
        utilities: budget.fixed.utilities.toString(),
        insurance: budget.fixed.insurance.toString(),
        groceries: budget.variable.groceries.toString(),
        dining: budget.variable.dining.toString(),
        transportation: budget.variable.transportation.toString(),
        shopping: budget.variable.shopping.toString(),
        entertainment: budget.variable.entertainment.toString()
      });
    }
  }, [budget, user]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!budget || !user) return;

    setBudget({
      ...budget,
      income: parseFloat(formData.income) || 0,
      savingsTarget: parseFloat(formData.savingsTarget) || 0,
      fixed: {
        ...budget.fixed,
        rent: parseFloat(formData.rent) || 0,
        utilities: parseFloat(formData.utilities) || 0,
        insurance: parseFloat(formData.insurance) || 0
      },
      variable: {
        ...budget.variable,
        groceries: parseFloat(formData.groceries) || 0,
        dining: parseFloat(formData.dining) || 0,
        transportation: parseFloat(formData.transportation) || 0,
        shopping: parseFloat(formData.shopping) || 0,
        entertainment: parseFloat(formData.entertainment) || 0
      }
    });

    onClose();
  };

  const InputField = ({ label, name }: { label: string, name: keyof typeof formData }) => (
    <div className="flex-col gap-sm">
      <label className="body-small" style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</label>
      <div className="input-with-icon">
        <span className="input-currency">{user?.currency || '$'}</span>
        <input 
          type="number"
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className="custom-input"
        />
      </div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex-row justify-between" style={{ marginBottom: 24 }}>
          <h2 className="h3">Edit Budget Plan</h2>
          <button onClick={onClose} className="icon-btn-circle" style={{ background: 'var(--bg-secondary)', flexShrink: 0 }}>
            <X size={20} color="var(--text-secondary)" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-col gap-lg">
          
          <div className="flex-col gap-md">
            <h3 className="h3" style={{ color: 'var(--accent-primary)' }}>Income & Savings</h3>
            <InputField label="Monthly Income" name="income" />
            <InputField label="Savings Target" name="savingsTarget" />
          </div>

          <div className="flex-col gap-md">
            <h3 className="h3" style={{ color: 'var(--accent-primary)' }}>Fixed Expenses</h3>
            <InputField label="Rent / Mortgage" name="rent" />
            <InputField label="Utilities" name="utilities" />
            <InputField label="Insurance" name="insurance" />
          </div>

          <div className="flex-col gap-md">
            <h3 className="h3" style={{ color: 'var(--accent-primary)' }}>Variable Goals</h3>
            <InputField label="Groceries" name="groceries" />
            <InputField label="Dining Out" name="dining" />
            <InputField label="Transportation" name="transportation" />
            <InputField label="Shopping" name="shopping" />
            <InputField label="Entertainment" name="entertainment" />
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: 16 }}>
            Save Full Budget
          </button>
        </form>
      </div>
    </div>
  );
}
