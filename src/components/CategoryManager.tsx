import { useState } from 'react';
import { X, Plus, Trash2, Tag } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function CategoryManager({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { categories, addCategory, deleteCategory } = useAppContext();
  const [newCat, setNewCat] = useState('');

  if (!isOpen) return null;

  const handleAdd = () => {
    if (newCat.trim()) {
      addCategory(newCat.trim());
      setNewCat('');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-slide-up" onClick={e => e.stopPropagation()} style={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
        <header className="flex-row justify-between align-center" style={{ marginBottom: 24 }}>
          <div className="flex-row align-center gap-sm">
            <div className="icon-wrap bg-emerald" style={{ width: 32, height: 32 }}>
              <Tag size={18} color="white" />
            </div>
            <h3 className="h3">Categories</h3>
          </div>
          <button onClick={onClose} className="icon-btn-circle">
            <X size={20} color="var(--text-secondary)" />
          </button>
        </header>

        <div className="flex-row gap-sm" style={{ marginBottom: 24 }}>
          <input 
            type="text" 
            placeholder="e.g. Coffee Shop" 
            value={newCat}
            onChange={e => setNewCat(e.target.value)}
            className="custom-input"
            style={{ flex: 1 }}
          />
          <button onClick={handleAdd} className="btn-primary" style={{ padding: '8px 16px' }}>
            <Plus size={18} />
          </button>
        </div>

        <div className="flex-col gap-sm" style={{ flex: 1, overflowY: 'auto', paddingRight: 4 }}>
          {categories.map((c, i) => (
            <div key={i} className="card flex-row justify-between align-center" style={{ padding: '12px 16px' }}>
              <span className="body" style={{ fontWeight: 500 }}>{c}</span>
              <button 
                onClick={() => deleteCategory(c)} 
                className="icon-btn-circle" 
                style={{ width: 32, height: 32 }}
              >
                <Trash2 size={16} color="var(--danger-color)" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
